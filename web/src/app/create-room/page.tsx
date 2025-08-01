"use client";

import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function CreateRoomPage() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isPrivate: false,
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        router.push("/auth");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/rooms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Room created successfully!");
        router.push(`/rooms/${data._id}`);
      } else {
        toast.error(data.message || "Failed to create room");
      }
    } catch (error) {
      console.error("Error creating room:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-3xl font-bold text-indigo-900 mb-6 text-center">
            Create New Room
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-indigo-700 mb-2"
              >
                Room Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors bg-indigo-50"
                placeholder="Enter room name"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-indigo-700 mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors bg-indigo-50"
                placeholder="Describe your room..."
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPrivate"
                name="isPrivate"
                checked={formData.isPrivate}
                onChange={handleInputChange}
                className="h-4 w-4 text-pink-500 focus:ring-pink-500 border-indigo-300 rounded"
              />
              <label
                htmlFor="isPrivate"
                className="ml-2 block text-sm text-indigo-700"
              >
                Make this room private
              </label>
            </div>

            {formData.isPrivate && (
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-indigo-700 mb-2"
                >
                  Room Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required={formData.isPrivate}
                  className="w-full px-4 py-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors bg-indigo-50"
                  placeholder="Enter room password"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-600 focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {loading ? "Creating..." : "Create Room"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
