@echo off
echo 🚀 Setting up HeyPlay project...

REM Backend setup
echo 📦 Installing backend dependencies...
cd backend
call npm install
copy .env.example .env
echo ✅ Backend setup complete

REM Web app setup
echo 📦 Installing web app dependencies...
cd ..\web
call npm install
echo ✅ Web app setup complete

REM Mobile app setup
echo 📦 Installing mobile app dependencies...
cd ..\mobile
call npm install
echo ✅ Mobile app setup complete

echo.
echo 🎉 HeyPlay project setup complete!
echo.
echo 📋 Next Steps:
echo 1. Start MongoDB server
echo 2. Start backend: cd backend && npm run dev
echo 3. Start web app: cd web && npm run dev
echo 4. Start mobile app: cd mobile && npm start
echo.
echo 🔗 URLs:
echo - Web App: http://localhost:3000
echo - Backend API: http://localhost:5000
echo - Mobile App: Use Expo Go with QR code
echo.
echo 📖 For detailed setup instructions, see README.md
