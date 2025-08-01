# Deployment Guide

This guide covers deploying HeyPlay to production environments.

## 🚀 Deployment Overview

HeyPlay consists of three main components:

- **Backend API** (Node.js + Express)
- **Web Application** (Next.js)
- **Mobile Application** (React Native + Expo)

## 🌐 Backend Deployment

### Option 1: Railway (Recommended)

Railway provides excellent Node.js hosting with automatic deployments.

1. **Connect Repository**

   ```bash
   # Install Railway CLI
   npm install -g @railway/cli

   # Login and link project
   railway login
   railway link
   ```

2. **Environment Variables**
   Set these in Railway dashboard:

   ```env
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/heyplay
   JWT_SECRET=production_jwt_secret_here
   JWT_REFRESH_SECRET=production_refresh_secret_here
   PORT=5000
   CORS_ORIGINS=https://your-frontend-domain.com
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   CLIENT_URL=https://your-frontend-domain.com
   ```

3. **Deploy**
   ```bash
   railway up
   ```

### Option 2: Heroku

1. **Install Heroku CLI** and login

   ```bash
   heroku login
   ```

2. **Create Application**

   ```bash
   cd backend
   heroku create your-app-name
   ```

3. **Set Environment Variables**

   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=your_mongodb_uri
   heroku config:set JWT_SECRET=your_jwt_secret
   # ... other environment variables
   ```

4. **Deploy**
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

### Option 3: DigitalOcean App Platform

1. **Create App** on DigitalOcean dashboard
2. **Connect Repository** from GitHub
3. **Configure Build Settings**:
   - Build Command: `npm install`
   - Run Command: `npm start`
   - Environment: Node.js
4. **Set Environment Variables** in dashboard
5. **Deploy**

### Option 4: VPS (Ubuntu)

1. **Server Setup**

   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y

   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Install PM2
   sudo npm install -g pm2

   # Install MongoDB
   sudo apt-get install -y mongodb
   ```

2. **Application Setup**

   ```bash
   # Clone repository
   git clone https://github.com/your-username/HeyPlay.git
   cd HeyPlay/backend

   # Install dependencies
   npm install --production

   # Create .env file
   nano .env
   ```

3. **PM2 Configuration**

   ```bash
   # Create ecosystem file
   nano ecosystem.config.js
   ```

   ```javascript
   module.exports = {
     apps: [
       {
         name: "heyplay-backend",
         script: "index.js",
         instances: "max",
         exec_mode: "cluster",
         env: {
           NODE_ENV: "development",
         },
         env_production: {
           NODE_ENV: "production",
           PORT: 5000,
         },
       },
     ],
   };
   ```

4. **Start Application**

   ```bash
   pm2 start ecosystem.config.js --env production
   pm2 save
   pm2 startup
   ```

5. **Nginx Configuration**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## 🌍 Web Application Deployment

### Option 1: Vercel (Recommended for Next.js)

1. **Install Vercel CLI**

   ```bash
   npm install -g vercel
   ```

2. **Deploy**

   ```bash
   cd web
   vercel
   ```

3. **Environment Variables**
   Set in Vercel dashboard:
   ```env
   NEXT_PUBLIC_API_URL=https://your-backend-url.com
   NEXT_PUBLIC_SOCKET_URL=https://your-backend-url.com
   ```

### Option 2: Netlify

