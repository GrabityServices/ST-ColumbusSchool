const mongoose = require("mongoose");
const getCurrentDateTime = require("../utils/currdate");

const contactSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  mess: {
    required: true,
    type: String,
    maxlength: [500, "Number words exceed"],
  },
  email: {
    required: true,
    type: String,
    unique: true,
  },
  contactOn: {
    type: String,
    default: getCurrentDateTime(),
  },
  location: {
    type: String,
    required: true,
    minlength: 4,
  },
  status: {
    type: String,
    enum: ["ATCARE", "CALLED"],
    default: "ATCARE",
  },
});

const Contact = mongoose.model("contact", contactSchema);

module.exports = Contact;
