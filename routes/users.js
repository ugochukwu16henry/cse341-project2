const express = require("express");
const User = require("../models/User");
const Appointment = require("../models/Appointment");
const { protect, authorize } = require("../middleware/auth");
const {
  userValidation,
  handleValidationErrors,
} = require("../middleware/validation");

const router = express.Router();

router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    const stats = await Appointment.aggregate([
      {
        $match: { client: req.user._id },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const upcomingAppointments = await Appointment.countDocuments({
      client: req.user.id,
      status: { $in: ["scheduled", "confirmed"] },
      appointmentDate: { $gte: new Date() },
    });

    const userData = user.toObject();
    userData.appointmentStats = stats;
    userData.upcomingAppointments = upcomingAppointments;

    res.json({
      success: true,
      data: userData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching user profile",
      error: error.message,
    });
  }
});

router.put(
  "/profile",
  protect,
  userValidation,
  handleValidationErrors,
  async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        phone,
        dateOfBirth,
        gender,
        emergencyContact,
      } = req.body;

      const updateData = {};
      if (firstName) updateData.firstName = firstName;
      if (lastName) updateData.lastName = lastName;
      if (phone) updateData.phone = phone;
      if (dateOfBirth) updateData.dateOfBirth = dateOfBirth;
      if (gender) updateData.gender = gender;
      if (emergencyContact) updateData.emergencyContact = emergencyContact;

      const user = await User.findByIdAndUpdate(req.user.id, updateData, {
        new: true,
        runValidators: true,
      }).select("-password");

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error updating user profile",
        error: error.message,
      });
    }
  }
);

router.get("/", protect, authorize("admin"), async (req, res) => {
  try {
    const { role, page = 1, limit = 10 } = req.query;

    let query = {};
    if (role) query.role = role;

    const users = await User.find(query)
      .select("-password")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      count: users.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message,
    });
  }
});

router.get("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const appointments = await Appointment.find({ client: req.params.id })
      .populate("counsellor", "user specialization")
      .populate("counsellor.user", "firstName lastName")
      .sort({ appointmentDate: -1 })
      .limit(10);

    const userData = user.toObject();
    userData.recentAppointments = appointments;

    res.json({
      success: true,
      data: userData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching user",
      error: error.message,
    });
  }
});

router.put("/:id/role", protect, authorize("admin"), async (req, res) => {
  try {
    const { role } = req.body;

    if (!["client", "counsellor", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating user role",
      error: error.message,
    });
  }
});

router.delete("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role === "counsellor") {
      const counsellorAppointments = await Appointment.findOne({
        counsellor: { $exists: true },
      }).populate("counsellor");

      const hasAppointments =
        counsellorAppointments?.counsellor?.user?.toString() === req.params.id;

      if (hasAppointments) {
        return res.status(400).json({
          success: false,
          message: "Cannot delete user with associated appointments",
        });
      }
    } else {
      const clientAppointments = await Appointment.findOne({
        client: req.params.id,
      });

      if (clientAppointments) {
        return res.status(400).json({
          success: false,
          message: "Cannot delete user with associated appointments",
        });
      }
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: error.message,
    });
  }
});

module.exports = router;
