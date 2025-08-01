const nodemailer = require("nodemailer");
const crypto = require("crypto");

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: process.env.EMAIL_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  generateOTP() {
    return crypto.randomInt(100000, 999999).toString();
  }

  async sendVerificationEmail(email, username, otp) {
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || "HeyPlay"}" <${
        process.env.EMAIL_FROM_ADDRESS || process.env.EMAIL_USER
      }>`,
      to: email,
      subject: "Verify Your HeyPlay Account",
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">🎵 HeyPlay</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Sync Streaming Together</p>
          </div>
          
          <div style="padding: 30px; background: #f9fafb; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb;">
            <h2 style="color: #1f2937; margin: 0 0 20px 0;">Hi ${username}! 👋</h2>
            
            <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0;">
              Welcome to HeyPlay! To complete your account setup and start streaming with friends, 
              please verify your email address using the OTP below:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <div style="display: inline-block; padding: 20px 30px; background: #667eea; color: white; border-radius: 8px; font-size: 32px; font-weight: bold; letter-spacing: 8px;">
                ${otp}
              </div>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; text-align: center; margin: 20px 0 0 0;">
              This OTP will expire in <strong>10 minutes</strong>. If you didn't create this account, please ignore this email.
            </p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                © 2025 HeyPlay. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Verification email sent to ${email}`);
      return true;
    } catch (error) {
      console.error("Error sending verification email:", error);
      return false;
    }
  }

  async sendPasswordResetEmail(email, username, otp) {
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || "HeyPlay"}" <${
        process.env.EMAIL_FROM_ADDRESS || process.env.EMAIL_USER
      }>`,
      to: email,
      subject: "Reset Your HeyPlay Password",
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">🔒 HeyPlay</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Password Reset Request</p>
          </div>
          
          <div style="padding: 30px; background: #f9fafb; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb;">
            <h2 style="color: #1f2937; margin: 0 0 20px 0;">Hi ${username}! 🔑</h2>
            
            <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0;">
              We received a request to reset your HeyPlay account password. 
              Use the OTP below to reset your password:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <div style="display: inline-block; padding: 20px 30px; background: #f5576c; color: white; border-radius: 8px; font-size: 32px; font-weight: bold; letter-spacing: 8px;">
                ${otp}
              </div>
            </div>
            
            <p style="color: #dc2626; font-size: 14px; text-align: center; margin: 20px 0;">
              ⚠️ This OTP will expire in <strong>15 minutes</strong>. If you didn't request this reset, please ignore this email.
            </p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                © 2025 HeyPlay. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Password reset email sent to ${email}`);
      return true;
    } catch (error) {
      console.error("Error sending password reset email:", error);
      return false;
    }
  }

  async sendWelcomeEmail(email, username) {
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || "HeyPlay"}" <${
        process.env.EMAIL_FROM_ADDRESS || process.env.EMAIL_USER
      }>`,
      to: email,
      subject: "Welcome to HeyPlay! 🎉",
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); color: #1f2937; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">🎉 Welcome to HeyPlay!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Your Account is Now Active</p>
          </div>
          
          <div style="padding: 30px; background: #f9fafb; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb;">
            <h2 style="color: #1f2937; margin: 0 0 20px 0;">Hi ${username}! 🎵</h2>
            
            <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0;">
              Congratulations! Your HeyPlay account has been successfully verified. 
              You can now enjoy synchronized streaming with friends around the world!
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
              <h3 style="color: #1f2937; margin: 0 0 15px 0;">🚀 What you can do now:</h3>
              <ul style="color: #4b5563; margin: 0; padding-left: 20px;">
                <li style="margin-bottom: 8px;">Create and join streaming rooms</li>
                <li style="margin-bottom: 8px;">Share YouTube, Spotify, and SoundCloud content</li>
                <li style="margin-bottom: 8px;">Chat with friends while streaming</li>
                <li style="margin-bottom: 8px;">Enjoy synchronized playback across devices</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${
                process.env.CLIENT_URL || "http://localhost:3000"
              }/dashboard" 
                 style="display: inline-block; padding: 15px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">
                Start Streaming Now 🎵
              </a>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                © 2025 HeyPlay. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Welcome email sent to ${email}`);
      return true;
    } catch (error) {
      console.error("Error sending welcome email:", error);
      return false;
    }
  }
}

module.exports = new EmailService();
