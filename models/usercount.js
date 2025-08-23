const mongoose = require("mongoose");

const visit = new mongoose.Schema(
  {
    totalvisits: {
      type: Number,
    },
    fetchBy:{
      type:String,
    }
  },
  { timestamps: true }
);

const totalVisits = mongoose.model("TotalVisits", visit);
module.exports = totalVisits;
