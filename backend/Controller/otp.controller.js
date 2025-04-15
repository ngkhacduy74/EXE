const Otps = require("../Model/otp.model");
const randomstring = require("randomstring");
const sendEmail = require("../Config/sendEmail");
function generateOTP() {
  return randomstring.generate({
    length: 6,
    charset: "numeric",
  });
}

async function sendOTP(email) {
  try {
    console.log("object :>> ");
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

async function verifyOTP(req, res) {
  const { email, otp } = req.query;
  try {
    console.log("otp12314asd", req.query);
    const existingOTP = await Otps.findOneAndDelete({ email, otp });

    if (existingOTP) {
      res
        .status(200)
        .json({ success: true, message: "OTP verification successful" });
    } else {
      res.status(400).json({ success: false, error: "Invalid OTP" });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

module.exports = { verifyOTP, sendOTP };
