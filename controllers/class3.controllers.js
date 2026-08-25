// Class3  

const Class3PT1 = require("../models/Class3/Class3PT1.js");
const Class3PT2 = require("../models/Class3/Class3PT2.js");
const Class3Halfyearly = require("../models/Class3/Class3Halfyearly.js");
const Class3PT3 = require("../models/Class3/Class3PT3.js");
const Class3PT4 = require("../models/Class3/Class3PT4.js");
const Class3Annual = require("../models/Class3/Class3Annual.js");


const saveMarks = require("../utils/saveMarks.js");


exports.Class3PT1 = async (req, res) => {
    return saveMarks(req, res, Class3PT1, "Class3 PT-1");
};

exports.Class3PT2 = async (req, res) => {
    return saveMarks(req, res, Class3PT2, "U   KG PT-2");
};

exports.Class3Halfyearly = async (req, res) => {
    return saveMarks(req, res, Class3Halfyearly, "Class3 Half Yearly");
};

exports.Class3PT3 = async (req, res) => {
    return saveMarks(req, res, Class3PT3, "Class3 PT-3");
};

exports.Class3PT4 = async (req, res) => {
    return saveMarks(req, res, Class3PT4, "Class3 PT-4");
};

exports.Class3Annual = async (req, res) => {
    return saveMarks(req, res, Class3Annual, "Class3 Annual");
};