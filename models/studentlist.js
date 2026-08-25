const mongoose = require("mongoose");
const { marksheetDB } = require("../connectdb");

const studentSchema = new mongoose.Schema(
  {
    admissionNo: {
      type: String,
      required: true,
      trim: true
    },

    house: {
      type: String,
      trim: true
    },

    className: {
      type: String,
      required: true,
      trim: true
    },

    section: {
      type: String,
      required: true,
      trim: true,
      uppercase: true
    },

    rollNo: {
      type: Number,
      required: true
    },

    studentName: {
      type: String,
      required: true,
      trim: true
    },

    fatherName: {
      type: String,
      required: true,
      trim: true
    },

    motherName: {
      type: String,
      trim: true
    },

    dateOfBirth: {
      type: Date
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"]
    },

    mobileNo: {
      type: String,
      trim: true
    },

    address: {
      type: String,
      trim: true
    },

    session: {
      type: String,
      trim: true
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active"
    }
  },
  {
    timestamps: true
  }
);

module.exports = marksheetDB.model("Student", studentSchema);