// backend/src/routes/auth.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User } = require("../models/Users");

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({ username, email, password });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.status(201).json({ token, user: { id: user._id, username, email } });
  } catch (error) {
    res.status(500).json({ message: "Error creating user" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.json({ token, user: { id: user._id, username: user.username, email } });
  } catch (error) {
    res.status(500).json({ message: "Error logging in" });
  }
});

// backend/src/routes/rooms.js
const { Room } = require("../models/Room");
const auth = require("../middleware/auth");

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
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: "Error creating room" });
  }
});

router.get("/", async (req, res) => {
  try {
    const rooms = await Room.find({ isPrivate: false })
      .populate("creator", "username")
      .populate("participants.user", "username")
      .select("-password");
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Error fetching rooms" });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate("creator", "username")
      .populate("participants.user", "username")
      .select("-password");

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.json(room);
  } catch (error) {
    res.status(500).json({ message: "Error fetching room" });
  }
});

module.exports = router;
