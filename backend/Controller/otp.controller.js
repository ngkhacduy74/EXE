const Otps = require("../Model/otp.model");
const randomstring = require("randomstring");
const sendEmail = require("../Config/sendEmail");
const { v1 } = require("uuid");
function generateOTP() {
  return randomstring.generate({
    length: 6,
    charset: "numeric",
  });
}

async function sendOTP(email) {
  try {
    const otp = generateOTP();
    const newOTP = new Otps({ email, otp });
    await newOTP.save();
    await sendEmail({
      to: email,
      subject: "Your OTP",
      message: `<p>Your OTP is: <strong>${otp}</strong></p>`,
    });

    return true;
  } catch (error) {
    console.error("Error sending OTP:", error);
    return false;
  }
}

const jwt = require("jsonwebtoken");
const User = require("../Model/user.model");

async function verifyOTP(req, res) {
  const { email, otp } = req.query;
  try {
    const existingOTP = await Otps.findOneAndDelete({ email, otp });
    if (!existingOTP) {
      return res
        .status(400)
        .json({ success: false, error: "OTP không hợp lệ" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, error: "Không tìm thấy người dùng" });
    }
    await User.findByIdAndUpdate(user._id, {
      lastLoginAt: new Date(),
      lastActivityAt: new Date(),
    });
    const token = jwt.sign(
      {
        user: { _id: user._id, role: user.role, email: user.email },
        type: "access",
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "30d" }
    );
    // Ghi đè currentToken, đảm bảo chỉ 1 nơi đăng nhập
    await User.findByIdAndUpdate(user._id, { currentToken: token });
    const refresh_token = jwt.sign(
      {
        user: { _id: user._id, role: user.role, email: user.email },
        type: "refresh",
      },
      process.env.REFRESH_TOKEN,
      { expiresIn: "30d" }
    );
    return res.status(200).json({
      success: true,
      message: "Xác minh OTP thành công",
      token,
      refresh_token: refresh_token,
    });
  } catch (error) {
    console.error("Lỗi xác minh OTP:", error);
    return res.status(500).json({ success: false, error: "Lỗi máy chủ" });
  }
}

module.exports = { verifyOTP, sendOTP };
