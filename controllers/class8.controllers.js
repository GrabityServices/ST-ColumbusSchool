// Class8  

const Class8PT1 = require("../models/Class8/Class8PT1.js");
const Class8PT2 = require("../models/Class8/Class8PT2.js");
const Class8Halfyearly = require("../models/Class8/Class8Halfyearly.js");
const Class8PT3 = require("../models/Class8/Class8PT3.js");
const Class8PT4 = require("../models/Class8/Class8PT4.js");
const Class8Annual = require("../models/Class8/Class8Annual.js");


const saveMarks = require("../utils/saveMarks.js");


exports.Class8PT1 = async (req, res) => {
    return saveMarks(req, res, Class8PT1, "Class8 PT-1");
};

exports.Class8PT2 = async (req, res) => {
    return saveMarks(req, res, Class8PT2, "Class8 PT-2");
};

exports.Class8Halfyearly = async (req, res) => {
    return saveMarks(req, res, Class8Halfyearly, "Class8 Half Yearly");
};

exports.Class8PT3 = async (req, res) => {
    return saveMarks(req, res, Class8PT3, "Class8 PT-3");
};

exports.Class8PT4 = async (req, res) => {
    return saveMarks(req, res, Class8PT4, "Class8 PT-4");
};

exports.Class8Annual = async (req, res) => {
    return saveMarks(req, res, Class8Annual, "Class8 Annual");
};