const express = require("express");
require("dotenv").config();
const cors = require("cors");
const Router = require("./Router/index");
const app = express();
const configs = require("./Config/index");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const cookieParser = require("cookie-parser");

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:4000",
  "https://exe-frontend-ou98.onrender.com",
  "https://vinsaky.com",
  "https://www.vinsaky.com",
  "https://exe-08k7.onrender.com",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.some((o) => origin.startsWith(o))) {
      callback(null, true);
    } else {
      console.log("🚫 CORS blocked origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  preflightContinue: false,
  allowedHeaders: [
    "Content-Type",
    "token",
    "authorization",
    "x-access-token",
    "Origin",
    "Accept",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
};

// Security middlewares
app.use(helmet());
// Basic rate limiter to protect auth endpoints and reduce brute-force risk
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(apiLimiter);
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());

// Health endpoint
app.get("/healthz", (req, res) => {
  res.status(200).json({ status: "ok" });
});

const startServer = () => {
  const port = process.env.PORT || 4000;
  // app.use(Router);
  Router(app);

  app.use("/api/*", (req, res) => {
    res.status(404).json({
      success: false,
      message: "API endpoint not found",
      path: req.originalUrl,
    });
  });

  app.use("*", (req, res) => {
    res.status(404).json({
      success: false,
      message: "Route not found",
      path: req.originalUrl,
    });
  });

  app.use((error, req, res, next) => {
    console.error("Server error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Something went wrong",
    });
  });

  app.listen(port, () => {
    console.log(`✅ Server running on port ${port}`);
  });
};

  // handle unhandled errors globally
  process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
  });

  process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
    process.exit(1);
  });

configs
  .connect()
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    startServer();
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });
