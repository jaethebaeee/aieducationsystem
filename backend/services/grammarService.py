#!/usr/bin/env python3
"""
Grammar Service for AdmitAI Korea
Uses LanguageTool for free, powerful grammar checking
"""

import json
import sys
from flask import Flask, request, jsonify
from flask_cors import CORS
from language_tool_python import LanguageTool
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Initialize LanguageTool
try:
    tool = LanguageTool('en-US')
    logger.info("LanguageTool initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize LanguageTool: {e}")
    tool = None

class GrammarAnalyzer:
    def __init__(self):
        self.tool = tool
        self.error_categories = {
            'GRAMMAR': 'Grammar errors',
            'SPELLING': 'Spelling mistakes',
            'STYLE': 'Style issues',
            'PUNCTUATION': 'Punctuation errors',
            'TYPOS': 'Typographical errors'
        }
    
    def analyze_text(self, text):
        """Analyze text for grammar, spelling, and style errors"""
        if not self.tool:
            return {
                'error': 'LanguageTool not available',
                'score': 0,
                'issues': []
            }
        
        try:
            # Get matches from LanguageTool
            matches = self.tool.check(text)
            
            # Process matches
            issues = []
            total_errors = len(matches)
            
            for match in matches:
                issue = {
                    'type': match.ruleId,
                    'category': match.category,
                    'message': match.message,
                    'suggestion': match.replacements[0] if match.replacements else None,
                    'offset': match.offset,
                    'length': match.errorLength,
                    'context': match.context,
                    'severity': self._get_severity(match.category)
                }
                issues.append(issue)
            
            # Calculate grammar score (0-100)
            score = max(0, 100 - (total_errors * 5))  # -5 points per error
            
            return {
                'score': score,
                'total_errors': total_errors,
                'issues': issues,
                'summary': self._generate_summary(issues)
            }
            
        except Exception as e:
            logger.error(f"Error analyzing text: {e}")
            return {
                'error': str(e),
                'score': 0,
                'issues': []
            }
    
    def _get_severity(self, category):
        """Determine severity level of an error"""
        severity_map = {
            'GRAMMAR': 'high',
            'SPELLING': 'medium',
            'STYLE': 'low',
            'PUNCTUATION': 'medium',
            'TYPOS': 'low'
        }
        return severity_map.get(category, 'medium')
    
    def _generate_summary(self, issues):
        """Generate a summary of grammar issues"""
        if not issues:
            return "No grammar issues found. Great job!"
        
        categories = {}
        for issue in issues:
            cat = issue['category']
            categories[cat] = categories.get(cat, 0) + 1
        
        summary_parts = []
        for cat, count in categories.items():
            summary_parts.append(f"{count} {cat.lower()} issue{'s' if count > 1 else ''}")
        
        return f"Found {len(issues)} total issues: {', '.join(summary_parts)}."
    
    def get_suggestions(self, text):
        """Get specific suggestions for improving the text"""
        if not self.tool:
            return []
        
        try:
            matches = self.tool.check(text)
            suggestions = []
            
            for match in matches:
                if match.replacements:
                    suggestion = {
                        'original': text[match.offset:match.offset + match.errorLength],
                        'suggestion': match.replacements[0],
                        'explanation': match.message,
                        'category': match.category
                    }
                    suggestions.append(suggestion)
            
            return suggestions
            
        except Exception as e:
            logger.error(f"Error getting suggestions: {e}")
            return []

# Initialize analyzer
analyzer = GrammarAnalyzer()

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'grammar-checker',
        'tool_available': tool is not None
    })

@app.route('/analyze', methods=['POST'])
def analyze_essay():
    """Analyze essay for grammar issues"""
    try:
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({'error': 'Text is required'}), 400
        
        text = data['text']
        
        if not text.strip():
            return jsonify({'error': 'Text cannot be empty'}), 400
        
        # Analyze the text
        result = analyzer.analyze_text(text)
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error in analyze endpoint: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/suggestions', methods=['POST'])
def get_suggestions():
    """Get specific suggestions for text improvement"""
    try:
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({'error': 'Text is required'}), 400
        
        text = data['text']
        suggestions = analyzer.get_suggestions(text)
        
        return jsonify({'suggestions': suggestions})
        
    except Exception as e:
        logger.error(f"Error in suggestions endpoint: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/check', methods=['POST'])
def quick_check():
    """Quick grammar check with basic info"""
    try:
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({'error': 'Text is required'}), 400
        
        text = data['text']
        
        if not self.tool:
            return jsonify({'error': 'LanguageTool not available'}), 503
        
        matches = self.tool.check(text)
        
        return jsonify({
            'has_errors': len(matches) > 0,
            'error_count': len(matches),
            'score': max(0, 100 - (len(matches) * 5))
        })
        
    except Exception as e:
        logger.error(f"Error in quick check endpoint: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 5001
    logger.info(f"Starting Grammar Service on port {port}")
    app.run(host='0.0.0.0', port=port, debug=False) 