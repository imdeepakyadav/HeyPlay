import { NavigationProp } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { API_BASE_URL } from "../config/constants";
import { useAuth } from "../context/AuthContext";
import { styles } from "../css/styles";

interface Room {
  _id: string;
  name: string;
  description: string;
  creator: {
    username: string;
  };
  participants: any[];
  currentTrack?: {
    title: string;
    artist: string;
  };
  isPrivate: boolean;
}

interface HomeScreenProps {
  navigation: NavigationProp<any>;
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();

  const fetchRooms = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/rooms`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRooms(data);
      } else {
        throw new Error("Failed to fetch rooms");
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
      Alert.alert("Error", "Failed to load rooms. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRooms();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const joinRoom = async (room: Room) => {
    if (room.isPrivate) {
      Alert.prompt(
        "Private Room",
        "Enter room password:",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Join",
            onPress: async (password) => {
              try {
                const response = await fetch(
                  `${API_BASE_URL}/api/rooms/${room._id}/join`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ password }),
                  }
                );

                if (response.ok) {
                  navigation.navigate("Room", { roomId: room._id });
                } else {
                  const data = await response.json();
                  Alert.alert("Error", data.message || "Failed to join room");
                }
              } catch (error) {
                console.error("Error joining room:", error);
                Alert.alert("Error", "Failed to join room");
              }
            },
          },
        ],
        "secure-text"
      );
    } else {
      navigation.navigate("Room", { roomId: room._id });
    }
  };

  const renderRoom = ({ item }: { item: Room }) => (
    <TouchableOpacity style={styles.roomCard} onPress={() => joinRoom(item)}>
      <View style={styles.roomHeader}>
        <Text style={styles.roomName}>{item.name}</Text>
        {item.isPrivate && <Text style={styles.privateIndicator}>🔒</Text>}
      </View>

      {item.description ? (
        <Text style={styles.roomDescription}>{item.description}</Text>
      ) : null}

      <Text style={styles.roomCreator}>by {item.creator.username}</Text>

      <View style={styles.roomInfo}>
        <Text style={styles.participantsCount}>
          👥 {item.participants.length} listening
        </Text>
        {item.currentTrack ? (
          <Text style={styles.currentTrack}>
            🎵 {item.currentTrack.title} - {item.currentTrack.artist}
          </Text>
        ) : (
          <Text style={styles.currentTrack}>No track playing</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading rooms...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Hey, {user?.username}! 👋</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => navigation.navigate("CreateRoom")}
        >
          <Text style={styles.createButtonText}>+ Create Room</Text>
        </TouchableOpacity>
      </View>

      {rooms.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>No rooms available</Text>
          <Text style={styles.emptyStateText}>
            Be the first to create a room and start listening together!
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("CreateRoom")}
          >
            <Text style={styles.buttonText}>Create Your First Room</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={rooms}
          renderItem={renderRoom}
          keyExtractor={(item) => item._id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}
