import { NavigationProp } from "@react-navigation/native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { API_BASE_URL } from "../config/constants";
import { useAuth } from "../context/AuthContext";
import { styles } from "../css/styles";

interface CreateRoomScreenProps {
  navigation: NavigationProp<any>;
}

export default function CreateRoomScreen({
  navigation,
}: CreateRoomScreenProps) {
  const [roomName, setRoomName] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const createRoom = async () => {
    if (!roomName.trim()) {
      Alert.alert("Error", "Please enter a room name");
      return;
    }

    if (isPrivate && !password.trim()) {
      Alert.alert("Error", "Please enter a password for private room");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/rooms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: roomName.trim(),
          description: description.trim(),
          isPrivate,
          password: isPrivate ? password : undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Room created successfully!", [
          {
            text: "OK",
            onPress: () => {
              navigation.goBack();
              navigation.navigate("Room", { roomId: data._id });
            },
          },
        ]);
      } else {
        Alert.alert("Error", data.message || "Failed to create room");
      }
    } catch (error) {
      console.error("Error creating room:", error);
      Alert.alert("Error", "Failed to create room. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Create Room</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Room Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter room name"
            value={roomName}
            onChangeText={setRoomName}
            maxLength={50}
          />

          <Text style={styles.label}>Description (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe your room..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            maxLength={200}
          />

          <View style={styles.switchContainer}>
            <Text style={styles.label}>Private Room</Text>
            <Switch
              value={isPrivate}
              onValueChange={setIsPrivate}
              trackColor={{ false: "#767577", true: "#007AFF" }}
              thumbColor={isPrivate ? "#fff" : "#f4f3f4"}
            />
          </View>

          {isPrivate && (
            <>
              <Text style={styles.label}>Room Password *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                maxLength={20}
              />
              <Text style={styles.helperText}>
                Only people with this password can join your room
              </Text>
            </>
          )}
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={createRoom}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Create Room</Text>
          )}
        </TouchableOpacity>

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Room Features:</Text>
          <Text style={styles.infoText}>• Real-time music & video sync</Text>
          <Text style={styles.infoText}>• Live chat & reactions</Text>
          <Text style={styles.infoText}>• Background music playback</Text>
          <Text style={styles.infoText}>• Collaborative playlists</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
