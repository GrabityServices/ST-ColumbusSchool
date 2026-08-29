const client = require("../connectRedis.js");


// ==========================================
// NORMAL / FORGOT PASSWORD OTP
// ==========================================

async function storeOtp(email, otp) {

    try {

        await client.set(
            `${email}:fotp`,
            String(otp),
            {
                EX: 600
            }
        );

        console.log("Forgot OTP stored successfully");

    } catch (err) {

        console.error(
            "Error storing forgot OTP:",
            err
        );

        throw err;
    }
}


async function getOtp(email) {

    try {

        return await client.get(
            `${email}:fotp`
        );

    } catch (err) {

        console.error(
            "Error getting forgot OTP:",
            err
        );

        throw err;
    }
}


async function deleteOtp(email) {

    try {

        await client.del(
            `${email}:fotp`
        );

    } catch (err) {

        console.error(
            "Error deleting forgot OTP:",
            err
        );

        throw err;
    }
}



// ==========================================
// OLD EDIT OTP
// ==========================================

async function storeEditOtp(email, otp) {

    try {

        await client.set(
            `${email}:eotp`,
            String(otp),
            {
                EX: 60
            }
        );

        console.log("Edit OTP stored successfully");

    } catch (err) {

        console.error(
            "Error storing edit OTP:",
            err
        );

        throw err;
    }
}


async function getEditOtp(email) {

    try {

        return await client.get(
            `${email}:eotp`
        );

    } catch (err) {

        console.error(
            "Error getting edit OTP:",
            err
        );

        throw err;
    }
}


async function deleteEditOtp(email) {

    try {

        await client.del(
            `${email}:eotp`
        );

    } catch (err) {

        console.error(
            "Error deleting edit OTP:",
            err
        );

        throw err;
    }
}



// ============================================================
// NEW MARKS EDIT VERIFICATION OTP
// ============================================================

const MARKS_EDIT_OTP_PREFIX =
    "marks_edit_verification:";

const MARKS_EDIT_OTP_EXPIRY =
    300; // 5 minutes



/*
|--------------------------------------------------------------------------
| Store Marks Edit Verification
|--------------------------------------------------------------------------
|
| Stores:
|
| OTP
| Teacher/Admin information
| Student information
| Exam information
|
*/

// ============================================================
// MARKS EDIT VERIFICATION OTP
// ============================================================

async function storeMarksEditOTP(
    challengeId,
    otp
) {

    const key =
        `${MARKS_EDIT_OTP_PREFIX}${challengeId}`;


    const data = {

        otp:
            String(otp).trim(),

        createdAt:
            new Date().toISOString()

    };


    await client.set(
        key,
        JSON.stringify(data),
        {
            EX:
                MARKS_EDIT_OTP_EXPIRY
        }
    );


    console.log(
        "Marks edit OTP stored successfully"
    );


    return true;
}


async function getMarksEditOTP(
    challengeId
) {

    const key =
        `${MARKS_EDIT_OTP_PREFIX}${challengeId}`;


    const data =
        await client.get(key);


    if (!data) {

        return null;

    }


    return JSON.parse(data);

}


async function deleteMarksEditOTP(
    challengeId
) {

    const key =
        `${MARKS_EDIT_OTP_PREFIX}${challengeId}`;


    await client.del(key);

}
// ============================================================
// GET MARKS EDIT OTP
// ============================================================

async function getMarksEditOTP(
    challengeId
) {

    try {

        const key =
            `${MARKS_EDIT_OTP_PREFIX}${challengeId}`;


        const data =
            await client.get(key);


        if (!data) {

            return null;

        }


        return JSON.parse(data);

    } catch (error) {

        console.error(
            "Error getting marks edit OTP:",
            error
        );

        throw error;

    }
}


// ============================================================
// DELETE MARKS EDIT OTP
// ============================================================

async function deleteMarksEditOTP(
    challengeId
) {

    try {

        const key =
            `${MARKS_EDIT_OTP_PREFIX}${challengeId}`;


        await client.del(key);


    } catch (error) {

        console.error(
            "Error deleting marks edit OTP:",
            error
        );

        throw error;

    }
}



// ============================================================
// EXPORT
// ============================================================

module.exports = {

    // Forgot password
    storeOtp,
    getOtp,
    deleteOtp,

    // Old edit OTP
    storeEditOtp,
    getEditOtp,
    deleteEditOtp,

    // NEW marks edit verification
    storeMarksEditOTP,
    getMarksEditOTP,
    deleteMarksEditOTP

};