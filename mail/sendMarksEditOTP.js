const sendEmail =
    require("./user.mailtrap");


const TEMPLATE =
    require("./marksEditVerificationEmail");


async function sendMarksEditOTP({

    otp,

    teacherId,

    studentId

}) {

    try {

        const message =
            TEMPLATE

                .replaceAll(
                    "{verificationCode}",
                    String(otp)
                )

                .replaceAll(
                    "{teacherId}",
                    String(teacherId)
                )

                .replaceAll(
                    "{studentId}",
                    String(studentId)
                );


        const response =
            await sendEmail(

                message,

                "Marks Editing Verification OTP",

                "MARKS_EDIT_SECURITY",

                "dkumar06545@gmail.com"

            );


        if (!response) {

            throw new Error(
                "Failed to send marks edit OTP email."
            );

        }


        console.log(
            "Marks edit verification email sent."
        );


        return true;

    } catch (error) {

        console.error(
            "Marks edit email error:",
            error.message
        );

        throw error;

    }

}


module.exports =
    sendMarksEditOTP;