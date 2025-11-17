const { validationResult } = require("express-validator");

// Get all appointments for user
const getAppointments = async (req, res) => {
  try {
    // Mock data for now
    const appointments = [
      {
        _id: "1",
        client: "mock-user-id",
        counsellor: {
          _id: "mock-counsellor-id",
          firstName: "Dr. Sarah",
          lastName: "Smith",
          email: "sarah@example.com",
        },
        appointmentDate: "2024-12-20T10:00:00.000Z",
        duration: 60,
        sessionType: "video",
        status: "scheduled",
        notes: "Test appointment",
        amount: 100,
        createdAt: "2024-01-10T08:00:00.000Z",
        updatedAt: "2024-01-10T08:00:00.000Z",
      },
    ];

    res.json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    console.error("Get appointments error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching appointments",
      error: error.message,
    });
  }
};

// Get single appointment
const getAppointment = async (req, res) => {
  try {
    const appointment = {
      _id: req.params.id,
      client: "mock-user-id",
      counsellor: {
        _id: "mock-counsellor-id",
        firstName: "Dr. Sarah",
        lastName: "Smith",
        email: "sarah@example.com",
      },
      appointmentDate: "2024-12-20T10:00:00.000Z",
      duration: 60,
      sessionType: "video",
      status: "scheduled",
      notes: "Test appointment",
      amount: 100,
      createdAt: "2024-01-10T08:00:00.000Z",
      updatedAt: "2024-01-10T08:00:00.000Z",
    };

    res.json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    console.error("Get appointment error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching appointment",
      error: error.message,
    });
  }
};

// Create new appointment
const createAppointment = async (req, res) => {
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

    // Create mock appointment
    const appointment = {
      _id: "mock-appointment-id",
      client: "mock-user-id",
      counsellor: {
        _id: counsellor,
        firstName: "Dr. Sarah",
        lastName: "Smith",
        email: "sarah@example.com",
      },
      appointmentDate,
      duration,
      sessionType,
      status: "scheduled",
      notes,
      amount,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      data: appointment,
    });
  } catch (error) {
    console.error("Create appointment error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating appointment",
      error: error.message,
    });
  }
};

// Export functions
module.exports = {
  getAppointments,
  getAppointment,
  createAppointment,
};
