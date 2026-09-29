// ==========================================================
// handler/check.result.js
// ==========================================================


// ==========================================================
// MARKSHEET DATABASE
// ==========================================================

const { marksheetDB } =
    require("../connectdb.js");


// ==========================================================
// IMPORT ALL MARKS MODELS
// ==========================================================


// ================= NURSERY =================
    const SchoolistAssessment = require("../models/schoolist");
    const Attendance = require("../models/attendance");
const NurseryPT1 =
    require("../models/Nursery/NurseryPT1.js");

const NurseryPT2 =
    require("../models/Nursery/NurseryPT2.js");

const NurseryHalfyearly =
    require("../models/Nursery/NurseryHalfyearly.js");

const NurseryPT3 =
    require("../models/Nursery/NurseryPT3.js");

const NurseryPT4 =
    require("../models/Nursery/NurseryPT4.js");

const NurseryAnnual =
    require("../models/Nursery/NurseryAnnual.js");


// ================= LKG =================

const LKGPT1 =
    require("../models/LKG/LKGPT1.js");

const LKGPT2 =
    require("../models/LKG/LKGPT2.js");

const LKGHalfyearly =
    require("../models/LKG/LKGHalfyearly.js");

const LKGPT3 =
    require("../models/LKG/LKGPT3.js");

const LKGPT4 =
    require("../models/LKG/LKGPT4.js");

const LKGAnnual =
    require("../models/LKG/LKGAnnual.js");


// ================= UKG =================

const UKGPT1 =
    require("../models/UKG/UKGPT1.js");

const UKGPT2 =
    require("../models/UKG/UKGPT2.js");

const UKGHalfyearly =
    require("../models/UKG/UKGHalfyearly.js");

const UKGPT3 =
    require("../models/UKG/UKGPT3.js");

const UKGPT4 =
    require("../models/UKG/UKGPT4.js");

const UKGAnnual =
    require("../models/UKG/UKGAnnual.js");


// ================= CLASS 1 =================

const Class1PT1 =
    require("../models/Class1/Class1PT1.js");

const Class1PT2 =
    require("../models/Class1/Class1PT2.js");

const Class1Halfyearly =
    require("../models/Class1/Class1Halfyearly.js");

const Class1PT3 =
    require("../models/Class1/Class1PT3.js");

const Class1PT4 =
    require("../models/Class1/Class1PT4.js");

const Class1Annual =
    require("../models/Class1/Class1Annual.js");


// ================= CLASS 2 =================

const Class2PT1 =
    require("../models/Class2/Class2PT1.js");

const Class2PT2 =
    require("../models/Class2/Class2PT2.js");

const Class2Halfyearly =
    require("../models/Class2/Class2Halfyearly.js");

const Class2PT3 =
    require("../models/Class2/Class2PT3.js");

const Class2PT4 =
    require("../models/Class2/Class2PT4.js");

const Class2Annual =
    require("../models/Class2/Class2Annual.js");


// ================= CLASS 3 =================

const Class3PT1 =
    require("../models/Class3/Class3PT1.js");

const Class3PT2 =
    require("../models/Class3/Class3PT2.js");

const Class3Halfyearly =
    require("../models/Class3/Class3Halfyearly.js");

const Class3PT3 =
    require("../models/Class3/Class3PT3.js");

const Class3PT4 =
    require("../models/Class3/Class3PT4.js");

const Class3Annual =
    require("../models/Class3/Class3Annual.js");


// ================= CLASS 4 =================

const Class4PT1 =
    require("../models/Class4/Class4PT1.js");

const Class4PT2 =
    require("../models/Class4/Class4PT2.js");

const Class4Halfyearly =
    require("../models/Class4/Class4Halfyearly.js");

const Class4PT3 =
    require("../models/Class4/Class4PT3.js");

const Class4PT4 =
    require("../models/Class4/Class4PT4.js");

