const express = require("express");
const Counsellor = require("../models/Counsellor");
const User = require("../models/User");
const Appointment = require("../models/Appointment");
const { protect, authorize } = require("../middleware/auth");
const {
  counsellorValidation,
  handleValidationErrors,
} = require("../middleware/validation");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const {
      specialization,
      minRating,
      sessionType,
      isVerified,
      page = 1,
      limit = 10,
    } = req.query;

    let query = { isActive: true };

    if (specialization) {
      query.specialization = { $in: [specialization] };
    }

    if (minRating) {
      query["rating.average"] = { $gte: parseFloat(minRating) };
    }

    if (sessionType) {
      query.sessionModalities = { $in: [sessionType] };
    }

    if (isVerified !== undefined) {
      query.isVerified = isVerified === "true";
    }

    const counsellors = await Counsellor.find(query)
      .populate("user", "firstName lastName email profilePicture phone")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ "rating.average": -1, "rating.totalReviews": -1 });

    const total = await Counsellor.countDocuments(query);

    res.json({
      success: true,
      count: counsellors.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: counsellors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching counsellors",
      error: error.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const counsellor = await Counsellor.findById(req.params.id).populate(
      "user",
      "firstName lastName email profilePicture phone dateOfBirth gender"
    );

    if (!counsellor) {
      return res.status(404).json({
        success: false,
        message: "Counsellor not found",
      });
    }

    const upcomingAppointments = await Appointment.countDocuments({
      counsellor: req.params.id,
      status: { $in: ["scheduled", "confirmed"] },
      appointmentDate: { $gte: new Date() },
    });

    const counsellorData = counsellor.toObject();
    counsellorData.upcomingAppointments = upcomingAppointments;

    res.json({
      success: true,
      data: counsellorData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching counsellor",
      error: error.message,
    });
  }
});

router.post(
  "/",
  protect,
  authorize("admin", "counsellor"),
  counsellorValidation,
  handleValidationErrors,
  async (req, res) => {
    try {
      const {
        specialization,
        qualifications,
        licenseNumber,
        yearsOfExperience,
        hourlyRate,
        bio,
        languages,
        availability,
        sessionModalities,
      } = req.body;

      const existingCounsellor = await Counsellor.findOne({
        $or: [{ user: req.user.id }, { licenseNumber }],
      });

      if (existingCounsellor) {
        return res.status(400).json({
          success: false,
          message:
            "Counsellor profile already exists or license number already registered",
        });
      }

      const counsellor = await Counsellor.create({
        user: req.user.id,
        specialization,
        qualifications,
        licenseNumber,
        yearsOfExperience,
        hourlyRate,
        bio,
        languages,
        availability,
        sessionModalities,
      });

      await User.findByIdAndUpdate(req.user.id, { role: "counsellor" });

      await counsellor.populate(
        "user",
        "firstName lastName email profilePicture"
      );

      res.status(201).json({
        success: true,
        data: counsellor,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error creating counsellor profile",
        error: error.message,
      });
    }
  }
);

router.put(
  "/:id",
  protect,
  authorize("counsellor", "admin"),
  async (req, res) => {
    try {
      const {
        specialization,
        qualifications,
        hourlyRate,
        bio,
        languages,
        availability,
        sessionModalities,
        isActive,
      } = req.body;

      let counsellor = await Counsellor.findById(req.params.id);

      if (!counsellor) {
        return res.status(404).json({
          success: false,
          message: "Counsellor not found",
        });
      }

      if (
        req.user.role === "counsellor" &&
        counsellor.user.toString() !== req.user.id
      ) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to update this counsellor profile",
        });
      }

      const updateData = {};
      if (specialization) updateData.specialization = specialization;
      if (qualifications) updateData.qualifications = qualifications;
      if (hourlyRate) updateData.hourlyRate = hourlyRate;
      if (bio) updateData.bio = bio;
      if (languages) updateData.languages = languages;
      if (availability) updateData.availability = availability;
      if (sessionModalities) updateData.sessionModalities = sessionModalities;
      if (isActive !== undefined) updateData.isActive = isActive;

      counsellor = await Counsellor.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      ).populate("user", "firstName lastName email profilePicture");

      res.json({
        success: true,
        data: counsellor,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error updating counsellor",
        error: error.message,
      });
    }
  }
);

router.delete("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const counsellor = await Counsellor.findById(req.params.id);

    if (!counsellor) {
      return res.status(404).json({
        success: false,
        message: "Counsellor not found",
      });
    }

    const hasUpcomingAppointments = await Appointment.findOne({
      counsellor: req.params.id,
      status: { $in: ["scheduled", "confirmed"] },
      appointmentDate: { $gte: new Date() },
    });

    if (hasUpcomingAppointments) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete counsellor with upcoming appointments",
      });
    }

    await Counsellor.findByIdAndDelete(req.params.id);

    await User.findByIdAndUpdate(counsellor.user, { role: "client" });

    res.json({
      success: true,
      message: "Counsellor deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting counsellor",
      error: error.message,
    });
  }
});

router.get("/:id/availability", async (req, res) => {
  try {
    const { date } = req.query;
    const counsellor = await Counsellor.findById(req.params.id);

    if (!counsellor) {
      return res.status(404).json({
        success: false,
        message: "Counsellor not found",
      });
    }

    const targetDate = date ? new Date(date) : new Date();
    const dayName = targetDate
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();

    const dayAvailability = counsellor.availability.find(
      (avail) => avail.day === dayName
    );

    const appointments = await Appointment.find({
      counsellor: req.params.id,
      appointmentDate: {
        $gte: new Date(targetDate.setHours(0, 0, 0, 0)),
        $lt: new Date(targetDate.setHours(23, 59, 59, 999)),
      },
      status: { $in: ["scheduled", "confirmed"] },
    });

    const bookedSlots = appointments.map((apt) =>
      apt.appointmentDate.toTimeString().split(" ")[0].substring(0, 5)
    );

    const availableSlots = dayAvailability
      ? dayAvailability.slots
          .filter(
            (slot) => slot.isAvailable && !bookedSlots.includes(slot.startTime)
          )
          .map((slot) => ({
            startTime: slot.startTime,
            endTime: slot.endTime,
          }))
      : [];

    res.json({
      success: true,
      data: {
        date: targetDate.toISOString().split("T")[0],
        availableSlots,
        dayAvailability: dayAvailability || null,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching availability",
      error: error.message,
    });
  }
});

module.exports = router;
