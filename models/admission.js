const generateProcessId=require('../utils/uniqueEnroll.js')
const mongoose = require("mongoose");

const AdmissionSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 60,
  },
  age: {
    type: Number,
    required: true,
    min: 3,
    max: 100,
  },
  email: {
    type: String,
    required: true,
    minlength: 6,
    mainxlength: 40,
    unique: true,
  },
  mobNumber: {
    type: Number,
    required: true,
    max: 9999999999,
    minlength: 1000000000,
  },
  fname: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 60,
  },
  mname: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 60,
  },
  forClass: {
    type: String,
    enum: [
      "LKG",
      "UKG",
      "NUR",
      "1ST",
      "2ND",
      "3RD",
      "4TH",
      "5TH",
      "6TH",
      "7TH",
      "8TH",
      "9TH",
      "10TH",
    ],
    default: "LKG",
  },
  add: {
    vill: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 60,
    },
    town: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 60,
    },
    dist: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 60,
    },
    state: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 60,
    },
    pincode: {
      type: String,
      required: true,
      maxlength: 6,
      minlength: 6,
    },
  },
  admissionStatus: {
    type: String,
    enum: ["Done", "Document verification", "Pending at counselor"],
    default: "Pending at counselor",
  },
  processId: {
    type: String,
    unique: true,
    match: [
      /^[A-Z0-9]{10}$/,
      "Process ID must be 10 alphanumeric characters",
    ],
  },
});


AdmissionSchema.pre("save", async function (next) {
  if (!this.processId) {
    let newId;
    let exists = true;

    while (exists) {
      newId = generateProcessId(5);
      const existing = await Admission.findOne({
        processId: newId,
      });
      if (!existing) exists = false;
    }

    this.processId = newId;
  }

  next();
});

const Admission = mongoose.model("admission", AdmissionSchema);
// Admission.create({
//   name: "Devendra Kumar",
//   fname: "Ramdeo Mandal",
//   mname: "Shanti Devi",
//   age: 22,
//   email: "dkumar@gmail.com",
//   mobNumber: 9142003626,
//   add: {
//     vill: "Harhanja",
//     town: "jhajha",
//     dist: "Jamui",
//     state: "Bihar",
//     pincode: 811308,
//   },
// });

module.exports = Admission;
