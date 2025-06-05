const express = require("express");
const {
  getAllUser,
  getUserById,
  updateUser,
} = require("../Controller/user.controller");
const { getUserByEmail } = require("../Controller/auth.controller");
const { verifyAdmin, verifyToken } = require("../Middleware/auth.middleware");
const router = express.Router();

router.get("/allUser", verifyAdmin, async (req, res) => {
  const result = await getAllUser();
  if (result.success === false) {
    return res.status(500).json(result);
  }
  res.status(200).json(result);
});
router.get("/getUserByEmail", verifyAdmin, async (req, res) => {
  const result = await getUserByEmail(req.query);
  if (result.success === false) {
    return res.status(500).json(result);
  }
  res.status(200).json(result);
});
router.get("/:id", verifyToken, async (req, res) => {
  const result = await getUserById(req.params.id);
  if (result.success === false) {
    return res.status(500).json(result);
  }
  res.status(200).json(result);
});
router.post("/:id", verifyToken, async (req, res) => {
  const id = req.params.id;
  const data = { id, ...req.body };
  const result = await updateUser(data);
  if (result.success === false) {
    return res.status(500).json(result);
  }
  res.status(200).json(result);
});
module.exports = router;
