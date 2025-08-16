const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  try {
    // const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const mailOptions = {
      from: `"Task Manager" <${testAccount.user}>`,
      to,
      subject,
      text,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(`Email sent to ${to}`);
    console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);

    return {
      previewURL: nodemailer.getTestMessageUrl(info),
      info,
    };
  } catch (err) {
    console.error("Email not sent:", err.message);
    throw err; 
  }
};

module.exports = sendEmail;
