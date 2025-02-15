const express = require("express");
require("dotenv").config();
const cors = require("cors"); // Allow frontend requests

const app = express();
const configs = require("./Config/index");

// Middleware
app.use(cors()); // Enable CORS for frontend requests
app.use(express.json()); // Allow JSON requests

// Connect to database or other configurations
configs.connect();

// ✅ Test API Endpoint for React
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend connected successfully!" });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
