

const express = require('express')
const jwt=require('jsonwebtoken')
const {
    requireMarksEditOTP
} = require("../middleware/otpVerification");
const marksheet=express.Router()
const mergeExamCollections =
    require("../utils/mergeMarksheets.js");
    const verifyStudentForMarks =
    require("../middleware/verifyStudentMarks.js");
const nurseryController=require('../controllers/nursery.controllers.js')
const lkgController=require('../controllers/lkg.controllers.js')
const ukgController=require('../controllers/ukg.controllers.js')
const class1Controller=require('../controllers/class1.controllers.js')
const class2Controller=require('../controllers/class2.controllers.js')
const class3Controller=require('../controllers/class3.controllers.js')
const class4Controller=require('../controllers/class4.controllers.js')
const class5Controller=require('../controllers/class5.controllers.js')
const class6Controller=require('../controllers/class6.controllers.js')
const class7Controller=require('../controllers/class7.controllers.js')
const class8Controller=require('../controllers/class8.controllers.js')
const verifyEdit = require('../middleware/verifyEdit.js')

// DBs
// Nursery
const NurseryPT1 = require("../models/Nursery/NurseryPT1.js");
const NurseryPT2 = require("../models/Nursery/NurseryPT2.js");
const NurseryHalfyearly = require("../models/Nursery/NurseryHalfyearly.js");
const NurseryPT3 = require("../models/Nursery/NurseryPT3.js");
const NurseryPT4 = require("../models/Nursery/NurseryPT4.js");
const NurseryAnnual = require("../models/Nursery/NurseryAnnual.js");
// LKG 
const LKGPT1 = require("../models/LKG/LKGPT1.js");
const LKGPT2 = require("../models/LKG/LKGPT2.js");
const LKGHalfyearly = require("../models/LKG/LKGHalfyearly.js");
const LKGPT3 = require("../models/LKG/LKGPT3.js");
const LKGPT4 = require("../models/LKG/LKGPT4.js");
const LKGAnnual = require("../models/LKG/LKGAnnual.js");
// UKG
const UKGPT1 = require("../models/UKG/UKGPT1.js");
const UKGPT2 = require("../models/UKG/UKGPT2.js");
const UKGHalfyearly = require("../models/UKG/UKGHalfyearly.js");
const UKGPT3 = require("../models/UKG/UKGPT3.js");
const UKGPT4 = require("../models/UKG/UKGPT4.js");
const UKGAnnual = require("../models/UKG/UKGAnnual.js");
// class 1
const Class1PT1 = require("../models/Class1/Class1PT1.js");
const Class1PT2 = require("../models/Class1/Class1PT2.js");
const Class1Halfyearly = require("../models/Class1/Class1Halfyearly.js");
const Class1PT3 = require("../models/Class1/Class1PT3.js");
const Class1PT4 = require("../models/Class1/Class1PT4.js");
const Class1Annual = require("../models/Class1/Class1Annual.js");
// class 2
const Class2PT1 = require("../models/Class2/Class2PT1.js");
const Class2PT2 = require("../models/Class2/Class2PT2.js");
const Class2Halfyearly = require("../models/Class2/Class2Halfyearly.js");
const Class2PT3 = require("../models/Class2/Class2PT3.js");
const Class2PT4 = require("../models/Class2/Class2PT4.js");
const Class2Annual = require("../models/Class2/Class2Annual.js");
// class 3
const Class3PT1 = require("../models/Class3/Class3PT1.js");
const Class3PT2 = require("../models/Class3/Class3PT2.js");
const Class3Halfyearly = require("../models/Class3/Class3Halfyearly.js");
const Class3PT3 = require("../models/Class3/Class3PT3.js");
const Class3PT4 = require("../models/Class3/Class3PT4.js");
const Class3Annual = require("../models/Class3/Class3Annual.js");
// class 4
const Class4PT1 = require("../models/Class4/Class4PT1.js");
const Class4PT2 = require("../models/Class4/Class4PT2.js");
const Class4Halfyearly = require("../models/Class4/Class4Halfyearly.js");
const Class4PT3 = require("../models/Class4/Class4PT3.js");
const Class4PT4 = require("../models/Class4/Class4PT4.js");
const Class4Annual = require("../models/Class4/Class4Annual.js");
// class 5
const Class5PT1 = require("../models/Class5/Class5PT1.js");
const Class5PT2 = require("../models/Class5/Class5PT2.js");
const Class5Halfyearly = require("../models/Class5/Class5Halfyearly.js");
const Class5PT3 = require("../models/Class5/Class5PT3.js");
const Class5PT4 = require("../models/Class5/Class5PT4.js");
const Class5Annual = require("../models/Class5/Class5Annual.js");
// class 6
const Class6PT1 = require("../models/Class6/Class6PT1.js");
const Class6PT2 = require("../models/Class6/Class6PT2.js");
const Class6Halfyearly = require("../models/Class6/Class6Halfyearly.js");
const Class6PT3 = require("../models/Class6/Class6PT3.js");
const Class6PT4 = require("../models/Class6/Class6PT4.js");
const Class6Annual = require("../models/Class6/Class6Annual.js");
// class 7
const Class7PT1 = require("../models/Class7/Class7PT1.js");
const Class7PT2 = require("../models/Class7/Class7PT2.js");
const Class7Halfyearly = require("../models/Class7/Class7Halfyearly.js");
const Class7PT3 = require("../models/Class7/Class7PT3.js");
const Class7PT4 = require("../models/Class7/Class7PT4.js");
const Class7Annual = require("../models/Class7/Class7Annual.js");
// class 8
const Class8PT1 = require("../models/Class8/Class8PT1.js");
const Class8PT2 = require("../models/Class8/Class8PT2.js");
const Class8Halfyearly = require("../models/Class8/Class8Halfyearly.js");
const Class8PT3 = require("../models/Class8/Class8PT3.js");
const Class8PT4 = require("../models/Class8/Class8PT4.js");
const Class8Annual = require("../models/Class8/Class8Annual.js");
const studentlist = require('../models/studentlist.js');
const SchoolistAssessment = require("../models/schoolist");
const Attendance = require("../models/attendance");



// class Models 

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

const marksModels = {

    Nursery: {
        PT1: NurseryPT1,
        PT2: NurseryPT2,
        PT3: NurseryPT3,
        PT4: NurseryPT4,
        HalfYearly: NurseryHalfyearly,
        Annual: NurseryAnnual
    },

    LKG: {
        PT1: LKGPT1,
        PT2: LKGPT2,
        PT3: LKGPT3,
        PT4: LKGPT4,
        HalfYearly: LKGHalfyearly,
        Annual: LKGAnnual
    },

    UKG: {
        PT1: UKGPT1,
        PT2: UKGPT2,
        PT3: UKGPT3,
        PT4: UKGPT4,
        HalfYearly: UKGHalfyearly,
        Annual: UKGAnnual
    },

    1: {
        PT1: Class1PT1,
        PT2: Class1PT2,
        PT3: Class1PT3,
        PT4: Class1PT4,
        HalfYearly: Class1Halfyearly,
        Annual: Class1Annual
    },

    2: {
        PT1: Class2PT1,
        PT2: Class2PT2,
        PT3: Class2PT3,
        PT4: Class2PT4,
        HalfYearly: Class2Halfyearly,
        Annual: Class2Annual
    },

    3: {
        PT1: Class3PT1,
        PT2: Class3PT2,
        PT3: Class3PT3,
        PT4: Class3PT4,
        HalfYearly: Class3Halfyearly,
        Annual: Class3Annual
    },

    4: {
        PT1: Class4PT1,
        PT2: Class4PT2,
        PT3: Class4PT3,
        PT4: Class4PT4,
        HalfYearly: Class4Halfyearly,
        Annual: Class4Annual
    },

    5: {
        PT1: Class5PT1,
        PT2: Class5PT2,
        PT3: Class5PT3,
        PT4: Class5PT4,
        HalfYearly: Class5Halfyearly,
        Annual: Class5Annual
    },

    6: {
        PT1: Class6PT1,
        PT2: Class6PT2,
        PT3: Class6PT3,
        PT4: Class6PT4,
        HalfYearly: Class6Halfyearly,
        Annual: Class6Annual
    },

    7: {
        PT1: Class7PT1,
        PT2: Class7PT2,
        PT3: Class7PT3,
        PT4: Class7PT4,
        HalfYearly: Class7Halfyearly,
        Annual: Class7Annual
    },

    8: {
        PT1: Class8PT1,
        PT2: Class8PT2,
        PT3: Class8PT3,
        PT4: Class8PT4,
        HalfYearly: Class8Halfyearly,
        Annual: Class8Annual
    }

};


function getMarksModel(className, examType) {

    const classModels = marksModels[String(className)];

    if (!classModels) {
        return null;
    }

    return classModels[examType] || null;
}

// search result



marksheet.route('/').get(async(req,res)=>{
    const data=req.cookies.stadminis
    const decoded = JSON.parse(Buffer.from(data.split('.')[1], 'base64').toString());
    
    res.render('selectClassTEM.ejs',{data:decoded})
})


