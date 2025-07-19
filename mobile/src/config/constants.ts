// API Configuration
export const API_BASE_URL = __DEV__
  ? "http://localhost:5000"
  : "https://your-production-api.com";

// Socket Configuration
export const SOCKET_URL = API_BASE_URL;

// Media player configuration
export const MUSIC_PLAYER_CONFIG = {
  enableBackgroundMode: true,
  enableCompactNotification: true,
  playInBackground: true,
};

// App Configuration
export const APP_CONFIG = {
  name: "HeyPlay",
  version: "1.0.0",
  supportEmail: "support@heyplay.com",
};

// Colors
export const COLORS = {
  primary: "#007AFF",
  secondary: "#5856D6",
  success: "#34C759",
  warning: "#FF9500",
  error: "#FF3B30",
  background: "#F2F2F7",
  surface: "#FFFFFF",
  text: "#000000",
  textSecondary: "#666666",
  border: "#E5E5EA",
};

// Fonts
export const FONTS = {
  regular: "System",
  medium: "System",
  bold: "System",
  light: "System",
};

// Dimensions
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Breakpoints
export const BREAKPOINTS = {
  small: 480,
  medium: 768,
  large: 1024,
};
