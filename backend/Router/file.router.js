const express = require("express");
const router = express.Router();

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { cloudinary, configCloudinary } = require("../Config/index");
const { uploadVideoMiddleware } = require("../Middleware/file.middleware");
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
router.post("/upload-image", upload.array("img", 10), (req, res) => {
  const urls = req.files.map((f) => f.path);
  return res.json({ urls });
});

router.post("/upload-video", uploadVideoMiddleware, (req, res) => {
  res.json({ files: req.files });
});
module.exports = router;
