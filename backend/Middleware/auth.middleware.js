const userSchema = require("../Validator/user.validator");
const jwt = require("jsonwebtoken");
const env = require("dotenv");
const validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ success: false, errors: error.details });
  }
  next();
};

const verifyUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (decoded.role !== "User") {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền thực hiện chức năng này",
        error: err.message,
      });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: "Token không hợp lệ hoặc đã hết hạn",
      error: err.message,
    });
  }
};

const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (decoded.role !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền thực hiện chức năng này",
        error: err.message,
      });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: "Token không hợp lệ hoặc đã hết hạn",
      error: err.message,
    });
  }
};
const token = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: "Token không hợp lệ hoặc đã hết hạn",
      error: err.message,
    });
  }
};
module.exports = {
  validateUser,
  verifyAdmin,
  token,
  verifyUser,
};
