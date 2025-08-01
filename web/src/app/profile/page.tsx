"use client";

import { ArrowLeftIcon, UserIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface User {
  id: string;
  username: string;
  email: string;
  profilePicture?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    profilePicture: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.push("/auth");
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    setFormData({
      username: parsedUser.username,
      profilePicture: parsedUser.profilePicture || "",
    });
  }, [router]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Profile updated successfully!");
        const updatedUser = { ...user, ...data };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_BASE_URL}/api/auth/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Password changed successfully!");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        toast.error(data.message || "Failed to change password");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-indigo-900">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-pink-100">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link
            href="/dashboard"
            className="flex items-center text-pink-500 hover:text-indigo-600 font-medium mr-4"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              {user.profilePicture ? (
                <Image
                  src={user.profilePicture}
                  alt="Profile"
                  width={80}
                  height={80}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <UserIcon className="h-10 w-10 text-white" />
              )}
            </div>
            <h1 className="text-3xl font-bold text-indigo-900">
              {user.username}
            </h1>
            <p className="text-gray-600">{user.email}</p>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-8 bg-indigo-50 rounded-lg p-1">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                activeTab === "profile"
                  ? "bg-pink-500 text-white"
                  : "text-indigo-700 hover:bg-indigo-100"
              }`}
            >
              Edit Profile
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                activeTab === "password"
                  ? "bg-pink-500 text-white"
                  : "text-indigo-700 hover:bg-indigo-100"
              }`}
            >
              Change Password
            </button>
          </div>

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-indigo-700 mb-2"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors bg-indigo-50"
                />
              </div>

              <div>
                <label
                  htmlFor="profilePicture"
                  className="block text-sm font-medium text-indigo-700 mb-2"
                >
                  Profile Picture URL
                </label>
                <input
                  type="url"
                  id="profilePicture"
                  name="profilePicture"
                  value={formData.profilePicture}
                  onChange={(e) =>
                    setFormData({ ...formData, profilePicture: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors bg-indigo-50"
                  placeholder="https://example.com/profile.jpg"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-pink-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-600 focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {loading ? "Updating..." : "Update Profile"}
              </button>
            </form>
          )}

          {/* Password Tab */}
          {activeTab === "password" && (
            <form onSubmit={handlePasswordChange} className="space-y-6">
              <div>
                <label
                  htmlFor="currentPassword"
                  className="block text-sm font-medium text-indigo-700 mb-2"
                >
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                  required
                  className="w-full px-4 py-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors bg-indigo-50"
                />
              </div>

              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-indigo-700 mb-2"
                >
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  required
                  className="w-full px-4 py-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors bg-indigo-50"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-indigo-700 mb-2"
                >
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                  className="w-full px-4 py-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors bg-indigo-50"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-pink-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-600 focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {loading ? "Changing..." : "Change Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
