const mongoose = require("mongoose");

const OtpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    otp: { type: String, required: true },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

// Create a Mongoose model
const Otps = mongoose.model("Otps", OtpSchema);

module.exports = Otps;
