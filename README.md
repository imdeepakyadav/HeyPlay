# HeyPlay

Sync. Stream. Enjoy Together.

## Overview

HeyPlay is a comprehensive cross-platform application that allows users to create rooms, invite friends, and enjoy synchronized music and video playback together. Built with React Native for mobile (iOS & Android) and Next.js for web, featuring real-time synchronization, chat, reactions, and background music playback.

## ✨ Features

### 🎵 Core Features

- **Room Creation & Management**: Create public or private rooms with password protection
- **Real-time Music & Video Sync**: Perfectly synchronized playback across all connected devices
- **Background Playback**: Continue listening even when the app is minimized (mobile)
- **Live Chat & Reactions**: Real-time messaging and emoji reactions
- **Cross-Platform Support**: Available on Web, Android, and iOS

### 🎧 Media Features

- **Multi-Platform Streaming**: Support for YouTube, Spotify, and custom media
- **Collaborative Playlists**: Build playlists together with friends
- **Media Search**: Search and discover music from multiple sources
- **Queue Management**: Add, remove, and reorder tracks in the playlist

### 👥 Social Features

- **User Authentication**: Secure login and registration
- **Profile Management**: Customizable user profiles
- **Room Roles**: Admin, moderator, and user permissions
- **Participant Management**: See who's listening in real-time

### 🔧 Technical Features

- **Real-time Communication**: WebSocket-based synchronization
- **Responsive Design**: Works seamlessly across all screen sizes
- **Offline Support**: Cache frequently accessed data
- **Push Notifications**: Stay updated with room activities

## 🏗️ Tech Stack

### **Frontend**

- **Mobile**: React Native (Expo, TypeScript)

  - React Navigation for routing
  - React Native Track Player for audio
  - Socket.io for real-time communication
  - AsyncStorage for local data

- **Web**: Next.js 15 (React 19, TypeScript, Tailwind CSS)
  - Framer Motion for animations
  - Heroicons for UI icons
  - Socket.io for real-time communication
  - React Hot Toast for notifications

### **Backend**

- **Server**: Node.js with Express
- **Database**: MongoDB with Mongoose ODM
- **Real-time**: Socket.io for WebSocket connections
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Media APIs**: YouTube API, Spotify API integration
- **File Upload**: Multer for media handling

### **Development Tools**

- **TypeScript**: Type safety across all platforms
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Nodemon**: Backend development server
- **Expo**: Mobile development and testing

## 🚀 Project Setup

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud)
- Git
- Expo CLI (for mobile development)

### Quick Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/HeyPlay.git
   cd HeyPlay
   ```

2. **Run the setup script**:

   ```bash
   # Windows
   setup.bat

   # Linux/Mac
   chmod +x setup.sh
   ./setup.sh
   ```

### Manual Setup

#### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

#### Web App Setup

```bash
cd web
npm install
npm run dev
```

#### Mobile App Setup

```bash
cd mobile
npm install
npm start
```

### Environment Configuration

#### Backend (.env)

```env
MONGODB_URI=mongodb://localhost:27017/heyplay
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
CORS_ORIGINS=http://localhost:3000,exp://localhost:19000
YOUTUBE_API_KEY=your_youtube_api_key
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
```

#### Web (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

#### Mobile (config/constants.ts)

```typescript
export const API_BASE_URL = __DEV__
  ? "http://localhost:5000"
  : "https://your-production-api.com";
