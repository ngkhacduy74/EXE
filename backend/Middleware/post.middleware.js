const postSchema = require("../Validator/post.validator");
const validatePost = (req, res, next) => {
  const { error } = postSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ success: false, errors: error.details });
  }
  next();
};
module.exports = validatePost;