function protectMarksRoute(
    route,
    className,
    controller
) {
    marksheet
        .route(route)
        .post(
            verifyStudentForMarks(className),
            controller
        );
}


// ============================================================
// NURSERY
// ============================================================

protectMarksRoute(
    "/Nursery/Periodic-Test-1",
    "Nursery",
    nurseryController.nurseryPT1
);

protectMarksRoute(
    "/Nursery/Periodic-Test-2",
    "Nursery",
    nurseryController.nurseryPT2
);

protectMarksRoute(
    "/Nursery/Halfyearly",
    "Nursery",
    nurseryController.nurseryHalfyearly
);

protectMarksRoute(
    "/Nursery/Periodic-Test-3",
    "Nursery",
    nurseryController.nurseryPT3
);

protectMarksRoute(
    "/Nursery/Periodic-Test-4",
    "Nursery",
    nurseryController.nurseryPT4
);

protectMarksRoute(
    "/Nursery/Annual",
    "Nursery",
    nurseryController.nurseryAnnual
);


// ============================================================
// LKG
// ============================================================

protectMarksRoute(
    "/LKG/Periodic-Test-1",
    "LKG",
    lkgController.LKGPT1
);

protectMarksRoute(
    "/LKG/Periodic-Test-2",
    "LKG",
    lkgController.LKGPT2
);

protectMarksRoute(
    "/LKG/Halfyearly",
    "LKG",
    lkgController.LKGHalfyearly
);

protectMarksRoute(
    "/LKG/Periodic-Test-3",
    "LKG",
    lkgController.LKGPT3
);

protectMarksRoute(
    "/LKG/Periodic-Test-4",
    "LKG",
    lkgController.LKGPT4
);

protectMarksRoute(
    "/LKG/Annual",
    "LKG",
    lkgController.LKGAnnual
);


// ============================================================
// UKG
// ============================================================

protectMarksRoute(
    "/UKG/Periodic-Test-1",
    "UKG",
    ukgController.UKGPT1
);

protectMarksRoute(
    "/UKG/Periodic-Test-2",
    "UKG",
    ukgController.UKGPT2
);

protectMarksRoute(
    "/UKG/Halfyearly",
    "UKG",
    ukgController.UKGHalfyearly
);

protectMarksRoute(
    "/UKG/Periodic-Test-3",
    "UKG",
    ukgController.UKGPT3
);

protectMarksRoute(
    "/UKG/Periodic-Test-4",
    "UKG",
    ukgController.UKGPT4
);

protectMarksRoute(
    "/UKG/Annual",
    "UKG",
    ukgController.UKGAnnual
);


// ============================================================
// CLASS 1
// ============================================================

protectMarksRoute(
    "/1/Periodic-Test-1",
    "STD-1",
    class1Controller.Class1PT1
);

protectMarksRoute(
    "/1/Periodic-Test-2",
    "STD-1",
    class1Controller.Class1PT2
);

protectMarksRoute(
    "/1/Halfyearly",
    "STD-1",
    class1Controller.Class1Halfyearly
);

protectMarksRoute(
    "/1/Periodic-Test-3",
    "STD-1",
    class1Controller.Class1PT3
);

protectMarksRoute(
    "/1/Periodic-Test-4",
    "STD-1",
    class1Controller.Class1PT4
);

protectMarksRoute(
    "/1/Annual",
    "STD-1",
    class1Controller.Class1Annual
);


// ============================================================
// CLASS 2
// ============================================================

protectMarksRoute(
    "/2/Periodic-Test-1",
    "STD-2",
    class2Controller.Class2PT1
);

protectMarksRoute(
    "/2/Periodic-Test-2",
    "STD-2",
    class2Controller.Class2PT2
);

protectMarksRoute(
    "/2/Halfyearly",
    "STD-2",
    class2Controller.Class2Halfyearly
);

protectMarksRoute(
    "/2/Periodic-Test-3",
    "STD-2",
    class2Controller.Class2PT3
);

protectMarksRoute(
    "/2/Periodic-Test-4",
    "STD-2",
    class2Controller.Class2PT4
);

protectMarksRoute(
    "/2/Annual",
    "STD-2",
    class2Controller.Class2Annual
);


// ============================================================
// CLASS 3
// ============================================================

protectMarksRoute(
    "/3/Periodic-Test-1",
    "STD-3",
    class3Controller.Class3PT1
);

protectMarksRoute(
    "/3/Periodic-Test-2",
    "STD-3",
    class3Controller.Class3PT2
);

protectMarksRoute(
    "/3/Halfyearly",
    "STD-3",
    class3Controller.Class3Halfyearly
);

protectMarksRoute(
    "/3/Periodic-Test-3",
    "STD-3",
    class3Controller.Class3PT3
);

protectMarksRoute(
    "/3/Periodic-Test-4",
    "STD-3",
    class3Controller.Class3PT4
);

protectMarksRoute(
    "/3/Annual",
    "STD-3",
    class3Controller.Class3Annual
);


// ============================================================
// CLASS 4
// ============================================================

protectMarksRoute(
    "/4/Periodic-Test-1",
    "STD-4",
    class4Controller.Class4PT1
);

protectMarksRoute(
    "/4/Periodic-Test-2",
    "STD-4",
    class4Controller.Class4PT2
);

protectMarksRoute(
    "/4/Halfyearly",
    "STD-4",
    class4Controller.Class4Halfyearly
);

protectMarksRoute(
    "/4/Periodic-Test-3",
    "STD-4",
    class4Controller.Class4PT3
);

protectMarksRoute(
    "/4/Periodic-Test-4",
    "STD-4",
    class4Controller.Class4PT4
);

protectMarksRoute(
    "/4/Annual",
    "STD-4",
    class4Controller.Class4Annual
);


// ============================================================
// CLASS 5
// ============================================================

protectMarksRoute(
    "/5/Periodic-Test-1",
    "STD-5",
    class5Controller.Class5PT1
);

protectMarksRoute(
    "/5/Periodic-Test-2",
    "STD-5",
    class5Controller.Class5PT2
);

protectMarksRoute(
    "/5/Halfyearly",
    "STD-5",
    class5Controller.Class5Halfyearly
);

protectMarksRoute(
    "/5/Periodic-Test-3",
    "STD-5",
    class5Controller.Class5PT3
);

protectMarksRoute(
    "/5/Periodic-Test-4",
    "STD-5",
    class5Controller.Class5PT4
);

protectMarksRoute(
    "/5/Annual",
    "STD-5",
    class5Controller.Class5Annual
);


// ============================================================
// CLASS 6
// ============================================================

protectMarksRoute(
    "/6/Periodic-Test-1",
    "STD-6",
    class6Controller.Class6PT1
);

protectMarksRoute(
    "/6/Periodic-Test-2",
    "STD-6",
    class6Controller.Class6PT2
);

protectMarksRoute(
    "/6/Halfyearly",
    "STD-6",
    class6Controller.Class6Halfyearly
);

protectMarksRoute(
    "/6/Periodic-Test-3",
    "STD-6",
    class6Controller.Class6PT3
);

protectMarksRoute(
    "/6/Periodic-Test-4",
    "STD-6",
    class6Controller.Class6PT4
);

protectMarksRoute(
    "/6/Annual",
    "STD-6",
    class6Controller.Class6Annual
);


// ============================================================
// CLASS 7
// ============================================================

protectMarksRoute(
    "/7/Periodic-Test-1",
    "STD-7",
    class7Controller.Class7PT1
);

protectMarksRoute(
    "/7/Periodic-Test-2",
    "STD-7",
    class7Controller.Class7PT2
);

protectMarksRoute(
    "/7/Halfyearly",
    "STD-7",
    class7Controller.Class7Halfyearly
);

protectMarksRoute(
    "/7/Periodic-Test-3",
    "STD-7",
    class7Controller.Class7PT3
);

protectMarksRoute(
    "/7/Periodic-Test-4",
    "STD-7",
    class7Controller.Class7PT4
);

protectMarksRoute(
    "/7/Annual",
    "STD-7",
    class7Controller.Class7Annual
);


// ============================================================
// CLASS 8
// ============================================================

protectMarksRoute(
    "/8/Periodic-Test-1",
    "STD-8",
    class8Controller.Class8PT1
);

protectMarksRoute(
    "/8/Periodic-Test-2",
    "STD-8",
    class8Controller.Class8PT2
);

protectMarksRoute(
    "/8/Halfyearly",
    "STD-8",
    class8Controller.Class8Halfyearly
);

protectMarksRoute(
    "/8/Periodic-Test-3",
    "STD-8",
    class8Controller.Class8PT3
);

protectMarksRoute(
    "/8/Periodic-Test-4",
    "STD-8",
    class8Controller.Class8PT4
);

protectMarksRoute(
    "/8/Annual",
    "STD-8",
    class8Controller.Class8Annual
);


marksheet.route("/see/classwise/marks").get(async (req, res) => {
  res.render("selectClassForMarks.ejs")
})

