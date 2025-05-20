const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Event = mongoose.model('Event');
const User = mongoose.model('User');

const validateEventCreation = require('../../validations/event');

// GET /api/events/:id
router.get('/:id', async (req, res, next) => {
    try {
        const unpopulatedEvent = await Event.findById(req.params.id)
        const event = JSON.parse(JSON.stringify(unpopulatedEvent));
        const populatedEvent = await unpopulatedEvent.populate('attendees')
        await populatedEvent.populate("pendingAttendees")
        return res.json({event, attendees: populatedEvent.attendees, pendingAttendees: populatedEvent.pendingAttendees})
    }
    catch(err) {
        const error = new Error('Event not found');
        error.statusCode = 404;
        error.errors = { message: "No event found with that id" };
        return next(error);
    }
})

// GET /api/events
router.get('/', async (req, res, next) => {
    const { language } = req.query
    let filter = {}
    if (language) {
        filter.languages = { $in: [language]}
    }
    const events = await Event.find(filter);
    const newState = {}
    const eventVals = Object.values(events);
    eventVals.forEach((event) => {
        newState[event._id] = event
    })
    return res.json(newState);
});

// POST /api/events
router.post('/', validateEventCreation, async (req, res, next) => {
    try {
        const newEvent = new Event({
            title: req.body.title,
            description: req.body.description,
            languages: req.body.languages,
            address: req.body.address,
            lat: req.body.lat,
            long: req.body.long,
            date: req.body.date,
            time: req.body.time,
            endTime: req.body.endTime,
            host: req.body.host,
            attendees: req.body.attendees
        })
        let event = await newEvent.save();

        let user = await User.findOne({_id: req.body.host})
        user.events.push(event._id);
        user.hostedEvents.push(event._id)
        await user.save();  
        await event.save();
    
        return res.json(event)
    } catch {
        return res.json({message: 'Could not create event'})
    }
})


// UPDATE /api/events/:id

router.patch('/:id', validateEventCreation, async (req, res, next) => {
    try {
        const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if (updatedEvent) {
            return res.json({event: updatedEvent});
        } else {
            return res.json({message: 'event not found'});
        }
    } catch {
        return res.json({message: 'error updating event'});
    }
})
module.exports = router

// POST /api/events/:id/users/:id (create a join request)

router.post('/:eventId/users/:userId', async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId);
        const event = await Event.findById(req.params.eventId);
        // const host = await User.findById(event._id);
        if (!user || !event) {
            return res.json({message: 'User or Event not found'});
        }
        if (!user.requestedEvents.includes(event._id) && !event.pendingAttendees.includes(user._id) && !user.events.includes(event._id) && !event.attendees.includes(user._id)) {
            user.requestedEvents.push(req.params.eventId);
            event.pendingAttendees.push(req.params.userId);
            await user.save();
            await event.save();
        } else { 
            const error = new Error('User has already requested to join this event');
            error.statusCode = 400;
            error.errors = {message: 'User has already requested to join this event'};
            return next(error);
        }
        return res.json({user: user, event: event});
    } catch {
        const error = new Error('Event or User not found');
        error.statusCode = 404;
        error.errors = { message: "No event or user found with that id" };
        return next(error);
    }
})

// DELETE /api/events/:id/users/:id (delete a join requeset)
router.delete('/:eventId/users/:userId', async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId);
        const event = await Event.findById(req.params.eventId);
        if (!user || !event) {
        return res.json({message: 'User or Event not found'});
        }
      // check if the join request exists on both ends
    if (user.requestedEvents.includes(event._id) && event.pendingAttendees.includes(user._id)) {
        // get rid of the association between event and attendee
        user.requestedEvents.pull(req.params.eventId);
        event.pendingAttendees.pull(req.params.userId);  
        await event.save();
        await user.save();
    } else {
        const error = new Error('User has not requested to join this event');
        error.statusCode = 400;
        error.errors = {message: 'User has not requested to join this event'};
        return next(error);
    }
        return res.json({user: user, event: event});
    } catch {
        const error = new Error('error saving user or event');
        error.statusCode = 404;
        error.errors = { message: "error saving user or event" };
        return next(error);
    }
})

// DELETE /api/events/:id
router.delete('/:id', async (req, res, next) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        let holder = []
        if (event) {
            let newEvent = await event.populate('attendees');
            for (const user of newEvent.attendees) {
                let i = user.events.indexOf(event._id);
                if (i !== -1) {
                    user.events.splice(i, 1);
                }
                await user.save()
            }
            let host = await User.findById(event.host);
            let j = host.hostedEvents.indexOf(event._id);
            host.hostedEvents.splice(j, 1);
            await host.save();
            return res.json(event);
        } else {
            return res.json({message: 'event not found'})
        }
        
    } catch {
        res.json({message: 'error deleting event'});
    }
})
