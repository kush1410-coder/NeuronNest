const app = require("../backend/src/app");
const connectDB = require("../backend/src/config/db");

// Middleware to ensure DB connection is active before processing any requests
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = app;
