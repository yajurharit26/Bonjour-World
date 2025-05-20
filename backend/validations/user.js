const { check } = require("express-validator");
const handleValidationErrors = require("./handleValidationErrors");

const isValidLanguages = (array) => {
  // if (array.length === 0) return false;
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

const validateUserInput = [
  check("email").isEmail().withMessage("Email is invalid"),
  check("username")
    .isLength({ min: 2, max: 30 })
    .withMessage("Username must be between 2 and 30 characters"),
  check("age")
    .optional()
    .isInt({ min: 12, max: 100 })
    .withMessage("Age is invalid"),
  check("firstName")
    .isLength({ min: 1, max: 30 })
    .withMessage("First name is invalid"),
  check("lastName")
    .isLength({ min: 1, max: 30 })
    .withMessage("Last name is invalid"),
  check("languages")
    .optional()
    .custom((value) => isValidLanguages(value))
    .withMessage("Language is required"),
  check("bio").optional(),
  handleValidationErrors,
];

module.exports = validateUserInput;