const Class4Annual =
    require("../models/Class4/Class4Annual.js");


// ================= CLASS 5 =================

const Class5PT1 =
    require("../models/Class5/Class5PT1.js");

const Class5PT2 =
    require("../models/Class5/Class5PT2.js");

const Class5Halfyearly =
    require("../models/Class5/Class5Halfyearly.js");

const Class5PT3 =
    require("../models/Class5/Class5PT3.js");

const Class5PT4 =
    require("../models/Class5/Class5PT4.js");

const Class5Annual =
    require("../models/Class5/Class5Annual.js");


// ================= CLASS 6 =================

const Class6PT1 =
    require("../models/Class6/Class6PT1.js");

const Class6PT2 =
    require("../models/Class6/Class6PT2.js");

const Class6Halfyearly =
    require("../models/Class6/Class6Halfyearly.js");

const Class6PT3 =
    require("../models/Class6/Class6PT3.js");

const Class6PT4 =
    require("../models/Class6/Class6PT4.js");

const Class6Annual =
    require("../models/Class6/Class6Annual.js");


// ================= CLASS 7 =================

const Class7PT1 =
    require("../models/Class7/Class7PT1.js");

const Class7PT2 =
    require("../models/Class7/Class7PT2.js");

const Class7Halfyearly =
    require("../models/Class7/Class7Halfyearly.js");

const Class7PT3 =
    require("../models/Class7/Class7PT3.js");

const Class7PT4 =
    require("../models/Class7/Class7PT4.js");

const Class7Annual =
    require("../models/Class7/Class7Annual.js");


// ================= CLASS 8 =================

const Class8PT1 =
    require("../models/Class8/Class8PT1.js");

const Class8PT2 =
    require("../models/Class8/Class8PT2.js");

const Class8Halfyearly =
    require("../models/Class8/Class8Halfyearly.js");

const Class8PT3 =
    require("../models/Class8/Class8PT3.js");

const Class8PT4 =
    require("../models/Class8/Class8PT4.js");

const Class8Annual =
    require("../models/Class8/Class8Annual.js");
const studentlist = require("../models/studentlist.js");


// ==========================================================
// CLASS MODELS
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
// CHECK STUDENT RESULT
// ==========================================================

