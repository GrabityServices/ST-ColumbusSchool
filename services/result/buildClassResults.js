// ==========================================================
// services/result/buildClassResults.js
// ==========================================================

const getClassStudentList =
    require("./getClassStudentList");


const buildStudentResult =
    require("./buildStudentResult");


// ==========================================================
// BUILD CLASS RESULTS
//
// studentClass:
// Selected class
//
// selectedStudents:
// Optional array:
//
// [
//     {
//         admissionNumber,
//         rollNumber
//     }
// ]
//
// If selectedStudents is empty or null,
// build results for all students in the class.
// ==========================================================

const buildClassResults = async (

    studentClass,

    selectedStudents = null

) => {

    // ======================================================
    // CLEAN CLASS VALUE
    // ======================================================

    const selectedClass =
        String(studentClass || "")
            .trim();


    if (!selectedClass) {

        throw new Error(
            "Class is required."
        );

    }


    // ======================================================
    // GET STUDENTS
    // ======================================================

    let students;


    // ======================================================
    // USE SELECTED STUDENTS
    // ======================================================

    if (

        Array.isArray(selectedStudents)

        &&

        selectedStudents.length > 0

    ) {

        students =
            selectedStudents;

    }


    // ======================================================
    // GET ALL STUDENTS OF CLASS
    // ======================================================

    else {

        students =
            await getClassStudentList(
                selectedClass
            );

    }


    // ======================================================
    // NO STUDENTS FOUND
    // ======================================================

    if (

        !Array.isArray(students)

        ||

        students.length === 0

    ) {

        return [];

    }


    // ======================================================
    // REMOVE DUPLICATE STUDENTS
    //
    // Primary key:
    // admissionNumber
    //
    // Roll number is included because selected student
    // data may come from the frontend.
    // ======================================================

    const uniqueStudentMap =
        new Map();


    for (

        const student
        of students

    ) {

        if (!student) {

            continue;

        }


        const admissionNumber =
            String(
                student.admissionNumber || ""
            ).trim();


        const rollNumber =
            student.rollNumber;


        // Admission number is required
        if (!admissionNumber) {

            continue;

        }


        // Unique student key
        const studentKey =
            admissionNumber;


        // Do not add duplicate students
        if (

            uniqueStudentMap.has(
                studentKey
            )

        ) {

            continue;

        }


        uniqueStudentMap.set(

            studentKey,

            {

                admissionNumber,

                rollNumber

            }

        );

    }


    // ======================================================
    // FINAL UNIQUE STUDENT ARRAY
    // ======================================================

    const finalStudents =
        Array.from(
            uniqueStudentMap.values()
        );


    // ======================================================
    // BUILD RESULTS FOR ALL STUDENTS
    //
    // Each student searches:
    //
    // PT1
    // PT2
    // Halfyearly
    // PT3
    // PT4
    // Annual
    // ======================================================

    const results =
        await Promise.all(

            finalStudents.map(

                async (
                    student
                ) => {

                    try {

                        return await
                            buildStudentResult({

                                studentClass:
                                    selectedClass,

                                admissionNumber:
                                    student
                                        .admissionNumber,

                                rollNumber:
                                    student
                                        .rollNumber

                            });

                    }

                    catch (
                        error
                    ) {

                        console.error(

                            "RESULT BUILD ERROR:",

                            {

                                class:
                                    selectedClass,

                                admissionNumber:
                                    student
                                        .admissionNumber,

                                rollNumber:
                                    student
                                        .rollNumber,

                                error:
                                    error.message

                            }

                        );


                        return null;

                    }

                }

            )

        );


    // ======================================================
    // REMOVE EMPTY / FAILED RESULTS
    // ======================================================

    const validResults =
        results.filter(

            result =>
                result !== null

        );


    // ======================================================
    // SORT BY ROLL NUMBER
    //
    // Handles numeric and missing roll numbers safely.
    // ======================================================

    validResults.sort(

        (
            a,
            b
        ) => {

            const rollA =
                Number(
                    a?.student?.roll
                );


            const rollB =
                Number(
                    b?.student?.roll
                );


            const safeRollA =
                Number.isNaN(rollA)
                    ? Infinity
                    : rollA;


            const safeRollB =
                Number.isNaN(rollB)
                    ? Infinity
                    : rollB;


            return (
                safeRollA
                -
                safeRollB
            );

        }

    );


    // ======================================================
    // RETURN
    // ======================================================

    return validResults;

};


// ==========================================================
// EXPORT
// ==========================================================

module.exports =
    buildClassResults;