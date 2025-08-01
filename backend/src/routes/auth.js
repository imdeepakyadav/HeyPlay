// backend/src/routes/auth.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User } = require("../models/Users");
const auth = require("../middleware/auth");
const emailService = require("../services/emailService");
const sessionService = require("../services/sessionService");

// Register
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
        code: "MISSING_FIELDS",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
        code: "WEAK_PASSWORD",
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Please provide a valid email address",
        code: "INVALID_EMAIL",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({
          message: "Email already registered",
          code: "EMAIL_EXISTS",
        });
      } else {
        return res.status(400).json({
          message: "Username already taken",
          code: "USERNAME_EXISTS",
        });
      }
    }

    // Generate OTP
    const otp = emailService.generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const user = new User({
      username,
      email,
      password,
      emailVerificationOTP: otp,
      emailVerificationExpires: otpExpires,
    });

    await user.save();

    // Send verification email
    const emailSent = await emailService.sendVerificationEmail(
      email,
      username,
      otp
    );

    if (!emailSent) {
      // Clean up user if email fails
      await User.findByIdAndDelete(user._id);
      return res.status(500).json({
        message: "Failed to send verification email. Please try again.",
        code: "EMAIL_SEND_FAILED",
      });
    }

    res.status(201).json({
      message:
        "Registration successful. Please check your email for verification OTP.",
      userId: user._id,
      email: user.email,
      requiresVerification: true,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      message: "Error creating user",
      code: "REGISTRATION_FAILED",
    });
  }
});

// Verify Email OTP
router.post("/verify-email", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
        code: "MISSING_FIELDS",
      });
    }

    const user = await User.findOne({
      email,
      emailVerificationOTP: otp,
      emailVerificationExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
        code: "INVALID_OTP",
      });
    }

    // Mark email as verified
    user.isEmailVerified = true;
    user.emailVerificationOTP = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    // Generate tokens
    const { accessToken, refreshToken } = sessionService.generateTokens(
      user._id
    );
    await sessionService.saveRefreshToken(user._id, refreshToken);
    await sessionService.updateLastLogin(user._id);

    // Send welcome email
    await emailService.sendWelcomeEmail(user.email, user.username);

    res.json({
      message: "Email verified successfully",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({
      message: "Error verifying email",
      code: "VERIFICATION_FAILED",
    });
  }
});

// Resend Verification OTP
router.post("/resend-verification", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
        code: "MISSING_EMAIL",
      });
    }

    const user = await User.findOne({ email, isEmailVerified: false });

    if (!user) {
      return res.status(400).json({
        message: "User not found or already verified",
        code: "USER_NOT_FOUND",
      });
    }

    // Generate new OTP
    const otp = emailService.generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.emailVerificationOTP = otp;
    user.emailVerificationExpires = otpExpires;
    await user.save();

    // Send verification email
    const emailSent = await emailService.sendVerificationEmail(
      email,
      user.username,
      otp
    );

    if (!emailSent) {
      return res.status(500).json({
        message: "Failed to send verification email",
        code: "EMAIL_SEND_FAILED",
      });
    }

    res.json({
      message: "Verification OTP sent successfully",
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    res.status(500).json({
      message: "Error resending verification",
      code: "RESEND_FAILED",
    });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
        code: "MISSING_FIELDS",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
        code: "INVALID_CREDENTIALS",
      });
    }

    // Check if account is locked
    const isLocked = await sessionService.isAccountLocked(user._id);
    if (isLocked) {
      return res.status(423).json({
        message:
          "Account is temporarily locked due to multiple failed login attempts. Please try again later.",
        code: "ACCOUNT_LOCKED",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Increment login attempts
      await sessionService.incrementLoginAttempts(user._id);
      return res.status(400).json({
        message: "Invalid credentials",
        code: "INVALID_CREDENTIALS",
      });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(401).json({
        message: "Please verify your email address first",
        code: "EMAIL_NOT_VERIFIED",
        email: user.email,
      });
    }

    // Generate tokens
    const { accessToken, refreshToken } = sessionService.generateTokens(
      user._id
    );
    await sessionService.saveRefreshToken(user._id, refreshToken);
    await sessionService.updateLastLogin(user._id);

    res.json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        isEmailVerified: user.isEmailVerified,
        lastLogin: new Date(),
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Error logging in",
      code: "LOGIN_FAILED",
    });
  }
});

// Refresh Token
router.post("/refresh-token", async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token is required",
        code: "MISSING_REFRESH_TOKEN",
      });
    }

    const user = await sessionService.validateRefreshToken(refreshToken);
    if (!user) {
      return res.status(401).json({
        message: "Invalid refresh token",
        code: "INVALID_REFRESH_TOKEN",
      });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(401).json({
        message: "Email verification required",
        code: "EMAIL_NOT_VERIFIED",
      });
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } =
      sessionService.generateTokens(user._id);

    // Revoke old refresh token and save new one
    await sessionService.revokeRefreshToken(user._id, refreshToken);
    await sessionService.saveRefreshToken(user._id, newRefreshToken);

    res.json({
      accessToken,
      refreshToken: newRefreshToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    console.error("Token refresh error:", error);
    res.status(500).json({
      message: "Error refreshing token",
      code: "REFRESH_FAILED",
    });
  }
});

// Logout
router.post("/logout", auth, async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      await sessionService.revokeRefreshToken(req.user._id, refreshToken);
    }

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      message: "Error logging out",
      code: "LOGOUT_FAILED",
    });
  }
});

