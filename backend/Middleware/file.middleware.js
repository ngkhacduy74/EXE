const { uploadImage, uploadVideo } = require("../Config/file");
const uploadImageMiddleware = uploadImage.fields([
  { name: "img", maxCount: 3 },
]);
const uploadVideoMiddleware = uploadVideo.fields([
  { name: "video", maxCount: 1 },
]);
const uploadAvatarMiddleware = uploadImage.fields([
  { name: "ava_img_url", maxCount: 1 },
]);

module.exports = { uploadImageMiddleware, uploadVideoMiddleware, uploadAvatarMiddleware };
