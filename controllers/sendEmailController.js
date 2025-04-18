const sendEmail = require("../utils/sendEmail");

exports.sendEmailHandler = async (req, res) => {
  try {
    const { to, subject, message } = req.body;

    if (!to || !subject || !message) {
      return res
        .status(400)
        .json({
          success: false,
          message: "All fields are required (to, subject, message)",
        });
    }

    const result = await sendEmail(to, subject, message);
    console.log("result", result);
    res.status(200).json({ success: true, message: `Email sent to ${to}` });
  } catch (error) {
    console.error("Send Email Error:", error.message);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to send email",
        error: error.message,
      });
  }
};
