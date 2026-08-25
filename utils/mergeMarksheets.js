const META_FIELDS = new Set([
    "_id",
    "__v",
    "createdAt",
    "updatedAt",
    "rollNumber",
    "admissionNumber",
    "name"
]);

function isMarkField(key) {
    return !META_FIELDS.has(key);
}


function normalizeMark(value) {

    // 0 is a valid mark
    if (value === 0) {
        return 0;
    }

    // Missing / empty mark = Absent
    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {
        return "AB";
    }

    return value;
}


async function getCollectionData(model) {

    return await model
        .find({})
        .lean();
}


const mergeExamCollections =
    async (models) => {

        try {

            // ==========================================
            // FINAL STUDENTS MAP
            //
            // KEY = admissionNumber
            // NEVER use rollNumber as identity
            // ==========================================

            const studentsMap =
                new Map();


            // ==========================================
            // GET ALL EXAM COLLECTIONS
            // ==========================================

            for (
                const [
                    examName,
                    Model
                ]
                of Object.entries(models)
            ) {

                console.log(
                    `LOADING EXAM: ${examName}`
                );


                // ======================================
                // GET ALL STUDENTS FROM THIS EXAM
                // ======================================

                const students =
                    await Model
                        .find({})
                        .lean();


                console.log(
                    `${examName} STUDENTS:`,
                    students.length
                );


                // ======================================
                // PROCESS EVERY STUDENT
                // ======================================

                for (
                    const student
                    of students
                ) {

                    // ----------------------------------
                    // ADMISSION NUMBER IS UNIQUE ID
                    // ----------------------------------

                    const admissionNumber =
                        String(
                            student.admissionNumber ||
                            ""
                        ).trim();


                    // Skip invalid records

                    if (
                        !admissionNumber
                    ) {

                        console.log(
                            `SKIPPING STUDENT WITHOUT ADMISSION NUMBER IN ${examName}:`,
                            student._id
                        );

                        continue;

                    }


                    // ----------------------------------
                    // CREATE STUDENT IF NOT EXISTS
                    //
                    // IMPORTANT:
                    // This works even if student is NOT
                    // in PT1 but exists in PT2/PT3/etc.
                    // ----------------------------------

                    if (
                        !studentsMap.has(
                            admissionNumber
                        )
                    ) {

                        studentsMap.set(
                            admissionNumber,
                            {

                                admissionNumber:

                                    admissionNumber,


                                // Display only
                                // NOT used for merging

                                rollNumber:

                                    student.rollNumber,


                                name:

                                    student.name,


                                exams: {}

                            }
                        );


                        console.log(
                            "NEW STUDENT ADDED:",
                            admissionNumber,
                            student.name
                        );

                    }


                    // ----------------------------------
                    // GET MERGED STUDENT
                    // ----------------------------------

                    const mergedStudent =
                        studentsMap.get(
                            admissionNumber
                        );


                    // ----------------------------------
                    // UPDATE BASIC INFORMATION
                    // ----------------------------------

                    if (
                        student.name
                    ) {

                        mergedStudent.name =
                            student.name;

                    }


                    if (
                        student.rollNumber !==
                        undefined
                    ) {

                        mergedStudent.rollNumber =
                            student.rollNumber;

                    }


                    // ----------------------------------
                    // STORE EXAM DATA
                    // ----------------------------------

                    mergedStudent.exams[
                        examName
                    ] =
                        student;


                    console.log(
                        `MERGED ${examName}:`,
                        student.name,
                        "| Admission:",
                        admissionNumber
                    );

                }

            }


            // ==========================================
            // CONVERT MAP TO ARRAY
            // ==========================================

            const students =
                Array.from(
                    studentsMap.values()
                );


            console.log(
                "================================="
            );

            console.log(
                "TOTAL UNIQUE STUDENTS:",
                students.length
            );

            console.log(
                "================================="
            );


            // ==========================================
            // SORT BY ADMISSION NUMBER
            //
            // Roll number is NOT used
            // ==========================================

            students.sort(

                (a, b) =>

                    String(
                        a.admissionNumber
                    ).localeCompare(

                        String(
                            b.admissionNumber
                        ),

                        undefined,

                        {
                            numeric: true
                        }

                    )

            );


            // ==========================================
            // SUBJECTS
            //
            // Keep your existing subject logic here
            // ==========================================

            const subjects =
                [
                    "english",
                    "hindi",
                    "math",
                    "sst",
                    "gsc",
                    "gk",
                    "computer",
                    "language"
                ];


            return {

                students,

                subjects

            };


        } catch (error) {

            console.error(
                "MERGE EXAM COLLECTION ERROR:",
                error
            );

            throw error;

        }

    };


module.exports =
    mergeExamCollections;

