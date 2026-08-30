const mongoose = require("mongoose");

const getCurrentDateTime = require("../utils/currdate");

const noticeSchema = new mongoose.Schema(

  {

    title: {

      type: String,

      required: true,

      minlength: [
        3,
        "Title must be at least 3 characters"
      ],

      maxlength: [
        100,
        "Title must be at most 100 characters"
      ],

    },


    mess: {

      type: String,

      maxlength: [
        500,
        "Message must be at most 500 characters"
      ],

    },


    img: {

      type: String,

      default: "",

    },


    messDate: {

      type: String,

      default: getCurrentDateTime,

    },

  },

  {
    timestamps: true
  }

);


const Notice =
  mongoose.model("notice", noticeSchema);


module.exports = Notice;