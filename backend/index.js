const express = require("express");
require("dotenv").config();
const cors = require("cors");
const Router = require("../backend/Router/index");
const app = express();
const configs = require("./Config/index");
app.use(cors({ origin: "https://exe-frontend-ou98.onrender.com" }));
// app.use(cors());
app.use(express.json());
Router(app);
configs.connect();

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
