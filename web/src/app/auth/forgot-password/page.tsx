"use client";

import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success("Password reset link sent to your email!");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-pink-100 flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
        <div className="text-center mb-8">
          <Link
            href="/auth"
            className="inline-flex items-center space-x-2 mb-6"
          >
            <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">H</span>
            </div>
            <span className="text-2xl font-bold text-indigo-900">HeyPlay</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-indigo-900 mb-2">
            Forgot Password
          </h1>
          <p className="text-gray-700 text-sm sm:text-base">
            Enter your email address and we&apos;ll send you a password reset
            link.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-indigo-700 mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors bg-indigo-50"
              placeholder="Enter your email"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-600 focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        <div className="mt-8 text-center">
          <Link
            href="/auth"
            className="text-pink-500 hover:text-indigo-600 font-medium"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
