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
  getPostById,
  addComment,
  toggleLike,
  toggleFavorite,
} = require("../Controller/post.controller");
const { getUserById } = require("../Controller/user.controller");
const {
  token,
  verifyAdmin,
  verifyToken,
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
router.put(
  "/change-condition/:condition/:id",
  verifyAdmin,
  async (req, res) => {
    try {
      const { condition, id } = req.params;
      const authHeader = req.headers.token;
      if (!authHeader) {
        return res
          .status(401)
          .json({ success: false, message: "No token provided" });
      }

      const decoded = jwt.verify(authHeader, process.env.JWT_SECRET_KEY);

      const result = await changePostCondition(condition, id, decoded);
      if (result.success === false) {
        return res.status(400).json(result);
      }
      res.status(200).json(result);
    } catch (err) {
      console.error("Error in change-condition route:", err);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: err.message,
      });
    }
  }
);
router.post(
  "/createPost",
  postMiddleware.postMiddleware,
  verifyAdmin,
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
router.get("/:id", verifyToken, async (req, res) => {
  const result = await getPostById(req.params.id);
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
router.post("/:id/comment", verifyToken, async (req, res) => {
  const user = req.user.id;
  const content = req.body.content;
  const result = await addComment(req.params.id, user, content);
  if (!result.success) return res.status(400).json(result);
  res.status(200).json(result);
});
router.post("/:id/like", verifyToken, async (req, res) => {
  const user = req.user.id;
  const result = await toggleLike(req.params.id, user);
  if (!result.success) return res.status(400).json(result);
  res.status(200).json(result);
});
router.post("/:id/favorite", verifyToken, async (req, res) => {
  const user = req.user.id;
  const result = await toggleFavorite(req.params.id, user);
  if (!result.success) return res.status(400).json(result);
  res.status(200).json(result);
});
module.exports = router;
