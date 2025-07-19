const axios = require("axios");

class MediaService {
  constructor() {
    this.youtubeApiKey = process.env.YOUTUBE_API_KEY;
    this.spotifyClientId = process.env.SPOTIFY_CLIENT_ID;
    this.spotifyClientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    this.spotifyToken = null;
  }

  // YouTube API methods
  async searchYoutube(query, maxResults = 10) {
    try {
      if (!this.youtubeApiKey) {
        throw new Error("YouTube API key not configured");
      }

      const response = await axios.get(
        "https://www.googleapis.com/youtube/v3/search",
        {
          params: {
            part: "snippet",
            q: query,
            type: "video",
            maxResults,
            key: this.youtubeApiKey,
            videoCategoryId: "10", // Music category
          },
        }
      );

      return response.data.items.map((item) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        artist: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails.medium.url,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        source: "youtube",
      }));
    } catch (error) {
      console.error("YouTube search error:", error);
      throw new Error("Failed to search YouTube");
    }
  }

  async getYoutubeVideoDetails(videoId) {
    try {
      if (!this.youtubeApiKey) {
        throw new Error("YouTube API key not configured");
      }

      const response = await axios.get(
        "https://www.googleapis.com/youtube/v3/videos",
        {
          params: {
            part: "snippet,contentDetails",
            id: videoId,
            key: this.youtubeApiKey,
          },
        }
      );

      if (response.data.items.length === 0) {
        throw new Error("Video not found");
      }

      const video = response.data.items[0];
      return {
        id: video.id,
        title: video.snippet.title,
        artist: video.snippet.channelTitle,
        thumbnail: video.snippet.thumbnails.medium.url,
        duration: this.parseDuration(video.contentDetails.duration),
        url: `https://www.youtube.com/watch?v=${video.id}`,
        source: "youtube",
      };
    } catch (error) {
      console.error("YouTube video details error:", error);
      throw new Error("Failed to get video details");
    }
  }

  // Spotify API methods
  async getSpotifyToken() {
    try {
      if (!this.spotifyClientId || !this.spotifyClientSecret) {
        throw new Error("Spotify credentials not configured");
      }

      const response = await axios.post(
        "https://accounts.spotify.com/api/token",
        "grant_type=client_credentials",
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${Buffer.from(
              `${this.spotifyClientId}:${this.spotifyClientSecret}`
            ).toString("base64")}`,
          },
        }
      );

      this.spotifyToken = response.data.access_token;
      return this.spotifyToken;
    } catch (error) {
      console.error("Spotify token error:", error);
      throw new Error("Failed to get Spotify token");
    }
  }

  async searchSpotify(query, maxResults = 10) {
    try {
      if (!this.spotifyToken) {
        await this.getSpotifyToken();
      }

      const response = await axios.get("https://api.spotify.com/v1/search", {
        params: {
          q: query,
          type: "track",
          limit: maxResults,
        },
        headers: {
          Authorization: `Bearer ${this.spotifyToken}`,
        },
      });

      return response.data.tracks.items.map((track) => ({
        id: track.id,
        title: track.name,
        artist: track.artists.map((artist) => artist.name).join(", "),
        thumbnail: track.album.images[1]?.url || track.album.images[0]?.url,
        duration: Math.floor(track.duration_ms / 1000),
        url: track.external_urls.spotify,
        preview_url: track.preview_url,
        source: "spotify",
      }));
    } catch (error) {
      console.error("Spotify search error:", error);
      throw new Error("Failed to search Spotify");
    }
  }

  // Universal search
  async searchMedia(query, sources = ["youtube"], maxResults = 10) {
    const results = [];

    for (const source of sources) {
      try {
        if (source === "youtube") {
          const youtubeResults = await this.searchYoutube(query, maxResults);
          results.push(...youtubeResults);
        } else if (source === "spotify") {
          const spotifyResults = await this.searchSpotify(query, maxResults);
          results.push(...spotifyResults);
        }
      } catch (error) {
        console.error(`Error searching ${source}:`, error);
      }
    }

    return results.slice(0, maxResults);
  }

  // Utility methods
  parseDuration(isoDuration) {
    const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const hours = match[1] ? parseInt(match[1]) : 0;
    const minutes = match[2] ? parseInt(match[2]) : 0;
    const seconds = match[3] ? parseInt(match[3]) : 0;
    return hours * 3600 + minutes * 60 + seconds;
  }

  formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    } else {
      return `${minutes}:${secs.toString().padStart(2, "0")}`;
    }
  }
}

module.exports = new MediaService();
