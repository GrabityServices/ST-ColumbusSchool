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


// ==========================================
// EDIT OTP
// ==========================================

async function storeEditOtp(email, otp) {
    try {

        await client.set(
            `${email}:eotp`,
            String(otp),
            {
                EX: 300
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


// ==========================================
// GET FORGOT PASSWORD OTP
// ==========================================

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


// ==========================================
// GET EDIT OTP
// ==========================================

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


// ==========================================
// DELETE FORGOT OTP
// ==========================================

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
// DELETE EDIT OTP
// ==========================================

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


module.exports = {

    storeOtp,
    storeEditOtp,

    getOtp,
    getEditOtp,

    deleteOtp,
    deleteEditOtp

};


// async function clearAllOtps() {
//     try {

//         const keys = await client.keys("*:fotp");

//         const editKeys = await client.keys("*:eotp");

//         const allKeys = [
//             ...keys,
//             ...editKeys
//         ];

//         if (allKeys.length > 0) {

//             await client.del(allKeys);

//             console.log(
//                 "Deleted OTP keys:",
//                 allKeys
//             );

//         } else {

//             console.log(
//                 "No OTPs found."
//             );

//         }

//     } catch (error) {

//         console.error(
//             "OTP cleanup error:",
//             error
//         );

//     } finally {

//         await client.quit();

//     }
// }

// clearAllOtps();