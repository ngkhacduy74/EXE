const express = require("express");
require("dotenv").config();
const cors = require("cors");
const Router = require("./Router/index");
const configs = require("./Config/index");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const cookieParser = require("cookie-parser");

const app = express();

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
    // Kiểm tra xem origin có phải là một trong các allowedOrigins hoặc bắt đầu bằng một trong số đó không
    if (allowedOrigins.some((o) => origin === o || origin.startsWith(o))) {
      callback(null, true);
    } else {
      console.log("🚫 CORS blocked origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "token",
    "authorization",
    "x-access-token",
    "Origin",
    "Accept",
    "X-Requested-With",
  ],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// Cấu hình Rate Limiter: Sử dụng giới hạn cao (10000) cho môi trường Development
// và giới hạn nghiêm ngặt (100) cho môi trường Production
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: process.env.NODE_ENV === "production" ? 100 : 10000, // Thay đổi ở đây
  standardHeaders: true,
  legacyHeaders: false,

  keyGenerator: (req, res) => {
    return req.ip;
  },
  // Thêm handler cho trường hợp bị giới hạn tốc độ
  handler: (req, res, next) => {
    console.warn(
      "Rate Limit exceeded for IP:",
      req.ip,
      "Path:",
      req.originalUrl
    );
    res.status(429).json({
      success: false,
      message: "Too Many Requests. Please try again after a while.",
    });
  },
});
app.use(apiLimiter);

app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());

app.get("/healthz", (req, res) => {
  res.status(200).json({ status: "ok" });
});

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
    if (error.message === "Not allowed by CORS") {
      return res.status(403).json({
        success: false,
        message: "CORS Error: Origin not allowed",
      });
    }

    // Nếu lỗi là do Rate Limiter, handler phía trên sẽ xử lý.
    // Nếu không, trả về lỗi 500
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
    console.log(`Server running on port ${port}`);
  });
};

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
    console.log("MongoDB connected successfully");
    startServer();
  })
  .catch((err) => {
    console.error(" MongoDB connection failed:", err.message);
    process.exit(1);
  });
