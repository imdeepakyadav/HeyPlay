// backend/index.js
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const cron = require("node-cron");
require("dotenv").config();

const sessionService = require("./src/services/sessionService");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CORS_ORIGINS?.split(",") || [
      "http://localhost:3000",
      "exp://localhost:19000",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGINS?.split(",") || [
      "http://localhost:3000",
      "exp://localhost:19000",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const connectDB = async () => {
  try {
    const mongoURI =
      process.env.MONGODB_URI || "mongodb://localhost:27017/heyplay";
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

connectDB();

// Setup cron jobs
cron.schedule(
  "0 0 * * *",
  async () => {
    // Run daily at midnight to cleanup expired tokens
    console.log("Running daily token cleanup...");
    await sessionService.cleanupExpiredTokens();
  },
  {
    timezone: "UTC",
  }
);

// Import models
const { User, Room } = require("./src/models/Users");

// Import routes
const authRoutes = require("./src/routes/auth");
const roomRoutes = require("./src/routes/rooms");
const mediaRoutes = require("./src/routes/media");

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/media", mediaRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Store active connections
const activeConnections = new Map();

// Socket.io event handlers
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join room
  socket.on("join-room", async (data) => {
    try {
      const { roomId, userId } = data;
      socket.join(roomId);

      // Store connection info
      activeConnections.set(socket.id, { roomId, userId });

      // Update room with online status
      const room = await Room.findById(roomId);
      if (room) {
        socket.to(roomId).emit("user-joined", {
          userId,
          socketId: socket.id,
          timestamp: new Date(),
        });

        // Send current room state to the new user
        socket.emit("room-state", {
          currentTrack: room.currentTrack,
          playlist: room.playlist,
          participants: room.participants,
        });
      }
    } catch (error) {
      console.error("Join room error:", error);
      socket.emit("error", { message: "Failed to join room" });
    }
  });

  // Leave room
  socket.on("leave-room", async (data) => {
    try {
      const { roomId, userId } = data;
      socket.leave(roomId);

      activeConnections.delete(socket.id);

      socket.to(roomId).emit("user-left", {
        userId,
        socketId: socket.id,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("Leave room error:", error);
    }
  });

  // Play/pause track
  socket.on("track-control", async (data) => {
    try {
      const { roomId, action, track, currentTime } = data;
      const connection = activeConnections.get(socket.id);

      if (!connection || connection.roomId !== roomId) {
        socket.emit("error", { message: "Not in room" });
        return;
      }

      // Update room current track
      const room = await Room.findById(roomId);
      if (room) {
        if (action === "play" || action === "pause") {
          room.currentTrack = {
            ...room.currentTrack,
            ...track,
            currentTime: currentTime || 0,
            isPlaying: action === "play",
          };
          await room.save();
        }

        // Broadcast to all users in room
        socket.to(roomId).emit("track-update", {
          action,
          track: room.currentTrack,
          currentTime,
          timestamp: new Date(),
        });
      }
    } catch (error) {
      console.error("Track control error:", error);
      socket.emit("error", { message: "Failed to control track" });
    }
  });

  // Seek track
  socket.on("track-seek", async (data) => {
    try {
      const { roomId, currentTime } = data;
      const connection = activeConnections.get(socket.id);

      if (!connection || connection.roomId !== roomId) {
        socket.emit("error", { message: "Not in room" });
        return;
      }

      // Update room current time
      const room = await Room.findById(roomId);
      if (room && room.currentTrack) {
        room.currentTrack.currentTime = currentTime;
        await room.save();

        // Broadcast seek to all users in room
        socket.to(roomId).emit("track-seek", {
          currentTime,
          timestamp: new Date(),
        });
      }
    } catch (error) {
      console.error("Track seek error:", error);
    }
  });

  // Send chat message
  socket.on("send-message", async (data) => {
    try {
      const { roomId, userId, message } = data;
      const connection = activeConnections.get(socket.id);

      if (!connection || connection.roomId !== roomId) {
        socket.emit("error", { message: "Not in room" });
        return;
      }

      // Save message to database
      const room = await Room.findById(roomId);
      if (room) {
        const newMessage = {
          user: userId,
          content: message,
          timestamp: new Date(),
        };

        room.messages.push(newMessage);
        await room.save();
        await room.populate("messages.user", "username profilePicture");

        // Broadcast message to all users in room
        io.to(roomId).emit("new-message", {
          message: newMessage,
          timestamp: new Date(),
        });
      }
    } catch (error) {
      console.error("Send message error:", error);
      socket.emit("error", { message: "Failed to send message" });
    }
  });

  // Send reaction
  socket.on("send-reaction", async (data) => {
    try {
      const { roomId, userId, reaction } = data;
      const connection = activeConnections.get(socket.id);

      if (!connection || connection.roomId !== roomId) {
        socket.emit("error", { message: "Not in room" });
        return;
      }

      // Broadcast reaction to all users in room
      socket.to(roomId).emit("new-reaction", {
        userId,
        reaction,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("Send reaction error:", error);
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    try {
      const connection = activeConnections.get(socket.id);
      if (connection) {
        const { roomId, userId } = connection;

        socket.to(roomId).emit("user-left", {
          userId,
          socketId: socket.id,
          timestamp: new Date(),
        });

        activeConnections.delete(socket.id);
      }

      console.log("User disconnected:", socket.id);
    } catch (error) {
      console.error("Disconnect error:", error);
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 HeyPlay Backend Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});
