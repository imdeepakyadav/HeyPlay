#!/bin/bash

# HeyPlay Project Setup Script

echo "🚀 Setting up HeyPlay project..."

# Backend setup
echo "📦 Installing backend dependencies..."
cd backend
npm install
cp .env.example .env
echo "✅ Backend setup complete"

# Web app setup
echo "📦 Installing web app dependencies..."
cd ../web
npm install
echo "✅ Web app setup complete"

# Mobile app setup
echo "📦 Installing mobile app dependencies..."
cd ../mobile
npm install
echo "✅ Mobile app setup complete"

echo ""
echo "🎉 HeyPlay project setup complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Start MongoDB server"
echo "2. Start backend: cd backend && npm run dev"
echo "3. Start web app: cd web && npm run dev"
echo "4. Start mobile app: cd mobile && npm start"
echo ""
echo "🔗 URLs:"
echo "- Web App: http://localhost:3000"
echo "- Backend API: http://localhost:5000"
echo "- Mobile App: Use Expo Go with QR code"
echo ""
echo "📖 For detailed setup instructions, see README.md"
