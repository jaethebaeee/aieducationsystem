# =============================================================================
# AdmitAI Korea - AI Essay Analysis Adaptation
# =============================================================================
# This file shows how to adapt the Automated Essay Grading repository
# for our Korean student-focused essay analysis system

import openai
import json
import re
from typing import Dict, List, Any, Optional
from dataclasses import dataclass
from enum import Enum
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# =============================================================================
# Data Models
# =============================================================================

class EssayType(Enum):
    PERSONAL_STATEMENT = "personal-statement"
    SUPPLEMENTAL = "supplemental"
    COMMON_APP = "common-app"
    SCHOLARSHIP = "scholarship"

class FeedbackSeverity(Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class FeedbackType(Enum):
    GRAMMAR = "grammar"
    STYLE = "style"
    CONTENT = "content"
    CULTURAL = "cultural"
    STRUCTURE = "structure"
    SCHOOL_FIT = "school-fit"

@dataclass
class EssayFeedback:
    id: str
    type: FeedbackType
    severity: FeedbackSeverity
    title: str
    description: str
    suggestion: str
    line_number: Optional[int] = None
    word_range: Optional[tuple] = None

@dataclass
class EssayAnalytics:
    overall_score: float
    grammar_score: float
    style_score: float
    content_score: float
    cultural_score: float
    structure_score: float
    word_count: int
    reading_level: str
    cultural_insights: List[str]
    school_fit_score: Optional[float] = None

@dataclass
class EssayAnalysis:
    essay_id: str
    analytics: EssayAnalytics
    feedback: List[EssayFeedback]
    summary: str
    recommendations: List[str]
    cultural_context: Dict[str, Any]

# =============================================================================
# BEFORE: Original SpaCy-based Analysis (from Automated Essay Grading)
# =============================================================================

class OriginalEssayGrader:
    """Original SpaCy-based essay grader from the repository"""
    
    def __init__(self):
        import spacy
        self.nlp = spacy.load("en_core_web_sm")
    
    def extract_features(self, essay_text: str) -> Dict[str, Any]:
        """Extract basic NLP features using SpaCy"""
        doc = self.nlp(essay_text)
        
        features = {
            'word_count': len(doc),
            'sentence_count': len(list(doc.sents)),
            'avg_sentence_length': len(doc) / len(list(doc.sents)),
            'unique_words': len(set([token.text.lower() for token in doc if not token.is_punct])),
            'vocabulary_diversity': len(set([token.text.lower() for token in doc if not token.is_punct])) / len(doc),
            'noun_phrases': len(list(doc.noun_chunks)),
            'verb_phrases': len([token for token in doc if token.pos_ == 'VERB']),
            'adjective_count': len([token for token in doc if token.pos_ == 'ADJ']),
            'adverb_count': len([token for token in doc if token.pos_ == 'ADV']),
        }
        
        return features
    
    def grade_essay(self, features: Dict[str, Any]) -> float:
        """Simple grading based on extracted features"""
        score = 0.0
        
        # Vocabulary diversity (30% weight)
        if features['vocabulary_diversity'] > 0.7:
            score += 3.0
        elif features['vocabulary_diversity'] > 0.5:
            score += 2.0
        else:
            score += 1.0
        
        # Sentence variety (25% weight)
        if 10 <= features['avg_sentence_length'] <= 25:
            score += 2.5
        elif 5 <= features['avg_sentence_length'] <= 30:
            score += 1.5
        else:
            score += 0.5
        
        # Content richness (45% weight)
        content_score = (features['noun_phrases'] + features['verb_phrases']) / features['word_count']
        if content_score > 0.3:
            score += 4.5
        elif content_score > 0.2:
            score += 3.0
        else:
            score += 1.5
        
        return min(score, 10.0)

# =============================================================================
# AFTER: Adapted GPT-4-based Analysis for Korean Students
# =============================================================================

class AdmitAIKoreaEssayAnalyzer:
    """Enhanced essay analyzer with GPT-4 and Korean cultural context"""
    
    def __init__(self, openai_api_key: str):
        openai.api_key = openai_api_key
        self.korean_cultural_context = self._load_korean_context()
        self.school_profiles = self._load_school_profiles()
    
    def _load_korean_context(self) -> Dict[str, Any]:
        """Load Korean cultural context for better analysis"""
        return {
            "cultural_values": [
                "Confucian values (respect for elders, education, harmony)",
                "Collectivism vs individualism",
                "Academic achievement pressure",
                "Family expectations and filial piety",
                "Korean work ethic and diligence",
                "Cultural humility and modesty"
            ],
            "common_esl_patterns": [
                "Article usage (a/an/the)",
                "Preposition confusion",
                "Verb tense consistency",
                "Subject-verb agreement",
                "Word order differences",
                "Formal vs informal register"
            ],
            "cultural_translation_challenges": [
                "Direct translation from Korean",
                "Cultural concept explanation",
                "Honorific system adaptation",
                "Indirect communication style",
                "Group-oriented thinking"
            ]
        }
    
    def _load_school_profiles(self) -> Dict[str, Dict[str, Any]]:
        """Load target school profiles for better analysis"""
        return {
            "stanford": {
                "name": "Stanford University",
                "values": ["innovation", "entrepreneurship", "intellectual vitality", "diversity"],
                "essay_preferences": ["personal stories", "intellectual curiosity", "leadership", "community impact"],
                "cultural_fit": ["global perspective", "collaboration", "risk-taking"]
            },
            "harvard": {
                "name": "Harvard University",
                "values": ["leadership", "academic excellence", "service", "character"],
                "essay_preferences": ["leadership examples", "intellectual growth", "service to others", "personal values"],
                "cultural_fit": ["global citizenship", "ethical leadership", "intellectual rigor"]
            },
            "mit": {
                "name": "MIT",
                "values": ["innovation", "problem-solving", "collaboration", "hands-on learning"],
                "essay_preferences": ["technical interests", "problem-solving examples", "collaboration", "practical applications"],
                "cultural_fit": ["technical curiosity", "teamwork", "practical innovation"]
            }
        }
    
    def create_cultural_prompt(self, essay_text: str, essay_type: EssayType, 
                             target_school: Optional[str] = None, 
                             user_language: str = "ko") -> str:
        """Create a culturally-aware prompt for GPT-4 analysis"""
        
        school_context = ""
        if target_school and target_school.lower() in self.school_profiles:
            school = self.school_profiles[target_school.lower()]
            school_context = f"""
            Target School: {school['name']}
            School Values: {', '.join(school['values'])}
            Essay Preferences: {', '.join(school['essay_preferences'])}
            Cultural Fit Factors: {', '.join(school['cultural_fit'])}
            """
        
        prompt = f"""
        You are an expert college admissions essay analyst specializing in Korean students applying to U.S. universities. 
        Analyze the following essay with cultural sensitivity and provide detailed feedback.

        ESSAY TYPE: {essay_type.value}
        TARGET LANGUAGE: {user_language}
        {school_context}

        ESSAY TEXT:
        {essay_text}

        Please provide a comprehensive analysis including:

        1. OVERALL SCORE (1-10 scale):
        - Grammar and mechanics (25% weight)
        - Style and flow (20% weight)
        - Content and substance (30% weight)
        - Cultural adaptation (15% weight)
        - Structure and organization (10% weight)

        2. DETAILED FEEDBACK:
        - Specific grammar corrections with line numbers
        - Style improvements for better flow
        - Content suggestions for stronger impact
        - Cultural context enhancements
        - Structure and organization tips

        3. CULTURAL INSIGHTS:
        - How well Korean cultural values are presented
        - Suggestions for better cultural bridge-building
        - ESL-specific improvements
        - Cultural humility and authenticity assessment

        4. SCHOOL FIT ANALYSIS (if target school provided):
        - Alignment with school values
        - Specific improvements for target school
        - Cultural fit recommendations

        5. ACTIONABLE RECOMMENDATIONS:
        - 3-5 specific, actionable improvements
        - Priority order for revisions
        - Cultural context suggestions

        Format your response as JSON with the following structure:
        {{
            "analytics": {{
                "overall_score": float,
                "grammar_score": float,
                "style_score": float,
                "content_score": float,
                "cultural_score": float,
                "structure_score": float,
                "word_count": int,
                "reading_level": string,
                "cultural_insights": [string],
                "school_fit_score": float
            }},
            "feedback": [
                {{
                    "type": "grammar|style|content|cultural|structure|school-fit",
                    "severity": "low|medium|high",
                    "title": string,
                    "description": string,
                    "suggestion": string,
                    "line_number": int,
                    "word_range": [int, int]
                }}
            ],
            "summary": string,
            "recommendations": [string],
            "cultural_context": {{
                "korean_values_present": [string],
                "cultural_bridge_opportunities": [string],
                "esl_improvements": [string]
            }}
        }}
        """
        
        return prompt
    
    def analyze_essay(self, essay_text: str, essay_type: EssayType, 
                     target_school: Optional[str] = None, 
                     user_language: str = "ko") -> EssayAnalysis:
        """Analyze essay using GPT-4 with Korean cultural context"""
        
        try:
            # Create culturally-aware prompt
            prompt = self.create_cultural_prompt(essay_text, essay_type, target_school, user_language)
            
            # Call GPT-4 API
            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are an expert college admissions essay analyst with deep understanding of Korean culture and U.S. college admissions."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=2000
            )
            
            # Parse response
            analysis_data = json.loads(response.choices[0].message.content)
            
            # Convert to our data models
            analytics = EssayAnalytics(**analysis_data["analytics"])
            
            feedback = []
            for fb in analysis_data["feedback"]:
                feedback.append(EssayFeedback(
                    id=f"fb_{len(feedback)}",
                    type=FeedbackType(fb["type"]),
                    severity=FeedbackSeverity(fb["severity"]),
                    title=fb["title"],
                    description=fb["description"],
                    suggestion=fb["suggestion"],
                    line_number=fb.get("line_number"),
                    word_range=tuple(fb["word_range"]) if fb.get("word_range") else None
                ))
            
            return EssayAnalysis(
                essay_id=f"essay_{hash(essay_text) % 10000}",
                analytics=analytics,
                feedback=feedback,
                summary=analysis_data["summary"],
                recommendations=analysis_data["recommendations"],
                cultural_context=analysis_data["cultural_context"]
            )
            
        except Exception as e:
            logger.error(f"Essay analysis failed: {str(e)}")
            raise
    
    def generate_cultural_insights(self, essay_text: str) -> List[str]:
        """Generate specific cultural insights for Korean students"""
        
        prompt = f"""
        Analyze this essay from a Korean cultural perspective and provide specific insights:

        ESSAY: {essay_text}

        Focus on:
        1. How Korean cultural values are expressed
        2. Opportunities to better bridge Korean and American cultures
        3. ESL patterns that could be improved
        4. Cultural authenticity and humility

        Provide 3-5 specific insights as a JSON array of strings.
        """
        
        try:
            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a cultural bridge expert specializing in Korean-American cultural exchange."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=500
            )
            
            return json.loads(response.choices[0].message.content)
            
        except Exception as e:
            logger.error(f"Cultural insights generation failed: {str(e)}")
            return ["Cultural analysis temporarily unavailable"]

