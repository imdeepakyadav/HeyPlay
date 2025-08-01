# HeyPlay Mobile App Release Guide

This guide covers the process of building and releasing the HeyPlay mobile application using Expo and React Native.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Development Build](#development-build)
3. [Production Build](#production-build)
4. [App Store Release](#app-store-release)
5. [Google Play Release](#google-play-release)
6. [Over-the-Air Updates](#over-the-air-updates)
7. [Testing](#testing)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Tools

```bash
# Install Expo CLI
npm install -g @expo/cli

# Install EAS CLI for building and deployment
npm install -g eas-cli

# Login to Expo account
eas login
```

### Project Setup

```bash
# Navigate to mobile directory
cd mobile/

# Install dependencies
npm install

# Initialize EAS (if not already done)
eas build:configure
```

## Development Build

### Local Development

```bash
# Start the development server
npm start

# Run on iOS simulator (macOS only)
npm run ios

# Run on Android emulator
npm run android

# Run on physical device
# Scan QR code with Expo Go app
```

### Development Build with EAS

Create development builds for testing on physical devices:

```bash
# Build for iOS (development)
eas build --profile development --platform ios

# Build for Android (development)
eas build --profile development --platform android

# Build for both platforms
eas build --profile development --platform all
```

## Production Build

### EAS Build Configuration

The `eas.json` file should be configured in the mobile directory:

```json
{
  "cli": {
    "version": ">= 7.8.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "channel": "preview"
    },
    "production": {
      "channel": "production"
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@email.com",
        "ascAppId": "your-app-store-connect-app-id"
      },
      "android": {
        "serviceAccountKeyPath": "path/to/service-account-key.json",
        "track": "production"
      }
    }
  },
  "update": {
    "production": {
      "channel": "production"
    },
    "preview": {
      "channel": "preview"
    }
  }
}
```

### Building for Production

```bash
# Build for iOS production
eas build --profile production --platform ios

# Build for Android production
eas build --profile production --platform android

# Build for both platforms
eas build --profile production --platform all
```

## App Store Release

### iOS App Store (Apple)

1. **Prerequisites**:

   - Apple Developer Account ($99/year)
   - App Store Connect access
   - iOS Distribution Certificate
   - App Store Provisioning Profile

2. **App Store Connect Setup**:

   ```bash
   # Create app in App Store Connect
   # Configure app metadata, screenshots, and descriptions
   ```

3. **Build and Submit**:

   ```bash
   # Build for iOS
   eas build --profile production --platform ios

   # Submit to App Store
   eas submit --platform ios
   ```

4. **App Store Review**:
   - Apple will review your app (typically 24-48 hours)
   - Address any review feedback
   - Once approved, release to App Store

### Required iOS Assets

- App Icon (1024x1024)
- Launch Screen/Splash Screen
- Screenshots for different device sizes
- App Store description and keywords
- Privacy Policy URL

## Google Play Release

### Google Play Store (Android)

1. **Prerequisites**:

   - Google Play Console account ($25 one-time fee)
   - Google Play Service Account
   - App signing key

2. **Google Play Console Setup**:

   ```bash
   # Create app in Google Play Console
   # Configure store listing, content rating, and pricing
   ```

3. **Build and Submit**:

   ```bash
   # Build for Android
   eas build --profile production --platform android

   # Submit to Google Play
   eas submit --platform android
   ```

4. **Google Play Review**:
   - Google will review your app (typically 1-3 days)
   - Address any policy violations
   - Release to production track

### Required Android Assets

- App Icon (512x512)
- Feature Graphic (1024x500)
- Screenshots for phones and tablets
- Short and full descriptions
- Content rating questionnaire

## Over-the-Air Updates

Expo provides OTA updates for JavaScript and asset changes:

### Publishing Updates

```bash
# Update the preview channel
eas update --channel preview --message "Bug fixes and improvements"

# Update the production channel
eas update --channel production --message "New features added"
```

### Update Configuration

In `app.json`:

```json
{
  "expo": {
    "updates": {
      "url": "https://u.expo.dev/[your-project-id]"
    },
    "runtimeVersion": {
      "policy": "sdkVersion"
    }
  }
}
```

### Viewing Updates

```bash
# View update history
eas update:list

# View specific update
eas update:view [update-id]
```

## Testing

### Internal Testing

```bash
# Build preview version
eas build --profile preview --platform all

# Distribute to internal testers
# Share build URLs or use TestFlight/Internal Testing
```

### Beta Testing

1. **iOS TestFlight**:

   - Upload build to App Store Connect
   - Add external testers (up to 10,000)
   - Distribute beta versions

2. **Android Internal Testing**:
   - Upload AAB to Google Play Console
   - Create internal testing track
   - Add testers via email or Google Groups

### Testing Checklist

- [ ] Authentication flow works correctly
- [ ] Real-time features function properly
- [ ] Push notifications are received
- [ ] Background audio playback works
- [ ] Network error handling is robust
- [ ] App works on different device sizes
- [ ] Performance is acceptable
- [ ] Security features are working

## Version Management

### Updating App Version

1. **Update version in app.json**:

   ```json
   {
     "expo": {
       "version": "1.0.1",
       "android": {
         "versionCode": 2
       },
       "ios": {
         "buildNumber": "2"
       }
     }
   }
   ```

2. **Update package.json version**:

   ```json
   {
     "version": "1.0.1"
   }
   ```

3. **Commit version changes**:
   ```bash
   git add .
   git commit -m "Bump version to 1.0.1"
   git tag v1.0.1
   git push origin main --tags
   ```

## Environment Configuration

### Production Environment Variables

Create `.env.production` in the mobile directory:

```env
EXPO_PUBLIC_API_URL=https://api.heyplay.app
EXPO_PUBLIC_WS_URL=https://api.heyplay.app
EXPO_PUBLIC_ENVIRONMENT=production
```

### Build-time Configuration

In `app.json`:

```json
{
  "expo": {
    "extra": {
      "apiUrl": process.env.EXPO_PUBLIC_API_URL,
      "wsUrl": process.env.EXPO_PUBLIC_WS_URL,
      "environment": process.env.EXPO_PUBLIC_ENVIRONMENT,
      "eas": {
        "projectId": "your-eas-project-id"
      }
    }
  }
}
```

## Troubleshooting

### Common Build Issues

1. **Dependency conflicts**:

   ```bash
   # Clear node modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **iOS build fails**:

   ```bash
   # Clear iOS cache
   npx expo install --fix
   ```

3. **Android build fails**:
   ```bash
   # Check Gradle version compatibility
   # Verify Android SDK and NDK versions
   ```

### Common Release Issues

1. **App Store rejection**:

   - Review Apple's App Store Review Guidelines
   - Check for privacy policy compliance
   - Ensure app functions without crashing

2. **Google Play rejection**:
   - Review Google Play policies
   - Check for required permissions justification
   - Ensure content rating is appropriate

### Getting Help

- **Expo Documentation**: https://docs.expo.dev/
- **Expo Discord**: https://chat.expo.dev/
- **Stack Overflow**: Tag questions with `expo` and `react-native`
- **GitHub Issues**: For project-specific issues

## Release Checklist

### Pre-Release

- [ ] All tests pass
- [ ] Code is reviewed and approved
- [ ] Version numbers updated
- [ ] Environment variables configured
- [ ] App store assets prepared
- [ ] Privacy policy updated
- [ ] Change log updated

### Release Process

- [ ] Build production version
- [ ] Test on physical devices
- [ ] Submit to app stores
- [ ] Monitor for crashes and issues
- [ ] Respond to store reviews
- [ ] Announce release to users

### Post-Release

- [ ] Monitor app performance
- [ ] Track user feedback
- [ ] Plan next release cycle
- [ ] Update documentation
- [ ] Analyze usage metrics

---

For questions about the mobile release process, please contact the development team or check the project documentation.
