const {
    createMarksEditOTP,
    verifyMarksEditOTP
} = require("../utils/marksEditOtpService");


const sendOTPVerificationEmail =
    require("../utils/sendOTPVerificationEmail");


// ============================================================
// MARKS EDIT OTP MIDDLEWARE
// ============================================================
//
// FIRST REQUEST
//
// POST /marksheet/edit/:admissionNumber
//
// No:
//      otpChallengeId
//      otp
//
//      ↓
//
// Generate OTP
// Send OTP email
// Return 202
//
//
//
// SECOND REQUEST
//
// POST /marksheet/edit/:admissionNumber
//
// Has:
//      otpChallengeId
//      otp
//
//      ↓
//
// Verify ONLY OTP
//
//      ↓
//
// Correct → next()
// Wrong   → 401
//
// ============================================================


async function requireMarksEditOTP(
    req,
    res,
    next
) {

    try {

        // =====================================================
        // STUDENT ID
        // =====================================================
        //
        // This is still required by the SAVE route.
        //
        // It is NOT used for OTP verification.
        //

        const studentId =
            String(
                req.body?.studentId || ""
            ).trim();


        if (!studentId) {

            return res.status(400).json({

                success: false,

                message:
                    "Student ID is required."

            });

        }


        // =====================================================
        // OTP DATA
        // =====================================================

        const challengeId =
            String(
                req.body?.otpChallengeId || ""
            ).trim();


        const enteredOTP =
            String(
                req.body?.otp || ""
            ).trim();


        // =====================================================
        // FIRST REQUEST
        // =====================================================

        if (
            !challengeId ||
            !enteredOTP
        ) {

            const challenge =
                await createMarksEditOTP();


            // =================================================
            // SEND EMAIL
            // =================================================
            //
            // Keep your existing email template.
            //
            // These extra values are passed only because
            // your existing email function may use them.
            //
            // They are NOT used for OTP verification.
            //

            await sendOTPVerificationEmail({

                otp:
                    challenge.otp,

                teacherId:
                    req.user?.email || "",

                studentId,

                email:
                    "dilraj85410@gmail.com"

            });


            console.log(
                "======================================"
            );

            console.log(
                "🔐 MARKS EDIT OTP SENT"
            );

            console.log(
                "STUDENT ID:",
                studentId
            );

            console.log(
                "CHALLENGE:",
                challenge.challengeId
            );

            console.log(
                "EMAIL:",
                "dilraj85410@gmail.com"
            );

            console.log(
                "======================================"
            );


            // =================================================
            // STOP
            // =================================================

            return res.status(202).json({

                success: false,

                verificationRequired:
                    true,

                message:
                    "OTP sent to verification email.",

                otpChallengeId:
                    challenge.challengeId,

                expiresIn:
                    challenge.expiresIn

            });

        }


        // =====================================================
        // SECOND REQUEST
        // =====================================================
        //
        // ONLY OTP + CHALLENGE ARE CHECKED.
        //

        const verification =
            await verifyMarksEditOTP({

                challengeId,

                otp:
                    enteredOTP

            });


        // =====================================================
        // OTP FAILED
        // =====================================================

        if (!verification.success) {

            console.log(
                "======================================"
            );

            console.log(
                "❌ MARKS EDIT OTP FAILED"
            );

            console.log(
                "REASON:",
                verification.message
            );

            console.log(
                "======================================"
            );


            return res.status(401).json({

                success: false,

                verificationRequired:
                    true,

                message:
                    verification.message

            });

        }


        // =====================================================
        // OTP SUCCESS
        // =====================================================

        console.log(
            "======================================"
        );

        console.log(
            "✅ MARKS EDIT OTP VERIFIED"
        );

        console.log(
            "STUDENT ID:",
            studentId
        );

        console.log(
            "======================================"
        );


        // =====================================================
        // ALLOW SAVE ROUTE
        // =====================================================

        return next();


    } catch (error) {

        console.error(
            "❌ Marks edit OTP middleware error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to process OTP verification."

        });

    }

}


module.exports = {
    requireMarksEditOTP
};