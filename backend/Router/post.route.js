const express = require("express");
const router = express.Router();
const postMiddleware = require("../Middleware/index");

router.post("/createPost", postMiddleware.postMiddleware, async (req, res) => {
  const result = await createPost(req.body);
  if (result.success === false) {
    res.status(500).json(result);
  }
  res.status(200).json(result);
});
module.exports = router;
