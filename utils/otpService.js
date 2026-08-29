const crypto = require("crypto");

/*
|--------------------------------------------------------------------------
| Generic OTP Store
|--------------------------------------------------------------------------
| For production, use Redis/DB instead of Map so OTPs survive restarts
| and work correctly when you have multiple Node.js instances.
*/

const otpStore = new Map();

const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
const VERIFICATION_TOKEN_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes


function generateOTP() {
    return crypto.randomInt(100000, 1000000).toString();
}


function generateToken() {
    return crypto.randomBytes(32).toString("hex");
}


/**
 * Create a new OTP challenge
 */
function createOTPChallenge({
    purpose,
    adminId,
    studentId,
    studentName,
    studentClass,
    route
}) {

    const challengeId = generateToken();

    const otp = generateOTP();

    const expiresAt = Date.now() + OTP_EXPIRY_MS;

    otpStore.set(challengeId, {
        challengeId,

        purpose,

        adminId,
        studentId,
        studentName,
        studentClass,

        route,

        otp,

        expiresAt,

        attempts: 0,

        maxAttempts: 5,

        verified: false,

        createdAt: new Date()
    });

    return {
        challengeId,
        otp,
        expiresAt
    };
}


/**
 * Verify OTP
 */
function verifyOTP(challengeId, enteredOTP) {

    const record = otpStore.get(challengeId);

    if (!record) {
        return {
            success: false,
            message: "Invalid or expired verification request."
        };
    }

    if (Date.now() > record.expiresAt) {

        otpStore.delete(challengeId);

        return {
            success: false,
            message: "OTP has expired."
        };
    }


    if (record.attempts >= record.maxAttempts) {

        otpStore.delete(challengeId);

        return {
            success: false,
            message: "Maximum OTP attempts exceeded."
        };
    }


    record.attempts++;


    if (record.otp !== String(enteredOTP)) {

        return {
            success: false,
            message: "Invalid OTP."
        };
    }


    const verificationToken = generateToken();

    record.verified = true;

    record.verificationToken = verificationToken;

    record.verificationTokenExpiresAt =
        Date.now() + VERIFICATION_TOKEN_EXPIRY_MS;


    // OTP itself is no longer needed.
    delete record.otp;


    return {
        success: true,

        verificationToken,

        data: {
            purpose: record.purpose,

            adminId: record.adminId,

            studentId: record.studentId,

            studentName: record.studentName,

            studentClass: record.studentClass,

            route: record.route
        }
    };
}


/**
 * Validate verification token
 */
function consumeVerificationToken(token, {
    purpose,
    adminId,
    studentId
} = {}) {

    for (const [challengeId, record] of otpStore.entries()) {

        if (
            record.verificationToken === token
        ) {

            if (
                Date.now() >
                record.verificationTokenExpiresAt
            ) {

                otpStore.delete(challengeId);

                return null;
            }


            if (
                purpose &&
                record.purpose !== purpose
            ) {
                return null;
            }


            if (
                adminId &&
                String(record.adminId) !== String(adminId)
            ) {
                return null;
            }


            if (
                studentId &&
                String(record.studentId) !== String(studentId)
            ) {
                return null;
            }


            /*
             * One-time token.
             * Delete immediately so it cannot be reused.
             */
            otpStore.delete(challengeId);

            return {
                purpose: record.purpose,

                adminId: record.adminId,

                studentId: record.studentId,

                studentName: record.studentName,

                studentClass: record.studentClass,

                route: record.route
            };
        }
    }

    return null;
}


module.exports = {
    createOTPChallenge,
    verifyOTP,
    consumeVerificationToken
};