#!/usr/bin/env python3
"""
Mindful Chat - AI-Powered Depression Support Backend
A Flask-based API server providing empathetic AI responses for mental health support.
"""

from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import json
import re
import random
import logging
from datetime import datetime
from typing import Dict, List, Optional
import os
from dataclasses import dataclass

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

@dataclass
class CrisisLevel:
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class MindfulAI:
    """AI system for providing empathetic mental health support responses."""
    
    def __init__(self):
        self.crisis_keywords = {
            CrisisLevel.CRITICAL: [
                'suicide', 'kill myself', 'end it all', 'not worth living',
                'better off dead', 'want to die', 'hurt myself', 'self harm',
                'cut myself', 'overdose', 'jump off', 'hang myself'
            ],
            CrisisLevel.HIGH: [
                'hopeless', 'no point', 'give up', 'can\'t go on',
                'worthless', 'burden', 'everyone would be better off'
            ],
            CrisisLevel.MEDIUM: [
                'depressed', 'anxiety', 'panic', 'overwhelmed',
                'can\'t cope', 'breaking down', 'falling apart'
            ]
        }
        
        self.response_templates = {
            'depression': [
                "I hear that you're feeling down, and I want you to know that your feelings are completely valid. It takes real courage to share what you're going through. Can you tell me more about what's contributing to these feelings?",
                "Feeling depressed can be incredibly overwhelming, and I want you to know that you're not alone in this. Reaching out shows incredible strength. What's one small thing that might help you feel a little better right now?",
                "I'm here with you in this difficult moment. Sometimes when we're feeling depressed, it helps to remember that feelings are temporary, even when they don't feel that way. What's been weighing on your mind lately?",
                "Depression can make everything feel so much harder than it should be. You're doing great by reaching out and talking about it. What's one thing that usually brings you even a small amount of comfort?"
            ],
            'anxiety': [
                "Anxiety can feel so overwhelming, and I want you to know that what you're experiencing is real and valid. Let's work through this together. What specific thoughts or situations are making you feel anxious right now?",
                "It sounds like anxiety is really affecting you today. That takes a lot of strength to acknowledge and share. Sometimes it helps to focus on your breathing - can you try taking three slow, deep breaths with me?",
                "Anxiety can make everything feel so much harder. You're doing great by reaching out. What's one thing that usually helps you feel a bit calmer when anxiety strikes?",
                "I understand how challenging anxiety can be. Your feelings are important, and I'm here to listen. What would be most helpful for you right now - talking through what's worrying you, or focusing on some calming techniques?"
            ],
            'general_support': [
                "Thank you for sharing that with me. I'm here to listen and support you without judgment. Can you tell me more about what's on your mind?",
                "I hear you, and I want you to know that your feelings are important and valid. What would be most helpful for you right now?",
                "Thank you for trusting me with your thoughts. I'm here to help you work through whatever you're experiencing. What's been weighing on you lately?",
                "I'm really glad you're reaching out. That's such an important step in taking care of yourself. What feelings are you experiencing right now?",
                "Your courage in sharing this means a lot. I'm here to listen and support you. What's going on inside that you'd like to talk about?"
            ],
            'crisis_response': [
                "I'm really concerned about what you've shared. Your life has value, and there are people who want to help you. Please reach out to a crisis helpline or emergency services right away. You don't have to face this alone.",
                "What you're experiencing sounds very serious, and I want you to know that help is available. Please contact a crisis counselor or emergency services immediately. Your life matters.",
                "I'm worried about your safety. Please reach out to someone who can help you right now - a crisis helpline, emergency services, or a trusted person in your life. You deserve support."
            ]
        }
        
        self.coping_strategies = [
            "Try taking 5 deep breaths, counting to 4 on each inhale and exhale",
            "Focus on one small thing you can do right now - even something as simple as drinking a glass of water",
            "Remember that feelings are temporary, even when they don't feel that way",
            "Consider reaching out to a trusted friend or family member",
            "Try some gentle movement or stretching if you're able",
            "Write down three things you're grateful for, no matter how small",
            "Listen to calming music or sounds that you find soothing",
            "Try the 5-4-3-2-1 grounding technique: name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste"
        ]

    def analyze_message(self, message: str) -> Dict:
        """Analyze the user's message for emotional content and crisis level."""
        message_lower = message.lower()
        
        # Check for crisis keywords
        crisis_level = CrisisLevel.LOW
        detected_keywords = []
        
        for level, keywords in self.crisis_keywords.items():
            for keyword in keywords:
                if keyword in message_lower:
                    crisis_level = level
                    detected_keywords.append(keyword)
                    break
            if crisis_level != CrisisLevel.LOW:
                break
        
        # Determine emotional category
        emotional_category = 'general_support'
        if any(word in message_lower for word in ['depressed', 'depression', 'down', 'sad', 'hopeless']):
            emotional_category = 'depression'
        elif any(word in message_lower for word in ['anxiety', 'anxious', 'worried', 'panic', 'nervous']):
            emotional_category = 'anxiety'
        
        return {
            'crisis_level': crisis_level,
            'emotional_category': emotional_category,
            'detected_keywords': detected_keywords,
            'message_length': len(message),
            'timestamp': datetime.now().isoformat()
        }

    def generate_response(self, message: str, analysis: Dict) -> Dict:
        """Generate an appropriate AI response based on message analysis."""
        
        # Handle critical crisis situations
        if analysis['crisis_level'] == CrisisLevel.CRITICAL:
            return {
                'message': random.choice(self.response_templates['crisis_response']),
                'crisis_detected': True,
                'crisis_level': CrisisLevel.CRITICAL,
                'suggested_actions': [
                    "Contact emergency services (911) immediately",
                    "Call the National Suicide Prevention Lifeline at 988",
                    "Text HOME to 741741 for Crisis Text Line",
                    "Reach out to a trusted person in your life"
                ],
                'follow_up': "Please know that your life has value and there are people who want to help you through this difficult time."
            }
        
        # Handle high crisis situations
        elif analysis['crisis_level'] == CrisisLevel.HIGH:
            response = random.choice(self.response_templates['crisis_response'])
            return {
                'message': response,
                'crisis_detected': True,
                'crisis_level': CrisisLevel.HIGH,
                'suggested_actions': [
                    "Consider reaching out to a mental health professional",
                    "Call the National Suicide Prevention Lifeline at 988",
                    "Talk to a trusted friend or family member",
                    "Try some grounding techniques"
                ],
                'follow_up': "I'm here to support you, but please also consider reaching out to professional help."
            }
        
        # Handle medium crisis situations
        elif analysis['crisis_level'] == CrisisLevel.MEDIUM:
            category_responses = self.response_templates.get(analysis['emotional_category'], self.response_templates['general_support'])
            response = random.choice(category_responses)
            
            return {
                'message': response,
                'crisis_detected': False,
                'crisis_level': CrisisLevel.MEDIUM,
                'suggested_actions': [
                    "Consider talking to a mental health professional",
                    "Try some coping strategies",
                    "Reach out to supportive people in your life",
                    "Practice self-care activities"
                ],
                'coping_strategy': random.choice(self.coping_strategies)
            }
        
        # Handle low crisis situations
        else:
            category_responses = self.response_templates.get(analysis['emotional_category'], self.response_templates['general_support'])
            response = random.choice(category_responses)
            
            return {
                'message': response,
                'crisis_detected': False,
                'crisis_level': CrisisLevel.LOW,
                'coping_strategy': random.choice(self.coping_strategies) if random.random() < 0.3 else None
            }

    def get_follow_up_questions(self, analysis: Dict) -> List[str]:
        """Generate follow-up questions based on the analysis."""
        questions = {
            'depression': [
                "What's been contributing to these feelings lately?",
                "Have you noticed any patterns in when you feel this way?",
                "What usually helps you feel a little better, even temporarily?",
                "How long have you been feeling this way?"
            ],
            'anxiety': [
                "What specific thoughts or situations are making you feel anxious?",
                "Have you tried any techniques that have helped with anxiety before?",
                "What does anxiety feel like in your body right now?",
                "Is there something particular that triggered these feelings?"
            ],
            'general_support': [
                "Can you tell me more about what's on your mind?",
                "What would be most helpful for you right now?",
                "How are you feeling about everything that's happening?",
                "What's been weighing on you lately?"
            ]
        }
        
        category_questions = questions.get(analysis['emotional_category'], questions['general_support'])
        return random.sample(category_questions, min(2, len(category_questions)))

