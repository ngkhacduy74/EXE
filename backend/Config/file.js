const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { cloudinary, configCloudinary } = require("../Config/index");

configCloudinary();

const storageImage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "image_gymshop",
    allowed_formats: ["jpg", "png", "jpeg"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

const uploadImage = multer({
  storage: storageImage,
  limits: { fileSize: 100 * 1024 * 1024 },
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

module.exports = {
  uploadImage,
  uploadVideo,
};
