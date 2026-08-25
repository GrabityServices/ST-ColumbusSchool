// ==========================================================
// GET CLASS STUDENT LIST
// ==========================================================

const {
    classModels
} = require("./classModels");


// ==========================================================
// GET ALL UNIQUE STUDENTS OF A CLASS
// ==========================================================

const getClassStudentList = async (
    studentClass
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
    // GET CLASS MODELS
    // ======================================================

    const models =
        classModels[selectedClass];


    if (!models) {

        throw new Error(
            `Invalid class selected: ${selectedClass}`
        );

    }


    // ======================================================
    // ALL EXAM TYPES
    // ======================================================

    const examsToSearch = [

        "PT1",

        "PT2",

        "Halfyearly",

        "PT3",

        "PT4",

        "Annual"

    ];


    // ======================================================
    // FETCH STUDENTS FROM ALL EXAM COLLECTIONS
    // ======================================================

    const examResults =
        await Promise.all(

            examsToSearch.map(

                async (
                    examName
                ) => {

                    const Model =
                        models[examName];


                    // Skip missing model

                    if (!Model) {

                        return [];

                    }


                    return await Model
                        .find(
                            {},
                            {

                                name: 1,

                                admissionNumber: 1,

                                rollNumber: 1

                            }
                        )
                        .lean();

                }

            )

        );


    // ======================================================
    // UNIQUE STUDENT MAP
    //
    // admissionNumber is the primary unique identifier.
    // ======================================================

    const studentMap =
        new Map();


    // ======================================================
    // ADD STUDENTS FROM ALL EXAMS
    // ======================================================

    for (

        const students
        of examResults

    ) {

        for (

            const student
            of students

        ) {

            if (!student) {

                continue;

            }


            // Clean admission number

            const admissionNumber =
                String(
                    student.admissionNumber || ""
                )
                    .trim();


            // Skip invalid student

            if (!admissionNumber) {

                continue;

            }


            const studentKey =
                admissionNumber;


            // ==================================================
            // ADD NEW STUDENT
            // ==================================================

            if (

                !studentMap.has(
                    studentKey
                )

            ) {

                studentMap.set(

                    studentKey,

                    {

                        name:
                            student.name || "",

                        admissionNumber,

                        rollNumber:
                            student.rollNumber

                    }

                );

            }


            // ==================================================
            // UPDATE EXISTING STUDENT
            //
            // Useful when one exam has incomplete data and
            // another exam contains missing information.
            // ==================================================

            else {

                const existingStudent =
                    studentMap.get(
                        studentKey
                    );


                if (

                    !existingStudent.name

                    &&

                    student.name

                ) {

                    existingStudent.name =
                        student.name;

                }


                if (

                    (
                        existingStudent.rollNumber ===
                        undefined

                        ||

                        existingStudent.rollNumber ===
                        null

                        ||

                        existingStudent.rollNumber ===
                        ""
                    )

                    &&

                    student.rollNumber !==
                    undefined

                    &&

                    student.rollNumber !==
                    null

                ) {

                    existingStudent.rollNumber =
                        student.rollNumber;

                }

            }

        }

    }


    // ======================================================
    // CONVERT MAP TO ARRAY
    // ======================================================

    const students =
        Array.from(
            studentMap.values()
        );


    // ======================================================
    // SORT BY ROLL NUMBER
    //
    // Missing roll numbers go to the end.
    // ======================================================

    students.sort(

        (
            a,
            b
        ) => {

            const rollA =
                Number(
                    a.rollNumber
                );


            const rollB =
                Number(
                    b.rollNumber
                );


            const safeRollA =
                Number.isNaN(
                    rollA
                )
                    ? Infinity
                    : rollA;


            const safeRollB =
                Number.isNaN(
                    rollB
                )
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
    // RETURN UNIQUE CLASS STUDENTS
    // ======================================================

    return students;

};


// ==========================================================
// EXPORT
// ==========================================================

module.exports =
    getClassStudentList;