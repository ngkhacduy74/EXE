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
const videoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "video",
    resource_type: "video",
    format: ["mp4", "mov", "avi"],
  },
});

const uploadImage = multer({
  storage: storage,
});
const uploadVideo = multer({ storage: videoStorage });
router.post(
  "/upload-file",
  uploadImage.fields([{ name: "img", maxCount: 1 }]),
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
      const videoFile = req.files["video"][0];
      res.json({
        success: true,
        message: "Video uploaded successfully",
        url: videoFile.path,
        public_id: videoFile.filename,
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);
router.post("/upload-video", async () => {});
module.exports = router;