/* ============================================================
   CLASS-WISE MARKSHEET — SECTION SAFE ROUTE

   URL:
       /marksheet/view-section/:class/marks

   EJS:
       viewmarks-section.ejs

   IMPORTANT:
   - Existing classModels is reused.
   - Existing mergeExamCollections() is reused.
   - Student identity is keyed by admission number.
   - studentlist.section has priority.
   - Section A/B/C are normalized consistently.
   - No-section students always come last.
   - Roll number is sorted inside each section.
   - EJS does not sort the students again.
   ============================================================ */

function marksheetSectionClassKey(value) {
    let v = String(value ?? "").trim().toUpperCase();

    if (!v) return "";

    v = v.replace(/^STD[-\s]*/, "");
    v = v.replace(/^CLASS[-\s]*/, "");

    return v.trim();
}

function marksheetSectionNormalize(value) {
    if (value === null || value === undefined) return "";

    return String(value)
        .trim()
        .toUpperCase()
        .replace(/^SECTION\s*/i, "")
        .trim();
}

function marksheetSectionRoll(value) {
    if (value === null || value === undefined) {
        return Number.MAX_SAFE_INTEGER;
    }

    const n = Number(String(value).trim());

    return Number.isFinite(n)
        ? n
        : Number.MAX_SAFE_INTEGER;
}

function marksheetSectionName(value) {
    return String(value ?? "")
        .trim()
        .toUpperCase();
}

function marksheetSectionCompare(a, b) {
    const sectionA = marksheetSectionNormalize(a.section);
    const sectionB = marksheetSectionNormalize(b.section);

    const hasA = sectionA !== "";
    const hasB = sectionB !== "";

    // No section ALWAYS last.
    if (hasA && !hasB) return -1;
    if (!hasA && hasB) return 1;

    // Section A, B, C...
    if (hasA && hasB) {
        const sectionCompare = sectionA.localeCompare(
            sectionB,
            undefined,
            { numeric: true, sensitivity: "base" }
        );

        if (sectionCompare !== 0) {
            return sectionCompare;
        }
    }

    // Roll number inside same section.
    const rollCompare =
        marksheetSectionRoll(a.rollNumber) -
        marksheetSectionRoll(b.rollNumber);

    if (rollCompare !== 0) return rollCompare;

    // Stable fallback.
    const nameCompare = marksheetSectionName(a.name).localeCompare(
        marksheetSectionName(b.name),
        undefined,
        { sensitivity: "base" }
    );

    if (nameCompare !== 0) return nameCompare;

    return String(a.admissionNumber ?? "").localeCompare(
        String(b.admissionNumber ?? ""),
        undefined,
        { numeric: true, sensitivity: "base" }
    );
}

marksheet
    .route("/view/:class/marks")
    .get(async (req, res) => {

        try {
            const className = String(req.params.class || "").trim();
            const models = classModels[className];

            if (!models) {
                return res.status(404).send("Invalid class");
            }

            // ----------------------------------------------------
            // 1. Get all marks exactly as the existing marksheet
            //    system already does.
            // ----------------------------------------------------
            const data = await mergeExamCollections(models);

            // ----------------------------------------------------
            // 2. Read master student data.
            //    Section from studentlist is authoritative.
            // ----------------------------------------------------
            const masterRows = await studentlist.find({}).lean();
            const targetClass = marksheetSectionClassKey(className);
            const masterMap = new Map();

            for (const row of masterRows) {

                const admissionNumber = String(
                    row.admissionNo ?? row.admissionNumber ?? ""
                ).trim();

                if (!admissionNumber) continue;

                // Prefer className/class. House is only a fallback
                // for older studentlist records.
                const rawClass =
                    row.className ??
                    row.class ??
                    row.house ??
                    "";

                const rowClass = marksheetSectionClassKey(rawClass);

                if (rowClass && rowClass !== targetClass) {
                    continue;
                }

                if (!masterMap.has(admissionNumber)) {
                    masterMap.set(admissionNumber, {
                        name: String(row.studentName ?? row.name ?? "").trim(),
                        rollNumber: row.rollNo ?? row.rollNumber ?? "",
                        section: marksheetSectionNormalize(row.section)
                    });
                }
            }

            // ----------------------------------------------------
            // 3. Merge master identity into merged exam students.
            //    Do NOT let an exam document overwrite the master
            //    section/roll/name.
            // ----------------------------------------------------
            const unique = new Map();

            for (const raw of data.students || []) {

                const admissionNumber = String(
                    raw.admissionNumber ?? raw.admissionNo ?? ""
                ).trim();

                if (!admissionNumber) continue;

                const master = masterMap.get(admissionNumber);

                const student = {
                    ...raw,
                    admissionNumber,
                    name: master?.name || raw.name || raw.studentName || "Unknown",
                    rollNumber: master?.rollNumber ?? raw.rollNumber ?? raw.rollNo ?? "",
                    section: master?.section || marksheetSectionNormalize(raw.section)
                };

                // One student = one admission number.
                if (!unique.has(admissionNumber)) {
                    unique.set(admissionNumber, student);
                }
            }

            // ----------------------------------------------------
            // 4. Sort ONCE.
            // ----------------------------------------------------
            const students = [...unique.values()].sort(
                marksheetSectionCompare
            );

            // ----------------------------------------------------
            // 5. Calculate totals.
            // ----------------------------------------------------
            const getNumericMark = (student, exam, subject) => {

                const value =
                    student.exams?.[exam]?.[subject];

                if (
                    value === undefined ||
                    value === null ||
                    value === "" ||
                    String(value).trim().toUpperCase() === "AB"
                ) {
                    return 0;
                }

                const number = Number(value);

                return Number.isFinite(number) ? number : 0;
            };

            const processedStudents = students.map(student => {

                let term1Total = 0;
                let term2Total = 0;

                for (const subject of data.subjects || []) {
                    term1Total +=
                        getNumericMark(student, "PT1", subject) +
                        getNumericMark(student, "PT2", subject) +
                        getNumericMark(student, "Halfyearly", subject);

                    term2Total +=
                        getNumericMark(student, "PT3", subject) +
                        getNumericMark(student, "PT4", subject) +
                        getNumericMark(student, "Annual", subject);
                }

                return {
                    ...student,
                    term1Total,
                    term2Total
                };
            });

            // ----------------------------------------------------
            // 6. Build section groups from the SAME normalized
            //    section value used by the sorter.
            // ----------------------------------------------------
            const sectionGroups = {};

            for (const student of processedStudents) {

                const section = marksheetSectionNormalize(
                    student.section
                );

                student.section = section;

                const key = section || "__NO_SECTION__";

                if (!sectionGroups[key]) {
                    sectionGroups[key] = [];
                }

                sectionGroups[key].push(student);
            }

            // ----------------------------------------------------
            // 7. Section order. No section last.
            // ----------------------------------------------------
            const sections = Object.keys(sectionGroups).sort((a, b) => {

                if (a === "__NO_SECTION__") return 1;
                if (b === "__NO_SECTION__") return -1;

                return a.localeCompare(
                    b,
                    undefined,
                    { numeric: true, sensitivity: "base" }
                );
            });

            // ----------------------------------------------------
            // 8. Ranking is SECTION-WISE.
            // ----------------------------------------------------
            for (const section of sections) {

                const group = sectionGroups[section];

                [...group]
                    .sort((a, b) => b.term1Total - a.term1Total)
                    .forEach((student, index) => {
                        student.term1Position = index + 1;
                    });

                [...group]
                    .sort((a, b) => b.term2Total - a.term2Total)
                    .forEach((student, index) => {
                        student.term2Position = index + 1;
                    });
            }

            const maximumTotal = (data.subjects || []).length * 100;

            console.log("============================================");
            console.log("MARKSHEET SECTION VIEW");
            console.log("CLASS:", className);
            console.log("TOTAL:", processedStudents.length);
            console.log("SECTIONS:", sections);
            console.log("============================================");

            return res.render("viewmarks.ejs", {
                className,
                students: processedStudents,
                processedStudents,
                sectionGroups,
                sections,
                subjects: data.subjects || [],
                maximumTotal,
                user: req.user
            });

        } catch (error) {

            console.error(
                "Section marksheet error:",
                error
            );

            return res
                .status(500)
                .send("Unable to load marksheet data");
        }
    });



