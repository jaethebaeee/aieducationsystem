// =============================================================================
// AdmitAI Korea - Portfolio Template Adaptation Example
// =============================================================================
// This file shows how to adapt React Portfolio Template components
// for our essay analysis system with Korean cultural design

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

// =============================================================================
// Original Portfolio Project Card → Essay Feedback Card
// =============================================================================

// BEFORE: Original Portfolio Project Card
const OriginalProjectCard = ({ project }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <img src={project.image} alt={project.title} className="w-full h-48 object-cover rounded-lg" />
      <h3 className="text-xl font-bold mt-4">{project.title}</h3>
      <p className="text-gray-600 mt-2">{project.description}</p>
      <div className="flex gap-2 mt-4">
        {project.technologies.map(tech => (
          <span key={tech} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
};

// AFTER: Adapted Essay Feedback Card
const EssayFeedbackCard = ({ essay }) => {
  const { t, i18n } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-600 bg-green-100';
    if (score >= 6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'draft': 'bg-gray-100 text-gray-800',
      'submitted': 'bg-blue-100 text-blue-800',
      'reviewing': 'bg-yellow-100 text-yellow-800',
      'feedback-ready': 'bg-green-100 text-green-800',
      'revised': 'bg-purple-100 text-purple-800'
    };
    return statusColors[status] || statusColors.draft;
  };

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-soft border border-neutral-200 p-6 hover:shadow-medium transition-shadow duration-200"
      whileHover={{ y: -2 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Essay Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-neutral-900 korean-text">
            {essay.title}
          </h3>
          <p className="text-sm text-neutral-600 mt-1">
            {t('essays.type.' + essay.type)} • {essay.wordCount} {t('essays.wordCount')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(essay.status)}`}>
            {t('essays.status.' + essay.status)}
          </span>
          {essay.analytics && (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getScoreColor(essay.analytics.overallScore)}`}>
              {essay.analytics.overallScore}/10
            </span>
          )}
        </div>
      </div>

      {/* Essay Preview */}
      <div className="bg-neutral-50 rounded-lg p-4 mb-4">
        <p className="text-neutral-700 text-sm line-clamp-3 korean-text">
          {essay.content.substring(0, 200)}...
        </p>
      </div>

      {/* Feedback Summary */}
      {essay.feedback && essay.feedback.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold text-neutral-900 mb-2">
            {t('feedback.title')} ({essay.feedback.length})
          </h4>
          <div className="space-y-2">
            {essay.feedback.slice(0, 3).map((feedback, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  feedback.severity === 'high' ? 'bg-red-500' :
                  feedback.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`} />
                <span className="text-sm text-neutral-700">
                  {feedback.title}
                </span>
              </div>
            ))}
            {essay.feedback.length > 3 && (
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                {isExpanded ? t('common.showLess') : t('common.showMore')} ({essay.feedback.length - 3})
              </button>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button className="btn-primary flex-1">
          {t('essays.view')}
        </button>
        <button className="btn-outline">
          {t('essays.edit')}
        </button>
        <button className="btn-ghost">
          {t('essays.analyze')}
        </button>
      </div>
    </motion.div>
  );
};

// =============================================================================
// Original Contact Form → Essay Upload Form
// =============================================================================

// BEFORE: Original Contact Form
const OriginalContactForm = () => {
  return (
    <form className="space-y-4">
      <input type="text" placeholder="Name" className="w-full p-3 border rounded" />
      <input type="email" placeholder="Email" className="w-full p-3 border rounded" />
      <textarea placeholder="Message" className="w-full p-3 border rounded" rows="4" />
      <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">
        Send Message
      </button>
    </form>
  );
};

// AFTER: Adapted Essay Upload Form
const EssayUploadForm = () => {
  const { t, i18n } = useTranslation();
  const [essayData, setEssayData] = useState({
    title: '',
    content: '',
    type: 'personal-statement',
    targetSchool: '',
    prompt: ''
  });
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    
    try {
      // Submit essay for AI analysis
      const response = await fetch('/api/essays', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(essayData)
      });
      
      if (response.ok) {
        // Navigate to feedback page
        window.location.href = '/feedback/' + (await response.json()).id;
      }
    } catch (error) {
      console.error('Essay upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <motion.form 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
    >
      {/* Essay Title */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2 korean-text">
          {t('essays.title')} *
        </label>
        <input 
          type="text" 
          value={essayData.title}
          onChange={(e) => setEssayData({...essayData, title: e.target.value})}
          placeholder={t('essays.titlePlaceholder')}
          className="input"
          required
        />
      </div>

      {/* Essay Type */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2 korean-text">
          {t('essays.type')} *
        </label>
        <select 
          value={essayData.type}
          onChange={(e) => setEssayData({...essayData, type: e.target.value})}
          className="input"
          required
        >
          <option value="personal-statement">{t('essays.type.personal')}</option>
          <option value="supplemental">{t('essays.type.supplemental')}</option>
          <option value="common-app">{t('essays.type.common')}</option>
          <option value="scholarship">{t('essays.type.scholarship')}</option>
        </select>
      </div>

      {/* Target School */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2 korean-text">
          {t('essays.targetSchool')}
        </label>
        <input 
          type="text" 
          value={essayData.targetSchool}
          onChange={(e) => setEssayData({...essayData, targetSchool: e.target.value})}
          placeholder={t('essays.targetSchoolPlaceholder')}
          className="input"
        />
      </div>

      {/* Essay Content */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2 korean-text">
          {t('essays.content')} *
        </label>
        <textarea 
          value={essayData.content}
          onChange={(e) => setEssayData({...essayData, content: e.target.value})}
          placeholder={t('essays.contentPlaceholder')}
          className="input min-h-[300px] resize-y"
          required
        />
        <div className="flex justify-between items-center mt-2 text-sm text-neutral-500">
          <span>{essayData.content.length} {t('essays.characters')}</span>
          <span>{Math.ceil(essayData.content.split(' ').length)} {t('essays.words')}</span>
        </div>
      </div>

      {/* Essay Prompt */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2 korean-text">
          {t('essays.prompt')}
        </label>
        <textarea 
          value={essayData.prompt}
          onChange={(e) => setEssayData({...essayData, prompt: e.target.value})}
          placeholder={t('essays.promptPlaceholder')}
          className="input"
          rows="3"
        />
      </div>

      {/* Ethical Disclaimer */}
      <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 text-primary-600 mt-0.5">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 className="font-medium text-primary-900 korean-text">
              {t('ethics.disclaimer.title')}
            </h4>
            <p className="text-sm text-primary-700 mt-1 korean-text">
              {t('ethics.disclaimer.message')}
            </p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button 
        type="submit" 
        disabled={isUploading}
        className="btn-primary w-full"
      >
        {isUploading ? (
          <div className="flex items-center gap-2">
            <div className="spinner w-4 h-4" />
            {t('essays.uploading')}
          </div>
        ) : (
          t('essays.submit')
        )}
      </button>
    </motion.form>
  );
};

// =============================================================================
// Original Hero Section → Essay Dashboard Hero
// =============================================================================

// BEFORE: Original Hero Section
const OriginalHeroSection = () => {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to My Portfolio</h1>
        <p className="text-xl mb-8">I'm a passionate developer creating amazing web experiences</p>
        <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold">
          View My Work
        </button>
      </div>
    </section>
  );
};

// AFTER: Adapted Essay Dashboard Hero
const EssayDashboardHero = ({ user }) => {
  const { t, i18n } = useTranslation();

  return (
    <section className="gradient-primary text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-6 korean-text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {t('dashboard.welcome')}, {user.firstName}!
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl mb-8 opacity-90 english-text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {t('dashboard.subtitle')}
          </motion.p>

          {/* Quick Stats */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl font-bold mb-2">{user.analytics?.essaysSubmitted || 0}</div>
              <div className="text-sm opacity-90 korean-text">{t('dashboard.essaysCount')}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl font-bold mb-2">{user.analytics?.averageScore?.toFixed(1) || '0.0'}</div>
              <div className="text-sm opacity-90 korean-text">{t('dashboard.averageScore')}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl font-bold mb-2">{user.analytics?.improvementRate?.toFixed(1) || '0.0'}%</div>
              <div className="text-sm opacity-90 korean-text">{t('dashboard.improvement')}</div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <button className="btn-secondary">
              {t('dashboard.newEssay')}
            </button>
            <button className="btn-outline border-white text-white hover:bg-white hover:text-primary-600">
              {t('dashboard.viewResources')}
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// =============================================================================
// Usage Example
// =============================================================================

const AdmitAIKoreaApp = () => {
  const { t, i18n } = useTranslation();

  // Sample essay data
  const sampleEssay = {
    id: '1',
    title: 'My Journey from Seoul to Stanford',
    content: 'Growing up in Seoul, I always dreamed of studying computer science at a top U.S. university...',
    type: 'personal-statement',
    targetSchool: 'Stanford University',
    wordCount: 650,
    status: 'feedback-ready',
    analytics: {
      overallScore: 8.5,
      grammarScore: 9.0,
      styleScore: 8.0,
      contentScore: 8.5
    },
    feedback: [
      {
        id: '1',
        type: 'grammar',
        severity: 'low',
        title: 'Minor grammar improvement needed',
        description: 'Consider using more varied sentence structures'
      },
      {
        id: '2',
        type: 'cultural',
        severity: 'medium',
        title: 'Cultural context enhancement',
        description: 'Great personal story, but could better connect Korean and American values'
      }
    ]
  };

  const sampleUser = {
    firstName: '지훈',
    analytics: {
      essaysSubmitted: 5,
      averageScore: 8.2,
      improvementRate: 15.5
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <EssayDashboardHero user={sampleUser} />
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Essay Upload Form */}
          <div className="card p-8">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6 korean-text">
              {t('essays.new')}
            </h2>
            <EssayUploadForm />
          </div>
          
          {/* Essay Feedback Card */}
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-6 korean-text">
              {t('dashboard.recentEssays')}
            </h2>
            <EssayFeedbackCard essay={sampleEssay} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmitAIKoreaApp; 