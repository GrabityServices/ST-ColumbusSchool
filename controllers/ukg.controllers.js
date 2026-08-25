// UKG  

const UKGPT1 = require("../models/UKG/UKGPT1.js");
const UKGPT2 = require("../models/UKG/UKGPT2.js");
const UKGHalfyearly = require("../models/UKG/UKGHalfyearly.js");
const UKGPT3 = require("../models/UKG/UKGPT3.js");
const UKGPT4 = require("../models/UKG/UKGPT4.js");
const UKGAnnual = require("../models/UKG/UKGAnnual.js");


const saveMarks = require("../utils/saveMarks.js");


exports.UKGPT1 = async (req, res) => {
    return saveMarks(req, res, UKGPT1, "UKG PT-1");
};

exports.UKGPT2 = async (req, res) => {
    return saveMarks(req, res, UKGPT2, "U   KG PT-2");
};

exports.UKGHalfyearly = async (req, res) => {
    return saveMarks(req, res, UKGHalfyearly, "UKG Half Yearly");
};

exports.UKGPT3 = async (req, res) => {
    return saveMarks(req, res, UKGPT3, "UKG PT-3");
};

exports.UKGPT4 = async (req, res) => {
    return saveMarks(req, res, UKGPT4, "UKG PT-4");
};

exports.UKGAnnual = async (req, res) => {
    return saveMarks(req, res, UKGAnnual, "UKG Annual");
};