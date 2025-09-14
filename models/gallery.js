const moment = require("moment");
const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: [3, "Admin Name must be at least 3 characters"],
      maxlength: [60, "Admin Name must be at most 30 characters"],
    },
    img: {
      type: String,
      default: "/adminAvt/defaultAvt.png",
    },
    EventDate: {
      type: String,
      default: () => moment().format("YYYY-MM-DD"),
    },
  },
  { timestamps: true }
);

const Gallery = mongoose.model("gallery", gallerySchema);


module.exports = Gallery;
