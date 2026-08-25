// Class5  

const Class5PT1 = require("../models/Class5/Class5PT1.js");
const Class5PT2 = require("../models/Class5/Class5PT2.js");
const Class5Halfyearly = require("../models/Class5/Class5Halfyearly.js");
const Class5PT3 = require("../models/Class5/Class5PT3.js");
const Class5PT4 = require("../models/Class5/Class5PT4.js");
const Class5Annual = require("../models/Class5/Class5Annual.js");


const saveMarks = require("../utils/saveMarks.js");


exports.Class5PT1 = async (req, res) => {
    return saveMarks(req, res, Class5PT1, "Class5 PT-1");
};

exports.Class5PT2 = async (req, res) => {
    return saveMarks(req, res, Class5PT2, "Class5 PT-2");
};

exports.Class5Halfyearly = async (req, res) => {
    return saveMarks(req, res, Class5Halfyearly, "Class5 Half Yearly");
};

exports.Class5PT3 = async (req, res) => {
    return saveMarks(req, res, Class5PT3, "Class5 PT-3");
};

exports.Class5PT4 = async (req, res) => {
    return saveMarks(req, res, Class5PT4, "Class5 PT-4");
};

exports.Class5Annual = async (req, res) => {
    return saveMarks(req, res, Class5Annual, "Class5 Annual");
};