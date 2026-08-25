// LKG  

const LKGPT1 = require("../models/LKG/LKGPT1.js");
const LKGPT2 = require("../models/LKG/LKGPT2.js");
const LKGHalfyearly = require("../models/LKG/LKGHalfyearly.js");
const LKGPT3 = require("../models/LKG/LKGPT3.js");
const LKGPT4 = require("../models/LKG/LKGPT4.js");
const LKGAnnual = require("../models/LKG/LKGAnnual.js");
const saveMarks = require("../utils/saveMarks.js");


exports.LKGPT1 = async (req, res) => {
    return saveMarks(req, res, LKGPT1, "LKG PT-1");
};

exports.LKGPT2 = async (req, res) => {
    return saveMarks(req, res, LKGPT2, "LKG PT-2");
};

exports.LKGHalfyearly = async (req, res) => {
    return saveMarks(req, res, LKGHalfyearly, "LKG Half Yearly");
};

exports.LKGPT3 = async (req, res) => {
    return saveMarks(req, res, LKGPT3, "LKG PT-3");
};

exports.LKGPT4 = async (req, res) => {
    return saveMarks(req, res, LKGPT4, "LKG PT-4");
};

exports.LKGAnnual = async (req, res) => {
    return saveMarks(req, res, LKGAnnual, "LKG Annual");
};