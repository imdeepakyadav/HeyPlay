const express = require("express");
const router = express.Router();
const mediaService = require("../services/mediaService");
const auth = require("../middleware/auth");

// Search for media
router.get("/search", auth, async (req, res) => {
  try {
    const { q: query, sources = "youtube", limit = 10 } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Query parameter is required" });
    }

    const sourcesArray = sources.split(",");
    const results = await mediaService.searchMedia(
      query,
      sourcesArray,
      parseInt(limit)
    );

    res.json({ results });
  } catch (error) {
    console.error("Media search error:", error);
    res.status(500).json({ message: "Error searching media" });
  }
});

// Get YouTube video details
router.get("/youtube/:videoId", auth, async (req, res) => {
  try {
    const { videoId } = req.params;
    const videoDetails = await mediaService.getYoutubeVideoDetails(videoId);

    res.json(videoDetails);
  } catch (error) {
    console.error("YouTube video details error:", error);
    res.status(500).json({ message: "Error fetching video details" });
  }
});

// Get trending videos (mock implementation)
router.get("/trending", auth, async (req, res) => {
  try {
    // Mock trending data - in production, you'd get this from YouTube API
    const trendingQueries = [
      "top hits 2024",
      "trending music",
      "viral songs",
      "new releases",
      "popular music",
    ];

    const randomQuery =
      trendingQueries[Math.floor(Math.random() * trendingQueries.length)];
    const results = await mediaService.searchMedia(
      randomQuery,
      ["youtube"],
      20
    );

    res.json({ results });
  } catch (error) {
    console.error("Trending media error:", error);
    res.status(500).json({ message: "Error fetching trending media" });
  }
});

module.exports = router;
