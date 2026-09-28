const mongoose = require("mongoose");

const termSchema = new mongoose.Schema({
  workingDays: { type: Number, default: null, min: 0 },
  present: { type: Number, default: null, min: 0 },
  absent: { type: Number, default: null, min: 0 }
}, { _id: false });

const attendanceSchema = new mongoose.Schema({
  academicYear: { type: String, required: true, trim: true },
  className: { type: String, required: true, trim: true },
  section: { type: String, default: "", trim: true },
  admissionNumber: { type: String, required: true, trim: true },
  rollNumber: { type: mongoose.Schema.Types.Mixed, default: "" },
  studentName: { type: String, required: true, trim: true },
  termI: { type: termSchema, default: () => ({}) },
  termII: { type: termSchema, default: () => ({}) }
}, { timestamps: true, collection: "attendances" });

attendanceSchema.index({ academicYear: 1, className: 1, admissionNumber: 1 }, { unique: true });

module.exports = mongoose.models.Attendance || mongoose.model("Attendance", attendanceSchema);
