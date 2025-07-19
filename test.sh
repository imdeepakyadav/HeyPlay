#!/bin/bash

# HeyPlay Test Script
# This script tests all components of the HeyPlay application

echo "🧪 HeyPlay Application Test Suite"
echo "=================================="
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test results
TESTS_PASSED=0
TESTS_FAILED=0

# Function to print test results
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}❌ $2${NC}"
        ((TESTS_FAILED++))
    fi
}

# Function to test if a service is running
test_service() {
    local url=$1
    local name=$2
    local timeout=10
    
    if curl -s --connect-timeout $timeout "$url" >/dev/null 2>&1; then
        print_result 0 "$name is running"
        return 0
    else
        print_result 1 "$name is not accessible"
        return 1
    fi
}

# Test Node.js and npm versions
echo "📋 Testing Prerequisites..."
echo "----------------------------"

# Check Node.js
if command -v node >/dev/null 2>&1; then
    NODE_VERSION=$(node --version)
    print_result 0 "Node.js installed ($NODE_VERSION)"
else
    print_result 1 "Node.js is not installed"
fi

# Check npm
if command -v npm >/dev/null 2>&1; then
    NPM_VERSION=$(npm --version)
    print_result 0 "npm installed ($NPM_VERSION)"
else
    print_result 1 "npm is not installed"
fi

# Check MongoDB
if command -v mongod >/dev/null 2>&1; then
    print_result 0 "MongoDB installed"
else
    print_result 1 "MongoDB is not installed (local)"
fi

# Check Expo CLI
if command -v expo >/dev/null 2>&1; then
    EXPO_VERSION=$(expo --version)
    print_result 0 "Expo CLI installed ($EXPO_VERSION)"
else
    print_result 1 "Expo CLI is not installed"
fi

echo ""

# Test Backend Dependencies
echo "🔧 Testing Backend Dependencies..."
echo "-----------------------------------"

cd backend 2>/dev/null
if [ $? -eq 0 ]; then
    if [ -f "package.json" ]; then
        print_result 0 "Backend package.json found"
        
        if [ -d "node_modules" ]; then
            print_result 0 "Backend dependencies installed"
        else
            print_result 1 "Backend dependencies not installed"
            echo "   Run: cd backend && npm install"
        fi
    else
        print_result 1 "Backend package.json not found"
    fi
else
    print_result 1 "Backend directory not accessible"
fi

cd .. 2>/dev/null

echo ""

# Test Web Dependencies
echo "🌐 Testing Web Dependencies..."
echo "------------------------------"

cd web 2>/dev/null
if [ $? -eq 0 ]; then
    if [ -f "package.json" ]; then
        print_result 0 "Web package.json found"
        
        if [ -d "node_modules" ]; then
            print_result 0 "Web dependencies installed"
        else
            print_result 1 "Web dependencies not installed"
            echo "   Run: cd web && npm install"
        fi
    else
        print_result 1 "Web package.json not found"
    fi
else
    print_result 1 "Web directory not accessible"
fi

cd .. 2>/dev/null

echo ""

# Test Mobile Dependencies
echo "📱 Testing Mobile Dependencies..."
echo "--------------------------------"

cd mobile 2>/dev/null
if [ $? -eq 0 ]; then
    if [ -f "package.json" ]; then
        print_result 0 "Mobile package.json found"
        
        if [ -d "node_modules" ]; then
            print_result 0 "Mobile dependencies installed"
        else
            print_result 1 "Mobile dependencies not installed"
            echo "   Run: cd mobile && npm install"
        fi
    else
        print_result 1 "Mobile package.json not found"
    fi
else
    print_result 1 "Mobile directory not accessible"
fi

cd .. 2>/dev/null

echo ""

# Test Configuration Files
echo "⚙️  Testing Configuration Files..."
echo "----------------------------------"

# Backend .env
if [ -f "backend/.env" ]; then
    print_result 0 "Backend .env file exists"
else
    print_result 1 "Backend .env file missing"
    echo "   Create: backend/.env (see backend/.env.example)"
fi