// Logout from all devices
router.post("/logout-all", auth, async (req, res) => {
  try {
    await sessionService.revokeAllRefreshTokens(req.user._id);
    res.json({ message: "Logged out from all devices successfully" });
  } catch (error) {
    console.error("Logout all error:", error);
    res.status(500).json({
      message: "Error logging out from all devices",
      code: "LOGOUT_ALL_FAILED",
    });
  }
});

// Forgot Password
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
        code: "MISSING_EMAIL",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if email exists or not
      return res.json({
        message:
          "If an account with that email exists, we've sent a password reset OTP.",
      });
    }

    // Generate OTP
    const otp = emailService.generateOTP();
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    user.passwordResetOTP = otp;
    user.passwordResetExpires = otpExpires;
    await user.save();

    // Send password reset email
    const emailSent = await emailService.sendPasswordResetEmail(
      email,
      user.username,
      otp
    );

    if (!emailSent) {
      return res.status(500).json({
        message: "Failed to send password reset email",
        code: "EMAIL_SEND_FAILED",
      });
    }

    res.json({
      message:
        "If an account with that email exists, we've sent a password reset OTP.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      message: "Error processing password reset request",
      code: "FORGOT_PASSWORD_FAILED",
    });
  }
});

// Reset Password
router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        message: "Email, OTP, and new password are required",
        code: "MISSING_FIELDS",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters",
        code: "WEAK_PASSWORD",
      });
    }

    const user = await User.findOne({
      email,
      passwordResetOTP: otp,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
        code: "INVALID_OTP",
      });
    }

    // Update password
    user.password = newPassword;
    user.passwordResetOTP = undefined;
    user.passwordResetExpires = undefined;

    // Reset login attempts and unlock account
    user.loginAttempts = 0;
    user.accountLocked = false;
    user.lockUntil = undefined;

    await user.save();

    // Revoke all existing refresh tokens for security
    await sessionService.revokeAllRefreshTokens(user._id);

    res.json({
      message:
        "Password reset successfully. Please login with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      message: "Error resetting password",
      code: "RESET_PASSWORD_FAILED",
    });
  }
});

// Get current user
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "-password -refreshTokens -emailVerificationOTP -passwordResetOTP"
    );
    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        isEmailVerified: user.isEmailVerified,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      message: "Error fetching user",
      code: "FETCH_USER_FAILED",
    });
  }
});

// Update profile
router.put("/profile", auth, async (req, res) => {
  try {
    const { username, profilePicture } = req.body;
    const updates = {};

    if (username) {
      // Check if username is already taken
      const existingUser = await User.findOne({
        username,
        _id: { $ne: req.user._id },
      });
      if (existingUser) {
        return res.status(400).json({
          message: "Username already taken",
          code: "USERNAME_TAKEN",
        });
      }
      updates.username = username;
    }

    if (profilePicture !== undefined) {
      updates.profilePicture = profilePicture;
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
    }).select(
      "-password -refreshTokens -emailVerificationOTP -passwordResetOTP"
    );

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({
      message: "Error updating profile",
      code: "PROFILE_UPDATE_FAILED",
    });
  }
});

// Change password
router.put("/change-password", auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current and new passwords are required",
        code: "MISSING_FIELDS",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters",
        code: "WEAK_PASSWORD",
      });
    }

    const user = await User.findById(req.user._id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect",
        code: "INVALID_CURRENT_PASSWORD",
      });
    }

    user.password = newPassword;
    await user.save();

    // Revoke all refresh tokens except current session for security
    await sessionService.revokeAllRefreshTokens(user._id);

    res.json({
      message:
        "Password changed successfully. Please login again on other devices.",
    });
  } catch (error) {
    console.error("Password change error:", error);
    res.status(500).json({
      message: "Error changing password",
      code: "PASSWORD_CHANGE_FAILED",
    });
  }
});

// Get session info
router.get("/session-info", auth, async (req, res) => {
  try {
    const tokenInfo = sessionService.getTokenInfo(req.token);
    const isExpiringSoon = sessionService.isTokenExpiringSoon(req.token);

    res.json({
      tokenInfo: {
        userId: tokenInfo.userId,
        issuedAt: new Date(tokenInfo.iat * 1000),
        expiresAt: new Date(tokenInfo.exp * 1000),
      },
      isExpiringSoon,
      user: {
        lastLogin: req.user.lastLogin,
        isEmailVerified: req.user.isEmailVerified,
      },
    });
  } catch (error) {
    console.error("Session info error:", error);
    res.status(500).json({
      message: "Error fetching session info",
      code: "SESSION_INFO_FAILED",
    });
  }
});

// Admin route to cleanup expired tokens (can be called by cron job)
router.post("/cleanup-tokens", async (req, res) => {
  try {
    // Simple API key check for admin routes
    const apiKey = req.header("X-Admin-Key");
    if (apiKey !== process.env.ADMIN_API_KEY) {
      return res.status(403).json({ message: "Access denied" });
    }

    await sessionService.cleanupExpiredTokens();
    res.json({ message: "Token cleanup completed" });
  } catch (error) {
    console.error("Token cleanup error:", error);
    res.status(500).json({
      message: "Error cleaning up tokens",
      code: "CLEANUP_FAILED",
    });
  }
});

module.exports = router;
