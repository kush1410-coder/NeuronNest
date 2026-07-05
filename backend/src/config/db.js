const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
    if (isConnected || mongoose.connection.readyState >= 1) {
        return;
    }
    try {
        const uri = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/sahai";
        await mongoose.connect(uri);
        isConnected = true;
        console.log("MongoDB Connected");
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        throw error;
    }
};

module.exports = connectDB;