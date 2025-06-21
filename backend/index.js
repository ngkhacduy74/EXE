const express = require("express");
require("dotenv").config();
const cors = require("cors");
const Router = require("./Router/index");
const app = express();
const configs = require("./Config/index");

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://exe-frontend-ou98.onrender.com",
    "https://vinsaky.com",
    "https://www.vinsaky.com",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json());

// Function to start the server
const startServer = () => {
  const port = process.env.PORT || 4000;
  
  // Register API routes
  Router(app);

  // 404 handler for API routes
  app.use('/api/*', (req, res) => {
    res.status(404).json({
      success: false,
      message: 'API endpoint not found',
      path: req.originalUrl
    });
  });

  // General 404 handler
  app.use('*', (req, res) => {
    res.status(404).json({
      success: false,
      message: 'Route not found',
      path: req.originalUrl
    });
  });

  // Error handling middleware
  app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  });

  app.listen(port, () => {
    console.log(`✅ Server running on port ${port}`);
  });
};

// Connect to DB and then start the server
configs.connect()
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    startServer();
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1); // Exit process with failure
  });