marksheet.route("/print/result").get((req,res)=>{
    res.render("searchResult.ejs")
})
marksheet.route("/print/result/search").get(
    async (req, res) => {

        try {
          // ==============================================
          // 1. GET SEARCH DATA
          // ==============================================

          const {
            class: studentClassInput = "",
            roll = "",
            admissionNumber = "",
          } = req.query;

          const studentClass = String(studentClassInput).trim();

          const cleanRoll = String(roll).trim();

          const cleanAdmissionNumber = String(admissionNumber).trim();

          console.log("\n=================================");

          console.log("RESULT SEARCH");

          console.log("Class:", studentClass);

          console.log("Roll:", cleanRoll);

          console.log("Admission Number:", cleanAdmissionNumber);

          console.log("=================================");

          let examModels;

          let searchQuery;

          let searchType;

          let finalClass;

          // ==============================================
          // 2. CLASS + ROLL SEARCH
          // ==============================================

          if (studentClass !== "" && cleanRoll !== "") {
            const rollNumber = Number(cleanRoll);

            // Validate class

            if (!classModels[studentClass]) {
              return res.status(400).send("Invalid class.");
            }

            // Validate roll number

            if (!Number.isInteger(rollNumber) || rollNumber < 1) {
              return res.status(400).send("Invalid roll number.");
            }

            // Get models only for selected class

            examModels = classModels[studentClass];

            // Search by roll number

            searchQuery = {
              rollNumber: rollNumber,
            };

            searchType = "classRoll";

            finalClass = studentClass;

            console.log("SEARCH TYPE: CLASS + ROLL");

            console.log("FINAL CLASS:", finalClass);

            console.log("SEARCH QUERY:", searchQuery);
          }

          // ==============================================
          // 3. ADMISSION NUMBER SEARCH
          // ==============================================

          // ==============================================
          // 3. ADMISSION NUMBER SEARCH
          // ==============================================
          else if (cleanAdmissionNumber !== "") {
            // ------------------------------------------
            // VALIDATE ADMISSION NUMBER
            // ------------------------------------------

            if (!/^\d{5}$/.test(cleanAdmissionNumber)) {
              return res.status(400).send("Invalid admission number.");
            }

            searchType = "admission";

            console.log("SEARCH TYPE: ADMISSION NUMBER");

            // ------------------------------------------
            // STEP 1:
            // SEARCH STUDENT COLLECTION
            // ------------------------------------------

            console.log(
              "SEARCHING STUDENT COLLECTION FOR:",
              cleanAdmissionNumber,
            );

            const student = await studentlist
              .findOne({
                admissionNo: cleanAdmissionNumber,
              })
              .lean();

            console.log("STUDENT FOUND:", student);

            // ------------------------------------------
            // STUDENT NOT FOUND
            // ------------------------------------------

            if (!student) {
              return res.status(404).send("Student not found.");
            }

            // ------------------------------------------
            // STEP 2:
            // EXTRACT CLASS FROM HOUSE
            //
            // Examples:
            //
            // STD-7   → 7
            // STD-1   → 1
            // STD-8   → 8
            //
            // Nursery, LKG, UKG can also
            // be handled if stored directly.
            // ------------------------------------------

            const studentHouse = String(student.house || "")
              .trim()
              .toUpperCase();

            console.log("STUDENT HOUSE:", studentHouse);

            // Remove STD-
            //
            // STD-7 → 7

            const extractedClass = studentHouse.replace(/^STD-/, "");

            finalClass = extractedClass;

            console.log("EXTRACTED CLASS:", finalClass);

            // ------------------------------------------
            // STEP 3:
            // VALIDATE CLASS
            // ------------------------------------------

            if (!classModels[finalClass]) {
              console.error("No exam models found for class:", finalClass);

              return res
                .status(404)
                .send(`No exam configuration found for Class ${finalClass}.`);
            }

            // ------------------------------------------
            // STEP 4:
            // GET EXAM MODELS FOR CLASS
            // ------------------------------------------

            examModels = classModels[finalClass];

            // ------------------------------------------
            // STEP 5:
            // SEARCH EXAMS
            //
            // First use admission number.
            // ------------------------------------------

            searchQuery = {
              admissionNumber: cleanAdmissionNumber,
            };

            console.log("\nSTUDENT DETAILS");

            console.log("Name:", student.studentName);

            console.log("Admission Number:", student.admissionNo);

            console.log("House:", student.house);

            console.log("Extracted Class:", finalClass);

            console.log("Student Roll:", student.rollNo);

            console.log("EXAM SEARCH QUERY:", searchQuery);
          }

          // ==============================================
          // 4. NO SEARCH DATA
          // ==============================================
          else {
            return res
              .status(400)
              .send("Please enter Class + Roll Number or Admission Number.");
          }

          // ==============================================
          // 5. SEARCH EXAM COLLECTIONS
          // ==============================================

          const searchResults = await Promise.all(
            Object.entries(examModels).map(async ([examName, Model]) => {
              const data = await Model.findOne(searchQuery).lean();

              console.log(
                examName,

                "=>",

                data
                  ? `FOUND | Roll: ${data.rollNumber} | Admission: ${data.admissionNumber}`
                  : "NOT FOUND",
              );

              return {
                examName,

                data,
              };
            }),
          );

          // ==============================================
          // 6. KEEP ONLY FOUND RESULTS
          // ==============================================

          const foundResults = searchResults.filter((result) => result.data);

          console.log("FOUND EXAM RECORDS:", foundResults.length);

          // ==============================================
          // 7. NO EXAM RESULT FOUND
          // ==============================================

          if (foundResults.length === 0) {
            return res.status(404).send("No examination result found.");
          }

          // ==============================================
          // 8. VALIDATE ALL FOUND RESULTS
          // ==============================================

          for (const result of foundResults) {
            // ------------------------------------------
            // CLASS + ROLL VALIDATION
            // ------------------------------------------

            if (searchType === "classRoll") {
              if (Number(result.data.rollNumber) !== Number(cleanRoll)) {
                console.error("ROLL NUMBER MISMATCH:", result.data);

                return res.status(500).send("Incorrect student record found.");
              }
            }

            // ------------------------------------------
            // ADMISSION NUMBER VALIDATION
            // ------------------------------------------

            if (searchType === "admission") {
              if (
                String(result.data.admissionNumber) !== cleanAdmissionNumber
              ) {
                console.error("ADMISSION NUMBER MISMATCH:", result.data);

                return res.status(500).send("Incorrect student record found.");
              }
            }
          }

          // ==============================================
          // 9. GET FIRST RESULT
          // ==============================================

          // ==============================================
          // 9. GET FIRST RESULT
          // ==============================================

          const firstResult = foundResults[0].data;

          // ==============================================
          // GET SCHOOLIST + ATTENDANCE
          // ==============================================

          const resultAdmissionNumber = String(
            firstResult.admissionNumber || cleanAdmissionNumber || "",
          ).trim();

          const schoolistData = await SchoolistAssessment.findOne({
            admissionNumber: resultAdmissionNumber,
            academicYear: "2026-27",
          }).lean();

          const attendanceData = await Attendance.findOne({
            admissionNumber: resultAdmissionNumber,
            academicYear: "2026-27",
          }).lean();

          const isUKG = String(finalClass).trim().toUpperCase() === "UKG";

          // ==============================================
          // 10. CREATE FINAL DATA
          // ==============================================

          const mergedData = {
            student: {
              name: firstResult.name,

              admissionNumber: firstResult.admissionNumber,

              class: finalClass,

              roll: firstResult.rollNumber,
            },

            exams: {},

            // NEW
            schoolist: schoolistData || null,

            // NEW
            attendance: attendanceData || null,

            // UKG = 600
            // Other classes = 800
            totalMarks: isUKG ? 600 : 800,

            isUKG,
          };

          // ==============================================
          // 11. MERGE ALL EXAMS
          // ==============================================

          for (const result of foundResults) {
            mergedData.exams[result.examName] = result.data;
          }

          // ==============================================
          // 12. FINAL DEBUG
          // ==============================================

          console.log("\n=================================");

          console.log("FINAL STUDENT DATA");

          console.log("Name:", mergedData.student.name);

          console.log("Class:", mergedData.student.class);

          console.log("Roll:", mergedData.student.roll);

          console.log("Admission:", mergedData.student.admissionNumber);

          console.log("Exams:", Object.keys(mergedData.exams));

          console.log("=================================\n");

          // ==============================================
          // 13. RENDER RESULT
          // ==============================================

          return res.render(
            "result.ejs",

            {
              data: mergedData,

              print: true,

              showNavigation: true,
            },
          );
        } catch (error) {

            console.error(
                "RESULT SEARCH ERROR:",
                error
            );


            return res
                .status(500)
                .send(
                    "Internal Server Error"
                );

        }

    }
);
marksheet.route("/edit/:id").get(
    verifyEdit,
    async (req, res) => {

        try {

            // Logged-in admin data
            const admin = req.user;

            // Example:
            // admin.id
            // admin.email
            // admin.name

            res.render("editMarksheet.ejs", {
                admin: admin,
                editVerified: req.editVerified,
                studentId: req.params.id
            });

        } catch (error) {

            console.error("Edit marks page error:", error);

            return res.status(500).send(
                "Unable to open edit marks page"
            );
        }
    }
);


// ==========================================================
// SEARCH STUDENT
// BY ADMISSION NUMBER + EXAM TYPE
// ==========================================================

marksheet.route("/edit/search/for").get(
    verifyEdit,
    async (req, res) => {

        try {

            const {
                class: className,
                admissionNumber,
                examType
            } = req.query;

            console.log("SEARCHING STUDENT");
            console.log("CLASS:", className);
            console.log("ADMISSION NUMBER:", admissionNumber);
            console.log("EXAM:", examType);

            if (
                !className ||
                !admissionNumber ||
                !examType
            ) {
                return res.status(400).send(
                    "Class, admission number and exam type are required."
                );
            }

            const Model = getMarksModel(
                className,
                examType
            );

            if (!Model) {
                return res.status(404).send(
                    "Invalid class or examination type."
                );
            }

            const student =
                await Model.findOne({
                    admissionNumber:
                        String(admissionNumber).trim()
                }).lean();

            if (!student) {
                return res.status(404).send(
                    `No student found with admission number ${admissionNumber}.`
                );
            }

            console.log(
                "STUDENT FOUND:",
                student.name,
                student.admissionNumber
            );

            return res.render(
                "editStudentMarks.ejs",
                {
                    admin: req.user,
                    student,
                    className,
                    examType,
                    admissionNumber:
                        String(admissionNumber).trim()
                }
            );

        } catch (error) {

            console.error(
                "❌ Find student marks error:",
                error
            );

            return res.status(500).send(
                "Unable to find student marks."
            );
        }
    }
);



