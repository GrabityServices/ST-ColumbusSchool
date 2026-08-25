// ==========================================================
// GET CLASS STUDENTS FOR RESULT PRINT
// ==========================================================

const getClassStudentList =
    require("../../services/result/getClassStudentList");


// ==========================================================
// GET STUDENTS OF SELECTED CLASS
// ==========================================================

const getClassStudentsForPrint = async (

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
        // GET ALL UNIQUE STUDENTS
        // ==================================================

        const students =
            await getClassStudentList(
                studentClass
            );


        // ==================================================
        // RENDER STUDENT SELECTION PAGE
        // ==================================================

        return res.render(

            "admin/resultPrint/classStudentList.ejs",

            {

                studentClass,

                students

            }

        );

    }

    catch (

        error

    ) {

        console.error(

            "GET CLASS STUDENTS FOR PRINT ERROR:",

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

            "Unable to load students for result printing."

        );

    }

};


// ==========================================================
// EXPORT
// ==========================================================

module.exports =
    getClassStudentsForPrint;