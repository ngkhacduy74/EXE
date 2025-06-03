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
const verifyAdmin = (req, res, next) => {
  try {
    const token = req.headers.token;
    console.log("lạklsdas", token);
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Token không được cung cấp" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("lấd", decoded);
    // if (decoded.type !== "access") {
    //   return res
    //     .status(403)
    //     .json({ message: "Bạn không có quyền truy cập. Vui lòng login!!!!" });
    // }
    if (!decoded || decoded.user.role !== "Admin") {
      return res.status(403).json({ message: "Bạn không có quyền truy cập" });
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
const verifyUser = (req, res, next) => {
  try {
    const token = req.headers.token;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Token không được cung cấp" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (decoded.type !== "access") {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền truy cập. Vui lòng login!!!!" });
    }
    if (!decoded || decoded.user.role !== "User") {
      return res
        .status(403)
        .json({ message: "Forbidden: Bạn không có quyền truy cập" });
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
};
