// ==========================================================
// SHOW CLASS RESULT PRINT PAGE
// ==========================================================

const showClassResultPrintPage = (

    req,

    res

) => {

    try {

        // ==================================================
        // AVAILABLE CLASSES
        //
        // These values must exactly match the keys
        // in services/result/classModels.js
        // ==================================================

        const classes = [

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

            "8"

        ];


        // ==================================================
        // RENDER RESULT PRINT PAGE
        // ==================================================

        return res.render(

            "admin/resultPrint/classResultPrint.ejs",

            {

                classes

            }

        );

    }

    catch (

        error

    ) {

        console.error(

            "SHOW CLASS RESULT PRINT PAGE ERROR:",

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

            "Unable to load result print page."

        );

    }

};


// ==========================================================
// EXPORT
// ==========================================================

module.exports =
    showClassResultPrintPage;