# API Documentation

This document provides comprehensive information about the HeyPlay backend API endpoints.

## Base URL

- **Development**: `http://localhost:5000`
- **Production**: `https://api.heyplay.com`

## Authentication

Most endpoints require authentication using JWT tokens in the Authorization header:

```http
Authorization: Bearer <access_token>
```

## Response Format

All API responses follow this structure:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "code": "SUCCESS"
}
```

For errors:

```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE"
}
```

## Authentication Endpoints

### Register User

Create a new user account.

```http
POST /api/auth/register
```

**Request Body:**

```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Registration successful. Please check your email for verification OTP.",
  "userId": "string",
  "email": "string",
  "requiresVerification": true
}
```

### Verify Email

Verify user email with OTP.

```http
POST /api/auth/verify-email
```

**Request Body:**

```json
{
  "email": "string",
  "otp": "string"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Email verified successfully",
  "accessToken": "string",
  "refreshToken": "string",
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "isEmailVerified": true
  }
}
```

### Login

Authenticate user and get tokens.

```http
POST /api/auth/login
```

**Request Body:**

```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "accessToken": "string",
  "refreshToken": "string",
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "profilePicture": "string",
    "isEmailVerified": true,
    "lastLogin": "date"
  }
}
```

### Refresh Token

Get new access token using refresh token.

```http
POST /api/auth/refresh-token
```

**Request Body:**

```json
{
  "refreshToken": "string"
}
```

### Forgot Password

Request password reset OTP.

```http
POST /api/auth/forgot-password
```

**Request Body:**

```json
{
  "email": "string"
}
```

### Reset Password

Reset password using OTP.

```http
POST /api/auth/reset-password
```

**Request Body:**

```json
{
  "email": "string",
  "otp": "string",
  "newPassword": "string"
}
```

### Logout

Logout user and revoke tokens.

```http
POST /api/auth/logout
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "refreshToken": "string"
}
```

### Get Current User

Get current authenticated user info.

```http
GET /api/auth/me
```

**Headers:** `Authorization: Bearer <token>`

### Update Profile

Update user profile information.

```http
PUT /api/auth/profile
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "username": "string",
  "profilePicture": "string"
}
```

### Change Password

Change user password.

```http
POST /api/auth/change-password
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```

## Room Endpoints

### Get Public Rooms

Get list of public rooms.

```http
GET /api/rooms
```

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search term

### Create Room

Create a new room.

```http
POST /api/rooms
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "name": "string",
  "description": "string",
  "isPrivate": "boolean",
  "password": "string" // optional, for private rooms
}
```

### Get Room Details

Get detailed information about a room.

```http
GET /api/rooms/:roomId
```

**Headers:** `Authorization: Bearer <token>`

### Join Room

Join a room.

```http
POST /api/rooms/:roomId/join
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "password": "string" // optional, for private rooms
}
```

### Leave Room

Leave a room.

```http
POST /api/rooms/:roomId/leave
```

**Headers:** `Authorization: Bearer <token>`

### Update Room

Update room information (admin only).

```http
PUT /api/rooms/:roomId
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "name": "string",
  "description": "string",
  "isPrivate": "boolean",
  "password": "string"
}
```

### Delete Room

Delete a room (admin only).

```http
DELETE /api/rooms/:roomId
```

**Headers:** `Authorization: Bearer <token>`

### Send Message

Send a message in a room.

```http
POST /api/rooms/:roomId/messages
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "content": "string",
  "type": "text" // or "emoji", "system"
}
```

### Get Room Messages

Get messages from a room.

```http
GET /api/rooms/:roomId/messages
```

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**

- `page` (optional): Page number
- `limit` (optional): Messages per page

### Update Current Track

Update the currently playing track (admin/moderator only).

```http
PUT /api/rooms/:roomId/current-track
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "trackId": "string",
  "trackUrl": "string",
  "title": "string",
  "artist": "string",
  "duration": "number",
  "thumbnail": "string",
  "position": "number", // current playback position
  "isPlaying": "boolean"
}
```

## Media Endpoints

### Search Media

Search for media content.

```http
GET /api/media/search
```

**Query Parameters:**

- `q`: Search query
- `source`: Media source (youtube, spotify)
- `limit`: Number of results

### Get Trending

Get trending media content.

```http
GET /api/media/trending
```

**Query Parameters:**

- `source`: Media source
- `limit`: Number of results

### Get YouTube Video Details

Get detailed information about a YouTube video.

```http
GET /api/media/youtube/:videoId
```

## User Endpoints

### Get User Profile

Get public profile of a user.

```http
GET /api/users/:userId
```

### Get User's Rooms

Get rooms created by a user.

```http
GET /api/users/:userId/rooms
```

## Health Check

### API Health

Check API health status.

```http
GET /api/health
```

**Response:**

```json
{
  "status": "healthy",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "uptime": "1d 2h 3m 4s",
  "database": "connected",
  "memory": {
    "used": "123.45 MB",
    "free": "876.55 MB"
  }
}
```

## Error Codes

| Code                  | Description                 |
| --------------------- | --------------------------- |
| `MISSING_FIELDS`      | Required fields are missing |
| `INVALID_EMAIL`       | Email format is invalid     |
| `EMAIL_EXISTS`        | Email already registered    |
| `USERNAME_EXISTS`     | Username already taken      |
| `INVALID_CREDENTIALS` | Invalid email or password   |
| `EMAIL_NOT_VERIFIED`  | Email verification required |
| `ACCOUNT_LOCKED`      | Account temporarily locked  |
| `INVALID_OTP`         | Invalid or expired OTP      |
| `TOKEN_EXPIRED`       | Access token expired        |
| `INVALID_TOKEN`       | Token is invalid            |
| `UNAUTHORIZED`        | Authentication required     |
| `FORBIDDEN`           | Insufficient permissions    |
| `NOT_FOUND`           | Resource not found          |
| `ROOM_FULL`           | Room has reached capacity   |
| `ROOM_PRIVATE`        | Room is private             |
| `WRONG_PASSWORD`      | Incorrect room password     |

## Rate Limiting

API endpoints are rate limited:

- **Authentication endpoints**: 5 requests per minute
- **General endpoints**: 100 requests per minute
- **Media search**: 20 requests per minute

Rate limit headers are included in responses:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1640995200
```

## Webhooks

### Room Events

You can subscribe to room events via webhooks:

```http
POST /api/webhooks/rooms
```

**Events:**

- `room.created`
- `room.updated`
- `room.deleted`
- `user.joined`
- `user.left`
- `track.changed`
- `message.sent`

---

For more detailed examples and testing, see our [Postman Collection](./postman/HeyPlay-API.json).
