// ==========================================================
// BUILD STUDENT RESULT
// ==========================================================

const {
    classModels
} = require("./classModels");


// ==========================================================
// BUILD COMPLETE RESULT FOR ONE STUDENT
// ==========================================================

const buildStudentResult = async ({
    studentClass,
    admissionNumber,
    rollNumber
}) => {

    // ======================================================
    // VALIDATE CLASS
    // ======================================================

    const selectedClass =
        String(studentClass || "")
            .trim();


    const models =
        classModels[selectedClass];


    if (!models) {

        throw new Error(
            `Invalid class selected: ${selectedClass}`
        );

    }


    // ======================================================
    // VALIDATE STUDENT IDENTIFICATION
    // ======================================================

    if (
        !admissionNumber &&
        !rollNumber
    ) {

        throw new Error(
            "Admission number or roll number is required."
        );

    }


    // ======================================================
    // BUILD STUDENT SEARCH QUERY
    //
    // Important:
    // Do not search undefined values unnecessarily.
    // ======================================================

    const searchQuery = {};


    if (admissionNumber) {

        searchQuery.admissionNumber =
            admissionNumber;

    }


    if (rollNumber) {

        searchQuery.rollNumber =
            rollNumber;

    }


    // ======================================================
    // EXAMS TO SEARCH
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
    // SEARCH STUDENT IN ALL EXAM MODELS
    // ======================================================

    const searchResults =
        await Promise.all(

            examsToSearch.map(
                async (examName) => {

                    const Model =
                        models[examName];


                    // Model safety check
                    if (!Model) {

                        return {
                            examName,
                            data: null
                        };

                    }


                    const data =
                        await Model
                            .findOne(searchQuery)
                            .lean();


                    return {
                        examName,
                        data
                    };

                }
            )

        );


    // ======================================================
    // KEEP ONLY AVAILABLE RESULTS
    // ======================================================

    const foundResults =
        searchResults.filter(
            result => result.data
        );


    // ======================================================
    // NO RESULT FOUND
    // ======================================================

    if (foundResults.length === 0) {

        return null;

    }


    // ======================================================
    // USE FIRST FOUND RESULT
    // FOR COMMON STUDENT INFORMATION
    // ======================================================

    const firstResult =
        foundResults[0].data;


    // ======================================================
    // BUILD FINAL RESULT OBJECT
    // ======================================================

    const mergedData = {

        student: {

            name:
                firstResult.name || "",

            admissionNumber:
                firstResult.admissionNumber || "",

            class:
                selectedClass,

            roll:
                firstResult.rollNumber || ""

        },


        exams: {}

    };


    // ======================================================
    // ADD ALL AVAILABLE EXAM RESULTS
    // ======================================================

    for (
        const result
        of foundResults
    ) {

        mergedData.exams[
            result.examName
        ] =
            result.data;

    }


    // ======================================================
    // RETURN COMPLETE STUDENT RESULT
    // ======================================================

    return mergedData;

};


// ==========================================================
// EXPORT
// ==========================================================

module.exports =
    buildStudentResult;