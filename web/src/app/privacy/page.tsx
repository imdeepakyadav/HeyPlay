"use client";

import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-pink-100 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-700">Last updated: August 1, 2025</p>
        </header>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-pink-500 mb-4">
                Information We Collect
              </h2>
              <p className="text-gray-700 mb-4">
                We collect information you provide directly to us, such as when
                you create an account, join a room, or contact us for support.
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Account information (username, email address)</li>
                <li>Profile information (profile picture, preferences)</li>
                <li>
                  Room activity (messages, reactions, playlist interactions)
                </li>
                <li>Device and usage information</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-pink-500 mb-4">
                How We Use Your Information
              </h2>
              <p className="text-gray-700 mb-4">
                We use the information we collect to provide, maintain, and
                improve our services.
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Provide and operate the HeyPlay service</li>
                <li>Enable real-time music synchronization and chat</li>
                <li>Send important service announcements</li>
                <li>Improve user experience and develop new features</li>
                <li>Protect against fraud and abuse</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-pink-500 mb-4">
                Information Sharing
              </h2>
              <p className="text-gray-700 mb-4">
                We do not sell, trade, or otherwise transfer your personal
                information to third parties, except as described in this
                policy.
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>
                  With other users in rooms (username, messages, reactions)
                </li>
                <li>
                  With service providers who assist in operating our platform
                </li>
                <li>When required by law or to protect our rights</li>
                <li>In connection with a business transfer or acquisition</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-pink-500 mb-4">
                Data Security
              </h2>
              <p className="text-gray-700">
                We implement appropriate security measures to protect your
                personal information against unauthorized access, alteration,
                disclosure, or destruction. However, no method of transmission
                over the internet is 100% secure.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-pink-500 mb-4">
                Your Rights
              </h2>
              <p className="text-gray-700 mb-4">
                You have certain rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Access and update your account information</li>
                <li>Delete your account and associated data</li>
                <li>Control your privacy settings</li>
                <li>Opt out of non-essential communications</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-pink-500 mb-4">
                Cookies and Tracking
              </h2>
              <p className="text-gray-700">
                We use cookies and similar technologies to enhance your
                experience, remember your preferences, and analyze how you use
                our service. You can control cookie settings through your
                browser.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-pink-500 mb-4">
                Children&apos;s Privacy
              </h2>
              <p className="text-gray-700">
                HeyPlay is not intended for children under 13. We do not
                knowingly collect personal information from children under 13.
                If you are a parent and believe your child has provided us with
                personal information, please contact us.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-pink-500 mb-4">
                Changes to This Policy
              </h2>
              <p className="text-gray-700">
                We may update this privacy policy from time to time. We will
                notify you of any material changes by posting the new policy on
                this page and updating the &quot;Last updated&quot; date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-pink-500 mb-4">
                Contact Us
              </h2>
              <p className="text-gray-700">
                If you have any questions about this privacy policy, please
                contact us at{" "}
                <Link
                  href="/contact"
                  className="text-pink-500 hover:text-indigo-600 font-medium"
                >
                  support@heyplay.com
                </Link>
                .
              </p>
            </section>
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
