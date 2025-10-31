const client = require("../connectRedis.js");

async function storeOtp(email, otp) {
    try {
        // Key: email, Value: otp, Expire in 600 seconds (10 minutes)
        await client.set(email, otp, {
            EX: 600 // expiration in seconds
        });
    } catch (err) {
        console.error("Error storing OTP:", err);
    }
}

async function getOtp(email) {
    try {
        const storedOtp = await client.get(email);
        return storedOtp; // null if expired or not found
    } catch (err) {
        console.error("Error getting OTP:", err);
    }
}

module.exports={
  storeOtp,
  getOtp
}