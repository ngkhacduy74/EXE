const { uploadImage, uploadVideo } = require("../Config/file");
const uploadImageMiddleware = uploadImage.fields([
  { name: "img", maxCount: 3 },
]);
const uploadVideoMiddleware = uploadVideo.fields([
  { name: "video", maxCount: 1 },
]);

module.exports = { uploadImageMiddleware, uploadVideoMiddleware };
