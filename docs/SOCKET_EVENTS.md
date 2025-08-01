# Socket.io Events Documentation

This document describes all real-time events used in HeyPlay for WebSocket communication.

## 🔌 Connection & Authentication

### Client Connection

```javascript
// Client connects to server
const socket = io("http://localhost:5000", {
  auth: {
    token: accessToken, // JWT access token
  },
});
```

### Server Authentication

```javascript
// Server validates token on connection
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  // Validate JWT token
  // Attach user to socket
  next();
});
```

## 🏠 Room Events

### Join Room

**Client → Server**

```javascript
socket.emit("join-room", {
  roomId: "room_id_here",
  password: "optional_password", // for private rooms
});
```

**Server → All Room Members**

```javascript
socket.to(roomId).emit("user-joined", {
  user: {
    id: "user_id",
    username: "username",
    profilePicture: "url",
  },
  timestamp: "2025-01-01T00:00:00.000Z",
  participantCount: 5,
});
```

### Leave Room

**Client → Server**

```javascript
socket.emit("leave-room", {
  roomId: "room_id_here",
});
```

**Server → All Room Members**

```javascript
socket.to(roomId).emit("user-left", {
  user: {
    id: "user_id",
    username: "username",
  },
  timestamp: "2025-01-01T00:00:00.000Z",
  participantCount: 4,
});
```

### Room State Update

**Server → Client (on join)**

```javascript
socket.emit("room-state", {
  room: {
    id: "room_id",
    name: "Room Name",
    description: "Room Description",
    currentTrack: {
      trackId: "track_id",
      url: "media_url",
      title: "Song Title",
      artist: "Artist Name",
      duration: 240, // seconds
      thumbnail: "thumbnail_url",
      position: 120, // current position in seconds
      isPlaying: true,
      startTime: "2025-01-01T00:00:00.000Z",
    },
    participants: [
      {
        id: "user_id",
        username: "username",
        role: "admin", // 'admin', 'moderator', 'member'
        isActive: true,
      },
    ],
  },
});
```

## 🎵 Media Control Events

### Play/Pause Track

**Client → Server**

```javascript
socket.emit("track-control", {
  roomId: "room_id",
  action: "play", // 'play', 'pause'
  position: 120, // current position in seconds
});
```

**Server → All Room Members**

```javascript
socket.to(roomId).emit("track-update", {
  action: "play",
  position: 120,
  timestamp: "2025-01-01T00:00:00.000Z",
  startTime: "2025-01-01T00:00:00.000Z",
  isPlaying: true,
  updatedBy: {
    id: "user_id",
    username: "username",
  },
});
```

### Seek Track

**Client → Server**

```javascript
socket.emit("track-control", {
  roomId: "room_id",
  action: "seek",
  position: 180, // new position in seconds
});
```

**Server → All Room Members**

```javascript
socket.to(roomId).emit("track-update", {
  action: "seek",
  position: 180,
  timestamp: "2025-01-01T00:00:00.000Z",
  startTime: "2025-01-01T00:00:00.000Z",
  isPlaying: true,
  updatedBy: {
    id: "user_id",
    username: "username",
  },
});
```

### Change Track

**Client → Server**

```javascript
socket.emit("track-control", {
  roomId: "room_id",
  action: "change",
  track: {
    trackId: "new_track_id",
    url: "new_media_url",
    title: "New Song Title",
    artist: "New Artist",
    duration: 300,
    thumbnail: "new_thumbnail_url",
  },
});
```

**Server → All Room Members**

```javascript
socket.to(roomId).emit("track-update", {
  action: "change",
  track: {
    trackId: "new_track_id",
    url: "new_media_url",
    title: "New Song Title",
    artist: "New Artist",
    duration: 300,
    thumbnail: "new_thumbnail_url",
  },
  position: 0,
  timestamp: "2025-01-01T00:00:00.000Z",
  startTime: "2025-01-01T00:00:00.000Z",
  isPlaying: true,
  updatedBy: {
    id: "user_id",
    username: "username",
  },
});
```

