const express = require("express");
const {
  getAllUser,
  getUserById,
  updateUser,
} = require("../Controller/user.controller");
const { getUserByEmail } = require("../Controller/auth.controller");
const router = express.Router();

router.get("/allUser", async (req, res) => {
  const { skip = 0, limit = 10 } = req.query;
  const result = await getAllUser({ skip, limit });
  if (result.success === false) {
    return res.status(500).json(result);
  }
  res.status(200).json(result);
});
router.get("/getUserByEmail", async (req, res) => {
  const result = await getUserByEmail(req.query);
  if (result.success === false) {
    return res.status(500).json(result);
  }
  res.status(200).json(result);
});
router.get("/:id", async (req, res) => {
  const result = await getUserById(req.params.id);
  if (result.success === false) {
    return res.status(500).json(result);
  }
  res.status(200).json(result);
});
router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const data = { id, ...req.body };
  const result = await updateUser(data);
  if (result.success === false) {
    return res.status(500).json(result);
  }
  res.status(200).json(result);
});
router.post("/:id", async (req, res) => {
  const id = req.params.id;
  const data = { id, ...req.body };
  const result = await updateUser(data);
  if (result.success === false) {
    return res.status(500).json(result);
  }
  res.status(200).json(result);
});
module.exports = router;
