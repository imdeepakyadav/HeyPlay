import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

// Define the styles for the application
export const styles = StyleSheet.create({
  // Container style
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    padding: 16,
  },

  // Centered content
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  // Title style
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000",
  },

  // Subtitle
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#333",
  },

  // Section title
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    marginTop: 8,
    color: "#000",
  },

  // Input field style
  input: {
    width: "100%",
    height: 48,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
    fontSize: 16,
  },

  // Search input
  searchInput: {
    height: 44,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 22,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    fontSize: 16,
    marginBottom: 16,
  },

  // Text area
  textArea: {
    height: 80,
    textAlignVertical: "top",
    paddingTop: 12,
  },

  // Button style
  button: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  // Disabled button
  buttonDisabled: {
    backgroundColor: "#CCCCCC",
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
    fontSize: 16,
  },

  // Header style
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingTop: 10,
  },

  // Room header
  roomHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  // Search container
  searchContainer: {
    marginBottom: 20,
  },

  // Create button style
  createButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },

  // Create button text style
  createButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },

  // Back button
  backButton: {
    padding: 8,
  },

  backButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },

  // Room card style
  roomCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },

  // Room name style
  roomName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#000",
    flex: 1,
  },

  // Room description
  roomDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },

  // Room creator
  roomCreator: {
    fontSize: 14,
    color: "#007AFF",
    marginBottom: 8,
  },

  // Room info container
  roomInfo: {
    marginTop: 8,
  },

  // Participants count style
  participantsCount: {
    color: "#666",
    marginBottom: 4,
    fontSize: 14,
  },

  // Current track style
  currentTrack: {
    color: "#333",
    fontStyle: "italic",
    fontSize: 14,
  },

  // Private indicator
  privateIndicator: {
    fontSize: 16,
    marginLeft: 8,
  },

  // Track card
  trackCard: {
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },

  // Track thumbnail
  trackThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },

  // Track info
  trackInfo: {
    flex: 1,
  },

  // Track title
  trackTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },

  // Track artist
  trackArtist: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },

  // Track meta
  trackMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  // Track source
  trackSource: {
    fontSize: 12,
    color: "#007AFF",
    textTransform: "uppercase",
    fontWeight: "600",
  },

  // Track duration
  trackDuration: {
    fontSize: 12,
    color: "#999",
  },

  // Form styles
  form: {
    marginBottom: 20,
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#000",
  },

  helperText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
    fontStyle: "italic",
  },

  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingVertical: 8,
  },

  // Info container
  infoContainer: {
    backgroundColor: "#F8F9FA",
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },

  infoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#000",
  },

  infoText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
    paddingLeft: 8,
  },

  // Empty state
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },

  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 12,
    textAlign: "center",
  },

  emptyStateText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
  },

  // Loading text
  loadingText: {
    fontSize: 16,
    color: "#666",
    marginTop: 12,
  },

  // Music player styles
  musicPlayer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },

  playerContent: {
    flexDirection: "row",
    alignItems: "center",
  },

  playerThumbnail: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },

  playerInfo: {
    flex: 1,
  },

  playerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 2,
  },

  playerArtist: {
    fontSize: 14,
    color: "#666",
  },

  playerControls: {
    flexDirection: "row",
    alignItems: "center",
  },

  controlButton: {
    padding: 8,
    marginHorizontal: 4,
  },

  // Progress bar
  progressContainer: {
    marginTop: 12,
  },

  progressBar: {
    height: 3,
    backgroundColor: "#E5E5EA",
    borderRadius: 1.5,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#007AFF",
    borderRadius: 1.5,
  },

  progressText: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },

  progressTime: {
    fontSize: 12,
    color: "#666",
  },

  // Profile styles
  profileSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },

  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  profileAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },

  profileAvatarText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
  },

  profileInfo: {
    flex: 1,
  },

  profileName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },

  profileEmail: {
    fontSize: 16,
    color: "#666",
  },

  editButton: {
    backgroundColor: "#F2F2F7",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "flex-start",
  },

  editButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007AFF",
  },

  // Settings styles
  settingsSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },

  aboutSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },

  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },

  settingLabel: {
    fontSize: 16,
    color: "#000",
    fontWeight: "500",
  },

  settingButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },

  settingButtonText: {
    fontSize: 16,
    color: "#000",
  },

  settingButtonArrow: {
    fontSize: 18,
    color: "#C7C7CC",
    fontWeight: "300",
  },

  versionInfo: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F2F2F7",
    alignItems: "center",
  },

  versionText: {
    fontSize: 14,
    color: "#999",
  },

  // Danger zone styles
  dangerSection: {
    marginBottom: 40,
  },

  dangerButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#FF3B30",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },

  dangerButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF3B30",
    textAlign: "center",
  },

  logoutButton: {
    backgroundColor: "#FF3B30",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  logoutButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },

  // Room screen styles
  roomScreenHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },

  roomTitleContainer: {
    flex: 1,
    alignItems: "center",
  },

  roomScreenTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },

  roomScreenSubtitle: {
    fontSize: 14,
    color: "#666",
  },

  leaveButton: {
    backgroundColor: "#FF3B30",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },

  leaveButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },

  // Current track styles
  currentTrackContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },

  currentTrackTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },

  trackDisplay: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  playButton: {
    backgroundColor: "#007AFF",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  playButtonText: {
    fontSize: 16,
  },

  // Tab styles
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#F2F2F7",
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
  },

  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 6,
  },

  activeTab: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },

  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },

  activeTabText: {
    color: "#007AFF",
    fontWeight: "600",
  },

  tabContent: {
    flex: 1,
  },

  // Messages styles
  messagesList: {
    flex: 1,
    marginBottom: 16,
  },

  messageContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },

  messageUser: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007AFF",
    marginBottom: 4,
  },

  messageContent: {
    fontSize: 16,
    color: "#000",
    marginBottom: 4,
  },

  messageTime: {
    fontSize: 12,
    color: "#999",
  },

  messageInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },

  messageInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    paddingRight: 12,
  },

  sendButton: {
    backgroundColor: "#007AFF",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },

  sendButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },

  // Participants styles
  participantContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },

  participantAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  participantAvatarText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },

  participantInfo: {
    flex: 1,
  },

  participantName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 2,
  },

  participantRole: {
    fontSize: 14,
    color: "#666",
    textTransform: "capitalize",
  },
});
