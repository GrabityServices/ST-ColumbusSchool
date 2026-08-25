// Class7  

const Class7PT1 = require("../models/Class7/Class7PT1.js");
const Class7PT2 = require("../models/Class7/Class7PT2.js");
const Class7Halfyearly = require("../models/Class7/Class7Halfyearly.js");
const Class7PT3 = require("../models/Class7/Class7PT3.js");
const Class7PT4 = require("../models/Class7/Class7PT4.js");
const Class7Annual = require("../models/Class7/Class7Annual.js");


const saveMarks = require("../utils/saveMarks.js");


exports.Class7PT1 = async (req, res) => {
    return saveMarks(req, res, Class7PT1, "Class7 PT-1");
};

exports.Class7PT2 = async (req, res) => {
    return saveMarks(req, res, Class7PT2, "Class7 PT-2");
};

exports.Class7Halfyearly = async (req, res) => {
    return saveMarks(req, res, Class7Halfyearly, "Class7 Half Yearly");
};

exports.Class7PT3 = async (req, res) => {
    return saveMarks(req, res, Class7PT3, "Class7 PT-3");
};

exports.Class7PT4 = async (req, res) => {
    return saveMarks(req, res, Class7PT4, "Class7 PT-4");
};

exports.Class7Annual = async (req, res) => {
    return saveMarks(req, res, Class7Annual, "Class7 Annual");
};