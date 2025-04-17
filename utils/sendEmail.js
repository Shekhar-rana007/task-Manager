const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail", // or use Ethereal for dev
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASS, // App password or email password
      },
    });

    const mailOptions = {
      from: `"Task Manager" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
    console.log(`📩 Email sent to ${to}`);
  } catch (err) {
    console.error("❌ Email send failed:", err.message);
  }
};

module.exports = sendEmail;
