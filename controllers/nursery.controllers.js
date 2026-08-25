// Nursery

const NurseryPT1 = require("../models/Nursery/NurseryPT1.js");
const NurseryPT2 = require("../models/Nursery/NurseryPT2.js");
const NurseryHalfyearly = require("../models/Nursery/NurseryHalfyearly.js");
const NurseryPT3 = require("../models/Nursery/NurseryPT3.js");
const NurseryPT4 = require("../models/Nursery/NurseryPT4.js");
const NurseryAnnual = require("../models/Nursery/NurseryAnnual.js");
const saveMarks = require("../utils/saveMarks.js");


exports.nurseryPT1 = async (req, res) => {
    return saveMarks(req, res, NurseryPT1, "Nursery PT-1");
};

exports.nurseryPT2 = async (req, res) => {
    return saveMarks(req, res, NurseryPT2, "Nursery PT-2");
};

exports.nurseryHalfyearly = async (req, res) => {
    return saveMarks(req, res, NurseryHalfyearly, "Nursery Half Yearly");
};

exports.nurseryPT3 = async (req, res) => {
    return saveMarks(req, res, NurseryPT3, "Nursery PT-3");
};

exports.nurseryPT4 = async (req, res) => {
    return saveMarks(req, res, NurseryPT4, "Nursery PT-4");
};

exports.nurseryAnnual = async (req, res) => {
    return saveMarks(req, res, NurseryAnnual, "Nursery Annual");
};