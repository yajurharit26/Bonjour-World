const { check, isPostalCode } = require("express-validator");
const handleValidationErrors = require("./handleValidationErrors");

const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

function isValidFutureDate(dateString) {
  var regEx = /^\d{4}-\d{2}-\d{2}$/;

  // Check if the format is valid
  if (!dateString.match(regEx)) return false;

  var inputDate = new Date(dateString);

  // Check if the Date object is valid
  var inputDateNum = inputDate.getTime();
  if (!inputDateNum && inputDateNum !== 0) return false;

  // Check if the date is in the future from today
  var currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0 for accurate comparison

  if (inputDate <= currentDate) return false;

  return true;
}

const isValidLanguages = (array) => {
  if (array.length === 0) return false;
  langs = [
    "Arabic",
    "English",
    "French",
    "German",
    "Hindi",
    "Japanese",
    "Korean",
    "Mandarin",
    "Portugese",
    "Russian",
    "Spanish",
    "Swahili",
  ];
  return array.every((value) => langs.includes(value));
};

const validateEventCreation = [
  check("title")
    .exists({ checkFalsy: true })
    .isLength({ min: 6, max: 30 })
    .withMessage("Event title must be between 6 and 30 characters"),
  check("description")
    .exists({ checkFalsy: true })
    .isLength({ min: 10, max: 10000 })
    .withMessage("Event description must be between 10 and 200 characters"),
  check("languages")
    .exists({ checkFalsy: true })
    .custom((value) => isValidLanguages(value))
    .withMessage("Language is required"),
  check("address")
    .exists({ checkFalsy: true })
    .withMessage("Address is required"),
  check("date")
    .exists({ checkFalsy: true })
    .custom((value) => isValidFutureDate(value))
    .withMessage("Date is invalid"),
  check("time")
    .exists({ checkFalsy: true })
    .custom((value) => timeRegex.test(value))
    .withMessage("Time is invalid"),
  check("host").exists({ checkFalsy: true }).withMessage("Host is required"),
  handleValidationErrors,
];

module.exports = validateEventCreation;
