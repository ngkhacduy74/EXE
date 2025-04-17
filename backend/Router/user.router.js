const express = require("express");
const { getAllUser, getUserById } = require("../Controller/user.controller");
const router = express.Router();
router.get("/:id", async (req, res) => {
  const result = await getUserById(req.params.id);
  if (result.success === false) {
    res.status(500).json(result);
  }
  res.status(200).json(result);
});
router.get("/allUser", async (req, res) => {
  const result = await getAllUser();
  if (result.success === false) {
    res.status(500).json(result);
  }
  res.status(200).json(result);
});

module.exports = router;
