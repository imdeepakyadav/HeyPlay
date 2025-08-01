"use client";

import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-pink-100 flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-indigo-900 mb-6 text-center">
          Pricing
        </h1>
        <p className="text-lg text-gray-700 mb-8 text-center">
          HeyPlay is <span className="font-bold text-pink-500">free</span> for
          everyone! Enjoy all features with no hidden costs.
        </p>
        <ul className="space-y-6">
          <li>
            <span className="font-semibold text-pink-500">Free Plan:</span>{" "}
            Unlimited rooms, chat, reactions, and playlist features.
          </li>
          <li>
            <span className="font-semibold text-pink-500">
              Premium (Coming Soon):
            </span>{" "}
            Advanced moderation, analytics, exclusive content, and more.
          </li>
        </ul>
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-pink-500 hover:text-indigo-600 font-medium"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
