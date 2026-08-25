// Class1  

const Class1T1 = require("../models/Class1/Class1PT1.js");
const Class1PT2 = require("../models/Class1/Class1PT2.js");
const Class1Halfyearly = require("../models/Class1/Class1Halfyearly.js");
const Class1PT3 = require("../models/Class1/Class1PT3.js");
const Class1PT4 = require("../models/Class1/Class1PT4.js");
const Class1Annual = require("../models/Class1/Class1Annual.js");
const saveMarks = require("../utils/saveMarks.js");


exports.Class1PT1 = async (req, res) => {
    console.log("Class1PT1",req.body);
    return saveMarks(req, res, Class1T1, "Class1 PT-1");
};

exports.Class1PT2 = async (req, res) => {
    return saveMarks(req, res, Class1PT2, "Class1 PT-2");
};

exports.Class1Halfyearly = async (req, res) => {
    return saveMarks(req, res, Class1Halfyearly, "Class1 Half Yearly");
};

exports.Class1PT3 = async (req, res) => {
    return saveMarks(req, res, Class1PT3, "Class1 PT-3");
};

exports.Class1PT4 = async (req, res) => {
    return saveMarks(req, res, Class1PT4, "Class1 PT-4");
};

exports.Class1Annual = async (req, res) => {
    return saveMarks(req, res, Class1Annual, "Class1 Annual");
};