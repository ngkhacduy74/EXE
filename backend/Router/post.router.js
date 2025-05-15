const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const postMiddleware = require("../Middleware/index");
const {
  createPost,
  updatePost,
  deletePost,
  changePostCondition,
  getPostByUserId,
  loadAllPost,
} = require("../Controller/post.controller");
const { getUserById } = require("../Controller/user.controller");
const { token } = require("../Middleware/auth.middleware");

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
  const authHeader = req.headers.authorization;

  console.log("akjdaksd", authHeader);
  // const token = jwt.decode(authHeader.split(" ")[1]);
  const decoded = jwt.verify(authHeader, process.env.JWT_SECRET_KEY);
  console.log("lkahsasd", decoded);

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
router.get("/", async (req, res) => {
  const result = await loadAllPost();
  if (result.success === false) {
    return res.status(500).json(result);
  }
  res.status(200).json(result);
});
module.exports = router;
