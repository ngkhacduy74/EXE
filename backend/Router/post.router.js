const express = require("express");
const router = express.Router();
const postMiddleware = require("../Middleware/index");
const {
  createPost,
  updatePost,
  deletePost,
  changePostCondition,
  getPostByUserId,
} = require("../Controller/post.controller");
const { getUserById } = require("../Controller/user.controller");

router.get("/user-post", async (req, res) => {
  const result = await getPostByUserId(req.user.id);
  if (result.success === false) {
    return res.status(500).json(result);
  }
  res.status(200).json(result);
});
//verify admin
router.post("/change-condition/:condition/:id", async (req, res) => {
  const { condition, id } = req.params;
  const result = await changePostCondition(condition, id);
  if (result.success === false) {
    return res.status(500).json(result);
  }
  res.status(200).json(result);
});
router.post("/createPost", postMiddleware.postMiddleware, async (req, res) => {
  const seller = await getUserById(req.user.id);
  const result = await createPost(req.body);
  if (result.success === false) {
    return res.status(500).json(result);
  }
  res.status(200).json(result);
});

router.put("/update-post/:id", async (req, res) => {
  const id = req.params.id;
  const userId = req.user.id;
  const seller = await getUserById(userId);
  const {
    category,
    image,
    video,
    status,
    title,
    user_position,
    address,
    description,
    condition,
  } = req.body;
  const result = await updatePost({
    id,
    category,
    image,
    video,
    status,
    title,
    user_position,
    address,
    description,
    seller,
    condition,
  });
  if (result.success === false) {
    return res.status(500).json(result);
  }
  res.status(200).json(result);
});
router.delete("/deletePost/:id", async (req, res) => {
  const result = await deletePost(req.params.id);
  if (result.success === false) {
    return res.status(500).json(result);
  }
  res.status(200).json(result);
});
module.exports = router;