# =============================================================================
# Integration Example: Flask API Endpoint
# =============================================================================

from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Initialize analyzer
analyzer = AdmitAIKoreaEssayAnalyzer(openai_api_key="your-openai-api-key")

@app.route('/api/essays/analyze', methods=['POST'])
def analyze_essay():
    """API endpoint for essay analysis"""
    
    try:
        data = request.get_json()
        
        # Validate input
        required_fields = ['content', 'type']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Parse essay type
        try:
            essay_type = EssayType(data['type'])
        except ValueError:
            return jsonify({'error': 'Invalid essay type'}), 400
        
        # Analyze essay
        analysis = analyzer.analyze_essay(
            essay_text=data['content'],
            essay_type=essay_type,
            target_school=data.get('target_school'),
            user_language=data.get('language', 'ko')
        )
        
        # Convert to JSON-serializable format
        result = {
            'essay_id': analysis.essay_id,
            'analytics': {
                'overall_score': analysis.analytics.overall_score,
                'grammar_score': analysis.analytics.grammar_score,
                'style_score': analysis.analytics.style_score,
                'content_score': analysis.analytics.content_score,
                'cultural_score': analysis.analytics.cultural_score,
                'structure_score': analysis.analytics.structure_score,
                'word_count': analysis.analytics.word_count,
                'reading_level': analysis.analytics.reading_level,
                'cultural_insights': analysis.analytics.cultural_insights,
                'school_fit_score': analysis.analytics.school_fit_score
            },
            'feedback': [
                {
                    'id': fb.id,
                    'type': fb.type.value,
                    'severity': fb.severity.value,
                    'title': fb.title,
                    'description': fb.description,
                    'suggestion': fb.suggestion,
                    'line_number': fb.line_number,
                    'word_range': fb.word_range
                }
                for fb in analysis.feedback
            ],
            'summary': analysis.summary,
            'recommendations': analysis.recommendations,
            'cultural_context': analysis.cultural_context
        }
        
        return jsonify(result), 200
        
    except Exception as e:
        logger.error(f"API error: {str(e)}")
        return jsonify({'error': 'Analysis failed'}), 500

