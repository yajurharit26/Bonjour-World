const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Event = mongoose.model('Event');
const passport = require('passport');
const { loginUser, restoreUser } = require('../../config/passport');
const { isProduction } = require('../../config/keys');
const validateRegisterInput = require('../../validations/register');
const validateLoginInput = require('../../validations/login');
const validateUserInput = require('../../validations/user');
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');

const otpStore = {};

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'chomalmedha@gmail.com',
        pass: 'sebl epvb gzeg xako' 
    },
    tls: {
        rejectUnauthorized: false 
    }
});

function generateOTP() {
    return randomstring.generate({ length: 4, charset: 'numeric' });
}

function sendOTP(email, otp) {
    const mailOptions = {
        from: 'chomalmedha@gmail.com',
        to: email,
        subject: 'Bonjour World - OTP Verification',
        text: `Your OTP for verification is: ${otp}`
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error sending email:', error);
                reject(error);
            } else {
                console.log('OTP Email sent successfully:', info.response);
                resolve(info);
            }
        });
    });
}

router.get('/', async (req, res, next) => {
    const users = await User.find();
    const newState = {};
    const userVals = Object.values(users);
    userVals.forEach((user) => {
        newState[user._id] = user;
    });
    return res.json(newState);
});

router.get('/current', restoreUser, (req, res) => {
    if (!isProduction) {
      
        const csrfToken = req.csrfToken();
        res.cookie('CSRF-TOKEN', csrfToken);
    }
    if (!req.user) return res.json(null);
    return res.json({
        _id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        events: req.user.events,
        hostedEvents: req.user.hostedEvents,
        requestedEvents: req.user.requestedEvents,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        age: req.user.age,
        pfp: req.user.pfp,
        bio: req.user.bio,
        languages: req.user.languages,
    });
});

router.get('/:id', async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        return res.json(user);
    } catch {
        const error = new Error('User not found');
        error.statusCode = 404;
        error.errors = { message: 'No user found with that id' };
        return next(error);
    }
});

router.post('/request-otp', async (req, res, next) => {
    try {
        const { email } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            const err = new Error('User not found');
            err.statusCode = 404;
            err.errors = { email: 'No user found with this email' };
            return next(err);
        }
        
        const otp = generateOTP();
        
        otpStore[email] = {
            otp,
            expiry: Date.now() + 5 * 60 * 1000
        };
        
        await sendOTP(email, otp);
        
        return res.json({ success: true, message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error requesting OTP:', error);
        const err = new Error('Failed to send OTP');
        err.statusCode = 500;
        return next(err);
    }
});

router.post('/verify-otp', async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        
        if (!otpStore[email]) {
            const err = new Error('OTP expired or not requested');
            err.statusCode = 400;
            err.errors = { otp: 'OTP expired or not requested' };
            return next(err);
        }
        
        if (otpStore[email].expiry < Date.now()) {
            delete otpStore[email];
            const err = new Error('OTP expired');
            err.statusCode = 400;
            err.errors = { otp: 'OTP expired' };
            return next(err);
        }
        
        if (otpStore[email].otp !== otp) {
            const err = new Error('Invalid OTP');
            err.statusCode = 400;
            err.errors = { otp: 'Invalid OTP' };
            return next(err);
        }
        
        delete otpStore[email];
        
        const user = await User.findOne({ email });
        return res.json(await loginUser(user));
    } catch (error) {
        console.error('Error verifying OTP:', error);
        const err = new Error('Failed to verify OTP');
        err.statusCode = 500;
        return next(err);
    }
});

router.post('/login', validateLoginInput, async (req, res, next) => {
    passport.authenticate('local', async function (err, user) {
        if (err) return next(err);
        if (!user) {
            const err = new Error('Invalid credentials');
            err.statusCode = 400;
            err.errors = { email: 'Invalid credentials' };
            return next(err);
        }
        
        return res.json({ 
            success: true, 
            email: user.email,
            requireOTP: true,
            message: 'Credentials verified. OTP verification required.'
        });
    })(req, res, next);
});

router.post('/register', validateRegisterInput, async (req, res, next) => {
    
    const user = await User.findOne({
        $or: [{ email: req.body.email }, { username: req.body.username }],
    });

    if (user) {
        const err = new Error('Validation Error');
        err.statusCode = 400;
        const errors = {};
        if (user.email === req.body.email) {
            errors.email = 'A user has already registered with this email';
        }
        if (user.username === req.body.username) {
            errors.username =
                'A user has already registered with this username';
        }
        err.errors = errors;
        return next(err);
    }

    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    });

    bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err;
        bcrypt.hash(req.body.password, salt, async (err, hashedPassword) => {
            if (err) throw err;
            try {
                newUser.hashedPassword = hashedPassword;
                const user = await newUser.save();
                
                const otp = generateOTP();
                
                otpStore[user.email] = {
                    otp,
                    expiry: Date.now() + 5 * 60 * 1000 // 5 minutes
                };
                
                await sendOTP(user.email, otp);
                
                return res.json({ 
                    success: true, 
                    email: user.email,
                    requireOTP: true,
                    message: 'Registration successful. OTP verification required.'
                });
            } catch (err) {
                next(err);
            }
        });
    });
});

router.patch('/:id', validateUserInput, async (req, res, next) => {
    try {
        let user = await User.findOneAndUpdate(
            { _id: req.params.id },
            req.body,
            { new: true }
        );
        user = await user.populate('events');
        return res.json(user);
    } catch {
        res.json({ message: 'error updating user' });
    }
});

router.post('/:userId/events/:eventId', async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId);
        const event = await Event.findById(req.params.eventId);

        if (!user || !event) {
            return res.json({ message: 'User or Event not found' });
        }
        if (
            !user.events.includes(event._id) &&
            !event.attendees.includes(user._id)
        ) {
            user.events.push(req.params.eventId);
            event.attendees.push(req.params.userId);
            await user.save();
            await event.save();
        } else {
            const error = new Error('User has already joined this event');
            error.statusCode = 400;
            error.errors = { message: 'User has already joined this event' };
            return next(error);
        }
        return res.json({ user: user, event: event });
    } catch {
        const error = new Error('Event or User not found');
        error.statusCode = 404;
        error.errors = { message: 'No event or user found with that id' };
        return next(error);
    }
});

router.delete('/:userId/events/:eventId', async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId);
        const event = await Event.findById(req.params.eventId);
        if (!user || !event) {
            return res.json({ message: 'User or Event not found' });
        }
        if (user.events.includes(event._id)) {
            user.events.pull(req.params.eventId);
            event.attendees.pull(req.params.userId);
            await user.save();
            await event.save();
        } else {
            const error = new Error('User has not joined this event');
            error.statusCode = 400;
            error.errors = { message: 'User has not joined this event' };
            return next(error);
        }
        return res.json({ user: user, event: event });
    } catch {
        const error = new Error('Event or User not found');
        error.statusCode = 404;
        error.errors = { message: 'No event or user found with that id' };
        return next(error);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (user) {
            return res.json(user);
        } else {
            return res.json({ message: 'user not found' });
        }
    } catch {
        res.json({ message: 'error deleting user' });
    }
});

module.exports = router;