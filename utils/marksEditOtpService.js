const crypto = require("crypto");

const {
    storeMarksEditOTP,
    getMarksEditOTP,
    deleteMarksEditOTP
} = require("./redis");


// ============================================================
// GENERATE 6 DIGIT OTP
// ============================================================

function generateOTP() {

    return crypto
        .randomInt(
            100000,
            1000000
        )
        .toString();

}


// ============================================================
// GENERATE CHALLENGE ID
// ============================================================

function generateChallengeId() {

    return crypto
        .randomBytes(32)
        .toString("hex");

}


// ============================================================
// CREATE MARKS EDIT OTP
// ============================================================

async function createMarksEditOTP() {

    const challengeId =
        generateChallengeId();


    const otp =
        generateOTP();


    // IMPORTANT:
    // Redis function now stores ONLY OTP.
    await storeMarksEditOTP(
        challengeId,
        otp
    );


    console.log(
        "======================================"
    );

    console.log(
        "MARKS EDIT OTP CREATED"
    );

    console.log(
        "CHALLENGE:",
        challengeId
    );

    console.log(
        "======================================"
    );


    return {

        challengeId,

        otp,

        expiresIn: 300

    };

}


// ============================================================
// VERIFY MARKS EDIT OTP
// ============================================================
//
// ONLY:
//
// challengeId
// otp
//
// are checked.
//
// NO teacherId
// NO studentId
// NO teacher verification
// NO student verification
//
// ============================================================

async function verifyMarksEditOTP({

    challengeId,
    otp

}) {

    const cleanChallengeId =
        String(
            challengeId || ""
        ).trim();


    const cleanOTP =
        String(
            otp || ""
        ).trim();


    // ========================================================
    // VALIDATION
    // ========================================================

    if (!cleanChallengeId) {

        return {

            success: false,

            message:
                "OTP verification session is missing."

        };

    }


    if (
        !/^\d{6}$/.test(
            cleanOTP
        )
    ) {

        return {

            success: false,

            message:
                "Enter a valid 6-digit OTP."

        };

    }


    // ========================================================
    // GET OTP FROM REDIS
    // ========================================================

    const stored =
        await getMarksEditOTP(
            cleanChallengeId
        );


    if (!stored) {

        return {

            success: false,

            message:
                "OTP expired or invalid."

        };

    }


    const storedOTP =
        String(
            stored.otp || ""
        ).trim();


    // ========================================================
    // COMPARE OTP
    // ========================================================

    console.log(
        "======================================"
    );

    console.log(
        "CHECKING MARKS EDIT OTP"
    );


    if (
        storedOTP !==
        cleanOTP
    ) {

        console.log(
            "❌ OTP NOT MATCHED"
        );

        console.log(
            "======================================"
        );


        return {

            success: false,

            message:
                "Invalid OTP."

        };

    }


    // ========================================================
    // OTP CORRECT
    // ========================================================

    await deleteMarksEditOTP(
        cleanChallengeId
    );


    console.log(
        "✅ OTP MATCHED"
    );

    console.log(
        "OTP DELETED - ONE TIME USE"
    );

    console.log(
        "======================================"
    );


    return {

        success: true

    };

}


module.exports = {

    createMarksEditOTP,

    verifyMarksEditOTP

};