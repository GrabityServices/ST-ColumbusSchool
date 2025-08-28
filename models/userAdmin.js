const mongoose = require("mongoose");

const userAdmin = mongoose.Schema(
  {
    name: {
      type: String,
      required,
      min: [3, "Minimum  length of name must be 3 or more"],
      max: [30, "Maximum  length of name must be 30 or less"],
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
      default:"/adminAvt/defaultAvt.png"
    },
    lastForgot:{
        type:Date,
        default: () => moment().format("YYYY-MM-DD")
    },
    forgotCount:{
        type:Number,
        default:0
    },
    lastLogin: {
      type: Date,
      default: () => moment().format("YYYY-MM-DD"),
    },
    blocked:{
      type:Boolean,
      default:false
    }
  },
  { timestamp: true }
);

const UserAdmin = mongoose.model("userAsAdmin", userAdmin);

module.exports = UserAdmin;
