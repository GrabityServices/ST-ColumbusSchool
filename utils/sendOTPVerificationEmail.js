const sendEmail =
    require("../mail/user.mailtrap");


const MARKS_EDIT_VERIFICATION_EMAIL_TEMPLATE =
    require("../mail/marksEditVerificationEmail");


async function sendOTPVerificationEmail({

    otp,

    teacherId,

    studentId,

    email =
        "dkumar06545@gmail.com"

}) {

    try {

        const message =
            MARKS_EDIT_VERIFICATION_EMAIL_TEMPLATE

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

                email

            );


        if (!response) {

            throw new Error(
                "Unable to send verification email."
            );

        }


        console.log(
            "Marks edit OTP email sent."
        );


        return true;

    } catch (error) {

        console.error(
            "OTP email error:",
            error.message
        );

        throw error;

    }

}


module.exports =
    sendOTPVerificationEmail;