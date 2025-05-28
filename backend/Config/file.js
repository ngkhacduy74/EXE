const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { configCloudinary, cloudinary } = require("../Config/index");
const multer = require("multer");
configCloudinary();
const storageImage = new CloudinaryStorage({
  cloudinary: cloudinary,
  folder: "image_gymshop",
  allowedFormats: ["jpg", "png", "jpeg"],
  transformation: [{ width: 500, height: 500, crop: "limit" }],
});
const uploadImage = multer({
  storage: storageImage,
});

const storageVideo = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "video",
    resource_type: "video",
  },
});

const uploadVideo = multer({
  storage: storageVideo,
  limits: { fileSize: 50 * 1024 * 1024 },
});

module.exports = { uploadImage, uploadVideo };
