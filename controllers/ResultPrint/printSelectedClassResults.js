// ==========================================================
// PRINT SELECTED CLASS RESULTS
// ==========================================================

const buildClassResults =
    require("../../services/result/buildClassResults");


// ==========================================================
// PRINT SELECTED STUDENTS RESULTS
// ==========================================================

const printSelectedClassResults = async (

    req,

    res

) => {

    try {

        // ==================================================
        // GET FORM DATA
        // ==================================================

        const {
            studentClass,
            students
        } = req.body || {};


        // ==================================================
        // CLEAN CLASS
        // ==================================================

        const selectedClass =
            String(
                studentClass || ""
            )
                .trim();


        if (!selectedClass) {

            return res.status(
                400
            ).send(
                "Class is required."
            );

        }


        // ==================================================
        // NORMALIZE STUDENT INPUT
        //
        // One checkbox:
        // students = '{"admissionNumber":"17001","rollNumber":1}'
        //
        // Multiple checkboxes:
        // students = [ ... ]
        // ==================================================

        const studentList =
            Array.isArray(students)
                ? students
                : students
                    ? [students]
                    : [];


        if (

            studentList.length === 0

        ) {

            return res.status(
                400
            ).send(
                "Please select at least one student."
            );

        }


        // ==================================================
        // PARSE STUDENT DATA
        // ==================================================

        const selectedStudents =
            studentList

                .map(

                    student => {

                        try {

                            return typeof student === "string"

                                ? JSON.parse(student)

                                : student;

                        }

                        catch (

                            error

                        ) {

                            console.error(

                                "INVALID STUDENT DATA:",

                                student

                            );


                            return null;

                        }

                    }

                )

                .filter(

                    student => {

                        return (

                            student

                            &&

                            String(
                                student.admissionNumber || ""
                            )
                                .trim()

                        );

                    }

                )

                .map(

                    student => ({

                        admissionNumber:

                            String(
                                student.admissionNumber
                            )
                                .trim(),

                        rollNumber:

                            student.rollNumber

                    })

                );


        // ==================================================
        // VALIDATE PARSED STUDENTS
        // ==================================================

        if (

            selectedStudents.length === 0

        ) {

            return res.status(
                400
            ).send(
                "No valid students selected."
            );

        }


        // ==================================================
        // REMOVE DUPLICATE STUDENTS
        // ==================================================

        const uniqueStudents =
            Array.from(

                new Map(

                    selectedStudents.map(

                        student => [

                            student.admissionNumber,

                            student

                        ]

                    )

                ).values()

            );


        // ==================================================
        // BUILD RESULTS
        // ==================================================

        const results =
            await buildClassResults(

                selectedClass,

                uniqueStudents

            );


        // ==================================================
        // CHECK RESULTS
        // ==================================================

        if (

            !Array.isArray(results)

            ||

            results.length === 0

        ) {

            return res.status(
                404
            ).send(
                "No result data found for selected students."
            );

        }


        // ==================================================
        // RENDER BULK PRINT PAGE
        // ==================================================

        return res.render(

            "admin/resultPrint/bulkResultPrint.ejs",

            {

                studentClass:
                    selectedClass,

                results,

                printMode:
                    "selected"

            }

        );

    }

    catch (

        error

    ) {

        console.error(

            "PRINT SELECTED CLASS RESULTS ERROR:",

            {

                error:
                    error.message,

                stack:
                    error.stack

            }

        );


        return res.status(
            500
        ).send(
            "Unable to prepare selected results for printing."
        );

    }

};


// ==========================================================
// EXPORT
// ==========================================================

module.exports =
    printSelectedClassResults;