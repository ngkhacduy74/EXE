const userSchema = require("../Validator/user.validator");
const jwt = require("jsonwebtoken");
const env = require("dotenv");
const User = require("../Model/user.model");
const validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ success: false, errors: error.details });
  }
  next();
};

const verifyToken = async (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    let token = req.headers.token;
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Token không được cung cấp" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (
      !decoded ||
      (decoded.user.role !== "Admin" && decoded.user.role !== "User")
    ) {
      return res
        .status(403)
        .json({ message: "Forbidden: Bạn không có quyền truy cập" });
    }
    // Kiểm tra token hiện tại trong DB (tìm theo email)
    const user = await User.findOne({ email: decoded.user.email });
    console.log("tokendsksksk:", user);
    if (!user || user.currentToken !== token) {
      return res.status(401).json({
        message: "Tài khoản đã đăng nhập ở nơi khác hoặc token không hợp lệ",
      });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      message: "Token không hợp lệ hoặc đã hết hạn",
      error: error.message,
    });
  }
};

const verifyAdmin = async (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    let token = req.headers.token;
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Token không được cung cấp" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded || decoded.user.role !== "Admin") {
      return res
        .status(403)
        .json({ message: "Forbidden: Bạn không có quyền truy cập" });
    }
    // Kiểm tra token hiện tại trong DB (tìm theo email)
    const user = await User.findOne({ email: decoded.user.email });
    console.log("verifyAdmin:", user);
    if (!user || user.currentToken !== token) {
      return res.status(401).json({
        message: "Tài khoản đã đăng nhập ở nơi khác hoặc token không hợp lệ",
      });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      message: "Token không hợp lệ hoặc đã hết hạn",
      error: error.message,
    });
  }
};

const verifyUser = async (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    let token = req.headers.token;
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Token không được cung cấp" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded || decoded.user.role !== "User") {
      return res
        .status(403)
        .json({ message: "Forbidden: Bạn không có quyền truy cập" });
    }

    const user = await User.findOne({ email: decoded.user.email });
    console.log("vferrifyUser:", user);
    if (!user || user.currentToken !== token) {
      return res.status(401).json({
        message: "Tài khoản đã đăng nhập ở nơi khác hoặc token không hợp lệ",
      });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      message: "Token không hợp lệ hoặc đã hết hạn",
      error: error.message,
    });
  }
};
module.exports = {
  validateUser,
  verifyAdmin,
  verifyUser,
  verifyToken,
};
