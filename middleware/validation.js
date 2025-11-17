const { body, param } = require("express-validator");
const { ObjectId } = require("mongodb");

// Validate ObjectId
const validateObjectId = [
  param("id").custom((value) => {
    if (!ObjectId.isValid(value)) {
      throw new Error("Invalid ID format");
    }
    return true;
  }),
];

// Validate Book
const validateBook = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 1, max: 200 })
    .withMessage("Title must be between 1 and 200 characters"),

  body("author")
    .trim()
    .notEmpty()
    .withMessage("Author is required")
    .isLength({ min: 1, max: 100 })
    .withMessage("Author must be between 1 and 100 characters"),

  body("isbn")
    .trim()
    .notEmpty()
    .withMessage("ISBN is required")
    .matches(/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/)
    .withMessage("Invalid ISBN format"),

  body("publishedYear")
    .isInt({ min: 1000, max: new Date().getFullYear() })
    .withMessage("Published year must be a valid year"),

  body("genre")
    .trim()
    .notEmpty()
    .withMessage("Genre is required")
    .isLength({ min: 1, max: 50 })
    .withMessage("Genre must be between 1 and 50 characters"),

  body("pages")
    .isInt({ min: 1 })
    .withMessage("Pages must be a positive integer"),

  body("language")
    .trim()
    .notEmpty()
    .withMessage("Language is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Language must be between 2 and 50 characters"),

  body("available")
    .optional()
    .isBoolean()
    .withMessage("Available must be a boolean value"),
];

// Validate Author
const validateAuthor = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ min: 1, max: 50 })
    .withMessage("First name must be between 1 and 50 characters"),

  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ min: 1, max: 50 })
    .withMessage("Last name must be between 1 and 50 characters"),

  body("birthYear")
    .isInt({ min: 1000, max: new Date().getFullYear() })
    .withMessage("Birth year must be a valid year"),

  body("nationality")
    .trim()
    .notEmpty()
    .withMessage("Nationality is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Nationality must be between 2 and 50 characters"),

  body("biography")
    .trim()
    .notEmpty()
    .withMessage("Biography is required")
    .isLength({ min: 10, max: 1000 })
    .withMessage("Biography must be between 10 and 1000 characters"),
];

module.exports = {
  validateObjectId,
  validateBook,
  validateAuthor,
};
