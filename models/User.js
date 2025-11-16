const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    sparse: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please enter a valid email",
    ],
  },
  password: {
    type: String,
    minlength: [6, "Password must be at least 6 characters"],
    select: false,
  },
  firstName: {
    type: String,
    required: [true, "First name is required"],
    trim: true,
    maxlength: [50, "First name cannot exceed 50 characters"],
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
    trim: true,
    maxlength: [50, "Last name cannot exceed 50 characters"],
  },
  phone: {
    type: String,
    trim: true,
    match: [/^\+?[\d\s-()]+$/, "Please enter a valid phone number"],
  },
  dateOfBirth: {
    type: Date,
    validate: {
      validator: function (date) {
        return date < new Date();
      },
      message: "Date of birth must be in the past",
    },
  },
  gender: {
    type: String,
    enum: {
      values: ["male", "female", "other", "prefer-not-to-say"],
      message: "Gender must be male, female, other, or prefer-not-to-say",
    },
  },
  role: {
    type: String,
    enum: ["client", "counsellor", "admin"],
    default: "client",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  profilePicture: {
    type: String,
  },
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.correctPassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