# Web .env.local
if [ -f "web/.env.local" ]; then
    print_result 0 "Web .env.local file exists"
else
    print_result 1 "Web .env.local file missing"
    echo "   Create: web/.env.local with NEXT_PUBLIC_API_URL"
fi

# Mobile config
if [ -f "mobile/config/constants.ts" ]; then
    print_result 0 "Mobile config file exists"
else
    print_result 1 "Mobile config file missing"
    echo "   Check: mobile/config/constants.ts"
fi

echo ""

# Test Services (if running)
echo "🚀 Testing Running Services..."
echo "------------------------------"

# Test backend API
test_service "http://localhost:5000/api/health" "Backend API"

# Test web application
test_service "http://localhost:3000" "Web Application"

# Test MongoDB (if local)
if command -v mongo >/dev/null 2>&1; then
    if mongo --eval "db.runCommand('ping').ok" localhost/test >/dev/null 2>&1; then
        print_result 0 "MongoDB connection"
    else
        print_result 1 "MongoDB connection failed"
    fi
fi

echo ""

# Test File Structure
echo "📁 Testing File Structure..."
echo "----------------------------"

# Critical backend files
backend_files=(
    "backend/index.js"
    "backend/package.json"
    "backend/src/models/Users.js"
    "backend/src/routes/auth.js"
    "backend/src/routes/rooms.js"
    "backend/src/routes/media.js"
)

for file in "${backend_files[@]}"; do
    if [ -f "$file" ]; then
        print_result 0 "Found: $file"
    else
        print_result 1 "Missing: $file"
    fi
done

# Critical web files
web_files=(
    "web/package.json"
    "web/next.config.ts"
    "web/src/app/page.tsx"
    "web/src/app/layout.tsx"
    "web/src/app/auth/page.tsx"
)

for file in "${web_files[@]}"; do
    if [ -f "$file" ]; then
        print_result 0 "Found: $file"
    else
        print_result 1 "Missing: $file"
    fi
done

# Critical mobile files
mobile_files=(
    "mobile/App.tsx"
    "mobile/package.json"
    "mobile/app.json"
    "mobile/src/screens/HomeScreen.tsx"
    "mobile/src/screens/AuthScreen.tsx"
    "mobile/src/context/AuthContext.tsx"
)

for file in "${mobile_files[@]}"; do
    if [ -f "$file" ]; then
        print_result 0 "Found: $file"
    else
        print_result 1 "Missing: $file"
    fi
done

echo ""

# Test Build Processes
echo "🔨 Testing Build Processes..."
echo "-----------------------------"

# Test backend syntax
cd backend 2>/dev/null
if [ -f "package.json" ] && [ -d "node_modules" ]; then
    if node -c index.js 2>/dev/null; then
        print_result 0 "Backend syntax check passed"
    else
        print_result 1 "Backend syntax errors found"
    fi
fi
cd .. 2>/dev/null

# Test web build (quick check)
cd web 2>/dev/null
if [ -f "package.json" ] && [ -d "node_modules" ]; then
    if npm run build >/dev/null 2>&1; then
        print_result 0 "Web build successful"
        # Clean up build
        rm -rf .next 2>/dev/null
    else
        print_result 1 "Web build failed"
    fi
fi
cd .. 2>/dev/null

echo ""

# Summary
echo "📊 Test Summary"
echo "==============="
echo -e "Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Tests Failed: ${RED}$TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed! Your HeyPlay application is ready to run.${NC}"
    echo ""
    echo "To start the application:"
    echo "1. Start Backend: cd backend && npm run dev"
    echo "2. Start Web: cd web && npm run dev"
    echo "3. Start Mobile: cd mobile && npm start"
else
    echo -e "${YELLOW}⚠️  Some tests failed. Please address the issues above before running the application.${NC}"
    echo ""
    echo "Common solutions:"
    echo "1. Run setup script: ./setup.sh (or setup.bat on Windows)"
    echo "2. Install dependencies manually in each directory"
    echo "3. Create missing configuration files"
fi

echo ""
echo "For detailed setup instructions, see README.md"
echo "For deployment help, see DEPLOYMENT.md"
