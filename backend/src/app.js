const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const activityRoutes =require("./routes/activityRoutes");
const emotionRoutes =require("./routes/emotionRoutes");
const analyticsRoutes =require("./routes/analyticsRoutes");
const storyRoutes = require("./routes/storyRoutes");
const recommendationRoutes =require("./routes/recommendationRoutes");
const dashboardRoutes =require("./routes/dashboardRoutes");

// Routes
const authRoutes = require("./routes/authRoutes");
const childRoutes = require("./routes/childRoutes");

const app = express();

// Body Parsers
app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);

// Middlewares
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (e.g., mobile apps, curl, Postman)
        if (!origin) return callback(null, true);
        // Allow any Vercel subdomain or custom domain
        if (allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
            return callback(null, true);
        }
        return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
}));

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

app.use(morgan("dev"));

app.use(compression());

app.use(cookieParser());

// Health Check
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        project: "SahAI",
        message: "SahAI Backend Running"
    });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/children", childRoutes);
app.use("/api/activities",activityRoutes);
app.use("/api/emotions",emotionRoutes);
app.use("/api/analytics",analyticsRoutes);
app.use("/api/story", storyRoutes);
app.use("/api/recommendations",recommendationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/recommendations",require("./routes/recommendation"));
app.use("/api/ai",require("./routes/ai"));
app.use("/api/emotion",require("./routes/emotion"));
// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);

    res.status(500).json({
        success: false,
        message: "Internal Server Error"
    });
});

module.exports = app;
