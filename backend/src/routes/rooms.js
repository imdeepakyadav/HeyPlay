const express = require("express");
const router = express.Router();
const { Room } = require("../models/Users");
const auth = require("../middleware/auth");

// Create a new room
router.post("/", auth, async (req, res) => {
  try {
    const { name, description, isPrivate, password } = req.body;

    const room = new Room({
      name,
      description,
      creator: req.user._id,
      isPrivate,
      password: isPrivate ? password : undefined,
      participants: [{ user: req.user._id, role: "admin" }],
    });

    await room.save();
    await room.populate("creator", "username profilePicture");

    res.status(201).json(room);
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).json({ message: "Error creating room" });
  }
});

// Get all public rooms
router.get("/", async (req, res) => {
  try {
    const rooms = await Room.find({ isPrivate: false })
      .populate("creator", "username profilePicture")
      .populate("participants.user", "username profilePicture")
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(rooms);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({ message: "Error fetching rooms" });
  }
});

// Get room by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate("creator", "username profilePicture")
      .populate("participants.user", "username profilePicture")
      .populate("messages.user", "username profilePicture")
      .select("-password");

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Check if user is participant or if room is public
    const isParticipant = room.participants.some(
      (p) => p.user._id.toString() === req.user._id.toString()
    );
    if (room.isPrivate && !isParticipant) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(room);
  } catch (error) {
    console.error("Error fetching room:", error);
    res.status(500).json({ message: "Error fetching room" });
  }
});

// Join a room
router.post("/:id/join", auth, async (req, res) => {
  try {
    const { password } = req.body;
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Check if user is already a participant
    const isParticipant = room.participants.some(
      (p) => p.user.toString() === req.user._id.toString()
    );
    if (isParticipant) {
      return res.status(400).json({ message: "Already in room" });
    }

    // Check password for private rooms
    if (room.isPrivate && room.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    room.participants.push({ user: req.user._id, role: "user" });
    await room.save();
    await room.populate("participants.user", "username profilePicture");

    res.json({ message: "Joined room successfully", room });
  } catch (error) {
    console.error("Error joining room:", error);
    res.status(500).json({ message: "Error joining room" });
  }
});

// Leave a room
router.post("/:id/leave", auth, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    room.participants = room.participants.filter(
      (p) => p.user.toString() !== req.user._id.toString()
    );
    await room.save();

    res.json({ message: "Left room successfully" });
  } catch (error) {
    console.error("Error leaving room:", error);
    res.status(500).json({ message: "Error leaving room" });
  }
});

// Add track to playlist
router.post("/:id/playlist", auth, async (req, res) => {
  try {
    const { url, title, artist, thumbnail, duration } = req.body;
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Check if user is participant
    const isParticipant = room.participants.some(
      (p) => p.user.toString() === req.user._id.toString()
    );
    if (!isParticipant) {
      return res.status(403).json({ message: "Access denied" });
    }

    const track = {
      url,
      title,
      artist,
      thumbnail,
      duration,
      addedBy: req.user._id,
    };

    room.playlist.push(track);
    await room.save();

    res.json({ message: "Track added to playlist", track });
  } catch (error) {
    console.error("Error adding track:", error);
    res.status(500).json({ message: "Error adding track" });
  }
});

// Send message to room
router.post("/:id/messages", auth, async (req, res) => {
  try {
    const { content } = req.body;
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Check if user is participant
    const isParticipant = room.participants.some(
      (p) => p.user.toString() === req.user._id.toString()
    );
    if (!isParticipant) {
      return res.status(403).json({ message: "Access denied" });
    }

    const message = {
      user: req.user._id,
      content,
      timestamp: new Date(),
    };

    room.messages.push(message);
    await room.save();
    await room.populate("messages.user", "username profilePicture");

    res.json({ message: "Message sent", data: message });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Error sending message" });
  }
});

// Update current track
router.put("/:id/current-track", auth, async (req, res) => {
  try {
    const { url, title, artist, thumbnail, duration, currentTime, isPlaying } =
      req.body;
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Check if user has admin/moderator rights
    const participant = room.participants.find(
      (p) => p.user.toString() === req.user._id.toString()
    );
    if (
      !participant ||
      (participant.role !== "admin" && participant.role !== "moderator")
    ) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }

    room.currentTrack = {
      url,
      title,
      artist,
      thumbnail,
      duration,
      currentTime: currentTime || 0,
      isPlaying: isPlaying || false,
    };

    await room.save();

    res.json({
      message: "Current track updated",
      currentTrack: room.currentTrack,
    });
  } catch (error) {
    console.error("Error updating current track:", error);
    res.status(500).json({ message: "Error updating current track" });
  }
});

// Add media to room
router.post("/:id/media", auth, async (req, res) => {
  try {
    const { url } = req.body;
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Check if user is a participant
    const participant = room.participants.find(
      (p) => p.user.toString() === req.user._id.toString()
    );
    if (!participant) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Extract media info from URL (simplified)
    let title = "Unknown Media";
    let type = "youtube";

    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      type = "youtube";
      title = "YouTube Video";
    } else if (url.includes("spotify.com")) {
      type = "spotify";
      title = "Spotify Track";
    } else if (url.includes("soundcloud.com")) {
      type = "soundcloud";
      title = "SoundCloud Track";
    }

    // Add to playlist
    const newMedia = {
      url,
      title,
      type,
      addedBy: req.user._id,
      addedAt: new Date(),
    };

    if (!room.playlist) {
      room.playlist = [];
    }
    room.playlist.push(newMedia);

    // If no current media is playing, set this as current
    if (!room.currentMedia) {
      room.currentMedia = {
        type,
        url,
        title,
        duration: 0,
        currentTime: 0,
        isPlaying: false,
      };
    }

    await room.save();
    await room.populate("playlist.addedBy", "username");

    res.json({
      message: "Media added successfully",
      media: newMedia,
      currentMedia: room.currentMedia,
    });
  } catch (error) {
    console.error("Error adding media:", error);
    res.status(500).json({ message: "Error adding media" });
  }
});

module.exports = router;