// ==========================================================
// UPDATE STUDENT MARKS
// BY ADMISSION NUMBER + EXAM TYPE
//
// IMPORTANT:
// If a subject does NOT already exist in MongoDB,
// it will be created and saved.
// ==========================================================

marksheet.route("/edit/:admissionNumber").post(
    verifyEdit,requireMarksEditOTP,
    async (req, res) => {
        console.log(req.body)

        try {

            const admissionNumber =
                String(
                    req.params.admissionNumber
                ).trim();


            const {
                class: className,
                examType
            } = req.body;


            // ==============================================
            // VALIDATE
            // ==============================================

            if (
                !className ||
                !examType ||
                !admissionNumber
            ) {

                return res.status(400).send(
                    "Invalid student information."
                );

            }


            // ==============================================
            // GET CORRECT EXAM MODEL
            // ==============================================

            const Model =
                getMarksModel(
                    className,
                    examType
                );


            if (!Model) {

                return res.status(404).send(
                    "Invalid class or examination type."
                );

            }


            // ==============================================
            // FIND STUDENT
            // ONLY BY ADMISSION NUMBER
            // ==============================================

            const existingStudent =
                await Model.findOne({
                    admissionNumber
                });


            if (!existingStudent) {

                return res.status(404).send(
                    "Student not found."
                );

            }


            // ==============================================
            // PROTECTED FIELDS
            //
            // These cannot be changed from marks form.
            // ==============================================

            const protectedFields = [

                "_id",
                "__v",

                "rollNumber",

                "admissionNumber",

                "name",

                "class",

                "createdAt",

                "updatedAt",

                "examType"

            ];


            // ==============================================
            // GET ALL SUBJECTS FROM SCHEMA
            //
            // This is the important part.
            //
            // Even if:
            //
            // english exists
            // hindi exists
            // math does NOT exist in document
            //
            // math can still be created and saved.
            // ==============================================

            const schemaPaths =
                Object.keys(
                    Model.schema.paths
                );


            const updates = {};


            // ==============================================
            // LOOP THROUGH FORM DATA
            // ==============================================

            for (
                const field
                of Object.keys(req.body)
            ) {


                // Ignore non-mark fields

                if (
                    field === "class" ||
                    field === "examType"
                ) {

                    continue;

                }


                // Ignore protected fields

                if (
                    protectedFields.includes(
                        field
                    )
                ) {

                    continue;

                }


                // ==========================================
                // ONLY ALLOW FIELDS THAT EXIST
                // IN THE MONGOOSE SCHEMA
                //
                // This allows creating missing subject
                // fields because schema knows them.
                // ==========================================

                if (
                    !schemaPaths.includes(
                        field
                    )
                ) {

                    continue;

                }


                const value =
                    req.body[field];


                // ==========================================
                // EMPTY FIELD
                //
                // Remove the subject value.
                // ==========================================

                if (
                    value === undefined ||
                    value === null ||
                    String(value).trim() === ""
                ) {

                    updates[field] =
                        undefined;

                    continue;

                }


                // ==========================================
                // NUMERIC MARK
                //
                // 0 is valid.
                // ==========================================

                const numericValue =
                    Number(value);


                if (
                    !Number.isFinite(
                        numericValue
                    )
                ) {

                    return res.status(400).send(
                        `Invalid marks for ${field}.`
                    );

                }


                updates[field] =
                    numericValue;

            }


            // ==============================================
            // UPDATE STUDENT
            //
            // $set will automatically CREATE a field
            // if that field is missing in MongoDB.
            // ==============================================

            const updatedStudent =
                await Model.findOneAndUpdate(

                    {

                        admissionNumber

                    },

                    {

                        $set:
                            updates

                    },

                    {

                        new: true,

                        runValidators: true

                    }

                );


            if (!updatedStudent) {

                return res.status(404).send(
                    "Unable to update student."
                );

            }


            console.log(

                "======================================"

            );

            console.log(
                "✅ MARKS UPDATED"
            );

            console.log(
                "ADMIN:",
                req.user.email
            );

            console.log(
                "CLASS:",
                className
            );

            console.log(
                "EXAM:",
                examType
            );

            console.log(
                "ADMISSION:",
                admissionNumber
            );

            console.log(
                "STUDENT:",
                updatedStudent.name
            );

            console.log(

                "======================================"

            );


            // ==============================================
            // SUCCESS
            // ==============================================

            return res.redirect(
                `/marksheet/edit/search/for?class=${encodeURIComponent(className)}&admissionNumber=${encodeURIComponent(admissionNumber)}&examType=${encodeURIComponent(examType)}`
            );


        } catch (error) {

            console.error(
                "❌ Save marks error:",
                error
            );

            return res.status(500).send(
                "Unable to save marks."
            );

        }

    }
);
/*
============================================================
NEW BULK MARK ENTRY ROUTES
============================================================

IMPORTANT:
This code is designed to be added to your EXISTING
marksheet router file.

Your existing file already contains:
    const marksheet = express.Router()
    const studentlist = require('../models/studentlist.js')
    const classModels = {...}
    const marksModels = {...}
    function getMarksModel(className, examType) {...}

Do NOT redeclare those variables.

Add the code below BEFORE:
    module.exports = marksheet;

URL:
    If your marksheet router is mounted at "/marksheet":
        /marksheet/new/mark-fill

    If it is mounted at "/":
        /new/mark-fill
============================================================
*/

const NEW_MARK_EXAMS = {
    I: [
        { key: "PT1", label: "PT-1", max: 10 },
        { key: "PT2", label: "PT-2", max: 10 },
        { key: "Halfyearly", label: "Halfyearly", max: 80 }
    ],
    II: [
        { key: "PT3", label: "PT-3", max: 10 },
        { key: "PT4", label: "PT-4", max: 10 },
        { key: "Annual", label: "Annual", max: 80 }
    ]
};

const NEW_MARK_CLASSES = [
    "Nursery", "LKG", "UKG",
    "1", "2", "3", "4", "5", "6", "7", "8"
];

function newMarkClassLabel(className) {
    if (["Nursery", "LKG", "UKG"].includes(String(className))) {
        return String(className);
    }

    return `Class ${className}`;
}

function newMarkExamModels(className, term) {
    const models = classModels[String(className)];

    if (!models) return null;

    if (term === "I") {
        return [
            { key: "PT1", label: "PT-1", max: 10, Model: models.PT1 },
            { key: "PT2", label: "PT-2", max: 10, Model: models.PT2 },
            { key: "Halfyearly", label: "Halfyearly", max: 80, Model: models.Halfyearly }
        ];
    }

    if (term === "II") {
        return [
            { key: "PT3", label: "PT-3", max: 10, Model: models.PT3 },
            { key: "PT4", label: "PT-4", max: 10, Model: models.PT4 },
            { key: "Annual", label: "Annual", max: 80, Model: models.Annual }
        ];
    }

    return null;
}

function newMarkHumanize(value) {
    return String(value)
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/[_-]+/g, " ")
        .replace(/\b\w/g, char => char.toUpperCase());
}

function newMarkGetSubjectOptions(className) {
    const models = classModels[String(className)];

    if (!models) return [];

    const fields = new Set();

    Object.values(models).forEach(Model => {
        if (!Model || !Model.schema || !Model.schema.paths) return;

        Object.keys(Model.schema.paths).forEach(path => {
            if (
                ![
                    "_id",
                    "__v",
                    "name",
                    "rollNumber",
                    "admissionNumber",
                    "class",
                    "examType",
                    "createdAt",
                    "updatedAt"
                ].includes(path)
            ) {
                fields.add(path);
            }
        });
    });

    return [...fields]
        .sort()
        .map(value => ({
            value,
            label: newMarkHumanize(value)
        }));
}

/*
============================================================
NEW BULK MARK ENTRY — V3
============================================================

ADD THIS BLOCK TO YOUR EXISTING marksheet ROUTER FILE.

It expects these existing variables to already exist:
    marksheet
    classModels
    studentlist

Routes:
    GET  /new/mark-fill
    POST /new/mark-fill/load
    POST /new/mark-fill/save

If your router is mounted with:
    app.use("/marksheet", marksheet)

the URLs are:
    /marksheet/new/mark-fill
    /marksheet/new/mark-fill/load
    /marksheet/new/mark-fill/save

IMPORTANT:
- Term I  = PT-1 + PT-2 + Halfyearly
- Term II = PT-3 + PT-4 + Annual
- Blank = leave existing database value unchanged
- 0 = valid mark
- Student identity is read-only in the UI
- Students are merged from studentlist + selected term exam
  collections, uniquely by admission number
- Section is taken from studentlist when available, otherwise
  from exam records
============================================================
*/

