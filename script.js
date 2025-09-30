// Mindful Chat - Frontend JavaScript
class MindfulChat {
    constructor() {
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.typingIndicator = document.getElementById('typingIndicator');
        this.crisisModal = document.getElementById('crisisModal');
        this.settingsModal = document.getElementById('settingsModal');
        
        this.isTyping = false;
        this.messageHistory = this.loadMessageHistory();
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSettings();
        this.setupAutoResize();
        this.loadChatHistory();
    }

    setupEventListeners() {
        // Send message events
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Quick starter buttons
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const message = e.currentTarget.dataset.message;
                this.messageInput.value = message;
                this.sendMessage();
            });
        });

        // Modal events
        document.getElementById('crisisBtn').addEventListener('click', () => {
            this.showModal('crisisModal');
        });

        document.getElementById('settingsBtn').addEventListener('click', () => {
            this.showModal('settingsModal');
        });

        document.getElementById('closeCrisisModal').addEventListener('click', () => {
            this.hideModal('crisisModal');
        });

        document.getElementById('closeSettingsModal').addEventListener('click', () => {
            this.hideModal('settingsModal');
        });

        // Settings events
        document.getElementById('themeSelect').addEventListener('change', (e) => {
            this.setTheme(e.target.value);
        });

        document.getElementById('fontSize').addEventListener('change', (e) => {
            this.setFontSize(e.target.value);
        });

        document.getElementById('saveHistory').addEventListener('change', (e) => {
            this.setSaveHistory(e.target.checked);
        });

        // Close modals when clicking outside
        [this.crisisModal, this.settingsModal].forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideModal(modal.id);
                }
            });
        });

        // Auto-save message as user types
        this.messageInput.addEventListener('input', () => {
            this.saveDraftMessage();
        });
    }

    setupAutoResize() {
        this.messageInput.addEventListener('input', () => {
            this.messageInput.style.height = 'auto';
            this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 120) + 'px';
        });
    }

    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message || this.isTyping) return;

        // Clear input and reset height
        this.messageInput.value = '';
        this.messageInput.style.height = 'auto';

        // Add user message to chat
        this.addMessage(message, 'user');

        // Show typing indicator
        this.showTypingIndicator();

        try {
            // Send message to backend
            const response = await this.sendToBackend(message);
            
            // Hide typing indicator
            this.hideTypingIndicator();
            
            // Add AI response
            this.addMessage(response.message, 'ai');
            
            // Save to history
            this.saveMessageToHistory(message, response.message);
            
        } catch (error) {
            console.error('Error sending message:', error);
            this.hideTypingIndicator();
            this.addMessage("I'm sorry, I'm having trouble connecting right now. Please try again in a moment.", 'ai');
        }
    }

    async sendToBackend(message) {
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // Handle crisis detection
            if (data.crisis_detected && data.crisis_level === 'critical') {
                setTimeout(() => {
                    this.showModal('crisisModal');
                }, 1000);
            }
            
            return data;
        } catch (error) {
            console.error('Error sending message to backend:', error);
            // Fallback to local AI response
            return { message: this.generateAIResponse(message) };
        }
    }

    generateAIResponse(userMessage) {
        const responses = {
            // Depression-related responses
            'down': [
                "I hear that you're feeling down, and I want you to know that your feelings are valid. It takes courage to share what you're going through. Can you tell me more about what's contributing to these feelings?",
                "Feeling down can be really overwhelming. You're not alone in this, and reaching out shows incredible strength. What's one small thing that might help you feel a little better right now?",
                "I'm here with you in this difficult moment. Sometimes when we're feeling down, it helps to remember that feelings are temporary, even when they don't feel that way. What's been on your mind lately?"
            ],
            'anxiety': [
                "Anxiety can feel so overwhelming, and I want you to know that what you're experiencing is real and valid. Let's work through this together. What specific thoughts or situations are making you feel anxious right now?",
                "It sounds like anxiety is really affecting you today. That takes a lot of strength to acknowledge and share. Sometimes it helps to focus on your breathing - can you try taking three slow, deep breaths with me?",
                "Anxiety can make everything feel so much harder. You're doing great by reaching out. What's one thing that usually helps you feel a bit calmer when anxiety strikes?"
            ],
            'feelings': [
                "I'm really glad you want to talk about your feelings. That's such an important step in taking care of yourself. What feelings are you experiencing right now?",
                "Sharing your feelings takes courage, and I'm honored that you trust me with them. Can you describe what you're feeling and what might have brought these feelings up?",
                "Your feelings matter, and I'm here to listen without judgment. What's going on inside that you'd like to talk about?"
            ],
            'default': [
                "Thank you for sharing that with me. I'm here to listen and support you. Can you tell me more about what's on your mind?",
                "I hear you, and I want you to know that your feelings are important. What would be most helpful for you right now?",
                "Thank you for trusting me with your thoughts. I'm here to help you work through whatever you're experiencing. What's been weighing on you lately?"
            ]
        };

        const message = userMessage.toLowerCase();
        let category = 'default';

        if (message.includes('down') || message.includes('sad') || message.includes('depressed')) {
            category = 'down';
        } else if (message.includes('anxiety') || message.includes('anxious') || message.includes('worried')) {
            category = 'anxiety';
        } else if (message.includes('feeling') || message.includes('feel')) {
            category = 'feelings';
        }

        const categoryResponses = responses[category] || responses.default;
        return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
    }

    addMessage(text, sender) {
        // Remove welcome message if it exists
        const welcomeMessage = this.chatMessages.querySelector('.welcome-message');
        if (welcomeMessage) {
            welcomeMessage.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-heart"></i>';

        const content = document.createElement('div');
        content.className = 'message-content';

        const textDiv = document.createElement('div');
        textDiv.className = 'message-text';
        textDiv.textContent = text;

        const timeDiv = document.createElement('div');
        timeDiv.className = 'message-time';
        timeDiv.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        content.appendChild(textDiv);
        content.appendChild(timeDiv);
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);

        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();

        // Add animation
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(20px)';
        setTimeout(() => {
            messageDiv.style.transition = 'all 0.3s ease';
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0)';
        }, 10);
    }

    showTypingIndicator() {
        this.isTyping = true;
        this.typingIndicator.classList.add('show');
        this.sendBtn.disabled = true;
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        this.isTyping = false;
        this.typingIndicator.classList.remove('show');
        this.sendBtn.disabled = false;
    }

    scrollToBottom() {
        setTimeout(() => {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }, 100);
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }

    // Settings Management
    loadSettings() {
        const settings = JSON.parse(localStorage.getItem('mindfulChatSettings') || '{}');
        
        // Apply theme
        this.setTheme(settings.theme || 'auto');
        document.getElementById('themeSelect').value = settings.theme || 'auto';
        
        // Apply font size
        this.setFontSize(settings.fontSize || 'medium');
        document.getElementById('fontSize').value = settings.fontSize || 'medium';
        
        // Apply save history setting
        const saveHistory = settings.saveHistory !== false; // Default to true
        document.getElementById('saveHistory').checked = saveHistory;
        this.setSaveHistory(saveHistory);
    }

    setTheme(theme) {
        const body = document.body;
        body.removeAttribute('data-theme');
        
        if (theme === 'dark') {
            body.setAttribute('data-theme', 'dark');
        } else if (theme === 'auto') {
            // Check system preference
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                body.setAttribute('data-theme', 'dark');
            }
        }
        
        this.saveSettings({ theme });
    }

    setFontSize(size) {
        const body = document.body;
        body.removeAttribute('data-font-size');
        
        if (size !== 'medium') {
            body.setAttribute('data-font-size', size);
        }
        
        this.saveSettings({ fontSize: size });
    }

    setSaveHistory(save) {
        this.saveSettings({ saveHistory: save });
        if (!save) {
            localStorage.removeItem('mindfulChatHistory');
            localStorage.removeItem('mindfulChatDraft');
        }
    }

    saveSettings(updates) {
        const currentSettings = JSON.parse(localStorage.getItem('mindfulChatSettings') || '{}');
        const newSettings = { ...currentSettings, ...updates };
        localStorage.setItem('mindfulChatSettings', JSON.stringify(newSettings));
    }

    // Message History Management
    loadMessageHistory() {
        const saveHistory = JSON.parse(localStorage.getItem('mindfulChatSettings') || '{}').saveHistory !== false;
        if (!saveHistory) return [];
        
        return JSON.parse(localStorage.getItem('mindfulChatHistory') || '[]');
    }

    saveMessageToHistory(userMessage, aiMessage) {
        const saveHistory = JSON.parse(localStorage.getItem('mindfulChatSettings') || '{}').saveHistory !== false;
        if (!saveHistory) return;
        
        this.messageHistory.push({
            user: userMessage,
            ai: aiMessage,
            timestamp: new Date().toISOString()
        });
        
        // Keep only last 50 conversations
        if (this.messageHistory.length > 50) {
            this.messageHistory = this.messageHistory.slice(-50);
        }
        
        localStorage.setItem('mindfulChatHistory', JSON.stringify(this.messageHistory));
    }

    loadChatHistory() {
        if (this.messageHistory.length === 0) return;
        
        // Remove welcome message
        const welcomeMessage = this.chatMessages.querySelector('.welcome-message');
        if (welcomeMessage) {
            welcomeMessage.remove();
        }
        
        // Load recent messages
        const recentMessages = this.messageHistory.slice(-10); // Show last 10 exchanges
        recentMessages.forEach(conversation => {
            this.addMessage(conversation.user, 'user');
            this.addMessage(conversation.ai, 'ai');
        });
    }

    saveDraftMessage() {
        const saveHistory = JSON.parse(localStorage.getItem('mindfulChatSettings') || '{}').saveHistory !== false;
        if (!saveHistory) return;
        
        const draft = this.messageInput.value;
        if (draft.trim()) {
            localStorage.setItem('mindfulChatDraft', draft);
        } else {
            localStorage.removeItem('mindfulChatDraft');
        }
    }

    loadDraftMessage() {
        const saveHistory = JSON.parse(localStorage.getItem('mindfulChatSettings') || '{}').saveHistory !== false;
        if (!saveHistory) return;
        
        const draft = localStorage.getItem('mindfulChatDraft');
        if (draft) {
            this.messageInput.value = draft;
            this.messageInput.style.height = 'auto';
            this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 120) + 'px';
        }
    }

    // Crisis Detection
    detectCrisisKeywords(message) {
        const crisisKeywords = [
            'suicide', 'kill myself', 'end it all', 'not worth living',
            'better off dead', 'want to die', 'hurt myself', 'self harm'
        ];
        
        const lowerMessage = message.toLowerCase();
        return crisisKeywords.some(keyword => lowerMessage.includes(keyword));
    }

    handleCrisisDetection(message) {
        if (this.detectCrisisKeywords(message)) {
            // Show crisis resources immediately
            setTimeout(() => {
                this.showModal('crisisModal');
            }, 1000);
            
            // Add crisis response
            setTimeout(() => {
                this.addMessage(
                    "I'm really concerned about what you've shared. Your life has value, and there are people who want to help you. Please reach out to a crisis helpline or emergency services right away. You don't have to face this alone.",
                    'ai'
                );
            }, 2000);
            
            return true;
        }
        return false;
    }
}

// Initialize the chat when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.mindfulChat = new MindfulChat();
    
    // Load draft message if available
    window.mindfulChat.loadDraftMessage();
    
    // Focus on input
    document.getElementById('messageInput').focus();
});

// Handle system theme changes
if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        const currentTheme = JSON.parse(localStorage.getItem('mindfulChatSettings') || '{}').theme;
        if (currentTheme === 'auto') {
            window.mindfulChat.setTheme('auto');
        }
    });
}

// Service Worker registration for offline functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/static/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
