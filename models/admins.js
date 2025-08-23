const mongoose = require("mongoose");

const adminsSchema = new mongoose.Schema(
  {
    unqId: {
      type: String,
      minlength: 3,
      maxlength: 10,
      required: true,
      unique: true,
      match: [/^[a-zA-Z0-9]{3,30}$/],
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      match: [/^[a-zA-Z]{3,15}\s[a-zA-Z]{3,15}$/],
      minlength: [3, "Admin Name must be at least 3 characters"],
      maxlength: [30, "Admin Name must be at most 30 characters"],
    },
    position: {
      type: String,
      minlength: [3, "Position must be at least 3 characters"],
      maxlength: [30, "Position must be at most 30 characters"],
      required: true,
      match: [/^[a-zA-Z]{3,30}$/],
    },
    img:{
      type:String,
      default:"/adminAvt/defaultAvt.png"
    },
    gender: {
      type: String,
      enum: ["male", "female", "others"],
    },
    quli: {
      type: String,
      maxlength: 30,
    },
    age: {
      type: Number,
      min: 20,
      max: 120,
    },
    joingDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Admins = mongoose.model("admins", adminsSchema);

// const admin1 = Admins.create({
//   unqId: "2234S",
//   name: "Dev Endra",
//   email: "dar0645@gmail.com",
//   position: "Chairman",
//   gender: "male",
//   quli: "BCA 3rd Year | 8CGPA",
//   age: 20,
// });


module.exports = Admins;