```

## 🖥️ Development

### Running the Application

1. **Start MongoDB** (if running locally)
2. **Start Backend**: `cd backend && npm run dev`
3. **Start Web App**: `cd web && npm run dev`
4. **Start Mobile App**: `cd mobile && npm start`

### Available URLs

- **Web App**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health
- **Mobile App**: Scan QR code with Expo Go

### API Endpoints

#### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

#### Rooms

- `GET /api/rooms` - Get public rooms
- `POST /api/rooms` - Create new room
- `GET /api/rooms/:id` - Get room details
- `POST /api/rooms/:id/join` - Join room
- `POST /api/rooms/:id/leave` - Leave room
- `POST /api/rooms/:id/messages` - Send message
- `PUT /api/rooms/:id/current-track` - Update current track

#### Media

- `GET /api/media/search` - Search for media
- `GET /api/media/trending` - Get trending content
- `GET /api/media/youtube/:videoId` - Get YouTube video details

### Socket Events

#### Client to Server

- `join-room` - Join a room
- `leave-room` - Leave a room
- `track-control` - Play/pause/seek track
- `send-message` - Send chat message
- `send-reaction` - Send emoji reaction

#### Server to Client

- `user-joined` - User joined room
- `user-left` - User left room
- `track-update` - Track state changed
- `new-message` - New chat message
- `new-reaction` - New emoji reaction
- `room-state` - Current room state

## 📱 Mobile Features

### React Native Components

- **AuthScreen**: Login and registration
- **HomeScreen**: Room discovery and creation
- **RoomScreen**: Room interface with chat and controls
- **SearchScreen**: Media search and discovery
- **ProfileScreen**: User profile management
- **MusicPlayer**: Background audio player

### Navigation Structure

```
Main Stack
├── Auth Stack (when not authenticated)
│   └── AuthScreen
└── Main Tabs (when authenticated)
    ├── Home Tab → HomeScreen
    ├── Search Tab → SearchScreen
    └── Profile Tab → ProfileScreen
    └── Modal Screens
        ├── RoomScreen
        └── CreateRoomScreen
```

## 🌐 Web Features

### Next.js Pages

- **Landing Page** (`/`): Marketing and feature showcase
- **Authentication** (`/auth`): Login and registration
- **Dashboard** (`/dashboard`): User's rooms and activities
- **Room Interface** (`/rooms/[id]`): Full-featured room experience
- **Profile** (`/profile`): User settings and preferences

### Responsive Design

- **Mobile-first approach** with Tailwind CSS
- **Progressive Web App** capabilities
- **Dark/light mode** support
- **Accessibility** compliance (WCAG 2.1)

## 🛠️ Customization

### Adding New Media Sources

1. Create a new service in `backend/src/services/`
2. Add API integration for the media platform
3. Update the media router to include new endpoints
4. Add UI components for the new source

### Extending Room Features

1. Update the Room schema in `backend/src/models/Users.js`
2. Add new socket events in `backend/index.js`
3. Update frontend components to handle new features
4. Test across all platforms

## 🧪 Testing

### Backend Testing

```bash
cd backend
npm test
```

### Web Testing

```bash
cd web
npm run test
npm run test:e2e
```

### Mobile Testing

```bash
cd mobile
npm test
expo test
```

## 📦 Deployment

### Backend Deployment

- **Heroku**, **Railway**, or **DigitalOcean**
- Configure production environment variables
- Set up MongoDB Atlas for database
- Configure CORS for production domains

### Web Deployment

- **Vercel** (recommended for Next.js)
- **Netlify** or **Railway**
- Configure environment variables
- Update API endpoints for production

### Mobile Deployment

- **Expo Application Services (EAS)**
- **App Store** and **Google Play Store**
- Configure production build settings
- Update API endpoints for production

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Follow the existing code style

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the `/docs` folder for detailed guides
- **Issues**: Report bugs on GitHub Issues
- **Discussions**: Join community discussions on GitHub
- **Email**: support@heyplay.com

## 🗺️ Roadmap

### Version 1.1

- [ ] Video streaming support
- [ ] Advanced playlist management
- [ ] User followers/following system
- [ ] Room analytics and insights

### Version 1.2

- [ ] Offline mode support
- [ ] Custom audio effects
- [ ] Integration with more music platforms
- [ ] Advanced moderation tools

### Version 2.0

- [ ] AI-powered music recommendations
- [ ] Voice chat integration
- [ ] Custom room themes
- [ ] Advanced user permissions

---

**Built with ❤️ by the HeyPlay Team**

_Sync. Stream. Enjoy Together._
