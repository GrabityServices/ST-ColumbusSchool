const mongoose = require("mongoose");

const schoolistAssessmentSchema = new mongoose.Schema(
  {
    academicYear: { type: String, required: true, trim: true },
    className: { type: String, required: true, trim: true },
    section: { type: String, default: "", trim: true },
    admissionNumber: { type: String, required: true, trim: true },
    rollNumber: { type: mongoose.Schema.Types.Mixed, default: "" },
    studentName: { type: String, required: true, trim: true },
    termI: { type: mongoose.Schema.Types.Mixed, default: {} },
    termII: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true, collection: "schoolistAssessments" },
);

schoolistAssessmentSchema.index(
  { academicYear: 1, className: 1, admissionNumber: 1 },
  { unique: true },
);

module.exports =
  mongoose.models.SchoolistAssessment ||
  mongoose.model("SchoolistAssessment", schoolistAssessmentSchema);
