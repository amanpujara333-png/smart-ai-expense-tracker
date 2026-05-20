#!/bin/bash

echo "🚀 Starting Combined Expense Tracker (Monolith Mode)..."

# 1. Kill any existing processes on 8080
echo "🧹 Cleaning up existing processes on port 8080..."
kill -9 $(lsof -t -i:8080) 2>/dev/null

# 2. Build Frontend and Copy to Spring Boot static folder
echo "💻 Preparing Frontend..."
cd modern-expense-tracker-ui
if [ ! -d "node_modules" ]; then
    echo "⬇️ Installing frontend dependencies..."
    npm install
fi
echo "🛠️ Building frontend production bundle..."
npm run build
cd ..

echo "📦 Moving frontend to Backend static resources..."
mkdir -p src/main/resources/static
rm -rf src/main/resources/static/*
cp -r modern-expense-tracker-ui/dist/* src/main/resources/static/

# 3. Start the Combined App
echo "📦 Starting Combined Application (Spring Boot)..."
if ! command -v mvn &> /dev/null
then
    echo "❌ Maven (mvn) is not installed. Please install it."
    exit 1
fi

echo "--------------------------------------------------"
echo "👉 YOUR APP WILL BE AT: http://localhost:8080"
echo "👉 Project Credit: 2026 Project BCA - Aman Pujara"
echo "👉 Default Login: admin / admin123"
echo "--------------------------------------------------"

mvn spring-boot:run
