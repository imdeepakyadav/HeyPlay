const jwt = require("jsonwebtoken");
const { User } = require("../models/Users");

class SessionService {
  constructor() {
    this.accessTokenExpiry = "15m"; // 15 minutes
    this.refreshTokenExpiry = "30d"; // 30 days
    this.maxLoginAttempts = 5;
    this.lockTime = 2 * 60 * 60 * 1000; // 2 hours
  }

  generateTokens(userId) {
    const accessToken = jwt.sign(
      { userId, type: "access" },
      process.env.JWT_SECRET,
      { expiresIn: this.accessTokenExpiry }
    );

    const refreshToken = jwt.sign(
      { userId, type: "refresh" },
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      { expiresIn: this.refreshTokenExpiry }
    );

    return { accessToken, refreshToken };
  }

  async saveRefreshToken(userId, refreshToken) {
    try {
      await User.findByIdAndUpdate(userId, {
        $push: {
          refreshTokens: {
            token: refreshToken,
            createdAt: new Date(),
          },
        },
      });
      return true;
    } catch (error) {
      console.error("Error saving refresh token:", error);
      return false;
    }
  }

  async validateRefreshToken(refreshToken) {
    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
      );

      if (decoded.type !== "refresh") {
        return null;
      }

      const user = await User.findOne({
        _id: decoded.userId,
        "refreshTokens.token": refreshToken,
      });

      return user;
    } catch (error) {
      console.error("Invalid refresh token:", error);
      return null;
    }
  }

  async revokeRefreshToken(userId, refreshToken) {
    try {
      await User.findByIdAndUpdate(userId, {
        $pull: {
          refreshTokens: { token: refreshToken },
        },
      });
      return true;
    } catch (error) {
      console.error("Error revoking refresh token:", error);
      return false;
    }
  }

  async revokeAllRefreshTokens(userId) {
    try {
      await User.findByIdAndUpdate(userId, {
        $set: { refreshTokens: [] },
      });
      return true;
    } catch (error) {
      console.error("Error revoking all refresh tokens:", error);
      return false;
    }
  }

  async updateLastLogin(userId) {
    try {
      await User.findByIdAndUpdate(userId, {
        lastLogin: new Date(),
        $unset: {
          loginAttempts: 1,
          accountLocked: 1,
          lockUntil: 1,
        },
      });
      return true;
    } catch (error) {
      console.error("Error updating last login:", error);
      return false;
    }
  }

  async incrementLoginAttempts(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) return false;

      const updates = { $inc: { loginAttempts: 1 } };

      // Lock account if max attempts reached
      if (user.loginAttempts >= this.maxLoginAttempts - 1) {
        updates.$set = {
          accountLocked: true,
          lockUntil: new Date(Date.now() + this.lockTime),
        };
      }

      await User.findByIdAndUpdate(userId, updates);
      return true;
    } catch (error) {
      console.error("Error incrementing login attempts:", error);
      return false;
    }
  }

  async isAccountLocked(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) return false;

      // Check if account is locked and lock time hasn't expired
      if (user.accountLocked && user.lockUntil && user.lockUntil > new Date()) {
        return true;
      }

      // If lock time has expired, unlock the account
      if (
        user.accountLocked &&
        user.lockUntil &&
        user.lockUntil <= new Date()
      ) {
        await User.findByIdAndUpdate(userId, {
          $unset: {
            accountLocked: 1,
            lockUntil: 1,
            loginAttempts: 1,
          },
        });
        return false;
      }

      return false;
    } catch (error) {
      console.error("Error checking account lock status:", error);
      return false;
    }
  }

  async cleanupExpiredTokens() {
    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      await User.updateMany(
        {},
        {
          $pull: {
            refreshTokens: {
              createdAt: { $lt: thirtyDaysAgo },
            },
          },
        }
      );

      console.log("Expired refresh tokens cleaned up");
      return true;
    } catch (error) {
      console.error("Error cleaning up expired tokens:", error);
      return false;
    }
  }

  getTokenInfo(token) {
    try {
      const decoded = jwt.decode(token);
      return {
        userId: decoded.userId,
        type: decoded.type,
        exp: decoded.exp,
        iat: decoded.iat,
      };
    } catch (error) {
      return null;
    }
  }

  isTokenExpiringSoon(token, thresholdMinutes = 5) {
    try {
      const decoded = jwt.decode(token);
      const now = Math.floor(Date.now() / 1000);
      const threshold = thresholdMinutes * 60;

      return decoded.exp - now <= threshold;
    } catch (error) {
      return true; // Assume expired if we can't decode
    }
  }
}

module.exports = new SessionService();
