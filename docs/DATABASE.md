# Database Schema

This document describes the MongoDB database schema for HeyPlay.

## Collections Overview

- **users** - User accounts and profiles
- **rooms** - Chat rooms and media sessions
- **messages** - Chat messages within rooms
- **refresh_tokens** - JWT refresh tokens for session management
- **login_attempts** - Failed login attempt tracking

## Users Collection

Stores user account information, authentication data, and profile details.

```javascript
{
  _id: ObjectId,
  username: String, // unique
  email: String, // unique, indexed
  password: String, // bcrypt hashed

  // Profile
  profilePicture: String, // URL or base64
  bio: String,

  // Email Verification
  isEmailVerified: Boolean, // default: false
  emailVerificationOTP: String,
  emailVerificationExpires: Date,

  // Password Reset
  passwordResetOTP: String,
  passwordResetExpires: Date,

  // Authentication
  lastLogin: Date,
  loginAttempts: Number, // default: 0
  lockUntil: Date,

  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

### Indexes

```javascript
// Compound index for email lookups
{
  email: 1;
}

// Username uniqueness
{
  username: 1;
}

// OTP expiration cleanup
{
  emailVerificationExpires: 1;
}
{
  passwordResetExpires: 1;
}

// Account locking
{
  lockUntil: 1;
}
```

### Virtual Properties

```javascript
// Check if account is locked
isLocked: function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
}
```

## Rooms Collection

Stores room information, settings, and current state.

```javascript
{
  _id: ObjectId,
  name: String, // required
  description: String,

  // Privacy Settings
  isPrivate: Boolean, // default: false
  password: String, // bcrypt hashed, optional

  // Room State
  currentTrack: {
    trackId: String,
    url: String,
    title: String,
    artist: String,
    duration: Number, // seconds
    thumbnail: String,
    position: Number, // current position in seconds
    isPlaying: Boolean,
    startTime: Date // when current playback started
  },

  // Participants
  participants: [{
    user: ObjectId, // ref: 'User'
    role: String, // 'admin', 'moderator', 'member'
    joinedAt: Date,
    isActive: Boolean // currently in room
  }],

  // Room Settings
  maxParticipants: Number, // default: 50
  allowChat: Boolean, // default: true
  allowReactions: Boolean, // default: true

  // Moderation
  bannedUsers: [ObjectId], // ref: 'User'

  // Statistics
  totalMessages: Number, // default: 0
  totalParticipants: Number, // default: 0

  // Metadata
  creator: ObjectId, // ref: 'User'
  createdAt: Date,
  updatedAt: Date,
  lastActivity: Date
}
```

### Indexes

```javascript
// Public room discovery
{ isPrivate: 1, lastActivity: -1 }

// Creator's rooms
{ creator: 1, createdAt: -1 }

// Participant lookups
{ "participants.user": 1 }

