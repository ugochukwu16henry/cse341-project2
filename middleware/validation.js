const { body, validationResult } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  next();
};

const appointmentValidation = [
  body("appointmentDate")
    .isISO8601()
    .withMessage("Valid appointment date is required"),
  body("duration")
    .isInt({ min: 30, max: 120 })
    .withMessage("Duration must be between 30 and 120 minutes"),
  body("sessionType")
    .isIn(["video", "phone", "in-person", "chat"])
    .withMessage("Valid session type is required"),
  body("counsellor").isMongoId().withMessage("Valid counsellor ID is required"),
];

const userValidation = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("firstName").notEmpty().withMessage("First name is required"),
  body("lastName").notEmpty().withMessage("Last name is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

const counsellorValidation = [
  body("specialization")
    .isArray()
    .withMessage("Specialization must be an array"),
  body("hourlyRate")
    .isFloat({ min: 0 })
    .withMessage("Valid hourly rate is required"),
  body("licenseNumber").notEmpty().withMessage("License number is required"),
];

module.exports = {
  handleValidationErrors,
  appointmentValidation,
  userValidation,
  counsellorValidation,
};
