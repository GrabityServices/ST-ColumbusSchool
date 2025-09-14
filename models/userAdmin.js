const mongoose = require("mongoose");
const moment = require("moment");

const userAdmin = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: [3, "Minimum length of name must be 3 or more"],
      max: [30, "Maximum length of name must be 30 or less"],
    },
    uniqId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      default: "/adminAvt/defaultAvt.png",
    },
    lastForgot: {
      type: String,
      default: () => moment().format("YYYY-MM-DD"),
    },
    forgotCount: {
      type: Number,
      default: 0,
    },
    lastLogin: {
      type: String,
      default: () => moment().format("YYYY-MM-DD"),
    },
    blocked: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["superadmin", "editor"],
      default: "editor",
    },
    permissions: {
      type: [String],
      default: ["update_content", "upload_images"],
    },
  },
  { timestamps: true }
);

const UserAdmin = mongoose.model("userAsAdmin", userAdmin);


// UserAdmin.create({
//   name:'Devendra Kumar',
//   uniqId:'BCA3RD2',
//   email:"s@gmail.com",
//   password:'Hello@st'
// })

module.exports = UserAdmin;
