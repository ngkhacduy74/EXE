const express = require("express");
require("dotenv").config();
const app = express();
const configs = require("./Config/index");
const port = process.env.PORT;
configs.connect();
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
