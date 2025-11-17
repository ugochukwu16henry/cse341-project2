const express = require("express");
const { body } = require("express-validator");
const {
  getAppointments,
  getAppointment,
  createAppointment,
} = require("../controllers/appointmentController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// All routes are protected
router.use(protect);

// GET /api/appointments
router.get("/", getAppointments);

// GET /api/appointments/:id
router.get("/:id", getAppointment);

// POST /api/appointments
router.post(
  "/",
  [
    body("counsellor").notEmpty().withMessage("Counsellor ID is required"),
    body("appointmentDate")
      .isISO8601()
      .withMessage("Valid appointment date is required"),
    body("duration")
      .isInt({ min: 30, max: 120 })
      .withMessage("Duration must be between 30-120 minutes"),
    body("sessionType")
      .isIn(["video", "phone", "in-person", "chat"])
      .withMessage("Valid session type is required"),
    body("amount")
      .isFloat({ min: 0 })
      .withMessage("Amount must be a positive number"),
  ],
  createAppointment
);

module.exports = router;
