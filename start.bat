@echo off
REM Mindful Chat - Windows Startup Script
echo 🌱 Starting Mindful Chat - AI Depression Support
echo ================================================

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python 3.7 or higher.
    pause
    exit /b 1
)

echo ✅ Python found

REM Install dependencies
echo 📦 Installing Python dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)
echo ✅ Dependencies installed successfully

REM Ensure standard Flask structure exists
if not exist templates (
    echo ❌ templates folder missing. Please keep index.html in templates\
    pause
    exit /b 1
)

echo.
echo 🚀 Starting the application...
echo 📱 Open your browser and go to: http://localhost:5000
echo 🛑 Press Ctrl+C to stop the server
echo.

REM Start the Flask application
python app.py

pause
