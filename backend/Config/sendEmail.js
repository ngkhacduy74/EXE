const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
  const host = process.env.SMPT_HOST;
  const user = process.env.SMPT_MAIL;
  const pass = process.env.SMPT_APP_PASS;
  const port = process.env.SMPT_PORT ? parseInt(process.env.SMPT_PORT, 10) : undefined;

  if (!host || !user || !pass || !port) {
    const missing = [];
    if (!host) missing.push("SMPT_HOST");
    if (!user) missing.push("SMPT_MAIL");
    if (!pass) missing.push("SMPT_APP_PASS");
    if (!port) missing.push("SMPT_PORT");
    throw new Error(`Missing SMTP config: ${missing.join(", ")}`);
  }

  const secure = port === 465; // port 465 uses SSL

  const transporter = nodeMailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });

  const mailOptions = {
    from: user,
    to: options.to,
    subject: options.subject,
    html: options.message,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    return info;
  } catch (err) {
    console.error("Error sending OTP:", err && err.message ? err.message : err);
    throw err;
  }
};

module.exports = sendEmail;