const CheckResult = async (req, res) => {

    try {

        // ==============================================
        // GET FORM DATA
        // ==============================================

        const {
            exam = "",
            admissionNumber = "",
            studentName = ""
        } = req.body;


        const selectedExam =
            String(exam).trim();


        const selectedAdmissionNumber =
            String(admissionNumber).trim();

        

        const selectedStudentName =
            String(studentName)
                .trim()
                .replace(/\s+/g, " ");


        console.log("\n=================================");
        console.log("STUDENT RESULT SEARCH");
        console.log("=================================");
        console.log(
            "Exam:",
            selectedExam
        );
        console.log(
            "Admission Number:",
            selectedAdmissionNumber
        );
        console.log(
            "Student Name:",
            selectedStudentName
        );
        console.log("=================================\n");


        // ==============================================
        // VALIDATE EXAM
        // ==============================================

        if (
            selectedExam !== "Halfyearly" &&
            selectedExam !== "Annual"
        ) {

            return res.render(
                "student-result-page.ejs",
                {
                    error:
                        "Please select a valid examination."
                }
            );

        }


const schoolistData = await SchoolistAssessment.findOne({
    admissionNumber: selectedAdmissionNumber,
    academicYear: "2026-27"
}).lean();

const attendanceData = await Attendance.findOne({
    admissionNumber: selectedAdmissionNumber,
    academicYear: "2026-27"
}).lean();

console.log("School Assessment:", schoolistData);
console.log("Attendance:", attendanceData);

        // ==============================================
        // VALIDATE ADMISSION NUMBER
        // ==============================================

        if (!selectedAdmissionNumber) {

            return res.render(
                "student-result-page.ejs",
                {
                    error:
                        "Please enter your Admission Number."
                }
            );

        }


        // ==============================================
        // VALIDATE STUDENT NAME
        // ==============================================

        if (!selectedStudentName) {

            return res.render(
                "student-result-page.ejs",
                {
                    error:
                        "Please enter your name."
                }
            );

        }


        // ==============================================
        // SEARCH STUDENT COLLECTION
        //
        // DATABASE FIELD:
        // admissionNo
        // ==============================================

        const student =
            await studentlist
                .findOne({

                    admissionNo:
                        selectedAdmissionNumber

                })
                .lean();


        // ==============================================
        // STUDENT NOT FOUND
        // ==============================================

        if (!student) {

            console.log(
                "STUDENT NOT FOUND:",
                selectedAdmissionNumber
            );


            return res.render(
                "student-result-page.ejs",
                {
                    error:
                        "No student found with this Admission Number."
                }
            );

        }


        console.log(
            "STUDENT FOUND:",
            student.studentName
        );


        // ==============================================
        // NORMALIZE DATABASE NAME
        //
        // DATABASE FIELD:
        // studentName
        // ==============================================

        const databaseStudentName =
            String(
                student.studentName || ""
            )
                .trim()
                .replace(/\s+/g, " ");


        // ==============================================
        // MATCH STUDENT NAME
        // CASE INSENSITIVE
        // ==============================================

        if (
            databaseStudentName.toLowerCase() !==
            selectedStudentName.toLowerCase()
        ) {

            console.log(
                "NAME NOT MATCHED"
            );

            console.log(
                "Entered:",
                selectedStudentName
            );

            console.log(
                "Database:",
                databaseStudentName
            );


            return res.render(
                "student-result-page.ejs",
                {
                    error:
                        "Student name does not match the Admission Number."
                }
            );

        }


        console.log(
            "NAME MATCHED SUCCESSFULLY"
        );

// ==============================================
// GET CLASS FROM STUDENT DATABASE
// ==============================================

// ==============================================
// EXTRACT CLASS FROM HOUSE
//
// Example:
// STD-7  →  7
// STD-10 →  10
// ==============================================

const selectedClass =
    String(student.house || "")
        .trim()
        .replace(/^STD-/i, "");


console.log(
    "House:",
    student.house
);

console.log(
    "Extracted Class:",
    selectedClass
);

console.log(
    "RAW STUDENT CLASS:",
    selectedClass || "NOT FOUND"
);


// ==============================================
// VALIDATE CLASS
// ==============================================

if (!selectedClass) {

    console.log(
        "FULL STUDENT DOCUMENT:"
    );

    console.log(student);


    return res.render(
        "student-result-page.ejs",
        {
            error:
                "Student class information was not found."
        }
    );

}


console.log(
    "Student Class:",
    selectedClass
);


        // ==============================================
        // GET CLASS RESULT MODELS
        // ==============================================

        const models =
            classModels[selectedClass];


        if (!models) {

            console.log(
                "CLASS MODEL NOT FOUND:",
                selectedClass
            );


            return res.render(
                "student-result-page.ejs",
                {
                    error:
                        `Result system is not available for Class ${selectedClass}.`
                }
            );

        }


        // ==============================================
        // GET ROLL NUMBER FROM STUDENT DATABASE
        //
        // DATABASE FIELD:
        // rollNo
        // ==============================================

        const selectedRoll =
            Number(
                student.rollNo
            );


        // ==============================================
        // VALIDATE ROLL NUMBER
        // ==============================================

        if (
            !Number.isInteger(
                selectedRoll
            ) ||
            selectedRoll < 1
        ) {

            return res.render(
                "student-result-page.ejs",
                {
                    error:
                        "Student roll number was not found."
                }
            );

        }


        console.log(
            "Student Roll:",
            selectedRoll
        );


        // ==============================================
        // RESULT SEARCH QUERY
        //
        // THESE FIELD NAMES DEPEND ON
        // YOUR RESULT MODELS
        // ==============================================

        const searchQuery = {

            admissionNumber:
                selectedAdmissionNumber,

            rollNumber:
                selectedRoll

        };


        // ==============================================
        // SELECT EXAMS
        // ==============================================

        let examsToSearch;


        // ==============================================
        // HALF YEARLY
        // PT1 + PT2 + HALFYEARLY
        // ==============================================

        if (
            selectedExam === "Halfyearly"
        ) {

            examsToSearch = [

                "PT1",

                "PT2",

                "Halfyearly"

            ];

        }


        // ==============================================
        // ANNUAL
        // PT1 + PT2 + HALFYEARLY
        // PT3 + PT4 + ANNUAL
        // ==============================================

        if (
            selectedExam === "Annual"
        ) {

            examsToSearch = [

                "PT1",

                "PT2",

                "Halfyearly",

                "PT3",

                "PT4",

                "Annual"

            ];

        }


        // ==============================================
        // SEARCH RESULTS
        // ==============================================

        const searchResults =
            await Promise.all(

                examsToSearch.map(
                    async (examName) => {

                        const Model =
                            models[examName];


                        if (!Model) {

                            console.log(
                                `${examName}: MODEL NOT FOUND`
                            );


                            return {

                                examName,

                                data: null

                            };

                        }


                        const data =
                            await Model
                                .findOne(
                                    searchQuery
                                )
                                .lean();


                        console.log(

                            `${examName}:`,

                            data
                                ? `FOUND`
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
        // KEEP FOUND RESULTS
        // ==============================================

        const foundResults =
            searchResults.filter(
                result =>
                    result.data
            );


        // ==============================================
        // NO RESULT FOUND
        // ==============================================

        if (
            foundResults.length === 0
        ) {

            return res.render(
                "student-result-page.ejs",
                {
                    error:
                        "No result found for this student."
                }
            );

        }


        // ==============================================
        // FINAL MERGED DATA
        //
        // STUDENT INFO FROM STUDENT COLLECTION
        // ==============================================

       const mergedData = {
         student: {
           name: student.studentName,

           admissionNumber: student.admissionNo,

           class: selectedClass,

           roll: selectedRoll,

           section: student.section,

           fatherName: student.fatherName,

           motherName: student.motherName,
         },

         exams: {},

         schoolist: schoolistData || null,

         attendance: attendanceData || null,

         // UKG has 600 total marks
         totalMarks: selectedClass.toUpperCase() === "UKG" ? 600 : 800,

         isUKG: selectedClass.toUpperCase() === "UKG",
       };

       
       console.log("Merged Data:", mergedData.totalMarks, mergedData.isUKG, mergedData.exams, mergedData.student, mergedData.schoolist, mergedData.attendance);
       

        // ==============================================
        // ADD FOUND EXAM RESULTS
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
        // FINAL LOG
        // ==============================================

        console.log("\n=================================");
        console.log("FINAL RESULT");
        console.log("=================================");

        console.log(
            "Student:",
            mergedData.student.name
        );

        console.log(
            "Admission:",
            mergedData.student.admissionNumber
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
            "Exams:",
            Object.keys(
                mergedData.exams
            )
        );

        console.log("=================================\n");


        // ==============================================
        // RENDER RESULT
        // ==============================================

        return res.render(
            "result.ejs",
            {

                data:
                    mergedData,

                print:
                    false,

                showNavigation:
                    false

            }

        );


    } catch (error) {

        console.error(
            "\nCHECK RESULT ERROR:"
        );

        console.error(error);


        return res.status(500).render(
            "student-result-page.ejs",
            {
                error:
                    "Something went wrong while searching the result."
            }
        );

    }

};


// ==========================================================
// EXPORT HANDLER
// ==========================================================

module.exports = CheckResult;