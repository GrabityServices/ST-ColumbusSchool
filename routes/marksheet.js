const express = require('express')
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

marksheet
    .route("/view/:class/marks")
    .get(
        async (req, res) => {

            try {

                const className =
                    req.params.class;


                const models =
                    classModels[className];


                if (!models) {

                    return res
                        .status(404)
                        .send(
                            "Invalid class"
                        );
                }


                const data =
                    await mergeExamCollections(
                        models
                    );


                /*
                ===========================================
                SORT STUDENTS

                ORDER:

                Section A
                Section B
                Section C
                ...

                Students without section
                always come LAST.

                Inside every section:
                Roll number ascending.
                ===========================================
                */

                const students =
                    [...data.students]
                        .sort(
                            (a, b) => {

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


                                const hasSectionA =
                                    sectionA !== "";


                                const hasSectionB =
                                    sectionB !== "";


                                /*
                                ===================================
                                NO SECTION ALWAYS LAST
                                ===================================
                                */

                                if (
                                    hasSectionA &&
                                    !hasSectionB
                                ) {

                                    return -1;
                                }


                                if (
                                    !hasSectionA &&
                                    hasSectionB
                                ) {

                                    return 1;
                                }


                                /*
                                ===================================
                                BOTH HAVE SECTIONS
                                SORT BY SECTION
                                ===================================
                                */

                                if (
                                    hasSectionA &&
                                    hasSectionB
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


                                    if (
                                        sectionCompare !== 0
                                    ) {

                                        return sectionCompare;
                                    }
                                }


                                /*
                                ===================================
                                SAME SECTION
                                OR BOTH HAVE NO SECTION

                                SORT BY ROLL NUMBER
                                ===================================
                                */

                                const rollA =
                                    Number(
                                        a.rollNumber
                                    ) || 0;


                                const rollB =
                                    Number(
                                        b.rollNumber
                                    ) || 0;


                                return rollA - rollB;

                            }
                        );


                console.log(
                    `Class ${className} students:`,
                    students.length
                );


                res.render(
                    "viewmarks.ejs",
                    {
                        className,
                        students,
                        subjects:
                            data.subjects,

                        user:
                            req.user
                    }
                );

            } catch (error) {

                console.error(
                    "Marksheet merge error:",
                    error
                );


                return res
                    .status(500)
                    .send(
                        "Unable to load marksheet data"
                    );
            }

        }
    );

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
                admissionNumber = ""
            } = req.query;


            const studentClass =
                String(studentClassInput).trim();


            const cleanRoll =
                String(roll).trim();


            const cleanAdmissionNumber =
                String(admissionNumber).trim();


            console.log(
                "\n================================="
            );

            console.log(
                "RESULT SEARCH"
            );

            console.log(
                "Class:",
                studentClass
            );

            console.log(
                "Roll:",
                cleanRoll
            );

            console.log(
                "Admission Number:",
                cleanAdmissionNumber
            );

            console.log(
                "================================="
            );


            let examModels;

            let searchQuery;

            let searchType;

            let finalClass;


            // ==============================================
            // 2. CLASS + ROLL SEARCH
            // ==============================================

            if (
                studentClass !== "" &&
                cleanRoll !== ""
            ) {

                const rollNumber =
                    Number(cleanRoll);


                // Validate class

                if (
                    !classModels[studentClass]
                ) {

                    return res
                        .status(400)
                        .send(
                            "Invalid class."
                        );

                }


                // Validate roll number

                if (
                    !Number.isInteger(
                        rollNumber
                    ) ||
                    rollNumber < 1
                ) {

                    return res
                        .status(400)
                        .send(
                            "Invalid roll number."
                        );

                }


                // Get models only for selected class

                examModels =
                    classModels[studentClass];


                // Search by roll number

                searchQuery = {

                    rollNumber:
                        rollNumber

                };


                searchType =
                    "classRoll";


                finalClass =
                    studentClass;


                console.log(
                    "SEARCH TYPE: CLASS + ROLL"
                );

                console.log(
                    "FINAL CLASS:",
                    finalClass
                );

                console.log(
                    "SEARCH QUERY:",
                    searchQuery
                );

            }


            // ==============================================
            // 3. ADMISSION NUMBER SEARCH
            // ==============================================

         // ==============================================
