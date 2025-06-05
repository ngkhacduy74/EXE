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
const {
  token,
  verifyAdmin,
  verifyUser,
} = require("../Middleware/auth.middleware");

router.get("/user-post", verifyUser, async (req, res) => {
  const result = await getPostByUserId(req.user.id);
  if (result.success === false) {
    return res.status(500).json(result);
  }
  res.status(200).json(result);
});
//verify admin
router.get(
  "/change-condition/:condition/:id",
  verifyAdmin,
  async (req, res) => {
    const { condition, id } = req.params;
    const authHeader = req.headers.token;
    const decoded = jwt.verify(authHeader, process.env.JWT_SECRET_KEY);
    console.log("jhs", decoded);
    const result = await changePostCondition(condition, id, decoded);
    if (result.success === false) {
      return res.status(500).json(result);
    }
    res.status(200).json(result);
  }
);
router.post(
  "/createPost",
  verifyUser,
  postMiddleware.postMiddleware,
  async (req, res) => {
    const authHeader = req.headers.token;

    const decoded = jwt.verify(authHeader, process.env.JWT_SECRET_KEY);

    const result = await createPost(req.body, decoded);
    if (result.success === false) {
      return res.status(500).json(result);
    }
    res.status(200).json(result);
  }
);

router.put("/update-post/:id", verifyUser, async (req, res) => {
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
router.delete("/deletePost/:id", verifyUser, async (req, res) => {
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
