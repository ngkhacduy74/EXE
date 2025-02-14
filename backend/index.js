const express = require("express");
require("dotenv").config();
const cors = require("cors"); // Allow frontend requests

const app = express();
const configs = require("../Config/index");

// Middleware
app.use(cors()); // Enable CORS for frontend requests
app.use(express.json()); // Allow JSON requests

// Connect to database or other configurations
configs.connect();

// ✅ Test API Endpoint for React
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend connected successfully!" });
});

// Start the server
const port = process.env.PORT || 5000; // Default to 5000 if not set in .env
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
