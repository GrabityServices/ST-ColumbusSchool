const moment = require("moment");
const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: [3, "Admin Name must be at least 3 characters"],
      maxlength: [60, "Admin Name must be at most 30 characters"],
    },
    mess: {
      type: String,
      maxlength: [500, "Position must be at most 30 characters"],
    },
    img: {
      type: String,
      default: "",
    },
    messDate: {
      type: String,
      default: () => moment().format("YYYY-MM-DD HH:MM"),
    },
  },
  { timestamps: true }
);

const Notice = mongoose.model("notice", noticeSchema);


module.exports = Notice;