// Active rooms
{ lastActivity: -1 }
```

## Messages Collection

Stores chat messages within rooms.

```javascript
{
  _id: ObjectId,
  room: ObjectId, // ref: 'Room'
  sender: ObjectId, // ref: 'User'

  // Message Content
  content: String,
  type: String, // 'text', 'emoji', 'system', 'media'

  // Message Metadata
  edited: Boolean, // default: false
  editedAt: Date,
  deleted: Boolean, // default: false
  deletedAt: Date,

  // Reactions
  reactions: [{
    user: ObjectId, // ref: 'User'
    emoji: String,
    createdAt: Date
  }],

  // Media (for media type messages)
  media: {
    type: String, // 'image', 'audio', 'video'
    url: String,
    filename: String,
    size: Number
  },

  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

### Indexes

```javascript
// Room message history
{ room: 1, createdAt: -1 }

// User's messages
{ sender: 1, createdAt: -1 }

// Message type filtering
{ room: 1, type: 1, createdAt: -1 }
```

## Refresh Tokens Collection

Manages JWT refresh tokens for secure session handling.

```javascript
{
  _id: ObjectId,
  user: ObjectId, // ref: 'User'
  token: String, // hashed refresh token

  // Token Metadata
  issuedAt: Date,
  expiresAt: Date,
  lastUsed: Date,

  // Device Information
  userAgent: String,
  ipAddress: String,
  deviceInfo: {
    platform: String, // 'web', 'mobile'
    browser: String,
    os: String
  },

  // Status
  isRevoked: Boolean, // default: false
  revokedAt: Date,
  revokedReason: String, // 'logout', 'security', 'expired'

  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

### Indexes

```javascript
// Token lookup
{ token: 1 }

// User's active tokens
{ user: 1, isRevoked: 1, expiresAt: 1 }

// Cleanup expired tokens
{ expiresAt: 1 }

// Security monitoring
{ user: 1, createdAt: -1 }
```

## Login Attempts Collection

Tracks failed login attempts for security monitoring.

```javascript
{
  _id: ObjectId,
  email: String, // attempted email
  ipAddress: String,
  userAgent: String,

  // Attempt Details
  success: Boolean,
  failureReason: String, // 'invalid_credentials', 'account_locked', etc.

  // Geographic Information (optional)
  location: {
    country: String,
    city: String,
    coordinates: [Number] // [longitude, latitude]
  },

  // Timestamps
  createdAt: Date
}
```

### Indexes

```javascript
// Email-based attempt tracking
{ email: 1, createdAt: -1 }

// IP-based attempt tracking
{ ipAddress: 1, createdAt: -1 }

// Cleanup old attempts (TTL index)
{ createdAt: 1 }, { expireAfterSeconds: 2592000 } // 30 days
```

## Playlists Collection (Future)

For collaborative playlist functionality.

```javascript
{
  _id: ObjectId,
  room: ObjectId, // ref: 'Room'
  name: String,
  description: String,

  // Tracks
  tracks: [{
    trackId: String,
    url: String,
    title: String,
    artist: String,
    duration: Number,
    thumbnail: String,
    addedBy: ObjectId, // ref: 'User'
    addedAt: Date,
    order: Number
  }],

  // Metadata
  creator: ObjectId, // ref: 'User'
  isCollaborative: Boolean, // default: true
  totalDuration: Number, // seconds

  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

## Database Relationships

```
User (1) ←→ (N) RefreshToken
User (1) ←→ (N) Room (as creator)
User (N) ←→ (N) Room (as participant)
Room (1) ←→ (N) Message
User (1) ←→ (N) Message (as sender)
User (1) ←→ (N) LoginAttempt
```

## Data Validation

### User Schema Validation

```javascript
// Email format
email: {
  type: String,
  required: true,
  unique: true,
  match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
}

// Username constraints
username: {
  type: String,
  required: true,
  unique: true,
  minlength: 3,
  maxlength: 30,
  match: /^[a-zA-Z0-9_]+$/
}

// Password strength (handled by bcrypt)
password: {
  type: String,
  required: true,
  minlength: 6
}
```

### Room Schema Validation

```javascript
// Room name
name: {
  type: String,
  required: true,
  minlength: 1,
  maxlength: 100
}

// Participant limit
maxParticipants: {
  type: Number,
  min: 2,
  max: 1000,
  default: 50
}
```

## Performance Considerations

### Query Optimization

- Use appropriate indexes for common queries
- Implement pagination for large result sets
- Use projection to limit returned fields
- Aggregate queries for complex data operations

### Data Cleanup

- Automatic cleanup of expired tokens and OTPs
- Archive old messages based on retention policy
- Remove inactive rooms after specified period
- Clean up orphaned data references

### Monitoring

- Track slow queries and optimize
- Monitor collection sizes and growth
- Set up alerts for unusual activity patterns
- Regular backup and restore procedures

---

For database migration scripts and seeding data, see the `/backend/scripts` directory.
