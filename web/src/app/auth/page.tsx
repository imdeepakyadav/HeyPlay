"use client";

import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

// Import using relative path to avoid alias issues
import authService from "../../lib/authService";

type AuthMode = "login" | "register" | "verify" | "forgot" | "reset";

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlMode = searchParams.get("mode") as AuthMode;

  const [mode, setMode] = useState<AuthMode>(urlMode || "login");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
    newPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleRegister = async () => {
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await authService.register(
        formData.username,
        formData.email,
        formData.password
      );

      if (response.success) {
        toast.success(
          "Registration successful! Please check your email for verification OTP."
        );
        setMode("verify");
        startCountdown();
      } else {
        toast.error(response.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleLogin = async () => {
    try {
      const response = await authService.login(
        formData.email,
        formData.password
      );

      if (response.success) {
        toast.success("Welcome back!");
        router.push("/dashboard");
      } else {
        if (response.code === "EMAIL_NOT_VERIFIED") {
          toast.error("Please verify your email first");
          setMode("verify");
        } else if (response.code === "ACCOUNT_LOCKED") {
          toast.error(response.message);
        } else {
          toast.error(response.message || "Login failed");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleVerifyEmail = async () => {
    try {
      const response = await authService.verifyEmail(
        formData.email,
        formData.otp
      );

      if (response.success) {
        toast.success("Email verified successfully! Welcome to HeyPlay!");
        router.push("/dashboard");
      } else {
        toast.error(response.message || "Verification failed");
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleResendOTP = async () => {
    try {
      const response = await authService.resendVerification(formData.email);

      if (response.success) {
        toast.success("Verification OTP sent!");
        startCountdown();
      } else {
        toast.error(response.message || "Failed to resend OTP");
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleForgotPassword = async () => {
    try {
      const response = await authService.forgotPassword(formData.email);

      if (response.success) {
        toast.success("Password reset OTP sent to your email!");
        setMode("reset");
        startCountdown();
      } else {
        toast.error(response.message || "Failed to send reset email");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleResetPassword = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await authService.resetPassword(
        formData.email,
        formData.otp,
        formData.newPassword
      );

      if (response.success) {
        toast.success(
          "Password reset successful! Please login with your new password."
        );
        setMode("login");
        setFormData({
          ...formData,
          password: "",
          newPassword: "",
          confirmPassword: "",
          otp: "",
        });
      } else {
        toast.error(response.message || "Password reset failed");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      switch (mode) {
        case "register":
          await handleRegister();
          break;
        case "login":
          await handleLogin();
          break;
        case "verify":
          await handleVerifyEmail();
          break;
        case "forgot":
          await handleForgotPassword();
          break;
        case "reset":
          await handleResetPassword();
          break;
      }
    } catch (error) {
      console.error("Auth error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case "register":
        return "Create Account";
      case "login":
        return "Welcome Back";
      case "verify":
        return "Verify Email";
      case "forgot":
        return "Reset Password";
      case "reset":
        return "Set New Password";
      default:
        return "Welcome Back";
    }
  };

  const getSubtitle = () => {
    switch (mode) {
      case "register":
        return "Join the community and start listening together";
      case "login":
        return "Sign in to access your rooms and playlists";
      case "verify":
        return "Enter the OTP sent to your email address";
      case "forgot":
        return "Enter your email to receive a reset code";
      case "reset":
        return "Enter the OTP and your new password";
      default:
        return "Sign in to access your rooms and playlists";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-indigo-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-900/80 backdrop-blur-xl rounded-3xl p-8 w-full max-w-md shadow-2xl border border-purple-500/20"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-white mb-2"
          >
            {getTitle()}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-400"
          >
            {getSubtitle()}
          </motion.p>
        </div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          {/* Username Field (Register only) */}
          {mode === "register" && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Enter your username"
              />
            </div>
          )}

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="Enter your email"
            />
          </div>

          {/* Password Field */}
          {(mode === "register" || mode === "login") && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Confirm Password Field */}
          {mode === "register" && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* New Password Field (Reset only) */}
          {mode === "reset" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-12"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* OTP Field */}
          {(mode === "verify" || mode === "reset") && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Verification Code
              </label>
              <input
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleInputChange}
                required
                maxLength={6}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-center text-2xl tracking-widest"
                placeholder="000000"
              />

              {/* Resend OTP */}
              <div className="mt-3 text-center">
                {countdown > 0 ? (
                  <p className="text-gray-400 text-sm">
                    Resend code in {countdown}s
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={
                      mode === "verify" ? handleResendOTP : handleForgotPassword
                    }
                    className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
                  >
                    Resend verification code
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Please wait..." : getTitle()}
          </motion.button>

          {/* Mode Switch Links */}
          <div className="text-center space-y-2">
            {mode === "login" && (
              <>
                <p className="text-gray-400 text-sm">
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("register")}
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    Sign up
                  </button>
                </p>
                <p className="text-gray-400 text-sm">
                  <button
                    type="button"
                    onClick={() => setMode("forgot")}
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    Forgot password?
                  </button>
                </p>
              </>
            )}

            {mode === "register" && (
              <p className="text-gray-400 text-sm">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Sign in
                </button>
              </p>
            )}

            {(mode === "verify" || mode === "forgot" || mode === "reset") && (
              <p className="text-gray-400 text-sm">
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Back to login
                </button>
              </p>
            )}
          </div>
        </motion.form>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center"
        >
          <Link
            href="/"
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            ← Back to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