# =============================================================================
# Usage Example
# =============================================================================

def example_usage():
    """Example of how to use the adapted essay analyzer"""
    
    # Sample essay text (Korean student's personal statement)
    sample_essay = """
    Growing up in Seoul, I was always fascinated by how technology could bridge cultural gaps. 
    When my grandmother first learned to use a smartphone to video call our relatives in America, 
    I saw how a simple device could connect families across continents. This experience inspired 
    my interest in computer science and my desire to study at Stanford University.
    
    In high school, I led a coding club where we developed apps to help Korean students learn English. 
    Our most successful project was a language exchange app that connected Korean students with 
    native English speakers. Through this project, I learned not just about programming, but about 
    the importance of cultural understanding in technology design.
    
    I believe that my background as a Korean student gives me a unique perspective on how technology 
    can serve diverse communities. At Stanford, I hope to combine my technical skills with my 
    cultural insights to create technology that truly serves global users.
    """
    
    # Initialize analyzer
    analyzer = AdmitAIKoreaEssayAnalyzer(openai_api_key="your-api-key")
    
    # Analyze essay
    analysis = analyzer.analyze_essay(
        essay_text=sample_essay,
        essay_type=EssayType.PERSONAL_STATEMENT,
        target_school="stanford",
        user_language="ko"
    )
    
    # Print results
    print(f"Overall Score: {analysis.analytics.overall_score}/10")
    print(f"Cultural Score: {analysis.analytics.cultural_score}/10")
    print(f"Word Count: {analysis.analytics.word_count}")
    print(f"Reading Level: {analysis.analytics.reading_level}")
    
    print("\nCultural Insights:")
    for insight in analysis.analytics.cultural_insights:
        print(f"- {insight}")
    
    print("\nTop Feedback:")
    for feedback in analysis.feedback[:3]:
        print(f"- {feedback.title} ({feedback.severity.value})")
    
    print("\nRecommendations:")
    for rec in analysis.recommendations:
        print(f"- {rec}")

if __name__ == "__main__":
    # Run example
    example_usage()
    
    # Or start Flask server
    # app.run(debug=True, port=5000) 