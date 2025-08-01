"use client";

import {
  MusicalNoteIcon,
  PlusIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Room {
  _id: string;
  name: string;
  description: string;
  isPrivate: boolean;
  participants: { user: { username: string }; role: string }[];
  creator: { username: string };
  createdAt: string;
}

interface User {
  id: string;
  username: string;
  email: string;
  profilePicture?: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.push("/auth");
      return;
    }

    setUser(JSON.parse(userData));
    fetchRooms();
  }, [router]);

  const fetchRooms = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_BASE_URL}/api/rooms`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRooms(data);
      } else {
        toast.error("Failed to load rooms");
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
      toast.error("Failed to load rooms");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-indigo-900">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-pink-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <MusicalNoteIcon className="h-8 w-8 text-pink-500" />
              <span className="text-2xl font-bold text-indigo-900">
                HeyPlay
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.username}!</span>
              <button
                onClick={handleLogout}
                className="text-pink-500 hover:text-indigo-600 font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-indigo-900 mb-6">
            Your Dashboard
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              href="/create-room"
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-indigo-100"
            >
              <div className="flex items-center space-x-3">
                <PlusIcon className="h-8 w-8 text-pink-500" />
                <div>
                  <h3 className="text-lg font-semibold text-indigo-900">
                    Create Room
                  </h3>
                  <p className="text-gray-600">Start a new listening session</p>
                </div>
              </div>
            </Link>
            <Link
              href="/rooms"
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-indigo-100"
            >
              <div className="flex items-center space-x-3">
                <UserGroupIcon className="h-8 w-8 text-pink-500" />
                <div>
                  <h3 className="text-lg font-semibold text-indigo-900">
                    Browse Rooms
                  </h3>
                  <p className="text-gray-600">Join public listening rooms</p>
                </div>
              </div>
            </Link>
            <Link
              href="/profile"
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-indigo-100"
            >
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {user?.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-indigo-900">
                    Profile
                  </h3>
                  <p className="text-gray-600">Manage your account</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Rooms */}
        <div>
          <h2 className="text-2xl font-bold text-indigo-900 mb-6">
            Public Rooms
          </h2>
          {rooms.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No rooms available
              </h3>
              <p className="text-gray-600 mb-4">
                Be the first to create a room!
              </p>
              <Link
                href="/create-room"
                className="bg-pink-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-600 transition-colors"
              >
                Create Room
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <div
                  key={room._id}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-indigo-100"
                >
                  <h3 className="text-lg font-semibold text-indigo-900 mb-2">
                    {room.name}
                  </h3>
                  <p className="text-gray-600 mb-3">{room.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      <p>{room.participants.length} participants</p>
                      <p>by {room.creator.username}</p>
                    </div>
                    <Link
                      href={`/rooms/${room._id}`}
                      className="bg-pink-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-600 transition-colors"
                    >
                      Join
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
