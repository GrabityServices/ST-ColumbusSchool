const mongoose = require("mongoose");

const adminsSchema = new mongoose.Schema(
  {
    unqId: {
      type: String,
      required: true,
      unique: true,
      match: [/^[A-Z0-9]{5}$/],
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
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

// Admins.create({
//   unqId:'8561',
//   name:"Raj",
//   position:"Developer",
//   gender:'male',
//   quli:"BCA CGPA",
//   age:20,
//   email:"r@gmail.com"
// })


module.exports = Admins;
