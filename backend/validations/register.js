const { check } = require("express-validator");
const handleValidationErrors = require('./handleValidationErrors');
const mongoose = require('mongoose');
const User = mongoose.model('User');

const validateRegisterInput = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Email is invalid'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 2, max: 30 })
    .withMessage('Username must be between 2 and 30 characters'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6, max: 30 })
    .withMessage('Password must be between 6 and 30 characters'),
  check('firstName')
    .exists({checkFalsy: true})
    .isLength({min: 1, max: 30})
    .withMessage('First name is invalid'),
  check('lastName')
    .exists({checkFalsy: true})
    .isLength({min: 1, max: 30})
    .withMessage('Last name is invalid'),
  handleValidationErrors
];

module.exports = validateRegisterInput;