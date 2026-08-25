const mongoose = require("mongoose");
const { marksheetDB } = require("../connectdb");


/*
|--------------------------------------------------------------------------
| Normalize text
|--------------------------------------------------------------------------
*/

function normalizeText(value) {

    return String(value ?? "")
        .trim()
        .replace(/\s+/g, " ")
        .toUpperCase();

}


/*
|--------------------------------------------------------------------------
| Normalize admission number
|--------------------------------------------------------------------------
*/

function normalizeAdmissionNumber(value) {

    return String(value ?? "")
        .trim()
        .replace(/\D/g, "");

}


/*
|--------------------------------------------------------------------------
| Normalize class
|--------------------------------------------------------------------------
*/

function normalizeClass(value) {

    const className =
        normalizeText(value);


    if (className === "NURSERY") {
        return "NURSERY";
    }

    if (className === "LKG") {
        return "LKG";
    }

    if (className === "UKG") {
        return "UKG";
    }


    const match =
        className.match(
            /(?:STD|CLASS)?[\s-]*(\d+)/
        );


    if (match) {

        return String(
            Number(match[1])
        );

    }


    return className;

}


/*
|--------------------------------------------------------------------------
| Get marksheet collection prefix
|--------------------------------------------------------------------------
*/

function getClassPrefix(className) {

    const normalized =
        normalizeClass(className);


    if (
        normalized === "NURSERY" ||
        normalized === "LKG" ||
        normalized === "UKG"
    ) {

        return normalized.toLowerCase();

    }


    if (
        /^[1-8]$/.test(normalized)
    ) {

        return `class${normalized}`;

    }


    return null;

}


/*
|--------------------------------------------------------------------------
| Verify student before marks entry
|--------------------------------------------------------------------------
*/

function verifyStudentForMarks(className) {

    return async function (req, res, next) {

        try {

            console.log(
                "\n================================"
            );

            console.log(
                "STUDENT MARKS VERIFICATION"
            );

            console.log(
                "Requested class:",
                className
            );

            console.log(
                "================================"
            );


            // =========================================================
            // REQUEST DATA
            // =========================================================

            const admissionNumber =
                normalizeAdmissionNumber(
                    req.body.admissionNumber
                );


            const submittedName =
                normalizeText(
                    req.body.name
                );


            const requestedClass =
                normalizeClass(
                    className
                );


            console.log(
                "Admission:",
                admissionNumber
            );

            console.log(
                "Name:",
                submittedName
            );

            console.log(
                "Requested class:",
                requestedClass
            );


            // =========================================================
            // VALIDATION
            // =========================================================

            if (!admissionNumber) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Admission number is required"

                });

            }


            if (!submittedName) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Student name is required"

                });

            }


            // =========================================================
            // IMPORTANT:
            // USE marksheetDB
            // =========================================================

            const db =
                marksheetDB.db;


            if (!db) {

                return res.status(500).json({

                    success: false,

                    message:
                        "Marksheet database is not connected"

                });

            }


            console.log(
                "Using database:",
                db.databaseName
            );


            // =========================================================
            // FIND STUDENT FROM marksheetDB.students
            // =========================================================

            const student =
                await db
                    .collection("students")
                    .findOne({

                        admissionNo: {
                            $regex:
                                `^${admissionNumber}\\D*$`
                        }

                    });


            console.log(
                "Student found:",
                student
            );


            if (!student) {

                return res.status(404).json({

                    success: false,

                    message:
                        `Admission number ${admissionNumber} is not present in student list`

                });

            }


            // =========================================================
            // MASTER STUDENT DATA
            // =========================================================

            const masterAdmission =
                normalizeAdmissionNumber(
                    student.admissionNo
                );


            const masterName =
                normalizeText(
                    student.studentName
                );


            const masterClass =
                normalizeClass(
                    student.house
                );


            console.log(
                "Master admission:",
                masterAdmission
            );

            console.log(
                "Master name:",
                masterName
            );

            console.log(
                "Master class:",
                masterClass
            );


            // =========================================================
            // ADMISSION CHECK
            // =========================================================

            if (
                masterAdmission !==
                admissionNumber
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Admission number does not match student record",

                    databaseAdmission:
                        student.admissionNo,

                    submittedAdmission:
                        admissionNumber

                });

            }


            // =========================================================
            // NAME CHECK
            // =========================================================

            if (
                masterName !==
                submittedName
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Student name does not match admission number",

                    admissionNumber,

                    expectedName:
                        student.studentName,

                    submittedName:
                        req.body.name

                });

            }


            // =========================================================
            // CLASS CHECK
            // =========================================================

            if (
                masterClass !==
                requestedClass
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Student does not belong to this class",

                    admissionNumber,

                    studentClass:
                        student.house,

                    requestedClass:
                        className

                });

            }


            console.log(
                "Admission ✔"
            );

            console.log(
                "Name ✔"
            );

            console.log(
                "Class ✔"
            );


            // =========================================================
            // CURRENT CLASS PREFIX
            // =========================================================

            const classPrefix =
                getClassPrefix(
                    className
                );


            if (!classPrefix) {

                return res.status(400).json({

                    success: false,

                    message:
                        `Invalid class: ${className}`

                });

            }


            // =========================================================
            // GET COLLECTIONS FROM marksheetDB
            // =========================================================

            const collections =
                await db
                    .listCollections({})
                    .toArray();


            const collectionNames =
                collections.map(
                    collection =>
                        collection.name
                );


            // =========================================================
            // EXAM COLLECTIONS ONLY
            // =========================================================

            const examCollections =
                collectionNames.filter(
                    name => {

                        const lower =
                            name.toLowerCase();


                        return (

                            /^class[1-8](pt[1-4]|annuals|halfyearlies)$/i
                                .test(lower)

                            ||

                            /^(nursery|lkg|ukg)(pt[1-4]|annuals|halfyearlies)$/i
                                .test(lower)

                        );

                    }
                );


            console.log(
                "Exam collections:",
                examCollections
            );


            // =========================================================
            // OTHER CLASS COLLECTIONS
            // =========================================================

            const otherClassCollections =
                examCollections.filter(
                    collectionName => {

                        return !collectionName
                            .toLowerCase()
                            .startsWith(
                                classPrefix
                            );

                    }
                );


            console.log(
                "Other class collections:",
                otherClassCollections
            );


            // =========================================================
            // CHECK STUDENT IN OTHER CLASS
            // =========================================================

            for (
                const collectionName
                of otherClassCollections
            ) {

                const existing =
                    await db
                        .collection(
                            collectionName
                        )
                        .findOne({

                            admissionNumber:
                                admissionNumber

                        });


                if (existing) {

                    console.log(
                        "❌ Student already exists in:",
                        collectionName
                    );


                    return res.status(409).json({

                        success: false,

                        message:
                            "This student already has marks in another class",

                        admissionNumber,

                        studentName:
                            student.studentName,

                        studentClass:
                            student.house,

                        requestedClass:
                            className,

                        foundIn:
                            collectionName

                    });

                }

            }


            // =========================================================
            // VERIFIED
            // =========================================================

            console.log(
                "================================"
            );

            console.log(
                "STUDENT VERIFICATION PASSED ✔"
            );

            console.log(
                "================================"
            );


            req.verifiedStudent = {

                admissionNumber:
                    masterAdmission,

                name:
                    student.studentName,

                class:
                    student.house

            };


            next();


        } catch (error) {

            console.error(
                "Student verification error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Unable to verify student",

                error:
                    error.message

            });

        }

    };

}


module.exports =
    verifyStudentForMarks;