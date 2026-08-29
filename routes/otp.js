const express = require("express");

const router = express.Router();

const {
    verifyOTP
} = require("../utils/otpService");


router.post("/verify", async (req, res) => {

    try {

        const {
            challengeId,
            otp
        } = req.body;


        if (!challengeId || !otp) {

            return res.status(400).json({

                success: false,

                message:
                    "Challenge ID and OTP are required."
            });
        }


        const result =
            verifyOTP(
                challengeId,
                otp
            );


        if (!result.success) {

            return res.status(401).json({

                success: false,

                message: result.message
            });
        }


        /*
         * Log successful verification.
         *
         * Again: NEVER log the OTP.
         */

        console.log(
            `[SECURITY] OTP VERIFIED | ` +
            `Admin: ${result.data.adminId} | ` +
            `Student: ${result.data.studentId} | ` +
            `Student Name: ${result.data.studentName} | ` +
            `Class: ${result.data.studentClass} | ` +
            `Purpose: ${result.data.purpose} | ` +
            `Route: ${result.data.route} | ` +
            `Time: ${new Date().toISOString()}`
        );


        return res.json({

            success: true,

            message:
                "OTP verified successfully.",

            verificationToken:
                result.verificationToken,

            expiresIn:
                600
        });


    } catch (error) {

        console.error(
            "OTP verification error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to verify OTP."
        });
    }
});


module.exports = router;