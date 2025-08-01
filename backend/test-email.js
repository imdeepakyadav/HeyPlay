const nodemailer = require("nodemailer");
require("dotenv").config();

async function testEmailConfig() {
  console.log("Testing email configuration...");
  console.log("Email Host:", process.env.EMAIL_HOST);
  console.log("Email Port:", process.env.EMAIL_PORT);
  console.log("Email User:", process.env.EMAIL_USER);

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.verify();
    console.log("✅ Email configuration is valid!");

    // Send test email
    const info = await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to yourself for testing
      subject: "HeyPlay Email Test",
      text: "This is a test email from HeyPlay authentication system.",
      html: "<b>This is a test email from HeyPlay authentication system.</b>",
    });

    console.log("✅ Test email sent successfully:", info.messageId);
  } catch (error) {
    console.error("❌ Email configuration error:", error);

    if (error.code === "EAUTH") {
      console.log("🔧 Authentication failed. For Gmail:");
      console.log("1. Enable 2-factor authentication");
      console.log("2. Generate an App Password");
      console.log("3. Use the App Password instead of your regular password");
    }
  }
}

testEmailConfig();
