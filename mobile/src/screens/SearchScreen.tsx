import { NavigationProp } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { API_BASE_URL } from "../config/constants";
import { useAuth } from "../context/AuthContext";
import { styles } from "../css/styles";

interface Track {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  url: string;
  duration?: number;
  source: string;
}

interface SearchScreenProps {
  navigation: NavigationProp<any>;
}

export default function SearchScreen({ navigation }: SearchScreenProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [trending, setTrending] = useState<Track[]>([]);
  const { token } = useAuth();

  useEffect(() => {
    fetchTrending();
  }, []);

  const fetchTrending = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/media/trending`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTrending(data.results || []);
      }
    } catch (error) {
      console.error("Error fetching trending:", error);
    }
  };

  const searchMedia = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/media/search?q=${encodeURIComponent(
          searchQuery
        )}&sources=youtube&limit=20`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setResults(data.results || []);
      } else {
        throw new Error("Search failed");
      }
    } catch (error) {
      console.error("Error searching media:", error);
      Alert.alert("Error", "Failed to search. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text: string) => {
    setQuery(text);

    // Debounce search
    const timeoutId = setTimeout(() => {
      searchMedia(text);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  const playTrack = (track: Track) => {
    // For now, just show an alert. In a full implementation,
    // you'd need to select a room or create a quick room
    Alert.alert(
      "Play Track",
      `Would you like to play "${track.title}" by ${track.artist}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Create Room & Play",
          onPress: () => {
            // Navigate to create room with this track
            navigation.navigate("CreateRoom", { initialTrack: track });
          },
        },
      ]
    );
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const renderTrack = ({ item }: { item: Track }) => (
    <TouchableOpacity style={styles.trackCard} onPress={() => playTrack(item)}>
      <Image
        source={{ uri: item.thumbnail }}
        style={styles.trackThumbnail}
        defaultSource={require("../../assets/icon.png")}
      />
      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.trackArtist} numberOfLines={1}>
          {item.artist}
        </Text>
        <View style={styles.trackMeta}>
          <Text style={styles.trackSource}>{item.source}</Text>
          {item.duration && (
            <Text style={styles.trackDuration}>
              {formatDuration(item.duration)}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const displayData = query.trim() ? results : trending;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <Text style={styles.title}>Search Music</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for songs, artists, albums..."
          value={query}
          onChangeText={handleSearch}
          clearButtonMode="while-editing"
        />
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      ) : (
        <>
          <Text style={styles.sectionTitle}>
            {query.trim() ? `Results for "${query}"` : "Trending Now"}
          </Text>

          {displayData.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateTitle}>
                {query.trim() ? "No results found" : "No trending tracks"}
              </Text>
              <Text style={styles.emptyStateText}>
                {query.trim()
                  ? "Try searching with different keywords"
                  : "Check back later for trending content"}
              </Text>
            </View>
          ) : (
            <FlatList
              data={displayData}
              renderItem={renderTrack}
              keyExtractor={(item) => `${item.source}-${item.id}`}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 100 }}
            />
          )}
        </>
      )}
    </SafeAreaView>
  );
}