const NEW_MARK_V3_CLASSES = [
    "Nursery",
    "LKG",
    "UKG",
    "1", "2", "3", "4", "5", "6", "7", "8"
];

const NEW_MARK_V3_TERMS = {
    I: [
        { key: "PT1", label: "PT-1", max: 10 },
        { key: "PT2", label: "PT-2", max: 10 },
        { key: "Halfyearly", label: "Halfyearly", max: 80 }
    ],
    II: [
        { key: "PT3", label: "PT-3", max: 10 },
        { key: "PT4", label: "PT-4", max: 10 },
        { key: "Annual", label: "Annual", max: 80 }
    ]
};

function newMarkV3ClassLabel(className) {
    const value = String(className);

    if (
        value === "Nursery" ||
        value === "LKG" ||
        value === "UKG"
    ) {
        return value;
    }

    return `Class ${value}`;
}

function newMarkV3NormalizeClass(value) {
    let valueText =
        String(value ?? "")
            .trim()
            .toUpperCase();

    if (!valueText) return "";

    valueText =
        valueText.replace(/^STD[-\s]*/, "");

    valueText =
        valueText.replace(/^CLASS[-\s]*/, "");

    return valueText;
}

function newMarkV3ExamConfig(className, term) {
    const models =
        classModels[String(className)];

    if (!models) return null;

    if (term === "I") {
        return [
            {
                key: "PT1",
                label: "PT-1",
                max: 10,
                Model: models.PT1
            },
            {
                key: "PT2",
                label: "PT-2",
                max: 10,
                Model: models.PT2
            },
            {
                key: "Halfyearly",
                label: "Halfyearly",
                max: 80,
                Model: models.Halfyearly
            }
        ];
    }

    if (term === "II") {
        return [
            {
                key: "PT3",
                label: "PT-3",
                max: 10,
                Model: models.PT3
            },
            {
                key: "PT4",
                label: "PT-4",
                max: 10,
                Model: models.PT4
            },
            {
                key: "Annual",
                label: "Annual",
                max: 80,
                Model: models.Annual
            }
        ];
    }

    return null;
}

function newMarkV3Humanize(value) {
    return String(value)
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/[_-]+/g, " ")
        .replace(/\b\w/g, char => char.toUpperCase());
}

function newMarkV3SubjectFields(examConfigs) {
    const ignored = new Set([
        "_id",
        "__v",
        "name",
        "rollNumber",
        "admissionNumber",
        "class",
        "className",
        "section",
        "examType",
        "createdAt",
        "updatedAt"
    ]);

    /*
     * Use the INTERSECTION of subject fields.
     *
     * A subject appears in the selector only when it exists
     * in every exam collection of the selected term.
     *
     * This prevents selecting a subject that cannot be saved
     * into one of the three selected examinations.
     */

    const sets = [];

    for (const exam of examConfigs || []) {

        if (
            !exam.Model ||
            !exam.Model.schema ||
            !exam.Model.schema.paths
        ) {
            continue;
        }

        const fields =
            Object.keys(
                exam.Model.schema.paths
            )
                .filter(
                    field => !ignored.has(field)
                );

        sets.push(
            new Set(fields)
        );
    }

    if (!sets.length) return [];

    const common =
        [...sets[0]]
            .filter(field =>
                sets.every(
                    set => set.has(field)
                )
            );

    return common
        .sort((a, b) =>
            newMarkV3Humanize(a)
                .localeCompare(
                    newMarkV3Humanize(b),
                    undefined,
                    {
                        sensitivity: "base"
                    }
                )
        )
        .map(value => ({
            value,
            label: newMarkV3Humanize(value)
        }));
}

/*
============================================================
GET /new/mark-fill
============================================================
*/

marksheet.route(
    "/new/mark-fill"
).get(
    async (req, res) => {

        try {

            const subjectsByClass = {};


            for (
                const className
                of NEW_MARK_V3_CLASSES
            ) {

                const termI =
                    newMarkV3ExamConfig(
                        className,
                        "I"
                    );

                const termII =
                    newMarkV3ExamConfig(
                        className,
                        "II"
                    );

                subjectsByClass[className] = {
                    I:
                        newMarkV3SubjectFields(
                            termI
                        ),

                    II:
                        newMarkV3SubjectFields(
                            termII
                        )
                };
            }

            let decoded = null;

            try {

                const token =
                    req.cookies?.stadminis;

                if (token) {

                    decoded =
                        JSON.parse(
                            Buffer
                                .from(
                                    token.split(".")[1],
                                    "base64"
                                )
                                .toString()
                        );
                }

            } catch (cookieError) {

                console.warn(
                    "NEW MARK V3: admin cookie decode failed:",
                    cookieError.message
                );

            }

            return res.render(
                "newMarkFill.ejs",
                {
                    subjectsByClass,
                    decoded,
                    error: null,
                    success:
                        String(
                            req.query.success || ""
                        ) === "1"
                }
            );

        } catch (error) {

            console.error(
                "NEW MARK V3 PAGE ERROR:",
                error
            );

            return res
                .status(500)
                .send(
                    "Unable to open mark fill page."
                );
        }
    }
);


/*
============================================================
BUILD UNIQUE STUDENT LIST
============================================================

Source priority:

1. studentlist
2. selected term exam collections

Identity:
    admissionNumber

Section priority:
    studentlist.section
    exam.section
    blank

Class:
    studentlist className / house
    exam class / className
============================================================
*/

async function newMarkV3GetStudents(
    className,
    examConfigs
) {

    const targetClass =
        newMarkV3NormalizeClass(
            className
        );

    const students =
        new Map();


    function mergeStudent(raw, source) {

        if (!raw) return;

        const admissionNumber =
            String(
                raw.admissionNo ??
                raw.admissionNumber ??
                ""
            ).trim();

        if (!admissionNumber) return;


        const rawClass =
            raw.className ??
            raw.class ??
            raw.house ??
            "";

        const normalizedRawClass =
            newMarkV3NormalizeClass(
                rawClass
            );


        /*
         * For master student records, class is important.
         * For exam fallback records, class is checked when
         * present. If an old exam document has no class field,
         * admission-number matching still remains safe because
         * the master list is used first.
         */

        if (
            normalizedRawClass &&
            normalizedRawClass !== targetClass
        ) {
            return;
        }


        const current =
            students.get(admissionNumber);


        const name =
            String(
                raw.studentName ??
                raw.name ??
                current?.name ??
                ""
            ).trim();

        const rollNumber =
            raw.rollNo ??
            raw.rollNumber ??
            current?.rollNumber ??
            "";

        const section =
            String(
                raw.section ??
                current?.section ??
                ""
            )
                .trim()
                .toUpperCase();


        students.set(
            admissionNumber,
            {
                name,
                rollNumber,
                admissionNumber,
                section
            }
        );
    }


    /*
     * --------------------------------------------------------
     * 1. MASTER STUDENT COLLECTION
     *
     * We intentionally read the collection and filter in JS.
     * This keeps the route compatible with the existing
     * studentlist model whether class is stored in:
     *
     *   className
     *   class
     *   house
     * --------------------------------------------------------
     */

    const masterRows =
        await studentlist
            .find({})
            .lean();


    for (const row of masterRows) {

        mergeStudent(
            row,
            "studentlist"
        );
    }


    /*
     * --------------------------------------------------------
     * 2. SELECTED TERM EXAM COLLECTIONS
     *
     * Enrich section and also recover students missing from
     * studentlist.
     * --------------------------------------------------------
     */

    const masterAdmissions =
        new Set(
            students.keys()
        );


    for (const exam of examConfigs) {

        if (!exam.Model) continue;

        let rows = [];

        /*
         * If we already have a master list, only fetch matching
         * admission numbers. This is faster and avoids mixing
         * classes.
         */

        if (masterAdmissions.size) {

            rows =
                await exam.Model
                    .find({
                        admissionNumber: {
                            $in: [
                                ...masterAdmissions
                            ]
                        }
                    })
                    .select(
                        "name studentName rollNumber rollNo admissionNumber admissionNo section class className"
                    )
                    .lean();

        } else {

            /*
             * No master rows. Recover students from this exam
             * collection, but only when the record itself carries
             * a class/className/house that matches the target.
             */

            rows =
                await exam.Model
                    .find({})
                    .select(
                        "name studentName rollNumber rollNo admissionNumber admissionNo section class className house"
                    )
                    .lean();
        }


        for (const row of rows) {

            mergeStudent(
                row,
                exam.key
            );
        }
    }


    /*
     * --------------------------------------------------------
     * SORT DEFAULT
     *
     * Section A
     * Section B
     * ...
     * No Section last
     *
     * Inside section:
     * Roll ascending
     * --------------------------------------------------------
     */

    return [
        ...students.values()
    ].sort(
        newMarkV3SectionRollComparator
    );
}


