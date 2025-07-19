import { NavigationProp, RouteProp } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { API_BASE_URL } from "../config/constants";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { styles } from "../css/styles";

type RoomScreenRouteProp = RouteProp<{ Room: { roomId: string } }, "Room">;

interface RoomScreenProps {
  navigation: NavigationProp<any>;
  route: RoomScreenRouteProp;
}

interface Message {
  _id: string;
  user: {
    username: string;
  };
  content: string;
  timestamp: string;
}

interface Participant {
  user: {
    _id: string;
    username: string;
  };
  role: string;
}

interface Room {
  _id: string;
  name: string;
  description: string;
  participants: Participant[];
  messages: Message[];
  currentTrack?: {
    title: string;
    artist: string;
    url: string;
    thumbnail: string;
    isPlaying: boolean;
    currentTime: number;
  };
}

export default function RoomScreen({ navigation, route }: RoomScreenProps) {
  const { roomId } = route.params;
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"chat" | "participants">("chat");
  const { user, token } = useAuth();
  const { socket, joinRoom, leaveRoom, sendMessage, controlTrack } =
    useSocket();

  useEffect(() => {
    fetchRoomDetails();

    if (socket) {
      joinRoom(roomId);

      // Socket event listeners
      socket.on("user-joined", handleUserJoined);
      socket.on("user-left", handleUserLeft);
      socket.on("new-message", handleNewMessage);
      socket.on("track-update", handleTrackUpdate);
      socket.on("room-state", handleRoomState);

      return () => {
        socket.off("user-joined");
        socket.off("user-left");
        socket.off("new-message");
        socket.off("track-update");
        socket.off("room-state");
        leaveRoom(roomId);
      };
    }
  }, [socket, roomId]);

  const fetchRoomDetails = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/rooms/${roomId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRoom(data);
      } else {
        throw new Error("Failed to fetch room details");
      }
    } catch (error) {
      console.error("Error fetching room:", error);
      Alert.alert("Error", "Failed to load room. Going back.");
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleUserJoined = (data: any) => {
    console.log("User joined:", data);
    // Refresh room data or update participants
    fetchRoomDetails();
  };

  const handleUserLeft = (data: any) => {
    console.log("User left:", data);
    // Refresh room data or update participants
    fetchRoomDetails();
  };

  const handleNewMessage = (data: any) => {
    if (room) {
      setRoom((prev) =>
        prev
          ? {
              ...prev,
              messages: [...prev.messages, data.message],
            }
          : null
      );
    }
  };

  const handleTrackUpdate = (data: any) => {
    if (room) {
      setRoom((prev) =>
        prev
          ? {
              ...prev,
              currentTrack: data.track,
            }
          : null
      );
    }
  };

  const handleRoomState = (data: any) => {
    if (room) {
      setRoom((prev) =>
        prev
          ? {
              ...prev,
              currentTrack: data.currentTrack,
              participants: data.participants,
            }
          : null
      );
    }
  };

  const handleSendMessage = () => {
    if (message.trim() && user) {
      sendMessage(roomId, message.trim());
      setMessage("");
    }
  };

  const handlePlayPause = () => {
    if (room?.currentTrack) {
      const action = room.currentTrack.isPlaying ? "pause" : "play";
      controlTrack(roomId, action, room.currentTrack);
    }
  };

  const leaveRoomAction = () => {
    Alert.alert("Leave Room", "Are you sure you want to leave this room?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Leave",
        onPress: () => {
          leaveRoom(roomId);
          navigation.goBack();
        },
      },
    ]);
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={styles.messageContainer}>
      <Text style={styles.messageUser}>{item.user.username}</Text>
      <Text style={styles.messageContent}>{item.content}</Text>
      <Text style={styles.messageTime}>
        {new Date(item.timestamp).toLocaleTimeString()}
      </Text>
    </View>
  );

  const renderParticipant = ({ item }: { item: Participant }) => (
    <View style={styles.participantContainer}>
      <View style={styles.participantAvatar}>
        <Text style={styles.participantAvatarText}>
          {item.user.username.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.participantInfo}>
        <Text style={styles.participantName}>{item.user.username}</Text>
        <Text style={styles.participantRole}>{item.role}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading room...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!room) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.emptyStateTitle}>Room not found</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.roomScreenHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.roomTitleContainer}>
          <Text style={styles.roomScreenTitle}>{room.name}</Text>
          <Text style={styles.roomScreenSubtitle}>
            {room.participants.length} participants
          </Text>
        </View>
        <TouchableOpacity style={styles.leaveButton} onPress={leaveRoomAction}>
          <Text style={styles.leaveButtonText}>Leave</Text>
        </TouchableOpacity>
      </View>

      {/* Current Track */}
      {room.currentTrack && (
        <View style={styles.currentTrackContainer}>
          <Text style={styles.currentTrackTitle}>Now Playing</Text>
          <View style={styles.trackDisplay}>
            <Text style={styles.trackTitle}>{room.currentTrack.title}</Text>
            <Text style={styles.trackArtist}>{room.currentTrack.artist}</Text>
            <TouchableOpacity
              style={styles.playButton}
              onPress={handlePlayPause}
            >
              <Text style={styles.playButtonText}>
                {room.currentTrack.isPlaying ? "⏸️" : "▶️"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "chat" && styles.activeTab]}
          onPress={() => setActiveTab("chat")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "chat" && styles.activeTabText,
            ]}
          >
            Chat
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "participants" && styles.activeTab]}
          onPress={() => setActiveTab("participants")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "participants" && styles.activeTabText,
            ]}
          >
            Participants
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.tabContent}>
        {activeTab === "chat" ? (
          <>
            <FlatList
              data={room.messages}
              renderItem={renderMessage}
              keyExtractor={(item) => item._id}
              style={styles.messagesList}
              showsVerticalScrollIndicator={false}
            />
            <View style={styles.messageInputContainer}>
              <TextInput
                style={styles.messageInput}
                placeholder="Type a message..."
                value={message}
                onChangeText={setMessage}
                onSubmitEditing={handleSendMessage}
                returnKeyType="send"
              />
              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleSendMessage}
              >
                <Text style={styles.sendButtonText}>Send</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <FlatList
            data={room.participants}
            renderItem={renderParticipant}
            keyExtractor={(item) => item.user._id}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
