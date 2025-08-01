const jwt = require("jsonwebtoken");
const { User } = require("../models/Users");
const sessionService = require("../services/sessionService");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({
        message: "Access denied. No token provided.",
        code: "NO_TOKEN",
      });
    }

    // Remove 'Bearer ' prefix if present
    const cleanToken = token.startsWith("Bearer ") ? token.slice(7) : token;

    const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET);

    // Check if it's an access token
    if (decoded.type && decoded.type !== "access") {
      return res.status(401).json({
        message: "Invalid token type.",
        code: "INVALID_TOKEN_TYPE",
      });
    }

    const user = await User.findById(decoded.userId).select(
      "-password -refreshTokens"
    );

    if (!user) {
      return res.status(401).json({
        message: "Invalid token. User not found.",
        code: "USER_NOT_FOUND",
      });
    }

    // Check if user's email is verified
    if (!user.isEmailVerified) {
      return res.status(401).json({
        message: "Please verify your email address first.",
        code: "EMAIL_NOT_VERIFIED",
      });
    }

    // Check if account is locked
    const isLocked = await sessionService.isAccountLocked(user._id);
    if (isLocked) {
      return res.status(423).json({
        message:
          "Account is temporarily locked due to multiple failed login attempts.",
        code: "ACCOUNT_LOCKED",
      });
    }

    req.user = user;
    req.token = cleanToken;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token has expired.",
        code: "TOKEN_EXPIRED",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid token.",
        code: "INVALID_TOKEN",
      });
    }

    res.status(401).json({
      message: "Authentication failed.",
      code: "AUTH_FAILED",
    });
  }
};

module.exports = auth;