function newMarkV3SectionRollComparator(a, b) {

    const sectionA =
        String(
            a.section || ""
        )
            .trim()
            .toUpperCase();

    const sectionB =
        String(
            b.section || ""
        )
            .trim()
            .toUpperCase();


    const noSectionA =
        !sectionA;

    const noSectionB =
        !sectionB;


    if (
        noSectionA &&
        !noSectionB
    ) {
        return 1;
    }

    if (
        !noSectionA &&
        noSectionB
    ) {
        return -1;
    }


    if (
        sectionA &&
        sectionB
    ) {

        const sectionCompare =
            sectionA.localeCompare(
                sectionB,
                undefined,
                {
                    numeric: true,
                    sensitivity: "base"
                }
            );

        if (sectionCompare !== 0) {
            return sectionCompare;
        }
    }


    const rollA =
        Number(a.rollNumber);

    const rollB =
        Number(b.rollNumber);


    if (
        Number.isFinite(rollA) &&
        Number.isFinite(rollB)
    ) {

        if (rollA !== rollB) {
            return rollA - rollB;
        }
    }


    return String(
        a.name || ""
    ).localeCompare(
        String(
            b.name || ""
        ),
        undefined,
        {
            sensitivity: "base"
        }
    );
}


/*
============================================================
POST /new/mark-fill/load
============================================================
*/

marksheet.route(
    "/new/mark-fill/load"
).post(
    async (req, res) => {

        try {

            const className =
                String(
                    req.body.className || ""
                ).trim();

            const term =
                String(
                    req.body.term || ""
                ).trim();

            const subject =
                String(
                    req.body.subject || ""
                ).trim();


            if (
                !NEW_MARK_V3_CLASSES
                    .includes(className)
            ) {
                return res
                    .status(400)
                    .send(
                        "Invalid class."
                    );
            }


            if (
                !["I", "II"]
                    .includes(term)
            ) {
                return res
                    .status(400)
                    .send(
                        "Invalid term."
                    );
            }


            const examConfigs =
                newMarkV3ExamConfig(
                    className,
                    term
                );


            if (!examConfigs) {

                return res
                    .status(400)
                    .send(
                        "No examination configuration found."
                    );
            }


            const validSubjects =
                newMarkV3SubjectFields(
                    examConfigs
                )
                    .map(
                        item => item.value
                    );


            if (
                !validSubjects
                    .includes(subject)
            ) {
                return res
                    .status(400)
                    .send(
                        "Invalid subject for the selected term."
                    );
            }


            const students =
                await newMarkV3GetStudents(
                    className,
                    examConfigs
                );


            const admissionNumbers =
                students.map(
                    student =>
                        student.admissionNumber
                );


            /*
             * Load marks for all three selected exams.
             */

            const marksByExam = {};


            await Promise.all(
                examConfigs.map(
                    async exam => {

                        if (!exam.Model) {

                            marksByExam[exam.key] =
                                new Map();

                            return;
                        }


                        const rows =
                            admissionNumbers.length
                                ? await exam.Model
                                    .find({
                                        admissionNumber: {
                                            $in:
                                                admissionNumbers
                                        }
                                    })
                                    .select(
                                        `admissionNumber ${subject}`
                                    )
                                    .lean()
                                : [];


                        marksByExam[exam.key] =
                            new Map(
                                rows.map(
                                    row => [
                                        String(
                                            row.admissionNumber
                                        ),
                                        row[subject]
                                    ]
                                )
                            );
                    }
                )
            );


            const finalStudents =
                students.map(
                    student => {

                        const marks = {};

                        for (
                            const exam
                            of examConfigs
                        ) {

                            const value =
                                marksByExam[
                                    exam.key
                                ]?.get(
                                    student.admissionNumber
                                );


                            marks[exam.key] =
                                value === undefined ||
                                value === null
                                    ? ""
                                    : value;
                        }


                        return {
                            ...student,
                            marks
                        };
                    }
                );
                 const logouttimeleft =
                   jwt.decode(req.cookies?.stadminis)?.exp * 1000 - Date.now();

                 console.log("logouttimeleft", logouttimeleft);

            return res.render(
                "newMarkFillStudents.ejs",
                {
                    className,
                    logouttimeleft,
                    classLabel:
                        newMarkV3ClassLabel(
                            className
                        ),

                    term,

                    termLabel:
                        term === "I"
                            ? "Term I"
                            : "Term II",

                    subject,

                    subjectLabel:
                        newMarkV3Humanize(
                            subject
                        ),

                    exams:
                        examConfigs.map(
                            exam => ({
                                key:
                                    exam.key,
                                label:
                                    exam.label,
                                max:
                                    exam.max
                            })
                        ),

                    students:
                        finalStudents,

                    totalStudents:
                        finalStudents.length
                }
            );

        } catch (error) {

            console.error(
                "NEW MARK V3 LOAD ERROR:",
                error
            );

            return res
                .status(500)
                .send(
                    "Unable to load students and marks."
                );
        }
    }
);


/*
============================================================
POST /new/mark-fill/save
============================================================

The form posts admission number with every row.

This removes the old "row index must match the database
student order" problem.
============================================================
*/

marksheet.route(
    "/new/mark-fill/save"
).post(
    async (req, res) => {

        try {

            const className =
                String(
                    req.body.className || ""
                ).trim();

            const term =
                String(
                    req.body.term || ""
                ).trim();

            const subject =
                String(
                    req.body.subject || ""
                ).trim();


            if (
                !NEW_MARK_V3_CLASSES
                    .includes(className)
            ) {
                return res
                    .status(400)
                    .send(
                        "Invalid class."
                    );
            }


            if (
                !["I", "II"]
                    .includes(term)
            ) {
                return res
                    .status(400)
                    .send(
                        "Invalid term."
                    );
            }


            const examConfigs =
                newMarkV3ExamConfig(
                    className,
                    term
                );


            if (!examConfigs) {

                return res
                    .status(400)
                    .send(
                        "Invalid term configuration."
                    );
            }


            const validSubjects =
                newMarkV3SubjectFields(
                    examConfigs
                )
                    .map(
                        item => item.value
                    );


            if (
                !validSubjects
                    .includes(subject)
            ) {
                return res
                    .status(400)
                    .send(
                        "Invalid subject."
                    );
            }


            const rows =
                Array.isArray(
                    req.body.rows
                )
                    ? req.body.rows
                    : Object.values(
                        req.body.rows || {}
                    );


            let updatedCount = 0;


            /*
             * Student data is loaded again from the database.
             * Posted name/roll/section are never trusted.
             */

            const students =
                await newMarkV3GetStudents(
                    className,
                    examConfigs
                );


            const studentsByAdmission =
                new Map(
                    students.map(
                        student => [
                            student.admissionNumber,
                            student
                        ]
                    )
                );


            for (
                const row
                of rows
            ) {

                const admissionNumber =
                    String(
                        row.admissionNumber || ""
                    ).trim();


                if (!admissionNumber) {
                    continue;
                }


                const student =
                    studentsByAdmission.get(
                        admissionNumber
                    );


                if (!student) {
                    continue;
                }


                for (
                    const exam
                    of examConfigs
                ) {

                    const rawValue =
                        row[exam.key];


                    /*
                     * BLANK:
                     * do not modify database.
                     */

                    if (
                        rawValue === undefined ||
                        rawValue === null ||
                        String(
                            rawValue
                        ).trim() === ""
                    ) {
                        continue;
                    }


                    const value =
                        Number(rawValue);


                    if (
                        !Number.isInteger(value) ||
                        value < 0 ||
                        value > exam.max
                    ) {

                        return res
                            .status(400)
                            .send(
                                `Invalid ${exam.label} marks for ${student.name}. Maximum is ${exam.max}.`
                            );
                    }


                    if (
                        !exam.Model ||
                        !exam.Model.schema?.paths?.[
                            subject
                        ]
                    ) {

                        return res
                            .status(400)
                            .send(
                                `Subject "${subject}" is not available in ${exam.label}.`
                            );
                    }


                    const existing =
                        await exam.Model.findOne({
                            admissionNumber
                        });


                    if (existing) {

                        await exam.Model.updateOne(
                            {
                                admissionNumber
                            },
                            {
                                $set: {
                                    [subject]:
                                        value
                                }
                            }
                        );

                    } else {

                        /*
                         * Create a missing exam document.
                         * Identity fields come from the trusted
                         * student collection, not the form.
                         */

                        const document = {

                            admissionNumber,

                            name:
                                student.name,

                            rollNumber:
                                student.rollNumber,

                            class:
                                className,

                            examType:
                                exam.key,

                            [subject]:
                                value
                        };


                        /*
                         * Preserve section when the marks schema
                         * supports it.
                         */

                        if (
                            exam.Model.schema
                                ?.paths
                                ?.section
                        ) {
                            document.section =
                                student.section;
                        }


                        await exam.Model.create(
                            document
                        );
                    }


                    updatedCount++;
                }
            }


            return res.redirect(
                `/marksheet/new/mark-fill?success=${updatedCount}`
            );

        } catch (error) {

            console.error(
                "NEW MARK V3 SAVE ERROR:",
                error
            );

            return res
                .status(500)
                .send(
                    "Unable to save marks."
                );
        }
    }
);


// _________________________________________



const CLASSES = [
  "Nursery",
  "LKG",
  "UKG",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
];
const TERMS = ["I", "II"];
const TYPES = ["scholastic", "attendance"];

