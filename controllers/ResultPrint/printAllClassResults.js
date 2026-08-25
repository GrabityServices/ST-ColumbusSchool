// ==========================================================
// PRINT ALL CLASS RESULTS
// ==========================================================

const buildClassResults =
    require("../../services/result/buildClassResults");


// ==========================================================
// PRINT ALL STUDENTS RESULTS OF ONE CLASS
// ==========================================================

const printAllClassResults = async (

    req,

    res

) => {

    try {

        // ==================================================
        // GET CLASS FROM URL
        // ==================================================

        const studentClass =
            String(
                req.params.className || ""
            )
                .trim();


        // ==================================================
        // VALIDATE CLASS
        // ==================================================

        if (!studentClass) {

            return res.status(
                400
            ).send(
                "Class is required."
            );

        }


        // ==================================================
        // BUILD ALL CLASS RESULTS
        //
        // selectedStudents is not provided,
        // so buildClassResults() automatically loads
        // every student of the selected class.
        // ==================================================

        const results =
            await buildClassResults(
                studentClass
            );


        // ==================================================
        // NO RESULTS FOUND
        // ==================================================

        if (

            !Array.isArray(results)

            ||

            results.length === 0

        ) {

            return res.status(
                404
            ).send(
                "No result data found for this class."
            );

        }


        // ==================================================
        // RENDER BULK PRINT PAGE
        // ==================================================

        return res.render(

            "admin/resultPrint/bulkResultPrint.ejs",

            {

                studentClass,

                results,

                printMode:
                    "all"

            }

        );

    }

    catch (

        error

    ) {

        console.error(

            "PRINT ALL CLASS RESULTS ERROR:",

            {

                className:
                    req.params.className,

                error:
                    error.message

            }

        );


        return res.status(
            500
        ).send(

            "Unable to prepare class results for printing."

        );

    }

};


// ==========================================================
// EXPORT
// ==========================================================

module.exports =
    printAllClassResults;