1. **Build Configuration**
   Create `netlify.toml`:

   ```toml
   [build]
     command = "npm run build"
     publish = ".next"

   [build.environment]
     NEXT_TELEMETRY_DISABLED = "1"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

2. **Deploy via Git** or drag & drop build folder

### Option 3: AWS Amplify

1. **Connect Repository** in AWS Amplify console
2. **Build Settings**:
   ```yaml
   version: 1
   applications:
     - frontend:
         phases:
           preBuild:
             commands:
               - cd web
               - npm install
           build:
             commands:
               - npm run build
         artifacts:
           baseDirectory: web/.next
           files:
             - "**/*"
         cache:
           paths:
             - web/node_modules/**/*
   ```

## 📱 Mobile Application Deployment

### Expo Application Services (EAS)

1. **Install EAS CLI**

   ```bash
   npm install -g eas-cli
   ```

2. **Configure EAS**

   ```bash
   cd mobile
   eas build:configure
   ```

3. **Update app.json**

   ```json
   {
     "expo": {
       "name": "HeyPlay",
       "slug": "heyplay",
       "version": "1.0.0",
       "orientation": "portrait",
       "icon": "./assets/icon.png",
       "splash": {
         "image": "./assets/splash-icon.png",
         "resizeMode": "contain",
         "backgroundColor": "#667eea"
       },
       "updates": {
         "fallbackToCacheTimeout": 0
       },
       "assetBundlePatterns": ["**/*"],
       "ios": {
         "supportsTablet": true,
         "bundleIdentifier": "com.heyplay.app"
       },
       "android": {
         "adaptiveIcon": {
           "foregroundImage": "./assets/adaptive-icon.png",
           "backgroundColor": "#667eea"
         },
         "package": "com.heyplay.app"
       },
       "web": {
         "favicon": "./assets/favicon.png"
       },
       "extra": {
         "eas": {
           "projectId": "your-project-id"
         }
       }
     }
   }
   ```

4. **Build for Production**

   ```bash
   # Build for both platforms
   eas build --platform all

   # Build for specific platform
   eas build --platform ios
   eas build --platform android
   ```

5. **Submit to App Stores**

   ```bash
   # Submit to App Store
   eas submit --platform ios

   # Submit to Google Play
   eas submit --platform android
   ```

## 🗄️ Database Setup

### MongoDB Atlas (Recommended)

1. **Create Cluster** on MongoDB Atlas
2. **Configure Network Access** (add IP addresses)
3. **Create Database User** with appropriate permissions
4. **Get Connection String** and update environment variables

### Self-Hosted MongoDB

1. **Install MongoDB** on your server
2. **Configure Security**:

   ```bash
   # Enable authentication
   sudo nano /etc/mongod.conf
   ```

   ```yaml
   security:
     authorization: enabled
   ```

3. **Create Database and User**:
   ```javascript
   use heyplay
   db.createUser({
     user: "heyplay_user",
     pwd: "secure_password",
     roles: ["readWrite"]
   })
   ```

## 🔒 Security Configuration

### SSL/TLS Certificates

1. **Let's Encrypt** (free):

   ```bash
   sudo apt install certbot
   sudo certbot --nginx -d your-domain.com
   ```

2. **CloudFlare** (proxy + SSL)

### Environment Security

1. **Use strong secrets** for JWT tokens
2. **Enable CORS** only for trusted domains
3. **Set up rate limiting**
4. **Monitor for suspicious activity**

### Database Security

1. **Enable authentication**
2. **Use connection string with credentials**
3. **Whitelist IP addresses**
4. **Regular backups**

## 📊 Monitoring & Logging

### Application Monitoring

1. **PM2 Monitoring** (for VPS):

   ```bash
   pm2 install pm2-logrotate
   pm2 set pm2-logrotate:max_size 10M
   pm2 set pm2-logrotate:retain 30
   ```

2. **Error Tracking**:
   - Sentry for error monitoring
   - LogRocket for session replay
   - DataDog for infrastructure monitoring

### Performance Monitoring

1. **Setup monitoring endpoints**
2. **Database query optimization**
3. **CDN for static assets**
4. **Caching strategies**

## 🔄 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Install dependencies
        run: |
          cd backend
          npm install

      - name: Run tests
        run: |
          cd backend
          npm test

      - name: Deploy to Railway
        run: |
          npm install -g @railway/cli
          railway login --browserless
          railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Install and build
        run: |
          cd web
          npm install
          npm run build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./web
```

## 🧪 Testing in Production

### Health Checks

1. **API Health Endpoint**: `GET /api/health`
2. **Database Connectivity**
3. **External Service Integration**
4. **WebSocket Connections**

### Load Testing

```bash
# Install Artillery
npm install -g artillery

# Create load test
artillery quick --count 100 --num 10 https://your-api.com/api/health
```

## 📱 Mobile App Store Submission

### iOS App Store

1. **Requirements**:

   - Apple Developer Account ($99/year)
   - App Store Connect access
   - Proper app icons and screenshots

2. **Preparation**:
   - Update version numbers
   - Create app store listing
   - Submit for review

### Google Play Store

1. **Requirements**:

   - Google Play Developer Account ($25 one-time)
   - Signed APK/AAB file
   - Store listing assets

2. **Preparation**:
   - Create signed build
   - Upload to Play Console
   - Fill store listing information

## 🔧 Post-Deployment Checklist

- [ ] All environment variables set correctly
- [ ] Database connection working
- [ ] API endpoints responding
- [ ] WebSocket connections working
- [ ] Email service functioning
- [ ] Error tracking configured
- [ ] SSL certificates installed
- [ ] Monitoring dashboards set up
- [ ] Backup procedures tested
- [ ] Performance benchmarks established

---

For troubleshooting deployment issues, see [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
