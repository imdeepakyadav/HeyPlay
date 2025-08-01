require("dotenv").config();
const nodemailer = require("nodemailer");

async function testGmailAuth() {
  console.log("🔧 Testing Gmail Authentication...");
  console.log("📧 Email User:", process.env.EMAIL_USER);
  console.log(
    "📧 Password Length:",
    process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0
  );

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("❌ EMAIL_USER or EMAIL_PASS not configured in .env");
    return;
  }

  if (process.env.EMAIL_PASS.length !== 16) {
    console.warn("⚠️  Gmail App Passwords are typically 16 characters long");
    console.log(
      "🔧 Make sure you're using an App Password, not your regular Gmail password"
    );
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  try {
    console.log("🔄 Verifying connection...");
    await transporter.verify();
    console.log("✅ Gmail authentication successful!");

    // Send a test email
    console.log("📤 Sending test email...");
    const info = await transporter.sendMail({
      from: `"HeyPlay Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to yourself for testing
      subject: "HeyPlay Email Service Test ✅",
      html: `
        <div style="padding: 20px; font-family: Arial, sans-serif;">
          <h2 style="color: #667eea;">🎵 HeyPlay Email Service</h2>
          <p>✅ Your email service is working perfectly!</p>
          <p>📧 From: ${process.env.EMAIL_USER}</p>
          <p>🕒 Time: ${new Date().toLocaleString()}</p>
          <p style="color: #666;">This is a test email to verify your Gmail App Password configuration.</p>
        </div>
      `,
    });

    console.log("✅ Test email sent successfully!");
    console.log("📧 Message ID:", info.messageId);
    console.log("🎉 Email service is fully functional!");
  } catch (error) {
    console.error("❌ Gmail authentication failed:", error.message);

    if (error.code === "EAUTH") {
      console.log("\n🚨 AUTHENTICATION ERROR - Follow these steps:");
      console.log("1. ✅ Go to: https://myaccount.google.com/security");
      console.log("2. ✅ Enable 2-Factor Authentication");
      console.log("3. ✅ Go to 'App passwords' section");
      console.log("4. ✅ Generate password for 'Mail'");
      console.log("5. ✅ Copy the 16-character password");
      console.log("6. ✅ Update EMAIL_PASS in .env with that password");
      console.log("7. ✅ Restart this test");
    }
  }
}

testGmailAuth().catch(console.error);
