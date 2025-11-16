const express = require("express");
const Appointment = require("../models/Appointment");
const Counsellor = require("../models/Counsellor");
const { protect, authorize } = require("../middleware/auth");
const {
  appointmentValidation,
  handleValidationErrors,
} = require("../middleware/validation");

const router = express.Router();

router.post(
  "/",
  protect,
  appointmentValidation,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { counsellor, appointmentDate, duration, sessionType, notes } =
        req.body;

      const counsellorDoc = await Counsellor.findById(counsellor);
      if (!counsellorDoc) {
        return res.status(404).json({
          success: false,
          message: "Counsellor not found",
        });
      }

      const conflictingAppointment = await Appointment.findOne({
        counsellor,
        appointmentDate,
        status: { $in: ["scheduled", "confirmed"] },
      });

      if (conflictingAppointment) {
        return res.status(400).json({
          success: false,
          message: "Counsellor is not available at this time",
        });
      }

      const appointment = await Appointment.create({
        client: req.user.id,
        counsellor,
        appointmentDate,
        duration,
        sessionType,
        notes: { clientNotes: notes?.clientNotes },
        amount: counsellorDoc.hourlyRate * (duration / 60),
      });

      await appointment.populate("counsellor", "user specialization");
      await appointment.populate("counsellor.user", "firstName lastName");

      res.status(201).json({
        success: true,
        data: appointment,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error creating appointment",
        error: error.message,
      });
    }
  }
);

router.get("/", protect, async (req, res) => {
  try {
    let query = {};

    if (req.user.role === "client") {
      query.client = req.user.id;
    } else if (req.user.role === "counsellor") {
      const counsellor = await Counsellor.findOne({ user: req.user.id });
      if (counsellor) {
        query.counsellor = counsellor._id;
      }
    }

    const appointments = await Appointment.find(query)
      .populate("client", "firstName lastName email")
      .populate("counsellor", "user specialization")
      .populate("counsellor.user", "firstName lastName")
      .sort({ appointmentDate: 1 });

    res.json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching appointments",
      error: error.message,
    });
  }
});

router.get("/:id", protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("client", "firstName lastName email phone")
      .populate("counsellor", "user specialization qualifications")
      .populate("counsellor.user", "firstName lastName profilePicture");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (
      req.user.role === "client" &&
      appointment.client._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this appointment",
      });
    }

    res.json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching appointment",
      error: error.message,
    });
  }
});

router.put("/:id", protect, async (req, res) => {
  try {
    const { status, counsellorNotes, cancellationReason, clientSatisfaction } =
      req.body;

    let appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (
      req.user.role === "client" &&
      appointment.client.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this appointment",
      });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (counsellorNotes && req.user.role === "counsellor") {
      updateData["notes.counsellorNotes"] = counsellorNotes;
    }
    if (cancellationReason) updateData.cancellationReason = cancellationReason;
    if (clientSatisfaction) updateData.clientSatisfaction = clientSatisfaction;

    appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate("client counsellor");

    res.json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating appointment",
      error: error.message,
    });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (
      appointment.client.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this appointment",
      });
    }

    await Appointment.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Appointment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting appointment",
      error: error.message,
    });
  }
});

module.exports = router;
