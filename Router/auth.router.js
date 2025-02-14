const express = require("express");
const router = express.Router();
const validate = require("../Validator/index");
router.get("/", async (req, res) => {
  //Redirect về trang home
});
router.post("/register", validate.authValidator, async (req, res) => {
  //xử lý register user
});
router.post("/deactive_user", async (req, res) => {
  // deactive user
});

module.exports = router;
