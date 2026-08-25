// Class4  

const Class4PT1 = require("../models/Class4/Class4PT1.js");
const Class4PT2 = require("../models/Class4/Class4PT2.js");
const Class4Halfyearly = require("../models/Class4/Class4Halfyearly.js");
const Class4PT3 = require("../models/Class4/Class4PT3.js");
const Class4PT4 = require("../models/Class4/Class4PT4.js");
const Class4Annual = require("../models/Class4/Class4Annual.js");


const saveMarks = require("../utils/saveMarks.js");


exports.Class4PT1 = async (req, res) => {
    return saveMarks(req, res, Class4PT1, "Class4 PT-1");
};

exports.Class4PT2 = async (req, res) => {
    return saveMarks(req, res, Class4PT2, "Class4 PT-2");
};

exports.Class4Halfyearly = async (req, res) => {
    return saveMarks(req, res, Class4Halfyearly, "Class4 Half Yearly");
};

exports.Class4PT3 = async (req, res) => {
    return saveMarks(req, res, Class4PT3, "Class4 PT-3");
};

exports.Class4PT4 = async (req, res) => {
    return saveMarks(req, res, Class4PT4, "Class4 PT-4");
};

exports.Class4Annual = async (req, res) => {
    return saveMarks(req, res, Class4Annual, "Class4 Annual");
};