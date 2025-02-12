// backend/src/index.js
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:3000", "exp://localhost:19000"],
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Basic Room Schema
const roomSchema = new mongoose.Schema({
  name: String,
  creator: String,
  currentTrack: {
    url: String,
    title: String,
    timestamp: Number,
  },
  participants: [
    {
      userId: String,
      username: String,
    },
  ],
});

const Room = mongoose.model("Room", roomSchema);

// Socket.io event handlers
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", async (roomId) => {
    socket.join(roomId);
    // Notify others in the room
    socket.to(roomId).emit("user-joined", socket.id);
  });

  socket.on("play-track", ({ roomId, trackData }) => {
    socket.to(roomId).emit("track-update", trackData);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
