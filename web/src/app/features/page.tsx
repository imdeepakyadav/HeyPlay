"use client";

import Link from "next/link";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-pink-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-indigo-900 mb-6 text-center">
          Features
        </h1>
        <ul className="space-y-6">
          <li>
            <span className="font-semibold text-pink-500">
              Create & Join Rooms:
            </span>{" "}
            Private or public rooms, invite friends, listen together in
            real-time.
          </li>
          <li>
            <span className="font-semibold text-pink-500">
              Synchronized Playback:
            </span>{" "}
            Perfectly synced music and video playback across all devices.
          </li>
          <li>
            <span className="font-semibold text-pink-500">
              Live Chat & Reactions:
            </span>{" "}
            Chat and react to tracks in real-time.
          </li>
          <li>
            <span className="font-semibold text-pink-500">
              Background Playback:
            </span>{" "}
            Keep music playing even when the app is minimized.
          </li>
          <li>
            <span className="font-semibold text-pink-500">
              Multi-Media Support:
            </span>{" "}
            Stream from YouTube, Spotify, and more.
          </li>
          <li>
            <span className="font-semibold text-pink-500">
              Collaborative Playlists:
            </span>{" "}
            Build playlists together and discover new music.
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
