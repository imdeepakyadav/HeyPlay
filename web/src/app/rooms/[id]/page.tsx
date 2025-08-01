"use client";

import {
  ChatBubbleLeftRightIcon,
  PauseIcon,
  PlayIcon,
  SpeakerWaveIcon,
  UserGroupIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { io, Socket } from "socket.io-client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Room {
  _id: string;
  name: string;
  description: string;
  isPrivate: boolean;
  participants: Array<{
    user: {
      _id: string;
      username: string;
      email: string;
    };
    role: "host" | "member";
    joinedAt: string;
  }>;
  creator: {
    _id: string;
    username: string;
    email: string;
  };
  currentMedia?: {
    type: "youtube" | "spotify" | "soundcloud";
    url: string;
    title: string;
    duration: number;
    currentTime: number;
    isPlaying: boolean;
  };
  createdAt: string;
}

interface ChatMessage {
  _id: string;
  user: {
    username: string;
  };
  message: string;
  timestamp: string;
}

interface User {
  _id: string;
  username: string;
  email: string;
}

interface MediaUpdate {
  type: "youtube" | "spotify" | "soundcloud";
  url: string;
  title: string;
  duration: number;
  currentTime: number;
  isPlaying: boolean;
}

interface UserEvent {
  username: string;
  userId: string;
}

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  const [room, setRoom] = useState<Room | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showChat, setShowChat] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.push("/auth");
      return;
    }

    setUser(JSON.parse(userData));

    const fetchRoom = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/rooms/${params.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            toast.error("Room not found");
            router.push("/dashboard");
            return;
          }
          throw new Error("Failed to fetch room");
        }

        const roomData = await response.json();
        setRoom(roomData);

        if (roomData.currentMedia) {
          setIsPlaying(roomData.currentMedia.isPlaying);
        }
      } catch (error) {
        console.error("Error fetching room:", error);
        toast.error("Failed to load room");
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    const initializeSocket = () => {
      const newSocket = io(API_BASE_URL, {
        auth: { token },
      });

      newSocket.on("connect", () => {
        console.log("Connected to socket server");
        newSocket.emit("join-room", params.id);
      });

      newSocket.on("room-update", (updatedRoom: Room) => {
        setRoom(updatedRoom);
      });

      newSocket.on("new-message", (message: ChatMessage) => {
        setMessages((prev) => [...prev, message]);
      });

      newSocket.on("media-update", (mediaData: MediaUpdate) => {
        setRoom((prev) => (prev ? { ...prev, currentMedia: mediaData } : null));
        setIsPlaying(mediaData.isPlaying);
      });

      newSocket.on("user-joined", (data: UserEvent) => {
        toast.success(`${data.username} joined the room`);
      });

      newSocket.on("user-left", (data: UserEvent) => {
        toast(`${data.username} left the room`);
      });

      setSocket(newSocket);
    };

    fetchRoom();
    initializeSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [router, params.id, socket]);

  const sendMessage = () => {
    if (!newMessage.trim() || !socket) return;

    socket.emit("send-message", {
      roomId: params.id,
      message: newMessage,
    });

    setNewMessage("");
  };

  const addMedia = async () => {
    if (!mediaUrl.trim()) {
      toast.error("Please enter a media URL");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `${API_BASE_URL}/api/rooms/${params.id}/media`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ url: mediaUrl }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add media");
      }

      setMediaUrl("");
      toast.success("Media added successfully");
    } catch (error) {
      console.error("Error adding media:", error);
      toast.error("Failed to add media");
    }
  };

  const togglePlayPause = () => {
    if (!socket) return;

    socket.emit("toggle-playback", {
      roomId: params.id,
      isPlaying: !isPlaying,
    });
  };

  const leaveRoom = () => {
    if (socket) {
      socket.emit("leave-room", params.id);
      socket.disconnect();
    }
    router.push("/dashboard");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Room not found
          </h1>
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{room.name}</h1>
              <p className="text-gray-600">{room.description}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-gray-600">
                <UserGroupIcon className="h-5 w-5 mr-1" />
                <span>{room.participants.length} participants</span>
              </div>
              <button
                onClick={leaveRoom}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Leave Room
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Media Player */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Now Playing</h2>

              {room.currentMedia ? (
                <div className="space-y-4">
                  <div className="bg-gray-100 rounded-lg p-6 text-center">
                    <h3 className="text-lg font-medium mb-2">
                      {room.currentMedia.title}
                    </h3>
                    <div className="flex justify-center items-center space-x-4">
                      <button
                        onClick={togglePlayPause}
                        className="bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-700"
                      >
                        {isPlaying ? (
                          <PauseIcon className="h-6 w-6" />
                        ) : (
                          <PlayIcon className="h-6 w-6" />
                        )}
                      </button>
                      <button
                        onClick={() => setIsMuted(!isMuted)}
                        className="bg-gray-600 text-white p-3 rounded-full hover:bg-gray-700"
                      >
                        <SpeakerWaveIcon className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-100 rounded-lg p-8 text-center">
                  <VideoCameraIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No media playing</p>
                </div>
              )}

              {/* Add Media */}
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Add Media</h3>
                <div className="flex space-x-2">
                  <input
                    type="url"
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    placeholder="Enter YouTube, Spotify, or SoundCloud URL"
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={addMedia}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Participants */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Participants</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {room.participants.map((participant) => (
                  <div
                    key={participant.user._id}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="h-10 w-10 bg-indigo-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">
                        {participant.user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {participant.user.username}
                      </p>
                      <p className="text-sm text-gray-600">
                        {participant.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow h-96 flex flex-col">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Chat</h2>
                  <button
                    onClick={() => setShowChat(!showChat)}
                    className="lg:hidden"
                  >
                    <ChatBubbleLeftRightIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((message) => (
                  <div key={message._id} className="flex space-x-2">
                    <div className="h-8 w-8 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-medium">
                        {message.user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">
                          {message.user.username}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-gray-700">{message.message}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={sendMessage}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
