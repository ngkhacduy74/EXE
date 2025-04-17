const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../Middleware/index");
const {
  Login,
  Register,
  getUserByEmail,
} = require("../Controller/auth.controller");

router.get("/getUserByEmail", async (req, res) => {
  const result = await getUserByEmail(req.query);
  if (result.success === false) {
    res.status(500).json(result);
  }
  res.status(200).json(result);
});

router.post("/login", async (req, res) => {
  const result = await Login(req.body);
  if (!result) {
    res.status(500).json(result);
  }
  res.status(200).json(result);
});

router.post("/register", authMiddleware.validateUser, async (req, res) => {
  const result = await Register(req.body);
  if (result.success === false) {
    res.status(500).json(result);
  }
  res.status(200).json(result);
});

module.exports = router;