// 3. ADMISSION NUMBER SEARCH
// ==============================================

else if (
    cleanAdmissionNumber !== ""
) {

    // ------------------------------------------
    // VALIDATE ADMISSION NUMBER
    // ------------------------------------------

    if (
        !/^\d{5}$/.test(
            cleanAdmissionNumber
        )
    ) {

        return res
            .status(400)
            .send(
                "Invalid admission number."
            );

    }


    searchType = "admission";


    console.log(
        "SEARCH TYPE: ADMISSION NUMBER"
    );


    // ------------------------------------------
    // STEP 1:
    // SEARCH STUDENT COLLECTION
    // ------------------------------------------

    console.log(
        "SEARCHING STUDENT COLLECTION FOR:",
        cleanAdmissionNumber
    );


    const student =
        await studentlist
            .findOne({
                admissionNo:
                    cleanAdmissionNumber
            })
            .lean();


    console.log(
        "STUDENT FOUND:",
        student
    );


    // ------------------------------------------
    // STUDENT NOT FOUND
    // ------------------------------------------

    if (!student) {

        return res
            .status(404)
            .send(
                "Student not found."
            );

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

    const studentHouse =
        String(
            student.house || ""
        )
        .trim()
        .toUpperCase();


    console.log(
        "STUDENT HOUSE:",
        studentHouse
    );


    // Remove STD-
    //
    // STD-7 → 7

    const extractedClass =
        studentHouse.replace(
            /^STD-/,
            ""
        );


    finalClass =
        extractedClass;


    console.log(
        "EXTRACTED CLASS:",
        finalClass
    );


    // ------------------------------------------
    // STEP 3:
    // VALIDATE CLASS
    // ------------------------------------------

    if (
        !classModels[finalClass]
    ) {

        console.error(
            "No exam models found for class:",
            finalClass
        );


        return res
            .status(404)
            .send(
                `No exam configuration found for Class ${finalClass}.`
            );

    }


    // ------------------------------------------
    // STEP 4:
    // GET EXAM MODELS FOR CLASS
    // ------------------------------------------

    examModels =
        classModels[finalClass];


    // ------------------------------------------
    // STEP 5:
    // SEARCH EXAMS
    //
    // First use admission number.
    // ------------------------------------------

    searchQuery = {

        admissionNumber:
            cleanAdmissionNumber

    };


    console.log(
        "\nSTUDENT DETAILS"
    );

    console.log(
        "Name:",
        student.studentName
    );

    console.log(
        "Admission Number:",
        student.admissionNo
    );

    console.log(
        "House:",
        student.house
    );

    console.log(
        "Extracted Class:",
        finalClass
    );

    console.log(
        "Student Roll:",
        student.rollNo
    );


    console.log(
        "EXAM SEARCH QUERY:",
        searchQuery
    );

}


            // ==============================================
            // 4. NO SEARCH DATA
            // ==============================================

            else {

                return res
                    .status(400)
                    .send(
                        "Please enter Class + Roll Number or Admission Number."
                    );

            }


            // ==============================================
            // 5. SEARCH EXAM COLLECTIONS
            // ==============================================

            const searchResults =
                await Promise.all(

                    Object.entries(
                        examModels
                    ).map(

                        async (
                            [examName, Model]
                        ) => {

                            const data =
                                await Model
                                    .findOne(
                                        searchQuery
                                    )
                                    .lean();


                            console.log(

                                examName,

                                "=>",

                                data
                                    ? `FOUND | Roll: ${data.rollNumber} | Admission: ${data.admissionNumber}`
                                    : "NOT FOUND"

                            );


                            return {

                                examName,

                                data

                            };

                        }

                    )

                );


            // ==============================================
            // 6. KEEP ONLY FOUND RESULTS
            // ==============================================

            const foundResults =
                searchResults.filter(

                    result =>
                        result.data

                );


            console.log(
                "FOUND EXAM RECORDS:",
                foundResults.length
            );


            // ==============================================
            // 7. NO EXAM RESULT FOUND
            // ==============================================

            if (
                foundResults.length === 0
            ) {

                return res
                    .status(404)
                    .send(
                        "No examination result found."
                    );

            }


            // ==============================================
            // 8. VALIDATE ALL FOUND RESULTS
            // ==============================================

            for (
                const result
                of foundResults
            ) {

                // ------------------------------------------
                // CLASS + ROLL VALIDATION
                // ------------------------------------------

                if (
                    searchType ===
                    "classRoll"
                ) {

                    if (
                        Number(
                            result.data.rollNumber
                        )
                        !==
                        Number(
                            cleanRoll
                        )
                    ) {

                        console.error(
                            "ROLL NUMBER MISMATCH:",
                            result.data
                        );


                        return res
                            .status(500)
                            .send(
                                "Incorrect student record found."
                            );

                    }

                }


                // ------------------------------------------
                // ADMISSION NUMBER VALIDATION
                // ------------------------------------------

                if (
                    searchType ===
                    "admission"
                ) {

                    if (
                        String(
                            result.data.admissionNumber
                        )
                        !==
                        cleanAdmissionNumber
                    ) {

                        console.error(
                            "ADMISSION NUMBER MISMATCH:",
                            result.data
                        );


                        return res
                            .status(500)
                            .send(
                                "Incorrect student record found."
                            );

                    }

                }

            }


            // ==============================================
            // 9. GET FIRST RESULT
            // ==============================================

            const firstResult =
                foundResults[0].data;


            // ==============================================
            // 10. CREATE FINAL DATA
            // ==============================================

            const mergedData = {

                student: {

                    name:
                        firstResult.name,

                    admissionNumber:
                        firstResult.admissionNumber,

                    class:
                        finalClass,

                    roll:
                        firstResult.rollNumber

                },


                exams: {}

            };


            // ==============================================
            // 11. MERGE ALL EXAMS
            // ==============================================

            for (
                const result
                of foundResults
            ) {

                mergedData.exams[
                    result.examName
                ] =
                    result.data;

            }


            // ==============================================
            // 12. FINAL DEBUG
            // ==============================================

            console.log(
                "\n================================="
            );

            console.log(
                "FINAL STUDENT DATA"
            );

            console.log(
                "Name:",
                mergedData.student.name
            );

            console.log(
                "Class:",
                mergedData.student.class
            );

            console.log(
                "Roll:",
                mergedData.student.roll
            );

            console.log(
                "Admission:",
                mergedData.student.admissionNumber
            );

            console.log(
                "Exams:",
                Object.keys(
                    mergedData.exams
                )
            );

            console.log(
                "=================================\n"
            );


            // ==============================================
            // 13. RENDER RESULT
            // ==============================================

            return res.render(

                "result.ejs",

                {

                    data:
                        mergedData,

                    print:
                        true,

                    showNavigation:
                        true

                }

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


            // ==============================================
            // VALIDATE
            // ==============================================

            if (
                !className ||
                !admissionNumber ||
                !examType
            ) {

                return res.status(400).send(
                    "Class, admission number and exam type are required."
                );

            }


            const cleanAdmissionNumber =
                String(admissionNumber)
                    .trim();


            // ==============================================
            // GET EXAM MODEL
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

            const student =
                await Model.findOne({
                    admissionNumber:
                        cleanAdmissionNumber
                }).lean();


            if (!student) {

                return res.status(404).send(
                    `No student found with admission number ${cleanAdmissionNumber}.`
                );

            }


            // ==============================================
            // RENDER EDIT PAGE
            // ==============================================

            return res.render(
                "editStudentMarks.ejs",
                {

                    admin:
                        req.user,

                    student,

                    className,

                    examType

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
    verifyEdit,
    async (req, res) => {

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

module.exports = marksheet 