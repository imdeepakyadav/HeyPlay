"use client";

import Link from "next/link";

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-pink-100 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-900 mb-4">
            Help Center
          </h1>
          <p className="text-lg text-gray-700">
            Find answers to common questions about HeyPlay
          </p>
        </header>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-pink-500 mb-4">
                Getting Started
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-indigo-900 mb-2">
                    How do I create a room?
                  </h3>
                  <p className="text-gray-700">
                    Go to your dashboard and click &quot;Create Room&quot;.
                    Enter a name, description, and choose if it&apos;s private
                    or public.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-indigo-900 mb-2">
                    How do I join a room?
                  </h3>
                  <p className="text-gray-700">
                    Browse public rooms on the Rooms page or use a room link if
                    you have one. Private rooms require a password.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-pink-500 mb-4">
                Features
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-indigo-900 mb-2">
                    What platforms are supported?
                  </h3>
                  <p className="text-gray-700">
                    HeyPlay works on web browsers, iOS, and Android devices. All
                    features are synchronized across platforms.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-indigo-900 mb-2">
                    Can I play music from Spotify or YouTube?
                  </h3>
                  <p className="text-gray-700">
                    Yes! HeyPlay supports music from YouTube, Spotify, and other
                    popular streaming platforms.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-pink-500 mb-4">
                Troubleshooting
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-indigo-900 mb-2">
                    Music isn&apos;t syncing properly
                  </h3>
                  <p className="text-gray-700">
                    Check your internet connection and refresh the page. Make
                    sure you&apos;re using the latest version of the app.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-indigo-900 mb-2">
                    I can&apos;t hear audio
                  </h3>
                  <p className="text-gray-700">
                    Check your device volume and make sure the browser has
                    permission to play audio. Try refreshing the page.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-pink-500 mb-4">
                Account & Privacy
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-indigo-900 mb-2">
                    How do I change my password?
                  </h3>
                  <p className="text-gray-700">
                    Go to your Profile page and use the &quot;Change
                    Password&quot; tab to update your password.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-indigo-900 mb-2">
                    Is my data secure?
                  </h3>
                  <p className="text-gray-700">
                    Yes, we use industry-standard encryption and security
                    practices to protect your data.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-indigo-100 text-center">
            <p className="text-gray-600 mb-4">Still need help?</p>
            <Link
              href="/contact"
              className="bg-pink-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-600 transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>

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
