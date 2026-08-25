const saveMarks = async (
    req,
    res,
    Model,
    examName
) => {

    try {

        const {

            rollNumber,
            admissionNumber,
            name,

            english,
            hindi,
            math,
            sst,
            gsc,
            gk,
            computer,
            language

        } = req.body;


        // ==========================================
        // STRING CLEANER
        //
        // "  Priyanshu Kumar  "
        //          ↓
        // "PRIYANSHU KUMAR"
        // ==========================================

        const cleanString =
            (value) => {

                if (
                    value === undefined ||
                    value === null
                ) {

                    return "";

                }


                return String(value)
                    .trim()
                    .toUpperCase();

            };


        // ==========================================
        // CLEAN ALL STRING VALUES
        // ==========================================

        const cleanRollNumber =
            cleanString(rollNumber);


        const cleanAdmissionNumber =
            cleanString(admissionNumber);


        const cleanName =
            cleanString(name);


        // ==========================================
        // REQUIRED STUDENT INFORMATION
        // ==========================================

        if (

            cleanRollNumber === "" ||

            cleanName === ""

        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Roll Number and Name are required."

            });

        }


        // ==========================================
        // VALIDATE ROLL NUMBER
        // ==========================================

        const numericRollNumber =
            Number(cleanRollNumber);


        if (

            !Number.isInteger(
                numericRollNumber
            ) ||

            numericRollNumber < 1

        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid Roll Number."

            });

        }


        // ==========================================
        // CREATE STUDENT DATA
        // ==========================================

        const studentData = {

            rollNumber:
                numericRollNumber,

            name:
                cleanName

        };


        // ==========================================
        // ADMISSION NUMBER
        // ==========================================

        if (

            cleanAdmissionNumber !== ""

        ) {

            studentData.admissionNumber =
                cleanAdmissionNumber;

        }


        // ==========================================
        // OPTIONAL MARKS
        //
        // Empty → not stored
        // 0     → stores 0
        // 5     → stores 5
        // ==========================================

        const subjects = {

            english,
            hindi,
            math,
            sst,
            gsc,
            gk,
            computer,
            language

        };


        for (

            const [subject, value]

            of Object.entries(subjects)

        ) {

            if (

                value !== undefined &&
                value !== null &&
                String(value).trim() !== ""

            ) {

                studentData[subject] =
                    Number(
                        String(value).trim()
                    );

            }

        }


        // ==========================================
        // CREATE NEW MARKSHEET
        //
        // Duplicate roll numbers allowed
        // ==========================================

        const student =
            await Model.create(
                studentData
            );


        console.log(

            `MARKS SAVED | ${examName}`,

            {

                id:
                    student._id,

                name:
                    student.name,

                admissionNumber:
                    student.admissionNumber,

                rollNumber:
                    student.rollNumber

            }

        );


        return res.redirect(
            "/marksheet"
        );


    } catch (err) {


        // ==========================================
        // MONGOOSE VALIDATION ERROR
        // ==========================================

        if (

            err.name ===
            "ValidationError"

        ) {

            return res.status(400).json({

                success: false,

                message:
                    err.message

            });

        }


        // ==========================================
        // DUPLICATE KEY ERROR
        // ==========================================

        if (

            err.code === 11000

        ) {

            console.error(

                "DUPLICATE KEY ERROR:",

                err.keyValue

            );


            return res.status(409).json({

                success: false,

                message:
                    `${examName} marks already exist for this record.`

            });

        }


        console.error(

            `${examName} SAVE ERROR:`,

            err

        );


        return res.status(500).json({

            success: false,

            message:
                "Internal Server Error"

        });

    }

};


module.exports =
    saveMarks;