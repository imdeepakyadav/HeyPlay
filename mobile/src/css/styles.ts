import { StyleSheet } from "react-native";

// Define the styles for the application
export const styles = StyleSheet.create({
  // Container style
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },

  // Title style
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },

  // Input field style
  input: {
    width: "100%",
    height: 48,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
  },

  // Button style
  button: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },

  // Button text style
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  // Switch text style
  switchText: {
    color: "#007AFF",
    textAlign: "center",
  },

  // Header style
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  // Create button style
  createButton: {
    backgroundColor: "#007AFF",
    padding: 8,
    borderRadius: 8,
  },

  // Create button text style
  createButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  // Room card style
  roomCard: {
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },

  // Room name style
  roomName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },

  // Participants count style
  participantsCount: {
    color: "#666",
    marginBottom: 4,
  },

  // Current track style
  currentTrack: {
    color: "#333",
    fontStyle: "italic",
  },
});
