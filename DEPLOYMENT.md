# HeyPlay Deployment Guide

This guide covers deploying HeyPlay across all three platforms: Backend, Web, and Mobile.

## 🚀 Backend Deployment (Railway/Heroku)

### Railway Deployment (Recommended)

1. **Prepare your repository**:

   ```bash
   # Ensure all changes are committed
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Deploy to Railway**:

   - Visit [railway.app](https://railway.app)
   - Create account and connect GitHub
   - Select your HeyPlay repository
   - Set root directory to `backend`

3. **Environment Variables**:

   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/heyplay
   JWT_SECRET=your_production_jwt_secret_key_here
   PORT=5000
   NODE_ENV=production
   CORS_ORIGINS=https://your-web-app.vercel.app,https://your-custom-domain.com
   YOUTUBE_API_KEY=your_youtube_api_key
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   ```

4. **Build Configuration**:
   Railway will automatically detect the Node.js app and run `npm start`.

### Heroku Deployment

1. **Install Heroku CLI** and login:

   ```bash
   heroku login
   ```

2. **Create Heroku app**:

   ```bash
   cd backend
   heroku create heyplay-backend
   ```

3. **Set environment variables**:

   ```bash
   heroku config:set MONGODB_URI=your_mongodb_uri
   heroku config:set JWT_SECRET=your_jwt_secret
   heroku config:set CORS_ORIGINS=https://your-web-app.vercel.app
   # Add other environment variables
   ```

4. **Deploy**:
   ```bash
   git subtree push --prefix backend heroku main
   ```

### MongoDB Atlas Setup

