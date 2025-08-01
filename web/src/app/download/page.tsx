"use client";

import Link from "next/link";

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-pink-100 flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-indigo-900 mb-6 text-center">
          Download
        </h1>
        <p className="text-lg text-gray-700 mb-8 text-center">
          Get HeyPlay on your favorite device:
        </p>
        <ul className="space-y-6">
          <li>
            <span className="font-semibold text-pink-500">iOS & Android:</span>{" "}
            Download via the App Store or Google Play (coming soon).
          </li>
          <li>
            <span className="font-semibold text-pink-500">Web App:</span> Use
            HeyPlay directly in your browser.
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
