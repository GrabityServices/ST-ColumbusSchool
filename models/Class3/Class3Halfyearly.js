const mongoose = require("mongoose");
const { marksheetDB } = require("../../connectdb");

const Class3HalfyearlySchema = new mongoose.Schema({

    rollNumber: {
        type: Number,
        min: [1, "Roll Number must be at least 1"],
    },

    admissionNumber: {
        type: String,
        required: [true, "Admission Number is required"],
        unique: true,
        match: [/^[0-9]{5}$/, "Admission Number must be exactly 5 digits"]
    },

    name: {
        type: String,
        required: [true, "Student Name is required"],
        trim: true,
        minlength: [2, "Name must contain at least 2 characters"],
        maxlength: [50, "Name cannot exceed 50 characters"],
        match: [/^[A-Za-z ]+$/, "Name can contain only letters and spaces"]
    },

 
    english: {
        type: Number,
        min: 0,
        max: 80
    },

    hindi: {
        type: Number,
        min: 0,
        max: 80
    },

    math: {
        type: Number,
        min: 0,
        max: 80
    },

    sst: {
        type: Number,
        min: 0,
        max: 80
    },

    gsc: {
        type: Number,
        min: 0,
        max: 80
    },

    gk: {
        type: Number,
        min: 0,
        max: 80
    },

    computer: {
        type: Number,
        min: 0,
        max: 80
    },

    language: {
        type: Number,
        min: 0,
        max: 80
    }

}, {
    timestamps: true
});

module.exports = marksheetDB.model(
    "Class3Halfyearly",
    Class3HalfyearlySchema
);