const express = require("express");
const router = express.Router();
const userController = require("../Controller/auth/user.controller");
router.get("/login", async (req, res) => {
  res.render("LogAndRegis");
});
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const result = await userController.Login(username, password);
  if (result === false) {
    res.render("/auth/login", { Notif: "Đăng nhập thất bại" });
  } else {
    console.log("Đăng nhập thành công");
  }
});
router.post("/create-user", async (req, res) => {
  const result = await userController.createUser(req.body);

  res.redirect("/auth/login");
});
router.post("/update-user", async (req, res) => {
  const result = await updateUser(req.body);
  if (result) {
    res.redirect("updateUsser"); //chỉnh lại đường dẫn đến file update
  }
});

module.exports = router;
