# 🎵 HeyPlay

<div align="center">

**Sync. Stream. Enjoy Together.**

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![React Native](https://img.shields.io/badge/React_Native-0.76.7-blue)](https://reactnative.dev/)
[![Next.js](https://img.shields.io/badge/Next.js-15.1.7-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue)](https://www.typescriptlang.org/)

_A comprehensive cross-platform application for synchronized music and video streaming with real-time social features._

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Contributing](#-contributing) • [Support](#-support)

</div>

---

## 🌟 Overview

HeyPlay is a modern, full-stack application that revolutionizes how people experience media together. Create rooms, invite friends, and enjoy perfectly synchronized music and video playback across all devices. Built with cutting-edge technology and designed for seamless cross-platform experience.

### 🎯 Key Highlights

- **🔄 Real-time Synchronization**: Perfect sync across all connected devices
- **📱 Cross-Platform**: Web (Next.js), Mobile (React Native), with shared backend
- **🎵 Multi-Source**: Support for YouTube, Spotify, and custom media
- **💬 Social Features**: Live chat, reactions, and collaborative playlists
- **🔐 Secure Authentication**: JWT-based with email verification and OTP
- **🎨 Modern UI**: Beautiful, responsive design with dark/light themes
- **🚀 Production Ready**: Full deployment setup and monitoringay

Sync. Stream. Enjoy Together.

## Overview

HeyPlay is a comprehensive cross-platform application that allows users to create rooms, invite friends, and enjoy synchronized music and video playback together. Built with React Native for mobile (iOS & Android) and Next.js for web, featuring real-time synchronization, chat, reactions, and background music playback.

## ✨ Features

### 🎵 Core Media Features

- **Room-Based Experience**: Create public/private rooms with password protection
- **Real-time Synchronization**: Perfectly synchronized playbook across all connected devices
- **Background Playback**: Continue listening when minimized (mobile)
- **Multi-Platform Streaming**: YouTube, Spotify, and custom media support
- **Collaborative Playlists**: Build and manage playlists together
- **Advanced Controls**: Play, pause, seek, skip with role-based permissions

### 👥 Social & Communication

- **Live Chat**: Real-time messaging within rooms
- **Emoji Reactions**: Express yourself with emoji reactions
- **User Roles**: Admin, moderator, and participant permissions
- **Profile Management**: Customizable user profiles and preferences
- **Participant Tracking**: See who's listening in real-time

### � Authentication & Security

- **Email Verification**: OTP-based email verification system
- **JWT Authentication**: Secure token-based authentication
- **Session Management**: Automatic token refresh and session cleanup
- **Account Security**: Login attempt tracking and account locking
- **Password Reset**: Secure password reset via email OTP

### �️ Technical Features

- **WebSocket Communication**: Real-time updates via Socket.io
- **Responsive Design**: Seamless experience across all screen sizes
- **Offline Support**: Cache management for better performance
- **Error Handling**: Comprehensive error management and user feedback
- **API Integration**: RESTful API with comprehensive endpoint coverage

## 🏗️ Technology Stack

### 🖥️ **Backend**

```
Node.js + Express    │ Server framework
MongoDB + Mongoose   │ Database and ODM
Socket.io           │ Real-time communication
JWT + bcryptjs      │ Authentication & security
Nodemailer          │ Email services
Node-cron           │ Background tasks
```

### 🌐 **Web Frontend**

```
Next.js 15          │ React framework with App Router
React 19            │ Latest React with concurrent features
TypeScript          │ Type safety and development experience
Tailwind CSS        │ Utility-first styling
Framer Motion       │ Smooth animations
Heroicons           │ Beautiful icon library
React Hot Toast     │ User notifications
```

### 📱 **Mobile Frontend**

```
React Native 0.76   │ Native mobile development
Expo 52             │ Development platform and tools
TypeScript          │ Type safety across platforms
React Navigation 7  │ Navigation and routing
Track Player        │ Background audio playback
AsyncStorage        │ Local data persistence
Vector Icons        │ Comprehensive icon set
```

### 🛠️ **Development & DevOps**

```
ESLint + Prettier   │ Code quality and formatting
Nodemon             │ Development server
Expo CLI            │ Mobile development tools
MongoDB Atlas       │ Cloud database
GitHub Actions      │ CI/CD pipeline (coming soon)
```

## 🚀 Quick Start

### 📋 Prerequisites

Ensure you have the following installed:

- **Node.js** (v18.0.0 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (local installation or MongoDB Atlas account) - [Setup Guide](https://docs.mongodb.com/manual/installation/)
- **Git** - [Download](https://git-scm.com/)
- **Expo CLI** (for mobile development) - `npm install -g @expo/cli`

### ⚡ Quick Setup (Recommended)

1. **Clone the repository**

   ```bash
   git clone https://github.com/imdeepakyadav/HeyPlay.git
   cd HeyPlay
   ```

2. **Install dependencies for all platforms**

   ```bash
   # Install backend dependencies
   cd backend && npm install

   # Install web dependencies
   cd ../web && npm install

   # Install mobile dependencies
   cd ../mobile && npm install
   ```

3. **Set up environment variables**

   ```bash
   # Backend environment
   cd ../backend
   cp .env.example .env
   # Edit .env with your configuration (see Environment Setup below)
   ```

4. **Start all services**

   ```bash
   # Terminal 1 - Backend (from /backend)
   npm run dev

   # Terminal 2 - Web App (from /web)
   npm run dev

   # Terminal 3 - Mobile App (from /mobile)
   npm start
   ```

5. **Access the applications**
   - **Web App**: http://localhost:3000
   - **Backend API**: http://localhost:5000
   - **Mobile App**: Scan QR code with Expo Go app

### 🔧 Environment Setup

Create these environment files with your configuration:

#### Backend `.env`

```env
# Database
MONGODB_URI=mongodb://localhost:27017/heyplay

# JWT Secrets (generate strong secrets for production)
JWT_SECRET=your_super_secret_jwt_key_here
JWT_REFRESH_SECRET=your_refresh_secret_key_here

# Server Configuration
PORT=5000
CORS_ORIGINS=http://localhost:3000,exp://localhost:19000

# Email Configuration (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM_NAME=HeyPlay
EMAIL_FROM_ADDRESS=noreply@heyplay.com

# Client URL
CLIENT_URL=http://localhost:3000

# API Keys (optional)
YOUTUBE_API_KEY=your_youtube_api_key
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
```

#### Web `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

#### Mobile Configuration

Update `mobile/src/config/constants.ts`:

```typescript
export const API_BASE_URL = __DEV__
  ? "http://localhost:5000"
  : "https://your-production-api.com";
```

## 🖥️ Development

### 🏃‍♂️ Running the Application

1. **Start MongoDB** (if using local installation)
2. **Start Backend Server**:

   ```bash
   cd backend
   npm run dev
   # Server runs on http://localhost:5000
   ```

3. **Start Web Application**:

   ```bash
   cd web
   npm run dev
   # Web app runs on http://localhost:3000
   ```

4. **Start Mobile Application**:
   ```bash
   cd mobile
   npm start
   # Scan QR code with Expo Go app
   ```

### 🔗 Available URLs

- **📱 Web App**: http://localhost:3000
- **🔌 Backend API**: http://localhost:5000
- **💚 API Health**: http://localhost:5000/api/health
- **📺 Mobile**: Scan QR code with [Expo Go](https://expo.dev/client)

### 🧪 Testing

```bash
# Backend tests
cd backend && npm test

# Web tests
cd web && npm run test

# Mobile tests
cd mobile && npm test

# End-to-end tests
cd web && npm run test:e2e
```

## 📚 Documentation

Comprehensive documentation is available in the `/docs` directory:

- **[🔌 API Documentation](./docs/API.md)** - Complete API reference
- **[🗄️ Database Schema](./docs/DATABASE.md)** - MongoDB collections and relationships
- **[🔐 Authentication](./docs/AUTHENTICATION.md)** - Auth system and security
- **[⚡ Socket Events](./docs/SOCKET_EVENTS.md)** - Real-time communication events
- **[🚀 Deployment Guide](./docs/DEPLOYMENT.md)** - Production deployment instructions
- **[🤝 Contributing](./CONTRIBUTING.md)** - How to contribute to the project

### 🎯 Key Features Overview

| Feature             | Web                   | Mobile                | Backend             |
| ------------------- | --------------------- | --------------------- | ------------------- |
| **Authentication**  | ✅ JWT + Email OTP    | ✅ JWT + Email OTP    | ✅ Full auth system |
| **Real-time Sync**  | ✅ Socket.io          | ✅ Socket.io          | ✅ WebSocket server |
| **Room Management** | ✅ Create/Join rooms  | ✅ Create/Join rooms  | ✅ Room API         |
| **Media Playback**  | ✅ Web Audio API      | ✅ Track Player       | ✅ Media metadata   |
| **Chat System**     | ✅ Real-time chat     | ✅ Real-time chat     | ✅ Message handling |
| **User Profiles**   | ✅ Profile management | ✅ Profile management | ✅ User API         |

## 🌟 Screenshots

<details>
<summary>Click to view screenshots</summary>

### Web Application

![Auth Page](./screenshots/web-auth.png)
![Dashboard](./screenshots/web-dashboard.png)
![Room Interface](./screenshots/web-room.png)

### Mobile Application

![Mobile Auth](./screenshots/mobile-auth.png)
![Mobile Home](./screenshots/mobile-home.png)
![Mobile Room](./screenshots/mobile-room.png)

</details>

## 🎪 Live Demo

- **🌐 Web Demo**: [https://heyplay-demo.vercel.app](https://heyplay-demo.vercel.app)
- **📱 Mobile Demo**: Download Expo Go and scan the QR code
- **🔑 Test Account**:
  - Email: `demo@heyplay.com`
  - Password: `demo123`

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Client    │    │  Mobile Client  │    │   Backend API   │
│   (Next.js)     │    │ (React Native)  │    │   (Node.js)     │
│                 │    │                 │    │                 │
├─ Auth Pages     │    ├─ Auth Screens   │    ├─ Auth Routes    │
├─ Dashboard      │◄──►│ Home Screen     │◄──►│ Room Routes     │
├─ Room Interface│    │ Room Screen     │    │ User Routes     │
├─ Profile       │    │ Profile Screen  │    │ Media Routes    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Database      │
                    │   (MongoDB)     │
                    │                 │
                    ├─ Users          │
                    ├─ Rooms          │
                    ├─ Messages       │
                    ├─ Sessions       │
                    └─────────────────┘
```

## 🚀 Deployment

### 🌐 Production Deployment

**Backend Options:**

- [Railway](https://railway.app) (Recommended) - Simple deployment with GitHub integration
- [Heroku](https://heroku.com) - Traditional PaaS platform
- [DigitalOcean](https://digitalocean.com) - VPS with more control
- [AWS/GCP/Azure](https://aws.amazon.com) - Enterprise cloud solutions

**Web Frontend:**

- [Vercel](https://vercel.com) (Recommended for Next.js) - Automatic deployments
- [Netlify](https://netlify.com) - JAMstack hosting platform
- [AWS Amplify](https://aws.amazon.com/amplify/) - Full-stack platform

**Mobile Apps:**

- [Expo Application Services](https://expo.dev/eas) - Build and submit to app stores
- [App Store Connect](https://appstoreconnect.apple.com) - iOS app distribution
- [Google Play Console](https://play.google.com/console) - Android app distribution

**Database:**

- [MongoDB Atlas](https://mongodb.com/atlas) (Recommended) - Cloud database
- Self-hosted MongoDB on VPS
- Other document databases (DocumentDB, CosmosDB)

See the [Deployment Guide](./docs/DEPLOYMENT.md) for detailed instructions.

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### 🐛 Report Bugs

- Use GitHub Issues with the bug report template
- Include steps to reproduce and environment details
- Add screenshots or videos if helpful

### 💡 Suggest Features

- Check existing issues and discussions first
- Use the feature request template
- Explain the use case and potential implementation

### 🔧 Submit Code

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes following our coding standards
4. Add tests for new functionality
5. Update documentation as needed
6. Submit a pull request

### 📝 Development Guidelines

- **TypeScript**: Use TypeScript for all new code
- **Code Style**: Follow ESLint and Prettier configurations
- **Commits**: Use [Conventional Commits](https://conventionalcommits.org/)
- **Testing**: Write tests for new features and bug fixes
- **Documentation**: Update relevant documentation

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.

### What this means:

- ✅ **Commercial use** - Use it in commercial projects
- ✅ **Modification** - Modify the code as needed
- ✅ **Distribution** - Distribute your modified versions
- ✅ **Private use** - Use it in private projects
- ❗ **Liability** - No warranty or liability provided
- ❗ **Attribution** - Include the original license

## 🆘 Support & Community

### 📞 Get Help

- **📖 Documentation**: Check the `/docs` directory first
- **🐛 Issues**: Report bugs on [GitHub Issues](https://github.com/imdeepakyadav/HeyPlay/issues)
- **💬 Discussions**: Join [GitHub Discussions](https://github.com/imdeepakyadav/HeyPlay/discussions)
- **📧 Email**: Contact us at `support@heyplay.com`

### 🌐 Community

- **Discord**: Join our [development Discord server](https://discord.gg/heyplay-dev)
- **Twitter**: Follow us [@HeyPlayApp](https://twitter.com/heyplayapp)
- **Reddit**: Join [r/HeyPlay](https://reddit.com/r/heyplay)

### 🔔 Stay Updated

- **⭐ Star** this repository to show support
- **👀 Watch** for release notifications
- **🍴 Fork** to contribute or customize
- **📧 Subscribe** to our newsletter for major updates

## 🗺️ Roadmap

### 📅 Current Version (v1.0)

- [x] ✅ User authentication with email verification
- [x] ✅ Real-time room-based music synchronization
- [x] ✅ Cross-platform support (Web + Mobile)
- [x] ✅ Live chat and emoji reactions
- [x] ✅ Beautiful, responsive UI design
- [x] ✅ Production-ready deployment setup

### 🎯 Version 1.1 (Q2 2025)

- [ ] 🎥 **Video streaming support** (YouTube, Vimeo)
- [ ] 🎨 **Custom room themes** and personalization
- [ ] 🔊 **Audio effects** and equalizer
- [ ] 📊 **Room analytics** and listening statistics
- [ ] 🔔 **Push notifications** for room activities
- [ ] 👥 **Friend system** and social features

### 🚀 Version 1.2 (Q3 2025)

- [ ] 🎤 **Voice chat integration**
- [ ] 🤖 **AI-powered music recommendations**
- [ ] 📱 **Progressive Web App** capabilities
- [ ] 🌐 **Multi-language support**
- [ ] 🎮 **Interactive room games** and activities
- [ ] 📈 **Advanced moderation tools**

### 🌟 Version 2.0 (Q4 2025)

- [ ] 🎵 **Spotify Premium integration**
- [ ] ☁️ **Cloud playlist synchronization**
- [ ] 🎭 **Virtual avatars** and room environments
- [ ] 📻 **Radio station mode**
- [ ] 🔐 **Advanced privacy controls**
- [ ] 💰 **Premium features** and monetization

> **Vote on features**: Help prioritize our roadmap by participating in [GitHub Discussions](https://github.com/imdeepakyadav/HeyPlay/discussions/categories/ideas)

## 👨‍💻 Contributors

Thanks to all the amazing people who have contributed to HeyPlay:

<a href="https://github.com/imdeepakyadav/HeyPlay/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=imdeepakyadav/HeyPlay" />
</a>

### 🏆 Core Team

- **[@imdeepakyadav](https://github.com/imdeepakyadav)** - Project Lead & Full-Stack Developer
- **[Your Name Here]** - Join us and be part of the core team!

### 💝 Special Thanks

- All beta testers and early adopters
- Contributors who reported bugs and suggested features
- The open-source community for amazing tools and libraries

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/imdeepakyadav/HeyPlay?style=social)
![GitHub forks](https://img.shields.io/github/forks/imdeepakyadav/HeyPlay?style=social)
![GitHub issues](https://img.shields.io/github/issues/imdeepakyadav/HeyPlay)
![GitHub pull requests](https://img.shields.io/github/issues-pr/imdeepakyadav/HeyPlay)
![GitHub last commit](https://img.shields.io/github/last-commit/imdeepakyadav/HeyPlay)

---

<div align="center">

**Built with ❤️ by the HeyPlay Team**

_Bringing people together through music, one room at a time._

### 🎵 _Sync. Stream. Enjoy Together._ 🎵

[⭐ Star on GitHub](https://github.com/imdeepakyadav/HeyPlay) • [🐛 Report Bug](https://github.com/imdeepakyadav/HeyPlay/issues) • [💡 Request Feature](https://github.com/imdeepakyadav/HeyPlay/discussions)

</div>
