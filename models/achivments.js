const mongoose = require("mongoose");

const achivSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: [3, "Admin Name must be at least 3 characters"],
      maxlength: [50, "Admin Name must be at most 30 characters"],
      unique: true,
    },
    prizeType: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      minlength: [3, "Position must be at least 3 characters"],
      maxlength: [500, "Position must be at most 30 characters"],
      required: true,
    },
    img: {
      type: String,
      default: "/adminAvt/defaultAvt.png",
    },
    comDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Achivments = mongoose.model("achivs", achivSchema);

// Achivments.create({
//   title: "Group Song inter School level compition",
//   desc: "Our school st columbus take first prize",
//   prizeType: "First",
// });

module.exports = Achivments;