const SCHOLASTIC_FIELDS = [
  ["listening", "Listening"],
  ["speaking", "Speaking"],
  ["reading", "Reading"],
  ["writing", "Writing"],
  ["collaboration", "Collaboration"],
  ["peers", "Peers"],
  ["teachers", "Teachers"],
  ["discipline", "Discipline"],
  ["cleanliness", "Cleanliness"],
  ["artCraft", "Art / Craft"],
  ["drawing", "Drawing"],
  ["musicDanceDrama", "Music / Dance / Drama"],
].map(([key, label]) => ({ key, label }));

const ATTENDANCE_FIELDS = [
  { key: "workingDays", label: "Working Days" },
  { key: "present", label: "Present" },
  { key: "absent", label: "Absent" },
];

function clean(value) {
  return String(value ?? "").trim();
}

function normalizeClass(value) {
  let text = clean(value).toUpperCase();
  text = text.replace(/^STD[-\s]*/, "").replace(/^CLASS[-\s]*/, "");

  if (text === "NURSERY" || text === "LKG" || text === "UKG")
    return text[0] + text.slice(1).toLowerCase();
  return text;
}

function classLabel(className) {
  return ["Nursery", "LKG", "UKG"].includes(className)
    ? className
    : `Class ${className}`;
}

function getAcademicYear() {
  const now = new Date();
  const start = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
  return `${start}-${String(start + 1).slice(-2)}`;
}

function isValid(className, term, type) {
  return (
    CLASSES.includes(className) && TERMS.includes(term) && TYPES.includes(type)
  );
}

function studentFromRow(row) {
  if (!row) return null;

  const admissionNumber = clean(
    row.admissionNo ?? row.admissionNumber ?? row.admission_no,
  );
  if (!admissionNumber) return null;

  const rawClass =
    row.house ??
    row.className ??
    row.class ??
    row.standard ??
    row.classNo ??
    "";
  const className = normalizeClass(rawClass);

  return {
    admissionNumber,
    name: clean(row.studentName ?? row.name ?? row.student_name),
    rollNumber: row.rollNo ?? row.rollNumber ?? row.roll ?? "",
    section: clean(row.section).toUpperCase(),
    className,
  };
}

async function getStudents(className) {
  const target = normalizeClass(className);
  const rows = await studentlist.find({}).lean();
  const map = new Map();

  for (const row of rows) {
    const student = studentFromRow(row);
    if (!student) continue;
    if (student.className !== target) continue;
    map.set(student.admissionNumber, student);
  }

  return [...map.values()].sort((a, b) => {
    const sa = a.section || "";
    const sb = b.section || "";

    if (!sa && sb) return 1;
    if (sa && !sb) return -1;

    const sectionCompare = sa.localeCompare(sb, undefined, {
      numeric: true,
      sensitivity: "base",
    });
    if (sectionCompare) return sectionCompare;

    const ra = Number(a.rollNumber);
    const rb = Number(b.rollNumber);
    if (Number.isFinite(ra) && Number.isFinite(rb) && ra !== rb) return ra - rb;

    return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
  });
}

function valueFor(data, key) {
  const value = data?.[key];
  return value === undefined || value === null ? "" : String(value);
}

marksheet.get("/schoolist-clean", async (req, res) => {
  try {
    return res.render("schoolistAttendance.ejs", {
      classes: CLASSES,
      academicYear: clean(req.query.academicYear) || getAcademicYear(),
      success: clean(req.query.success),
      error: clean(req.query.error),
    });
  } catch (error) {
    console.error("SCHOOLIST CLEAN PAGE ERROR:", error);
    return res.status(500).send("Unable to open Schoolist entry page.");
  }
});

marksheet.post("/schoolist-clean/load", async (req, res) => {
  try {
    const className = clean(req.body.className);
    const term = clean(req.body.term);
    const assessmentType = clean(req.body.assessmentType).toLowerCase();
    const academicYear = clean(req.body.academicYear) || getAcademicYear();

    if (!isValid(className, term, assessmentType)) {
      return res.status(400).send("Invalid class, term or entry type.");
    }

    const students = await getStudents(className);
    const ids = students.map((s) => s.admissionNumber);
    const termKey = term === "I" ? "termI" : "termII";
    const Model =
      assessmentType === "scholastic" ? SchoolistAssessment : Attendance;

    const existing = new Map();

    if (ids.length) {
      const docs = await Model.find({
        academicYear,
        className,
        admissionNumber: { $in: ids },
      }).lean();

      for (const doc of docs) {
        existing.set(String(doc.admissionNumber), doc);
      }
    }

    const fields =
      assessmentType === "scholastic" ? SCHOLASTIC_FIELDS : ATTENDANCE_FIELDS;

    const finalStudents = students.map((student) => {
      const existingDoc = existing.get(student.admissionNumber);
      const data = existingDoc?.[termKey] || {};

      const values = {};
      for (const field of fields) {
        values[field.key] = valueFor(data, field.key);
      }

      return {
        admissionNumber: student.admissionNumber,
        name: student.name,
        rollNumber: student.rollNumber,
        section: student.section,
        values,
      };
    });

    return res.render("schoolistAttendanceStudents.ejs", {
      className,
      classLabel: classLabel(className),
      term,
      termLabel: term === "I" ? "Term I" : "Term II",
      assessmentType,
      academicYear,
      fields,
      students: finalStudents,
      totalStudents: finalStudents.length,
      error: null,
    });
  } catch (error) {
    console.error("SCHOOLIST CLEAN LOAD ERROR:", error);
    return res.status(500).send("Unable to load Schoolist students.");
  }
});

marksheet.post("/schoolist-clean/save", async (req, res) => {
  try {
    const className = clean(req.body.className);
    const term = clean(req.body.term);
    const assessmentType = clean(req.body.assessmentType).toLowerCase();
    const academicYear = clean(req.body.academicYear) || getAcademicYear();

    if (!isValid(className, term, assessmentType)) {
      return res.status(400).send("Invalid class, term or entry type.");
    }

    // IMPORTANT: one request parameter only for the complete student table.
    // This avoids Express "too many parameters" errors from rows[0][field]...
    let rows = [];
    try {
      rows = JSON.parse(req.body.rowsJson || "[]");
    } catch {
      return res.status(400).send("Invalid student data received.");
    }

    if (!Array.isArray(rows)) {
      return res.status(400).send("Invalid student data received.");
    }

    const students = await getStudents(className);
    const studentsByAdmission = new Map(
      students.map((student) => [student.admissionNumber, student]),
    );

    const termKey = term === "I" ? "termI" : "termII";
    const Model =
      assessmentType === "scholastic" ? SchoolistAssessment : Attendance;
    const operations = [];

    const fieldKeys =
      assessmentType === "scholastic"
        ? SCHOLASTIC_FIELDS.map((field) => field.key)
        : ATTENDANCE_FIELDS.map((field) => field.key);

    for (const row of rows) {
      const admissionNumber = clean(row?.admissionNumber);
      if (!admissionNumber) continue;

      const student = studentsByAdmission.get(admissionNumber);
      if (!student) continue;

      const set = {
        studentName: student.name,
        rollNumber: student.rollNumber,
        section: student.section,
      };

      if (assessmentType === "scholastic") {
        for (const key of fieldKeys) {
          const raw = row?.[key];

          // Same save rule as bulk marks: blank = no change.
          if (raw === undefined || raw === null || clean(raw) === "") continue;

          set[`${termKey}.${key}`] = clean(raw);
        }
      } else {
        for (const key of fieldKeys) {
          const raw = row?.[key];
          if (raw === undefined || raw === null || clean(raw) === "") continue;

          const value = Number(raw);
          if (!Number.isInteger(value) || value < 0) {
            return res
              .status(400)
              .send(`Invalid ${key} value for ${student.name}.`);
          }

          set[`${termKey}.${key}`] = value;
        }
      }

      // Only identity fields means nothing to save.
      if (Object.keys(set).length === 3) continue;

      operations.push({
        updateOne: {
          filter: {
            academicYear,
            className,
            admissionNumber,
          },
          update: {
            $set: set,
            $setOnInsert: {
              academicYear,
              className,
              admissionNumber,
            },
          },
          upsert: true,
        },
      });
    }

    if (!operations.length) {
      return res.redirect(
        `/marksheet/schoolist-clean?success=0&academicYear=${encodeURIComponent(academicYear)}`,
      );
    }

    // Same pattern as mark-fill: prepare updateOne operations and bulkWrite once.
    const result = await Model.bulkWrite(operations, { ordered: false });
    const saved = (result.modifiedCount || 0) + (result.upsertedCount || 0);

    console.log("SCHOOLIST CLEAN SAVED:", {
      className,
      term,
      assessmentType,
      academicYear,
      operations: operations.length,
      saved,
    });

    return res.redirect(
      `/marksheet/schoolist-clean?success=${saved}&academicYear=${encodeURIComponent(academicYear)}`,
    );
  } catch (error) {
    console.error("SCHOOLIST CLEAN SAVE ERROR:", error);
    return res.status(500).send("Unable to save Schoolist data.");
  }
});




module.exports = marksheet 