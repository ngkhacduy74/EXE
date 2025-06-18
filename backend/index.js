const express = require("express");
require("dotenv").config();
const cors = require("cors");
const Router = require("./Router/index");
const app = express();
const configs = require("./Config/index");

const corsOptions = {
  origin: "https://exe-frontend-ou98.onrender.com", // Thay thế bằng URL frontend của bạn trên Render
  methods: ["GET", "POST"], // Thêm phương thức cho phép nếu cần thiết
};

app.use(cors(corsOptions));

app.use(express.json());
Router(app);
configs.connect();

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
