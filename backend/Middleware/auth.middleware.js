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

const verifyToken = (req, res, next) => {
  // Allow OPTIONS requests to pass through for CORS preflight
  if (req.method === 'OPTIONS') {
    return next();
  }
  
  try {
    // Support both token and authorization headers
    let token = req.headers.token;
    
    if (!token && req.headers.authorization) {
      // Extract token from "Bearer <token>" format
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Token không được cung cấp" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("Token verified:", decoded);
    if (
      !decoded ||
      (decoded.user.role !== "Admin" && decoded.user.role !== "User")
    ) {
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

//CẦN CHÚ Ý CHỖ NÀY
const verifyAdmin = (req, res, next) => {
  // Allow OPTIONS requests to pass through for CORS preflight
  if (req.method === 'OPTIONS') {
    return next();
  }
  
  try {
    // Support both token and authorization headers
    let token = req.headers.token;
    
    if (!token && req.headers.authorization) {
      // Extract token from "Bearer <token>" format
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
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
  // Allow OPTIONS requests to pass through for CORS preflight
  if (req.method === 'OPTIONS') {
    return next();
  }
  
  try {
    const token = req.headers.token;
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