"use client";

import Link from "next/link";

export default function RoomsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-pink-100 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="flex flex-col sm:flex-row items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-indigo-900">HeyPlay</span>
            <span className="bg-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
              Rooms
            </span>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link
              href="/"
              className="text-pink-500 hover:text-indigo-600 font-medium"
            >
              Home
            </Link>
          </div>
        </header>
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-indigo-900 mb-6 text-center">
            Browse Public Rooms
          </h1>
          <p className="text-lg text-gray-700 mb-8 text-center">
            Join a room and start listening together!
          </p>
          {/* Room list placeholder */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Example room cards */}
            <div className="bg-indigo-50 rounded-xl p-6 shadow hover:shadow-xl transition-shadow">
              <h2 className="text-xl font-bold text-pink-500 mb-2">
                Chill Vibes
              </h2>
              <p className="text-gray-700 mb-2">Public • 12 listeners</p>
              <Link
                href="/rooms/1"
                className="text-indigo-600 hover:text-pink-500 font-medium"
              >
                Join Room
              </Link>
            </div>
            <div className="bg-indigo-50 rounded-xl p-6 shadow hover:shadow-xl transition-shadow">
              <h2 className="text-xl font-bold text-pink-500 mb-2">Top Hits</h2>
              <p className="text-gray-700 mb-2">Public • 8 listeners</p>
              <Link
                href="/rooms/2"
                className="text-indigo-600 hover:text-pink-500 font-medium"
              >
                Join Room
              </Link>
            </div>
            <div className="bg-indigo-50 rounded-xl p-6 shadow hover:shadow-xl transition-shadow">
              <h2 className="text-xl font-bold text-pink-500 mb-2">
                Lo-Fi Study
              </h2>
              <p className="text-gray-700 mb-2">Public • 5 listeners</p>
              <Link
                href="/rooms/3"
                className="text-indigo-600 hover:text-pink-500 font-medium"
              >
                Join Room
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
