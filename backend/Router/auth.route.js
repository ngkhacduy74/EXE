const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../Middleware/index");
const {
  Login,
  Register,
  getAllUser,
} = require("../Controller/auth.controller");
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

router.get("/getUser", authMiddleware.verifyAdmin, async (req, res) => {
  const result = await getAllUser();
});
module.exports = router;
