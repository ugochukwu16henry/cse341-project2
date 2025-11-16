const express = require("express");
const { body, validationResult } = require("express-validator");
const Appointment = require("../models/Appointment");
const User = require("../models/User");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// POST /api/appointments - Create new appointment
router.post(
  "/",
  protect,
  [
    body("counsellor")
      .isMongoId()
      .withMessage("Valid counsellor ID is required"),
    body("appointmentDate")
      .isISO8601()
      .withMessage("Valid appointment date is required")
      .custom((value) => {
        if (new Date(value) <= new Date()) {
          throw new Error("Appointment date must be in the future");
        }
        return true;
      }),
    body("duration")
      .isInt({ min: 30, max: 120 })
      .withMessage("Duration must be between 30 and 120 minutes"),
    body("sessionType")
      .isIn(["video", "phone", "in-person", "chat"])
      .withMessage("Session type must be video, phone, in-person, or chat"),
    body("notes.clientNotes")
      .optional()
      .isLength({ max: 500 })
      .withMessage("Client notes cannot exceed 500 characters"),
    body("amount")
      .isFloat({ min: 0 })
      .withMessage("Amount must be a positive number"),
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const {
        counsellor,
        appointmentDate,
        duration,
        sessionType,
        notes,
        amount,
      } = req.body;

      // Check if counsellor exists and is actually a counsellor
      const counsellorUser = await User.findOne({
        _id: counsellor,
        role: "counsellor",
      });

      if (!counsellorUser) {
        return res.status(404).json({
          success: false,
          message: "Counsellor not found or is not a valid counsellor",
        });
      }

      // Check for scheduling conflicts
      const conflictingAppointment = await Appointment.findOne({
        counsellor,
        appointmentDate: {
          $gte: new Date(
            new Date(appointmentDate).getTime() - duration * 60000
          ),
          $lte: new Date(
            new Date(appointmentDate).getTime() + duration * 60000
          ),
        },
        status: { $in: ["scheduled", "confirmed"] },
      });

      if (conflictingAppointment) {
        return res.status(400).json({
          success: false,
          message:
            "Counsellor is not available at this time. Please choose a different time.",
        });
      }

      // Create appointment
      const appointment = await Appointment.create({
        client: req.user.id,
        counsellor,
        appointmentDate,
        duration,
        sessionType,
        notes,
        amount,
      });

      // Populate counsellor details for response
      await appointment.populate("counsellor", "firstName lastName email");

      res.status(201).json({
        success: true,
        message: "Appointment created successfully",
        data: appointment,
      });
    } catch (error) {
      console.error("Create appointment error:", error);

      if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map((err) => err.message);
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: messages,
        });
      }

      res.status(500).json({
        success: false,
        message: "Error creating appointment",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      });
    }
  }
);

// GET /api/appointments - Get all appointments for user
router.get("/", protect, async (req, res) => {
  try {
    let query = {};

    // Clients can only see their own appointments
    // Counsellors can see appointments assigned to them
    // Admins can see all appointments
    if (req.user.role === "client") {
      query.client = req.user.id;
    } else if (req.user.role === "counsellor") {
      query.counsellor = req.user.id;
    }

    const appointments = await Appointment.find(query)
      .populate("client", "firstName lastName email")
      .populate("counsellor", "firstName lastName email")
      .sort({ appointmentDate: 1 });

    res.json({
      success: true,
      count: appointments.length,
      message: "Appointments retrieved successfully",
      data: appointments,
    });
  } catch (error) {
    console.error("Get appointments error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching appointments",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
});

// GET /api/appointments/:id - Get single appointment
router.get("/:id", protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("client", "firstName lastName email phone")
      .populate("counsellor", "firstName lastName email specialization");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Check if user is authorized to view this appointment
    if (
      req.user.role === "client" &&
      appointment.client._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this appointment",
      });
    }

    if (
      req.user.role === "counsellor" &&
      appointment.counsellor._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this appointment",
      });
    }

    res.json({
      success: true,
      message: "Appointment retrieved successfully",
      data: appointment,
    });
  } catch (error) {
    console.error("Get appointment error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error fetching appointment",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
});

// PUT /api/appointments/:id - Update appointment
router.put(
  "/:id",
  protect,
  [
    body("status")
      .optional()
      .isIn([
        "scheduled",
        "confirmed",
        "in-progress",
        "completed",
        "cancelled",
        "no-show",
      ])
      .withMessage("Invalid status value"),
    body("notes.counsellorNotes")
      .optional()
      .isLength({ max: 1000 })
      .withMessage("Counsellor notes cannot exceed 1000 characters"),
    body("cancellationReason")
      .optional()
      .isLength({ max: 200 })
      .withMessage("Cancellation reason cannot exceed 200 characters"),
    body("clientSatisfaction.rating")
      .optional()
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating must be between 1 and 5"),
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const appointment = await Appointment.findById(req.params.id);

      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: "Appointment not found",
        });
      }

      // Authorization check
      if (
        req.user.role === "client" &&
        appointment.client.toString() !== req.user.id
      ) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to update this appointment",
        });
      }

      // Only counsellors can add counsellor notes
      if (req.body.notes?.counsellorNotes && req.user.role !== "counsellor") {
        return res.status(403).json({
          success: false,
          message: "Only counsellors can add counsellor notes",
        });
      }

      const updateData = { ...req.body };

      // Remove fields that shouldn't be updated
      delete updateData.client;
      delete updateData.counsellor;
      delete updateData.appointmentDate;

      const updatedAppointment = await Appointment.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      ).populate("client counsellor", "firstName lastName email");

      res.json({
        success: true,
        message: "Appointment updated successfully",
        data: updatedAppointment,
      });
    } catch (error) {
      console.error("Update appointment error:", error);

      if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map((err) => err.message);
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: messages,
        });
      }

      if (error.name === "CastError") {
        return res.status(400).json({
          success: false,
          message: "Invalid appointment ID format",
        });
      }

      res.status(500).json({
        success: false,
        message: "Error updating appointment",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      });
    }
  }
);

// DELETE /api/appointments/:id - Delete appointment
router.delete("/:id", protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Authorization check
    if (
      req.user.role === "client" &&
      appointment.client.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this appointment",
      });
    }

    // Only allow deletion of future appointments
    if (
      appointment.appointmentDate < new Date() &&
      appointment.status !== "cancelled"
    ) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete past or active appointments",
      });
    }

    await Appointment.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Appointment deleted successfully",
    });
  } catch (error) {
    console.error("Delete appointment error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error deleting appointment",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
});

module.exports = router;
