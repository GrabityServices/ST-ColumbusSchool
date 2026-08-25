// Class6  

const Class6PT1 = require("../models/Class6/Class6PT1.js");
const Class6PT2 = require("../models/Class6/Class6PT2.js");
const Class6Halfyearly = require("../models/Class6/Class6Halfyearly.js");
const Class6PT3 = require("../models/Class6/Class6PT3.js");
const Class6PT4 = require("../models/Class6/Class6PT4.js");
const Class6Annual = require("../models/Class6/Class6Annual.js");


const saveMarks = require("../utils/saveMarks.js");


exports.Class6PT1 = async (req, res) => {
    return saveMarks(req, res, Class6PT1, "Class6 PT-1");
};

exports.Class6PT2 = async (req, res) => {
    return saveMarks(req, res, Class6PT2, "Class6 PT-2");
};

exports.Class6Halfyearly = async (req, res) => {
    return saveMarks(req, res, Class6Halfyearly, "Class6 Half Yearly");
};

exports.Class6PT3 = async (req, res) => {
    return saveMarks(req, res, Class6PT3, "Class6 PT-3");
};

exports.Class6PT4 = async (req, res) => {
    return saveMarks(req, res, Class6PT4, "Class6 PT-4");
};

exports.Class6Annual = async (req, res) => {
    return saveMarks(req, res, Class6Annual, "Class6 Annual");
};