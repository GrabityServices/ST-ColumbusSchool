const mongoose = require("mongoose");
const { marksheetDB } = require("../../connectdb");

const Class1PT3Schema = new mongoose.Schema({

    rollNumber: {
        type: Number,
        min: 1,
    },
    
    admissionNumber: {
        type: String,
        match: /^[0-9]{5}$/,
        required: true,
        unique: true
    },

    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50,
        match: /^[A-Za-z ]+$/
    },

    english: { type: Number,  min: 0, max: 10 },
    hindi: { type: Number,  min: 0, max: 10 },
    math: { type: Number,  min: 0, max: 10 },
    sst: { type: Number,  min: 0, max: 10 },
    gsc: { type: Number,  min: 0, max: 10 },
    gk: { type: Number,  min: 0, max: 10 },
    computer: { type: Number,  min: 0, max: 10 },
    language: { type: Number,  min: 0, max: 10 }

},{
    timestamps:true
});

module.exports = marksheetDB.model("Class1PT3", Class1PT3Schema);