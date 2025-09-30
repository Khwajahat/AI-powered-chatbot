#!/bin/bash

# Mindful Chat - Startup Script
echo "🌱 Starting Mindful Chat - AI Depression Support"
echo "================================================"

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.7 or higher."
    exit 1
fi

# Check if pip is installed
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip3 is not installed. Please install pip3."
    exit 1
fi

echo "✅ Python and pip found"

# Install dependencies if requirements.txt exists
if [ -f "requirements.txt" ]; then
    echo "📦 Installing Python dependencies..."
    pip3 install -r requirements.txt
    if [ $? -eq 0 ]; then
        echo "✅ Dependencies installed successfully"
    else
        echo "❌ Failed to install dependencies"
        exit 1
    fi
else
    echo "⚠️  requirements.txt not found, skipping dependency installation"
fi

# Create templates directory if it doesn't exist
mkdir -p templates

# Copy index.html to templates directory for Flask
if [ -f "index.html" ]; then
    cp index.html templates/index.html
    echo "✅ HTML template copied to Flask templates directory"
fi

echo ""
echo "🚀 Starting the application..."
echo "📱 Open your browser and go to: http://localhost:5000"
echo "🛑 Press Ctrl+C to stop the server"
echo ""

# Start the Flask application
python3 app.py
