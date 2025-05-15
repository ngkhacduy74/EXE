const express = require("express");
const ChatGpt = require("../Controller/chatgpt.controller");
const router = express.Router();
router.post("/ask", async (req, res) => {
  const result = await ChatGpt(req.body);
  if (result.success === false) {
    return res.status(500).json(result);
  }
  res.status(200).json(result);
});
module.exports = router;
