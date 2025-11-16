const mongoose = require("mongoose");

const counsellorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    specialization: [
      {
        type: String,
        enum: [
          "anxiety",
          "depression",
          "relationships",
          "trauma",
          "addiction",
          "career",
          "family",
          "lgbtq+",
        ],
      },
    ],
    qualifications: [
      {
        degree: String,
        institution: String,
        year: Number,
      },
    ],
    licenseNumber: {
      type: String,
      required: true,
    },
    yearsOfExperience: {
      type: Number,
      min: 0,
    },
    hourlyRate: {
      type: Number,
      required: true,
      min: 0,
    },
    bio: {
      type: String,
      maxlength: 1000,
    },
    languages: [
      {
        type: String,
      },
    ],
    availability: [
      {
        day: {
          type: String,
          enum: [
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday",
          ],
        },
        slots: [
          {
            startTime: String,
            endTime: String,
            isAvailable: Boolean,
          },
        ],
      },
    ],
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      totalReviews: {
        type: Number,
        default: 0,
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    sessionModalities: [
      {
        type: String,
        enum: ["video", "phone", "in-person", "chat"],
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Counsellor", counsellorSchema);