## 💬 Chat Events

### Send Message

**Client → Server**

```javascript
socket.emit("send-message", {
  roomId: "room_id",
  content: "Hello everyone!",
  type: "text", // 'text', 'emoji', 'system'
});
```

**Server → All Room Members**

```javascript
socket.to(roomId).emit("new-message", {
  id: "message_id",
  content: "Hello everyone!",
  type: "text",
  sender: {
    id: "user_id",
    username: "username",
    profilePicture: "url",
  },
  timestamp: "2025-01-01T00:00:00.000Z",
  reactions: [],
});
```

### Send Reaction

**Client → Server**

```javascript
socket.emit("send-reaction", {
  roomId: "room_id",
  emoji: "🎵",
  messageId: "message_id", // optional, for message reactions
});
```

**Server → All Room Members**

```javascript
socket.to(roomId).emit("new-reaction", {
  emoji: "🎵",
  user: {
    id: "user_id",
    username: "username",
  },
  messageId: "message_id", // if reacting to message
  timestamp: "2025-01-01T00:00:00.000Z",
});
```

### Message Reaction Update

**Server → All Room Members** (when someone reacts to a message)

```javascript
socket.to(roomId).emit("message-reaction-update", {
  messageId: "message_id",
  reactions: [
    {
      emoji: "👍",
      users: [
        { id: "user1", username: "user1" },
        { id: "user2", username: "user2" },
      ],
      count: 2,
    },
  ],
});
```

## 👥 User Events

### User Status Update

**Server → All Room Members** (when user goes online/offline)

```javascript
socket.to(roomId).emit("user-status-update", {
  user: {
    id: "user_id",
    username: "username",
  },
  status: "online", // 'online', 'offline', 'away'
  timestamp: "2025-01-01T00:00:00.000Z",
});
```

### User Role Update

**Server → All Room Members** (when user role changes)

```javascript
socket.to(roomId).emit("user-role-update", {
  user: {
    id: "user_id",
    username: "username",
  },
  oldRole: "member",
  newRole: "moderator",
  updatedBy: {
    id: "admin_id",
    username: "admin_username",
  },
  timestamp: "2025-01-01T00:00:00.000Z",
});
```

## 🎶 Playlist Events

### Add to Queue

**Client → Server**

```javascript
socket.emit("queue-add", {
  roomId: "room_id",
  track: {
    trackId: "track_id",
    url: "media_url",
    title: "Song Title",
    artist: "Artist Name",
    duration: 240,
    thumbnail: "thumbnail_url",
  },
});
```

**Server → All Room Members**

```javascript
socket.to(roomId).emit("queue-update", {
  action: "add",
  track: {
    trackId: "track_id",
    url: "media_url",
    title: "Song Title",
    artist: "Artist Name",
    duration: 240,
    thumbnail: "thumbnail_url",
    addedBy: {
      id: "user_id",
      username: "username",
    },
    addedAt: "2025-01-01T00:00:00.000Z",
  },
  queue: [
    /* updated queue array */
  ],
});
```

### Remove from Queue

**Client → Server**

```javascript
socket.emit("queue-remove", {
  roomId: "room_id",
  trackId: "track_id",
});
```

**Server → All Room Members**

```javascript
socket.to(roomId).emit("queue-update", {
  action: "remove",
  trackId: "track_id",
  removedBy: {
    id: "user_id",
    username: "username",
  },
  queue: [
    /* updated queue array */
  ],
});
```

### Reorder Queue

**Client → Server**

```javascript
socket.emit("queue-reorder", {
  roomId: "room_id",
  trackId: "track_id",
  newPosition: 2, // new position in queue
});
```

## 🔔 System Events

### Room Full

**Server → Client** (when trying to join full room)

```javascript
socket.emit("room-full", {
  roomId: "room_id",
  maxParticipants: 50,
  currentParticipants: 50,
});
```

