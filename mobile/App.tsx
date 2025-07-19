import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { ActivityIndicator, View } from "react-native";

// Import screens
import AuthScreen from "./src/screens/AuthScreen";
import CreateRoomScreen from "./src/screens/CreateRoomScreen";
import HomeScreen from "./src/screens/HomeScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import RoomScreen from "./src/screens/RoomScreen";
import SearchScreen from "./src/screens/SearchScreen";

// Import context
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { SocketProvider } from "./src/context/SocketContext";

// Import components
import { MusicPlayer } from "./src/components/MusicPlayer";

// Import types
import { RootStackParamList, TabParamList } from "./src/types/navigation";

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// Tab Navigator for authenticated users
function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "#999",
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Rooms",
          // tabBarIcon: ({ color, size }) => (
          //   <Icon name="home" size={size} color={color} />
          // ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarLabel: "Search",
          // tabBarIcon: ({ color, size }) => (
          //   <Icon name="search" size={size} color={color} />
          // ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
          // tabBarIcon: ({ color, size }) => (
          //   <Icon name="user" size={size} color={color} />
          // ),
        }}
      />
    </Tab.Navigator>
  );
}

// Stack Navigator
function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {user ? (
          // Authenticated screens
          <>
            <Stack.Screen name="MainTabs" component={MainTabNavigator} />
            <Stack.Screen name="Room" component={RoomScreen} />
            <Stack.Screen name="CreateRoom" component={CreateRoomScreen} />
          </>
        ) : (
          // Unauthenticated screens
          <Stack.Screen name="Auth" component={AuthScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <AppNavigator />
        <MusicPlayer />
        <StatusBar style="auto" />
      </SocketProvider>
    </AuthProvider>
  );
}
