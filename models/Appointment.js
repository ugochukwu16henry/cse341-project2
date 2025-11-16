const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Client ID is required"],
    },
    counsellor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Counsellor ID is required"],
    },
    appointmentDate: {
      type: Date,
      required: [true, "Appointment date is required"],
      validate: {
        validator: function (date) {
          return date > new Date();
        },
        message: "Appointment date must be in the future",
      },
    },
    duration: {
      type: Number,
      required: true,
      min: [30, "Duration must be at least 30 minutes"],
      max: [120, "Duration cannot exceed 120 minutes"],
      default: 60,
    },
    sessionType: {
      type: String,
      required: true,
      enum: {
        values: ["video", "phone", "in-person", "chat"],
        message: "Session type must be video, phone, in-person, or chat",
      },
    },
    status: {
      type: String,
      enum: [
        "scheduled",
        "confirmed",
        "in-progress",
        "completed",
        "cancelled",
        "no-show",
      ],
      default: "scheduled",
    },
    notes: {
      clientNotes: {
        type: String,
        maxlength: [500, "Client notes cannot exceed 500 characters"],
      },
      counsellorNotes: {
        type: String,
        maxlength: [1000, "Counsellor notes cannot exceed 1000 characters"],
      },
    },
    emergencyContactPresent: {
      type: Boolean,
      default: false,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded", "failed"],
      default: "pending",
    },
    amount: {
      type: Number,
      required: true,
      min: [0, "Amount cannot be negative"],
    },
    meetingLink: {
      type: String,
    },
    cancellationReason: {
      type: String,
      maxlength: [200, "Cancellation reason cannot exceed 200 characters"],
    },
    clientSatisfaction: {
      rating: {
        type: Number,
        min: [1, "Rating must be at least 1"],
        max: [5, "Rating cannot exceed 5"],
      },
      feedback: {
        type: String,
        maxlength: [500, "Feedback cannot exceed 500 characters"],
      },
    },
  },
  {
    timestamps: true,
  }
);

appointmentSchema.index({ appointmentDate: 1 });
appointmentSchema.index({ client: 1, status: 1 });
appointmentSchema.index({ counsellor: 1, status: 1 });

module.exports = mongoose.model("Appointment", appointmentSchema);