### Room Closed

**Server → All Room Members** (when room is deleted)

```javascript
socket.to(roomId).emit("room-closed", {
  reason: "deleted", // 'deleted', 'inactive'
  message: "Room has been deleted by admin",
  timestamp: "2025-01-01T00:00:00.000Z",
});
```

### Server Announcement

**Server → All Connected Users**

```javascript
io.emit("server-announcement", {
  type: "maintenance", // 'maintenance', 'update', 'notice'
  title: "Scheduled Maintenance",
  message: "Server will be down for maintenance in 10 minutes",
  timestamp: "2025-01-01T00:00:00.000Z",
});
```

## 🚨 Error Events

### Join Room Error

**Server → Client**

```javascript
socket.emit("join-room-error", {
  code: "ROOM_NOT_FOUND", // 'ROOM_NOT_FOUND', 'WRONG_PASSWORD', 'ROOM_FULL'
  message: "Room not found",
  roomId: "room_id",
});
```

### Permission Error

**Server → Client**

```javascript
socket.emit("permission-error", {
  action: "track-control",
  code: "INSUFFICIENT_PERMISSIONS",
  message: "Only admins and moderators can control playback",
  requiredRole: "moderator",
});
```

### Rate Limit Error

**Server → Client**

```javascript
socket.emit("rate-limit-error", {
  action: "send-message",
  message: "Too many messages sent. Please wait.",
  retryAfter: 5000, // milliseconds
});
```

## 🔧 Connection Events

### Disconnect

**Client/Server**

```javascript
socket.on("disconnect", (reason) => {
  // Handle disconnect
  // Clean up user from rooms
  // Notify other participants
});
```

### Reconnect

**Client**

```javascript
socket.on("connect", () => {
  // Rejoin previous rooms
  // Sync current state
});
```

### Connection Error

**Client**

```javascript
socket.on("connect_error", (error) => {
  // Handle connection errors
  // Implement reconnection logic
});
```

## 📱 Client Implementation Examples

### React/Next.js Web Client

```typescript
import { io, Socket } from "socket.io-client";

class SocketService {
  private socket: Socket | null = null;

  connect(token: string): void {
    this.socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      auth: { token },
    });

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    // Room events
    this.socket.on("user-joined", this.handleUserJoined);
    this.socket.on("user-left", this.handleUserLeft);
    this.socket.on("room-state", this.handleRoomState);

    // Media events
    this.socket.on("track-update", this.handleTrackUpdate);

    // Chat events
    this.socket.on("new-message", this.handleNewMessage);
    this.socket.on("new-reaction", this.handleNewReaction);
  }

  joinRoom(roomId: string, password?: string): void {
    this.socket?.emit("join-room", { roomId, password });
  }

  sendMessage(roomId: string, content: string): void {
    this.socket?.emit("send-message", { roomId, content, type: "text" });
  }
}
```

### React Native Client

```typescript
import { io } from "socket.io-client";

class MobileSocketService {
  // Similar implementation with React Native considerations
  // Handle app state changes (background/foreground)
  // Implement reconnection on network changes
}
```

## 📊 Event Rate Limits

| Event Type      | Limit        | Window   |
| --------------- | ------------ | -------- |
| `send-message`  | 30 messages  | 1 minute |
| `send-reaction` | 60 reactions | 1 minute |
| `track-control` | 10 controls  | 1 minute |
| `queue-add`     | 20 additions | 1 minute |

## 🔍 Debugging Events

### Enable Debug Mode

```javascript
// Client-side debugging
localStorage.debug = 'socket.io-client:socket';

// Server-side debugging
DEBUG=socket.io:* npm start
```

### Event Logging

```javascript
// Log all events for debugging
socket.onAny((eventName, ...args) => {
  console.log(`Event: ${eventName}`, args);
});
```

---

For testing Socket.io events, see the test files in `/backend/tests/socket.test.js` and use the Socket.io testing tools.
