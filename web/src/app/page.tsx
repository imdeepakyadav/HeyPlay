"use client";

import {
  ChatBubbleLeftRightIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  HeartIcon,
  MusicalNoteIcon,
  PlayIcon,
  UserGroupIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

const features = [
  {
    icon: UserGroupIcon,
    title: "Create & Join Rooms",
    description:
      "Create private or public rooms and invite friends to listen together in real-time.",
  },
  {
    icon: PlayIcon,
    title: "Synchronized Playback",
    description:
      "Experience perfectly synced music and video playback across all devices.",
  },
  {
    icon: ChatBubbleLeftRightIcon,
    title: "Live Chat & Reactions",
    description:
      "Chat with friends and react to your favorite tracks in real-time.",
  },
  {
    icon: MusicalNoteIcon,
    title: "Background Playback",
    description: "Keep the music playing even when the app is minimized.",
  },
  {
    icon: VideoCameraIcon,
    title: "Multi-Media Support",
    description:
      "Stream music from YouTube, Spotify, and other popular platforms.",
  },
  {
    icon: HeartIcon,
    title: "Collaborative Playlists",
    description:
      "Build playlists together with friends and discover new music.",
  },
];

const platforms = [
  {
    icon: DevicePhoneMobileIcon,
    title: "Mobile Apps",
    description: "iOS & Android",
    available: true,
  },
  {
    icon: ComputerDesktopIcon,
    title: "Web App",
    description: "All Browsers",
    available: true,
  },
];

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-pink-100">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-4 sm:p-6 lg:px-12">
        <div className="flex items-center space-x-2">
          <MusicalNoteIcon className="h-8 w-8 text-pink-500" />
          <span className="text-2xl font-bold text-indigo-900">HeyPlay</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            href="/auth"
            className="text-indigo-600 hover:text-pink-500 font-semibold transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/auth?mode=register"
            className="bg-pink-500 text-white px-4 py-2 rounded-lg font-semibold shadow-md hover:bg-indigo-600 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
        transition={{ duration: 0.6 }}
        className="relative px-4 sm:px-6 lg:px-12 py-16 sm:py-24"
      >
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-indigo-900 mb-6">
            Sync. Stream.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-indigo-600">
              Enjoy Together.
            </span>
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 mb-8 sm:mb-12 max-w-2xl mx-auto">
            Create rooms, invite friends, and experience synchronized music and
            video playback. Real-time reactions and chat included.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth?mode=register"
              className="bg-pink-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-600 transition-colors shadow-lg"
            >
              Start Listening Together
            </Link>
            <Link
              href="/rooms"
              className="border-2 border-indigo-300 text-indigo-700 px-8 py-4 rounded-lg text-lg font-semibold hover:border-pink-400 transition-colors"
            >
              Browse Public Rooms
            </Link>
          </div>
        </div>

        {/* Hero Image/Video Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.9 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-12 sm:mt-20 mx-auto max-w-4xl sm:max-w-6xl"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <div className="bg-gray-100 aspect-video flex items-center justify-center">
              <div className="text-center">
                <PlayIcon className="h-20 sm:h-24 w-20 sm:w-24 text-pink-300 mx-auto mb-4" />
                <p className="text-gray-400 text-base sm:text-lg">
                  App Preview Coming Soon
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Features Section */}
      <div className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-indigo-900 mb-4">
              Everything you need for social streaming
            </h2>
            <p className="text-base sm:text-lg text-gray-700">
              HeyPlay brings people together through music and shared
              experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-4 sm:p-6 rounded-xl hover:shadow-xl transition-shadow bg-gradient-to-br from-white via-indigo-50 to-pink-50"
              >
                <feature.icon className="h-10 sm:h-12 w-10 sm:w-12 text-pink-500 mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-indigo-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-700 text-sm sm:text-base">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Platform Support */}
      <div className="py-16 sm:py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-indigo-900 mb-4">
              Available everywhere
            </h2>
            <p className="text-base sm:text-lg text-gray-700">
              Access HeyPlay on all your favorite devices and platforms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {platforms.map((platform, index) => (
              <motion.div
                key={platform.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{
                  opacity: isVisible ? 1 : 0,
                  scale: isVisible ? 1 : 0.9,
                }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white p-6 sm:p-8 rounded-xl text-center shadow-xl border border-indigo-100"
              >
                <platform.icon className="h-12 sm:h-16 w-12 sm:w-16 text-pink-500 mx-auto mb-4" />
                <h3 className="text-lg sm:text-2xl font-semibold text-indigo-900 mb-2">
                  {platform.title}
                </h3>
                <p className="text-gray-700 mb-4 text-sm sm:text-base">
                  {platform.description}
                </p>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Available Now
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 sm:py-24 bg-gradient-to-r from-pink-500 to-indigo-600">
        <div className="mx-auto max-w-4xl text-center px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Ready to start your listening party?
            </h2>
            <p className="text-base sm:text-xl text-indigo-100 mb-8">
              Join thousands of music lovers who are already enjoying
              synchronized streaming together.
            </p>
            <Link
              href="/auth?mode=register"
              className="bg-white text-pink-500 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-50 transition-colors shadow-lg inline-block"
            >
              Create Your First Room
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-indigo-900 text-white py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <MusicalNoteIcon className="h-8 w-8 text-pink-300" />
                <span className="text-2xl font-bold text-white">HeyPlay</span>
              </div>
              <p className="text-gray-400 mb-4">
                Bringing people together through music and shared experiences.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link
                    href="/features"
                    className="hover:text-white transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="hover:text-white transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/download"
                    className="hover:text-white transition-colors"
                  >
                    Download
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link
                    href="/help"
                    className="hover:text-white transition-colors"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-white transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-white transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 HeyPlay. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
