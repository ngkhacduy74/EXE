const express = require("express");
require("dotenv").config();
const cors = require("cors");
const Router = require("./Router/index");
const app = express();
const configs = require("./Config/index");

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
};

app.use(cors(corsOptions));

app.options("*", cors(corsOptions));

app.use(express.json());

const startServer = () => {
  const port = process.env.PORT || 4000;

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
