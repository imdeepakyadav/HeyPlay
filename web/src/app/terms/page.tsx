"use client";

import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-pink-100 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-900 mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-gray-700">Last updated: August 1, 2025</p>
        </header>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-pink-500 mb-4">
                Acceptance of Terms
              </h2>
              <p className="text-gray-700">
                By accessing and using HeyPlay, you accept and agree to be bound
                by the terms and provision of this agreement. If you do not
                agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-pink-500 mb-4">
                Description of Service
              </h2>
              <p className="text-gray-700 mb-4">
                HeyPlay is a social music streaming platform that allows users
                to create rooms, listen to music together in real-time, and
                interact through chat and reactions.
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Create and join music listening rooms</li>
                <li>Synchronized music playback across devices</li>
                <li>Real-time chat and reactions</li>
                <li>Collaborative playlist management</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-pink-500 mb-4">
                User Accounts
              </h2>
              <p className="text-gray-700 mb-4">
                To use HeyPlay, you must create an account and provide accurate
                information.
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>You must be at least 13 years old to create an account</li>
                <li>You are responsible for maintaining account security</li>
                <li>You must provide accurate and current information</li>
                <li>One person may not maintain multiple accounts</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-pink-500 mb-4">
                Acceptable Use
              </h2>
              <p className="text-gray-700 mb-4">
                You agree to use HeyPlay responsibly and in accordance with
                these guidelines:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>
                  Do not share inappropriate, offensive, or illegal content
                </li>
                <li>Respect other users and maintain a friendly environment</li>
                <li>Do not attempt to disrupt or interfere with the service</li>
                <li>Do not violate any applicable laws or regulations</li>
                <li>
                  Do not infringe on copyrights or intellectual property rights
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-pink-500 mb-4">
                Content and Copyright
              </h2>
              <p className="text-gray-700 mb-4">
                HeyPlay respects intellectual property rights and expects users
                to do the same.
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>
                  Users are responsible for ensuring they have rights to share
                  content
                </li>
                <li>We may remove content that violates copyright laws</li>
                <li>Repeated violations may result in account termination</li>
                <li>We comply with DMCA takedown requests</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-pink-500 mb-4">Privacy</h2>
              <p className="text-gray-700">
                Your privacy is important to us. Please review our{" "}
                <Link
                  href="/privacy"
                  className="text-pink-500 hover:text-indigo-600 font-medium"
                >
                  Privacy Policy
                </Link>{" "}
                to understand how we collect, use, and protect your information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-pink-500 mb-4">
                Service Availability
              </h2>
              <p className="text-gray-700 mb-4">
                We strive to keep HeyPlay available 24/7, but we cannot
                guarantee uninterrupted service.
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>We may temporarily suspend service for maintenance</li>
                <li>We are not liable for service interruptions</li>
                <li>We may modify or discontinue features with notice</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-pink-500 mb-4">
                Limitation of Liability
              </h2>
              <p className="text-gray-700">
                HeyPlay is provided &quot;as is&quot; without warranties. We are
                not liable for any damages arising from your use of the service,
                including but not limited to direct, indirect, incidental, or
                consequential damages.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-pink-500 mb-4">
                Termination
              </h2>
              <p className="text-gray-700 mb-4">
                We may terminate or suspend your account at any time for
                violations of these terms.
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>You may delete your account at any time</li>
                <li>We may terminate accounts for terms violations</li>
                <li>
                  Termination does not affect rights and obligations that should
                  survive
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-pink-500 mb-4">
                Changes to Terms
              </h2>
              <p className="text-gray-700">
                We may update these terms from time to time. We will notify
                users of material changes by posting the updated terms on this
                page and updating the &quot;Last updated&quot; date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-pink-500 mb-4">
                Contact Information
              </h2>
              <p className="text-gray-700">
                If you have any questions about these terms, please contact us
                at{" "}
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
