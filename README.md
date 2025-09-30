# Mindful Chat - AI-Powered Depression Support

A compassionate AI-powered chat application designed to provide empathetic support for people dealing with depression and mental health challenges. Built with a clean, adaptable UI and intelligent backend processing.

## 🌟 Features

### Frontend (HTML, CSS, JavaScript)
- **Clean, Depression-Friendly UI**: Calming color schemes and gentle animations
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Accessibility Features**: High contrast support, keyboard navigation, screen reader friendly
- **Theme Support**: Light, dark, and auto themes based on system preferences
- **Font Size Options**: Adjustable text size for better readability
- **Offline Support**: Service worker for basic offline functionality
- **Crisis Detection**: Automatic detection of crisis keywords with immediate resource display

### Backend (Python Flask)
- **Intelligent AI Responses**: Context-aware responses tailored to emotional states
- **Crisis Detection**: Multi-level crisis assessment with appropriate interventions
- **Mental Health Focus**: Specialized responses for depression, anxiety, and general support
- **Safety Features**: Automatic crisis resource suggestions and emergency contact information
- **RESTful API**: Clean API endpoints for chat, health checks, and resources

### Safety & Privacy
- **Local Storage**: Chat history stored locally (optional)
- **No Data Collection**: No personal information is stored on servers
- **Crisis Resources**: Immediate access to emergency contacts and helplines
- **Professional Disclaimer**: Clear guidance that this is not a replacement for professional help

## 🚀 Quick Start

### Prerequisites
- Python 3.7 or higher
- Modern web browser with JavaScript enabled

### Installation

1. **Clone or download the project files**
   ```bash
   # If using git
   git clone <repository-url>
   cd mindful-chat
   ```

2. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the application**
   ```bash
   python app.py
   ```

4. **Open your browser**
   Navigate to `http://localhost:5000`

### Alternative: Static File Serving
If you prefer to run just the frontend without the Python backend:
1. Open `index.html` directly in your browser
2. The app will work with fallback AI responses

## 📱 Usage

### Getting Started
1. **Open the application** in your web browser
2. **Choose a quick starter** or type your own message
3. **Chat naturally** - the AI will respond with empathy and support
4. **Access crisis resources** if needed via the header button

### Features Overview

#### Chat Interface
- Type your message in the input field
- Press Enter to send, Shift+Enter for new lines
- Use quick starter buttons for common topics
- View conversation history (if enabled in settings)

#### Settings
- **Theme**: Choose between light, dark, or auto themes
- **Font Size**: Adjust text size for better readability
- **Privacy**: Control whether chat history is saved locally

#### Crisis Resources
- **Emergency**: Direct access to 911
- **Crisis Hotlines**: National Suicide Prevention Lifeline (988)
- **Text Support**: Crisis Text Line (text HOME to 741741)
- **Online Resources**: Links to professional mental health organizations

## 🛠️ Technical Details

### Frontend Architecture
- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **Vanilla JavaScript**: No external dependencies for core functionality
- **Service Worker**: Basic offline caching and functionality
- **Progressive Web App**: Installable with manifest.json

### Backend Architecture
- **Flask**: Lightweight Python web framework
- **CORS**: Cross-origin resource sharing enabled
- **RESTful API**: Clean API design with proper error handling
- **Crisis Detection**: Multi-level keyword analysis
- **Response Generation**: Context-aware AI responses

### API Endpoints
- `POST /api/chat` - Send message and receive AI response
- `GET /api/health` - Health check endpoint
- `GET /api/crisis-resources` - Get crisis resources and contacts
- `GET /api/coping-strategies` - Get coping strategies list

## 🔒 Safety & Crisis Support

### Crisis Detection
The AI automatically detects crisis keywords at multiple levels:
- **Critical**: Immediate crisis intervention with emergency resources
- **High**: Professional help recommendations
- **Medium**: Supportive responses with coping strategies
- **Low**: General empathetic support

### Emergency Resources
- **911**: Emergency services
- **988**: National Suicide Prevention Lifeline (24/7)
- **741741**: Crisis Text Line (text HOME)
- **Professional Organizations**: Links to mental health resources

### Important Disclaimers
- This application is **not a replacement** for professional mental health care
- **Crisis situations** require immediate professional intervention
- **Always seek professional help** for serious mental health concerns
- **Emergency situations** should be reported to 911 immediately

## 🎨 Customization

### Themes
The application supports three themes:
- **Light**: Clean, bright interface
- **Dark**: Easy on the eyes for low-light environments
- **Auto**: Automatically switches based on system preferences

### Styling
CSS custom properties allow easy customization:
```css
:root {
    --primary-color: #6366f1;
    --background: #ffffff;
    --text-primary: #1e293b;
    /* ... more variables */
}
```

### AI Responses
Modify response templates in `app.py`:
```python
self.response_templates = {
    'depression': [
        "Your custom response here...",
        # ... more responses
    ]
}
```

## 📊 Browser Support

- **Chrome**: 80+
- **Firefox**: 75+
- **Safari**: 13+
- **Edge**: 80+
- **Mobile Browsers**: iOS Safari 13+, Chrome Mobile 80+

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Guidelines
- Follow existing code style
- Add comments for complex logic
- Test on multiple browsers
- Ensure accessibility compliance
- Maintain crisis safety features

## 📄 License

This project is open source. Please ensure any modifications maintain the safety features and crisis support functionality.

## 🆘 Support

### For Users
- **Crisis Support**: Use the crisis resources button in the app
- **Technical Issues**: Check browser console for errors
- **Feedback**: Contact through appropriate channels

### For Developers
- **Documentation**: This README and inline code comments
- **Issues**: Report bugs and feature requests
- **Community**: Join discussions about mental health tech

## 🔮 Future Enhancements

- **Multi-language Support**: Expand to other languages
- **Voice Input**: Speech-to-text capabilities
- **Advanced AI**: Integration with more sophisticated AI models
- **Professional Integration**: Connect with mental health professionals
- **Analytics**: Anonymous usage analytics for improvement
- **Mobile App**: Native mobile applications

---

**Remember**: This tool is designed to provide support and comfort, but it's not a replacement for professional mental health care. If you're experiencing a mental health crisis, please contact emergency services or a mental health professional immediately.

**Your mental health matters. You are not alone.**
