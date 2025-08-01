"use client";

import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate form submission
    setTimeout(() => {
      setLoading(false);
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-pink-100 p-4">
      <div className="max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-900 mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-gray-700">
            Get in touch with the HeyPlay team
          </p>
        </header>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-indigo-700 mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors bg-indigo-50"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-indigo-700 mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors bg-indigo-50"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-indigo-700 mb-2"
              >
                Subject
              </label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors bg-indigo-50"
              >
                <option value="">Select a subject</option>
                <option value="technical-support">Technical Support</option>
                <option value="feature-request">Feature Request</option>
                <option value="bug-report">Bug Report</option>
                <option value="general-inquiry">General Inquiry</option>
                <option value="partnership">Partnership</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-indigo-700 mb-2"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={6}
                className="w-full px-4 py-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors bg-indigo-50"
                placeholder="Tell us how we can help you..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-600 focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-indigo-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-center">
              <div>
                <h3 className="font-semibold text-indigo-900 mb-2">Email</h3>
                <p className="text-gray-600">support@heyplay.com</p>
              </div>
              <div>
                <h3 className="font-semibold text-indigo-900 mb-2">
                  Response Time
                </h3>
                <p className="text-gray-600">Within 24 hours</p>
              </div>
            </div>
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
