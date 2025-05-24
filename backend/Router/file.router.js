const express = require("express");
const router = express.Router();

const {
  uploadVideoMiddleware,
  uploadImageMiddleware,
} = require("../Middleware/file.middleware");

router.post("/upload-image", uploadImageMiddleware, async (req, res) => {
  const link_img = req.files?.img || [];
  res.send(link_img);
});

router.post("/upload-video", uploadVideoMiddleware, async (req, res) => {
  try {
    if (!req.files || !req.files["video"]) {
      return res.status(400).send({ message: "No video file uploaded" });
    }
    const link_video = req.files["video"][0];
    res.send(link_video);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Upload failed",
      error: error.message || error.toString(),
    });
  }
});

module.exports = router;
