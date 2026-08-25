// ==========================================================
// services/result/classModels.js
// RESULT CLASS → EXAM MODEL MAP
// ==========================================================


// =========================
// NURSERY
// =========================

const NurseryPT1 = require("../../models/Nursery/NurseryPT1.js");
const NurseryPT2 = require("../../models/Nursery/NurseryPT2.js");
const NurseryHalfyearly = require("../../models/Nursery/NurseryHalfyearly.js");
const NurseryPT3 = require("../../models/Nursery/NurseryPT3.js");
const NurseryPT4 = require("../../models/Nursery/NurseryPT4.js");
const NurseryAnnual = require("../../models/Nursery/NurseryAnnual.js");


// =========================
// LKG
// =========================

const LKGPT1 = require("../../models/LKG/LKGPT1.js");
const LKGPT2 = require("../../models/LKG/LKGPT2.js");
const LKGHalfyearly = require("../../models/LKG/LKGHalfyearly.js");
const LKGPT3 = require("../../models/LKG/LKGPT3.js");
const LKGPT4 = require("../../models/LKG/LKGPT4.js");
const LKGAnnual = require("../../models/LKG/LKGAnnual.js");


// =========================
// UKG
// =========================

const UKGPT1 = require("../../models/UKG/UKGPT1.js");
const UKGPT2 = require("../../models/UKG/UKGPT2.js");
const UKGHalfyearly = require("../../models/UKG/UKGHalfyearly.js");
const UKGPT3 = require("../../models/UKG/UKGPT3.js");
const UKGPT4 = require("../../models/UKG/UKGPT4.js");
const UKGAnnual = require("../../models/UKG/UKGAnnual.js");


// =========================
// CLASS 1
// =========================

const Class1PT1 = require("../../models/Class1/Class1PT1.js");
const Class1PT2 = require("../../models/Class1/Class1PT2.js");
const Class1Halfyearly = require("../../models/Class1/Class1Halfyearly.js");
const Class1PT3 = require("../../models/Class1/Class1PT3.js");
const Class1PT4 = require("../../models/Class1/Class1PT4.js");
const Class1Annual = require("../../models/Class1/Class1Annual.js");


// =========================
// CLASS 2
// =========================

const Class2PT1 = require("../../models/Class2/Class2PT1.js");
const Class2PT2 = require("../../models/Class2/Class2PT2.js");
const Class2Halfyearly = require("../../models/Class2/Class2Halfyearly.js");
const Class2PT3 = require("../../models/Class2/Class2PT3.js");
const Class2PT4 = require("../../models/Class2/Class2PT4.js");
const Class2Annual = require("../../models/Class2/Class2Annual.js");


// =========================
// CLASS 3
// =========================

const Class3PT1 = require("../../models/Class3/Class3PT1.js");
const Class3PT2 = require("../../models/Class3/Class3PT2.js");
const Class3Halfyearly = require("../../models/Class3/Class3Halfyearly.js");
const Class3PT3 = require("../../models/Class3/Class3PT3.js");
const Class3PT4 = require("../../models/Class3/Class3PT4.js");
const Class3Annual = require("../../models/Class3/Class3Annual.js");


// =========================
// CLASS 4
// =========================

const Class4PT1 = require("../../models/Class4/Class4PT1.js");
const Class4PT2 = require("../../models/Class4/Class4PT2.js");
const Class4Halfyearly = require("../../models/Class4/Class4Halfyearly.js");
const Class4PT3 = require("../../models/Class4/Class4PT3.js");
const Class4PT4 = require("../../models/Class4/Class4PT4.js");
const Class4Annual = require("../../models/Class4/Class4Annual.js");


// =========================
// CLASS 5
// =========================

const Class5PT1 = require("../../models/Class5/Class5PT1.js");
const Class5PT2 = require("../../models/Class5/Class5PT2.js");
const Class5Halfyearly = require("../../models/Class5/Class5Halfyearly.js");
const Class5PT3 = require("../../models/Class5/Class5PT3.js");
const Class5PT4 = require("../../models/Class5/Class5PT4.js");
const Class5Annual = require("../../models/Class5/Class5Annual.js");


// =========================
// CLASS 6
// =========================