1. **Create MongoDB Atlas Account**:

   - Visit [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
   - Create free cluster

2. **Configure Database**:

   - Create database user
   - Whitelist IP addresses (0.0.0.0/0 for production)
   - Get connection string

3. **Security**:
   - Use strong passwords
   - Restrict database access
   - Enable SSL connections

## 🌐 Web Deployment (Vercel)

### Vercel Deployment (Recommended)

1. **Prepare Web App**:

   ```bash
   cd web
   npm run build  # Test build locally
   ```

2. **Deploy to Vercel**:

   - Visit [vercel.com](https://vercel.com)
   - Import GitHub repository
   - Set root directory to `web`
   - Set framework preset to "Next.js"

3. **Environment Variables** (Vercel Dashboard):

   ```env
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app
   NEXT_PUBLIC_SOCKET_URL=https://your-backend.railway.app
   ```

4. **Custom Domain** (Optional):
   - Add domain in Vercel dashboard
   - Configure DNS records
   - Enable HTTPS

### Alternative: Netlify Deployment

1. **Build Configuration**:

   ```toml
   # netlify.toml
   [build]
     base = "web"
     publish = "web/.next"
     command = "npm run build"
   ```

2. **Deploy**:
   - Connect GitHub repository
   - Set build settings
   - Deploy

## 📱 Mobile Deployment (Expo)

### Expo Application Services (EAS)

1. **Install EAS CLI**:

   ```bash
   npm install -g @expo/cli
   npm install -g eas-cli
   ```

2. **Configure EAS**:

   ```bash
   cd mobile
   eas login
   eas build:configure
   ```

3. **Production Configuration**:

   ```json
   // mobile/eas.json
   {
     "cli": {
       "version": ">= 3.0.0"
     },
     "build": {
       "development": {
         "developmentClient": true,
         "distribution": "internal"
       },
       "preview": {
         "distribution": "internal"
       },
       "production": {
         "env": {
           "API_BASE_URL": "https://your-backend.railway.app"
         }
       }
     },
     "submit": {
       "production": {}
     }
   }
   ```

4. **Build for Production**:

   ```bash
   # iOS
   eas build --platform ios --profile production

   # Android
   eas build --platform android --profile production

   # Both platforms
   eas build --platform all --profile production
   ```

### App Store Submission

#### iOS App Store

1. **Apple Developer Account** ($99/year required)
2. **App Store Connect**:

   - Create app record
   - Upload screenshots
   - Set app metadata
   - Submit for review

3. **Submit with EAS**:
   ```bash
   eas submit --platform ios
   ```

#### Google Play Store

1. **Google Play Console** ($25 one-time fee)
2. **Create App**:

   - Upload APK/AAB
   - Set store listing
   - Configure content rating

3. **Submit with EAS**:
   ```bash
   eas submit --platform android
   ```

## 🔧 Production Configuration

### Backend Production Settings

```javascript
// backend/index.js production additions
if (process.env.NODE_ENV === "production") {
  // Trust proxy for Railway/Heroku
  app.set("trust proxy", 1);

  // Security headers
  app.use(helmet());

  // Rate limiting
  const rateLimit = require("express-rate-limit");
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    })
  );
}
```

### Web Production Settings

```javascript
// web/next.config.ts
const nextConfig = {
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  images: {
    domains: ["your-backend.railway.app"],
  },
  // Enable static optimization
  trailingSlash: true,
  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
    ];
  },
};
```

### Mobile Production Settings

```typescript
// mobile/config/constants.ts
const CONFIG = {
  API_BASE_URL: __DEV__
    ? "http://localhost:5000"
    : "https://your-backend.railway.app",

  SOCKET_URL: __DEV__
    ? "http://localhost:5000"
    : "https://your-backend.railway.app",

  // Enable production optimizations
  ENABLE_ANALYTICS: !__DEV__,
  ENABLE_CRASH_REPORTING: !__DEV__,
};
```

## 🔒 Security Checklist

### Backend Security

- [ ] Environment variables properly set
- [ ] JWT secret is strong and unique
- [ ] CORS origins restricted to known domains
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] MongoDB connection secured with authentication
- [ ] HTTPS enforced in production

### Web Security

- [ ] API endpoints using HTTPS
- [ ] No sensitive data in client-side code
- [ ] CSP headers configured
- [ ] XSS protection enabled
- [ ] Input sanitization implemented

### Mobile Security

- [ ] API endpoints using HTTPS
- [ ] Sensitive data encrypted in AsyncStorage
- [ ] API keys not hardcoded in app bundle
- [ ] App transport security configured

## 📊 Monitoring & Analytics

### Backend Monitoring

```javascript
// Add to backend/index.js
const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}
```

### Web Analytics

```javascript
// web/lib/analytics.ts
export const trackEvent = (eventName: string, properties?: object) => {
  if (typeof window !== "undefined" && process.env.NODE_ENV === "production") {
    // Add your analytics service (Google Analytics, Mixpanel, etc.)
    console.log("Event:", eventName, properties);
  }
};
```

### Mobile Analytics

```typescript
// mobile/utils/analytics.ts
import { Analytics } from "expo-analytics";

const analytics = new Analytics("your-tracking-id");

export const trackScreenView = (screenName: string) => {
  if (!__DEV__) {
    analytics.hit(screenName);
  }
};
```

## 🧪 Testing in Production

### Pre-deployment Testing

```bash
# Backend
cd backend && npm test

# Web
cd web && npm run test && npm run build

# Mobile
cd mobile && npm test && expo build:web
```

### Post-deployment Verification

1. **Backend**: Test API endpoints with Postman/curl
2. **Web**: Verify all pages load and features work
3. **Mobile**: Test on actual devices through TestFlight/Internal Testing

## 🚨 Troubleshooting

### Common Issues

#### Backend Issues

- **Port conflicts**: Ensure PORT environment variable is set
- **MongoDB connection**: Check connection string and network access
- **CORS errors**: Verify CORS_ORIGINS includes your frontend URLs

#### Web Issues

- **API connection**: Check NEXT_PUBLIC_API_URL environment variable
- **Build failures**: Ensure all dependencies are properly installed
- **404 errors**: Verify routing configuration

#### Mobile Issues

- **Metro bundler**: Clear cache with `npx expo start --clear`
- **Build failures**: Check eas.json configuration
- **API connection**: Verify API_BASE_URL points to production backend

### Performance Optimization

#### Backend

- Enable gzip compression
- Implement caching with Redis
- Optimize database queries
- Use CDN for static assets

#### Web

- Enable Next.js Image Optimization
- Implement code splitting
- Use service workers for caching
- Optimize bundle size

#### Mobile

- Enable Hermes JavaScript engine
- Optimize images and assets
- Implement lazy loading
- Use native modules for performance-critical features

## 📈 Scaling Considerations

### Backend Scaling

- **Horizontal scaling**: Use load balancers
- **Database scaling**: MongoDB sharding/replica sets
- **Caching**: Redis for session storage and caching
- **CDN**: CloudFront/CloudFlare for static assets

### Real-time Scaling

- **Socket.io clustering**: Redis adapter for multiple servers
- **WebSocket load balancing**: Sticky sessions
- **Connection limits**: Monitor and optimize concurrent connections

### Monitoring & Alerts

- **Uptime monitoring**: UptimeRobot, Pingdom
- **Error tracking**: Sentry, LogRocket
- **Performance monitoring**: New Relic, DataDog
- **User analytics**: Google Analytics, Mixpanel

---

**🎉 Congratulations! Your HeyPlay app is now deployed and ready for users!**

For support and questions, refer to the main README.md or create an issue on GitHub.
