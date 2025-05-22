const express = require("express");
const router = express.Router();
// const configs = require("./Config/index");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { cloudinary, configCloudinary } = require("../Config/index");
configCloudinary();
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  folder: "image_gymshop",
  allowedFormats: ["jpg", "png", "jpeg"],
  transformation: [{ width: 500, height: 500, crop: "limit" }],
});
const upload = multer({
  storage: storage,
});

const storageVideo = new CloudinaryStorage({
  cloudinary: cloudinary,
  folder: "video",
  allowedFormats: ["mp4", "mov", "avi", "mkv", "wmv"],
});

const uploadVideo = multer({
  storage: storageVideo,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB, bạn điều chỉnh theo nhu cầu
});

router.post(
  "/upload-image",
  upload.fields([{ name: "img", maxCount: 1 }]),
  async (req, res) => {
    const link_img = req.files["img"][0];
    res.send(link_img);
  }
);

router.post(
  "/upload-video",
  uploadVideo.fields([{ name: "video", maxCount: 1 }]),
  async (req, res) => {
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
  }
);

module.exports = router;
