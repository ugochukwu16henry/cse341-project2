const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    counsellor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Counsellor",
      required: true,
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
      min: 30,
      max: 120,
      default: 60,
    },
    sessionType: {
      type: String,
      enum: ["video", "phone", "in-person", "chat"],
      required: true,
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
      clientNotes: String,
      counsellorNotes: String,
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
      min: 0,
    },
    meetingLink: {
      type: String,
    },
    cancellationReason: String,
    rescheduledFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },
    clientSatisfaction: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      feedback: String,
    },
    followUpRequired: {
      type: Boolean,
      default: false,
    },
    nextAppointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
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
