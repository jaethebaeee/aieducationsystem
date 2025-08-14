import React, { useState, useRef, useEffect } from 'react';
import PrivateSEO from '../../components/seo/PrivateSEO';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  PaperAirplaneIcon,
  LightBulbIcon,
  AcademicCapIcon,
  GlobeAltIcon,
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  BookOpenIcon,
  ArrowPathIcon,
  ShareIcon
} from '@heroicons/react/24/outline';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'resource';
}

const MentorPage: React.FC = () => {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('general');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const suggestedQuestions = {
    general: [
      t('mentor.suggestions.general.essayStructure'),
      t('mentor.suggestions.general.culturalElements'),
      t('mentor.suggestions.general.weaknesses'),
      t('mentor.suggestions.general.personalStatement')
    ],
    cultural: [
      t('mentor.suggestions.cultural.koreanHeritage'),
      t('mentor.suggestions.cultural.culturalBridge'),
      t('mentor.suggestions.cultural.authenticity'),
      t('mentor.suggestions.cultural.values')
    ],
    technical: [
      t('mentay.suggestions.technical.grammar'),
      t('mentor.suggestions.technical.structure'),
      t('mentor.suggestions.technical.flow'),
      t('mentor.suggestions.technical.hook')
    ]
  };

  const categories = [
    { id: 'general', label: t('mentor.categories.general'), icon: ChatBubbleLeftRightIcon, color: 'bg-blue-100 text-blue-800' },
    { id: 'cultural', label: t('mentor.categories.cultural'), icon: GlobeAltIcon, color: 'bg-green-100 text-green-800' },
    { id: 'technical', label: t('mentor.categories.technical'), icon: AcademicCapIcon, color: 'bg-purple-100 text-purple-800' }
  ];

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI response with different types
    setTimeout(() => {
      const responses = [
        {
          text: t('mentor.responses.general'),
          type: 'text' as const
        },
        {
          text: t('mentor.responses.suggestion'),
          type: 'suggestion' as const
        },
        {
          text: t('mentor.responses.resource'),
          type: 'resource' as const
        }
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const aiResponse: Message = {
        id: Date.now() + 1,
        text: randomResponse.text,
        isUser: false,
        timestamp: new Date(),
        type: randomResponse.type
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 2000);
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputMessage(question);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const exportChat = () => {
    const chatText = messages.map(msg => 
      `${msg.isUser ? 'You' : 'Mentor'}: ${msg.text}`
    ).join('\n\n');
    
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mentor-chat-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PrivateSEO title="멘토 챗 | AdmitAI Korea" language="ko" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 text-korean">
                {t('mentor.title')}
              </h1>
              <p className="mt-2 text-gray-600 text-korean">
                {t('mentor.subtitle')}
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <button
                onClick={clearChat}
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ArrowPathIcon className="w-4 h-4" />
                <span className="text-korean">{t('mentor.clearChat')}</span>
              </button>
              <button
                onClick={exportChat}
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ShareIcon className="w-4 h-4" />
                <span className="text-korean">{t('mentor.exportChat')}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-[600px] flex flex-col">
              {/* Chat Header */}
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <SparklesIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-korean">
                      {t('mentor.virtualMentor')}
                    </h3>
                    <p className="text-sm text-gray-600 text-korean">
                      {t('mentor.onlineStatus')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ChatBubbleLeftRightIcon className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 text-korean mb-2">
                      {t('mentor.welcomeTitle')}
                    </h3>
                    <p className="text-gray-600 text-korean max-w-md mx-auto">
                      {t('mentor.welcomeMessage')}
                    </p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md ${message.isUser ? 'order-2' : 'order-1'}`}>
                        {!message.isUser && (
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                              <SparklesIcon className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-xs text-gray-500 text-korean">{t('mentor.aiMentor')}</span>
                          </div>
                        )}
                        <div
                          className={`px-4 py-3 rounded-2xl ${
                            message.isUser
                              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-korean whitespace-pre-wrap">{message.text}</p>
                          {message.type === 'suggestion' && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <div className="flex items-center space-x-2">
                                <LightBulbIcon className="w-4 h-4 text-yellow-500" />
                                <span className="text-xs font-medium text-korean">{t('mentor.suggestion')}</span>
                              </div>
                            </div>
                          )}
                          {message.type === 'resource' && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <div className="flex items-center space-x-2">
                                <BookOpenIcon className="w-4 h-4 text-blue-500" />
                                <span className="text-xs font-medium text-korean">{t('mentor.resource')}</span>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className={`text-xs mt-1 ${message.isUser ? 'text-gray-500 text-right' : 'text-gray-500'}`}>
                          {formatTime(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-center space-x-2 bg-gray-100 text-gray-900 px-4 py-3 rounded-2xl">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-sm text-korean">{t('mentor.thinking')}</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-6 border-t border-gray-200">
                <div className="flex space-x-3">
                  <div className="flex-1 relative">
                    <textarea
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={t('mentor.typeMessage')}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-korean"
                      rows={1}
                      style={{ minHeight: '44px', maxHeight: '120px' }}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isLoading}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <PaperAirplaneIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                  <span className="text-korean">{t('mentor.pressEnter')}</span>
                  <span>{inputMessage.length}/500</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Category Selection */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 text-korean mb-4">
                {t('mentor.categories.title')}
              </h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-blue-50 border border-blue-200'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${category.color}`}>
                      <category.icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-gray-900 text-korean">{category.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Suggested Questions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 text-korean mb-4">
                {t('mentor.suggestions.title')}
              </h3>
              <div className="space-y-2">
                {suggestedQuestions[selectedCategory as keyof typeof suggestedQuestions]?.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedQuestion(question)}
                    className="w-full text-left p-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-korean"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 text-korean mb-4">
                {t('mentor.quickActions')}
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => handleSuggestedQuestion(t('mentor.actions.essayReview'))}
                  className="w-full flex items-center space-x-3 p-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <DocumentTextIcon className="w-4 h-4" />
                  <span className="text-korean">{t('mentor.actions.essayReview')}</span>
                </button>
                <button
                  onClick={() => handleSuggestedQuestion(t('mentor.actions.culturalAdvice'))}
                  className="w-full flex items-center space-x-3 p-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <GlobeAltIcon className="w-4 h-4" />
                  <span className="text-korean">{t('mentor.actions.culturalAdvice')}</span>
                </button>
                <button
                  onClick={() => handleSuggestedQuestion(t('mentor.actions.applicationStrategy'))}
                  className="w-full flex items-center space-x-3 p-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <AcademicCapIcon className="w-4 h-4" />
                  <span className="text-korean">{t('mentor.actions.applicationStrategy')}</span>
                </button>
              </div>
            </div>

            {/* Chat Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 text-korean mb-4">
                {t('mentor.chatStats')}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 text-korean">{t('mentor.stats.messages')}</span>
                  <span className="text-sm font-medium text-gray-900">{messages.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 text-korean">{t('mentor.stats.sessionTime')}</span>
                  <span className="text-sm font-medium text-gray-900">
                    {messages.length > 0 ? 
                      Math.round((Date.now() - messages[0].timestamp.getTime()) / 60000) : 0}m
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorPage; 