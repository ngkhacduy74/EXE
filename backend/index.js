const express = require("express");
require("dotenv").config();
const cors = require("cors");
const Router = require("./Router/index");
const app = express();
const configs = require("./Config/index");

const corsOptions = {
  origin: [
    "http://localhost:3000", // Frontend local development
    "https://exe-frontend-ou98.onrender.com" // Production URL
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(express.json());
Router(app);
configs.connect();

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
