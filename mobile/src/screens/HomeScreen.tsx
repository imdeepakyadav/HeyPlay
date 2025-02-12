// mobile/src/screens/HomeScreen.tsx
import React, { useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "../css/styles";

import { NavigationProp } from '@react-navigation/native';

export default function HomeScreen({ navigation }: { navigation: NavigationProp<any> }) {
  const [rooms, setRooms] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRooms = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/rooms");
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
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

  const renderRoom = ({ item }: { item: { _id: string; name: string; participants: any[]; currentTrack?: { title: string } } }) => (
    <TouchableOpacity
      style={styles.roomCard}
      onPress={() => navigation.navigate("Room", { roomId: item._id })}
    >
      <Text style={styles.roomName}>{item.name}</Text>
      <Text style={styles.participantsCount}>
        {item.participants.length} listening
      </Text>
      <Text style={styles.currentTrack}>
        {item.currentTrack?.title || "No track playing"}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>HeyPlay</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => navigation.navigate("CreateRoom")}
        >
          <Text style={styles.createButtonText}>Create Room</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={rooms}
        renderItem={renderRoom}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}