const Class6PT1 = require("../../models/Class6/Class6PT1.js");
const Class6PT2 = require("../../models/Class6/Class6PT2.js");
const Class6Halfyearly = require("../../models/Class6/Class6Halfyearly.js");
const Class6PT3 = require("../../models/Class6/Class6PT3.js");
const Class6PT4 = require("../../models/Class6/Class6PT4.js");
const Class6Annual = require("../../models/Class6/Class6Annual.js");


// =========================
// CLASS 7
// =========================

const Class7PT1 = require("../../models/Class7/Class7PT1.js");
const Class7PT2 = require("../../models/Class7/Class7PT2.js");
const Class7Halfyearly = require("../../models/Class7/Class7Halfyearly.js");
const Class7PT3 = require("../../models/Class7/Class7PT3.js");
const Class7PT4 = require("../../models/Class7/Class7PT4.js");
const Class7Annual = require("../../models/Class7/Class7Annual.js");


// =========================
// CLASS 8
// =========================

const Class8PT1 = require("../../models/Class8/Class8PT1.js");
const Class8PT2 = require("../../models/Class8/Class8PT2.js");
const Class8Halfyearly = require("../../models/Class8/Class8Halfyearly.js");
const Class8PT3 = require("../../models/Class8/Class8PT3.js");
const Class8PT4 = require("../../models/Class8/Class8PT4.js");
const Class8Annual = require("../../models/Class8/Class8Annual.js");


// ==========================================================
// CLASS → EXAM → MONGOOSE MODEL
// ==========================================================

const classModels = {

    Nursery: {
        PT1: NurseryPT1,
        PT2: NurseryPT2,
        Halfyearly: NurseryHalfyearly,
        PT3: NurseryPT3,
        PT4: NurseryPT4,
        Annual: NurseryAnnual
    },

    LKG: {
        PT1: LKGPT1,
        PT2: LKGPT2,
        Halfyearly: LKGHalfyearly,
        PT3: LKGPT3,
        PT4: LKGPT4,
        Annual: LKGAnnual
    },

    UKG: {
        PT1: UKGPT1,
        PT2: UKGPT2,
        Halfyearly: UKGHalfyearly,
        PT3: UKGPT3,
        PT4: UKGPT4,
        Annual: UKGAnnual
    },

    "1": {
        PT1: Class1PT1,
        PT2: Class1PT2,
        Halfyearly: Class1Halfyearly,
        PT3: Class1PT3,
        PT4: Class1PT4,
        Annual: Class1Annual
    },

    "2": {
        PT1: Class2PT1,
        PT2: Class2PT2,
        Halfyearly: Class2Halfyearly,
        PT3: Class2PT3,
        PT4: Class2PT4,
        Annual: Class2Annual
    },

    "3": {
        PT1: Class3PT1,
        PT2: Class3PT2,
        Halfyearly: Class3Halfyearly,
        PT3: Class3PT3,
        PT4: Class3PT4,
        Annual: Class3Annual
    },

    "4": {
        PT1: Class4PT1,
        PT2: Class4PT2,
        Halfyearly: Class4Halfyearly,
        PT3: Class4PT3,
        PT4: Class4PT4,
        Annual: Class4Annual
    },

    "5": {
        PT1: Class5PT1,
        PT2: Class5PT2,
        Halfyearly: Class5Halfyearly,
        PT3: Class5PT3,
        PT4: Class5PT4,
        Annual: Class5Annual
    },

    "6": {
        PT1: Class6PT1,
        PT2: Class6PT2,
        Halfyearly: Class6Halfyearly,
        PT3: Class6PT3,
        PT4: Class6PT4,
        Annual: Class6Annual
    },

    "7": {
        PT1: Class7PT1,
        PT2: Class7PT2,
        Halfyearly: Class7Halfyearly,
        PT3: Class7PT3,
        PT4: Class7PT4,
        Annual: Class7Annual
    },

    "8": {
        PT1: Class8PT1,
        PT2: Class8PT2,
        Halfyearly: Class8Halfyearly,
        PT3: Class8PT3,
        PT4: Class8PT4,
        Annual: Class8Annual
    }

};


// ==========================================================
// HELPER: GET RESULT MODEL
// ==========================================================

function getResultModel(className, examType) {

    if (!classModels[className]) {
        return null;
    }

    if (!classModels[className][examType]) {
        return null;
    }

    return classModels[className][examType];

}


// ==========================================================
// EXPORT
// ==========================================================

module.exports = {
    classModels,
    getResultModel
};