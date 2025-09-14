const mongoose = require("mongoose");
const getCurrentDateTime = require("../utils/currdate.js");

const stringFeeField = {
  type: String,
  minlength: 1,
  maxlength: 5,
  match: /^[0-9]+$/,
};

const feeSchema = mongoose.Schema({
  tutionfee: {
    nurUkg: {
      addfee: stringFeeField,
      monthly: stringFeeField,
    },
    oneFive: {
      addfee: stringFeeField,
      monthly: stringFeeField,
    },
    sixEight: {
      addfee: stringFeeField,
      monthly: stringFeeField,
    },
    nineTen: {
      addfee: stringFeeField,
      monthly: stringFeeField,
    },
  },
  transport: {
    oneKm: stringFeeField,
    fiveKm: stringFeeField,
    elevenKm: stringFeeField,
    sixteenKm: stringFeeField,
    twentyPlush: stringFeeField,
  },
  schoolUniform: {
    regular: stringFeeField,
    gameUniform: stringFeeField,
    tie: stringFeeField,
    belt: stringFeeField,
    IDcard: stringFeeField,
    shoesSocks: stringFeeField,
  },
  lastChanged: {
    type: String,
    default: getCurrentDateTime(),
  },
  getBy: {
    type: String,
    default: process.env.GETFEE,
  },
});

const Feestuct = mongoose.model("feestructure", feeSchema);

module.exports = Feestuct;
