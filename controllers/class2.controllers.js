// Class2  

const Class2PT1 = require("../models/Class2/Class2PT1.js");
const Class2PT2 = require("../models/Class2/Class2PT2.js");
const Class2Halfyearly = require("../models/Class2/Class2Halfyearly.js");
const Class2PT3 = require("../models/Class2/Class2PT3.js");
const Class2PT4 = require("../models/Class2/Class2PT4.js");
const Class2Annual = require("../models/Class2/Class2Annual.js");


const saveMarks = require("../utils/saveMarks.js");


exports.Class2PT1 = async (req, res) => {
    return saveMarks(req, res, Class2PT1, "Class2 PT-1");
};

exports.Class2PT2 = async (req, res) => {
    return saveMarks(req, res, Class2PT2, "U   KG PT-2");
};

exports.Class2Halfyearly = async (req, res) => {
    return saveMarks(req, res, Class2Halfyearly, "Class2 Half Yearly");
};

exports.Class2PT3 = async (req, res) => {
    return saveMarks(req, res, Class2PT3, "Class2 PT-3");
};

exports.Class2PT4 = async (req, res) => {
    return saveMarks(req, res, Class2PT4, "Class2 PT-4");
};

exports.Class2Annual = async (req, res) => {
    return saveMarks(req, res, Class2Annual, "Class2 Annual");
};