# Initialize AI system
mindful_ai = MindfulAI()

@app.route('/')
def index():
    """Serve the main chat interface."""
    return render_template('index.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    """Handle chat messages and return AI responses."""
    try:
        data = request.get_json()
        
        if not data or 'message' not in data:
            return jsonify({'error': 'Message is required'}), 400
        
        message = data['message'].strip()
        
        if not message:
            return jsonify({'error': 'Message cannot be empty'}), 400
        
        # Log the interaction (anonymized)
        logger.info(f"Received message: {len(message)} characters")
        
        # Analyze the message
        analysis = mindful_ai.analyze_message(message)
        
        # Generate response
        response_data = mindful_ai.generate_response(message, analysis)
        
        # Add analysis metadata
        response_data['analysis'] = {
            'emotional_category': analysis['emotional_category'],
            'message_length': analysis['message_length'],
            'timestamp': analysis['timestamp']
        }
        
        # Log response generation
        logger.info(f"Generated response for {analysis['emotional_category']} category, crisis level: {analysis['crisis_level']}")
        
        return jsonify(response_data)
        
    except Exception as e:
        logger.error(f"Error processing chat message: {str(e)}")
        return jsonify({
            'error': 'I apologize, but I\'m having trouble processing your message right now. Please try again in a moment.',
            'message': 'I\'m here to listen and support you. Please try sharing your thoughts again.'
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0'
    })

@app.route('/api/crisis-resources', methods=['GET'])
def crisis_resources():
    """Get crisis resources and emergency contacts."""
    return jsonify({
        'emergency': {
            'phone': '911',
            'description': 'Emergency Services'
        },
        'lifeline': {
            'phone': '988',
            'description': 'National Suicide Prevention Lifeline',
            'hours': '24/7'
        },
        'crisis_text': {
            'text': 'HOME to 741741',
            'description': 'Crisis Text Line',
            'hours': '24/7'
        },
        'online_resources': [
            {
                'name': 'Suicide Prevention Lifeline',
                'url': 'https://suicidepreventionlifeline.org'
            },
            {
                'name': 'Crisis Text Line',
                'url': 'https://www.crisistextline.org'
            },
            {
                'name': 'National Alliance on Mental Illness',
                'url': 'https://www.nami.org'
            }
        ]
    })

@app.route('/api/coping-strategies', methods=['GET'])
def coping_strategies():
    """Get a list of coping strategies."""
    return jsonify({
        'strategies': mindful_ai.coping_strategies,
        'timestamp': datetime.now().isoformat()
    })

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors."""
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors."""
    logger.error(f"Internal server error: {str(error)}")
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    # Run the Flask app
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True,
        threaded=True
    )
