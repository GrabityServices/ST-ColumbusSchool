const mongoose = require("mongoose");

const marksheetDB = mongoose.createConnection(
    process.env.MARKSHEET_DB
);

const connectDB = async () => {
    try {
        // Main database
        await mongoose.connect(process.env.DB);

        console.log("Main MongoDB connected successfully");

        // Marksheet database
        await marksheetDB.asPromise();

        console.log("Marksheet MongoDB connected successfully");

    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        process.exit(1);
    }
};

module.exports = {
    connectDB,
    marksheetDB
};