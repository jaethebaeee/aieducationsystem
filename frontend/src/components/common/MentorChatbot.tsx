import React, { useState, useRef, useEffect } from 'react';
import KoreanText from './KoreanText';
import PromptSuggestions from '../chat/PromptSuggestions';
import { PromptSuggestion } from '../../services/promptSuggestions';

interface Message {
  id: string;
  text: string;
  koreanText?: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface QuickResponse {
  id: string;
  text: string;
  koreanText: string;
}

const MentorChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your virtual admissions mentor. I can help you with essay topics, application strategies, and college selection. What would you like to know?',
      koreanText: '안녕하세요! 저는 여러분의 가상 입학 멘토입니다. 에세이 주제, 지원 전략, 대학 선택에 대해 도움을 드릴 수 있습니다. 무엇을 알고 싶으신가요?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [university, setUniversity] = useState<string>('');

  const quickResponses: QuickResponse[] = [
    {
      id: '1',
      text: 'How do I choose an essay topic?',
      koreanText: '에세이 주제를 어떻게 선택하나요?'
    },
    {
      id: '2',
      text: 'What makes a good personal statement?',
      koreanText: '좋은 개인 성명서의 특징은 무엇인가요?'
    },
    {
      id: '3',
      text: 'How do I write about Korean culture?',
      koreanText: '한국 문화에 대해 어떻게 써야 하나요?'
    },
    {
      id: '4',
      text: 'What colleges should I apply to?',
      koreanText: '어떤 대학에 지원해야 하나요?'
    }
  ];

  const botResponses = {
    'essay_topic': {
      text: 'Great question! Choose a topic that reveals something unique about you. Consider moments of growth, challenges overcome, or experiences that shaped your values. For Korean students, cultural experiences like Chuseok celebrations, bilingual challenges, or balancing Korean and American values can make compelling topics.',
      koreanText: '좋은 질문이네요! 여러분만의 독특한 면을 보여주는 주제를 선택하세요. 성장의 순간, 극복한 도전, 가치관을 형성한 경험을 고려해보세요. 한국 학생들에게는 추석 축제, 이중 언어의 도전, 한국적 가치와 미국적 가치의 균형 같은 문화적 경험이 매력적인 주제가 될 수 있습니다.'
    },
    'personal_statement': {
      text: 'A strong personal statement should tell a compelling story with a clear narrative arc. Start with a hook, show growth and reflection, and connect to your future goals. Be authentic and specific - avoid generic statements. For Korean students, don\'t feel pressured to explain every cultural detail; focus on your personal journey.',
      koreanText: '강력한 개인 성명서는 명확한 서사적 구조를 가진 매력적인 이야기를 해야 합니다. 흥미로운 시작, 성장과 성찰, 미래 목표와의 연결을 보여주세요. 진정성 있고 구체적으로 작성하고, 일반적인 진술은 피하세요. 한국 학생들은 모든 문화적 세부사항을 설명할 필요는 없고, 개인적 여정에 집중하세요.'
    },
    'korean_culture': {
      text: 'Writing about Korean culture is powerful when you connect it to your personal story. Don\'t just describe traditions - show how they shaped you. For example, instead of just writing about making kimchi, write about how the patience and community spirit of kimjang taught you about collaboration and tradition.',
      koreanText: '한국 문화에 대해 쓸 때는 개인적 이야기와 연결하는 것이 강력합니다. 전통을 단순히 설명하지 말고, 그것이 여러분을 어떻게 형성했는지 보여주세요. 예를 들어, 김치 만드는 것에 대해 단순히 쓰는 대신, 김장의 인내심과 공동체 정신이 협력과 전통에 대해 가르쳐준 방법을 써보세요.'
    },
    'college_selection': {
      text: 'Consider factors like academic programs, location, size, and culture. For Korean students, also think about Korean student communities, international student support, and opportunities to share your culture. Research each school\'s values and see how they align with your goals. Don\'t just focus on rankings - find schools where you\'ll thrive.',
      koreanText: '학과 프로그램, 위치, 규모, 문화 같은 요소를 고려하세요. 한국 학생들에게는 한국 학생 커뮤니티, 국제 학생 지원, 문화를 공유할 기회도 생각해보세요. 각 학교의 가치관을 조사하고 여러분의 목표와 어떻게 일치하는지 확인하세요. 순위에만 집중하지 말고, 여러분이 번성할 수 있는 학교를 찾으세요.'
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateTyping = async () => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsTyping(false);
  };

  const handleSendMessage = async (text: string, koreanText?: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      koreanText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    // Simulate bot response
    await simulateTyping();

    let botResponse = {
      text: 'Thank you for your question! I\'m here to help you with your college application journey. Could you please provide more specific details about what you\'d like to know?',
      koreanText: '질문해주셔서 감사합니다! 대학 지원 여정에서 도움을 드리기 위해 여기 있습니다. 더 구체적인 세부사항을 알려주시면 도움을 드릴 수 있습니다.'
    };

    // Simple keyword matching for demo
    const lowerText = text.toLowerCase();
    if (lowerText.includes('topic') || lowerText.includes('주제')) {
      botResponse = botResponses.essay_topic;
    } else if (lowerText.includes('personal') || lowerText.includes('개인')) {
      botResponse = botResponses.personal_statement;
    } else if (lowerText.includes('culture') || lowerText.includes('문화')) {
      botResponse = botResponses.korean_culture;
    } else if (lowerText.includes('college') || lowerText.includes('대학')) {
      botResponse = botResponses.college_selection;
    }

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: botResponse.text,
      koreanText: botResponse.koreanText,
      sender: 'bot',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMessage]);
  };

  const handleQuickResponse = (response: QuickResponse) => {
    handleSendMessage(response.text, response.koreanText);
  };

  const handlePickSuggestion = (s: PromptSuggestion) => {
    handleSendMessage(s.prompt);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-colors z-50 flex items-center justify-center"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-lg shadow-xl border border-gray-200 z-50 flex flex-col">
          {/* Header */}
          <div className="bg-red-600 text-white p-4 rounded-t-lg">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3">
                <span className="text-red-600 font-bold text-sm">AI</span>
              </div>
              <div>
                <h3 className="font-semibold">
                  <KoreanText>가상 입학 멘토</KoreanText> / Virtual Mentor
                </h3>
                <p className="text-sm opacity-90">
                  <KoreanText>24/7 입학 상담</KoreanText> / 24/7 Admissions Guidance
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  {message.koreanText && (
                    <p className="text-xs mt-1 opacity-80">
                      <KoreanText>{message.koreanText}</KoreanText>
                    </p>
                  )}
                  <p className="text-xs opacity-60 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Prompt Suggestions (Apollo.io style chips) */}
          <div className="px-4 pb-2 border-t border-gray-200">
            <PromptSuggestions
              context={{ university }}
              onPick={handlePickSuggestion}
            />
          </div>

          {/* Quick Responses */}
          {messages.length === 1 && (
            <div className="p-4 border-t border-gray-200">
              <p className="text-xs text-gray-600 mb-2">
                <KoreanText>빠른 질문</KoreanText> / Quick Questions:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {quickResponses.map((response) => (
                  <button
                    key={response.id}
                    onClick={() => handleQuickResponse(response)}
                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors text-left"
                  >
                    <KoreanText>{response.koreanText}</KoreanText>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && inputText.trim()) {
                    handleSendMessage(inputText);
                  }
                }}
                placeholder="Ask your mentor..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
              />
              <button
                onClick={() => inputText.trim() && handleSendMessage(inputText)}
                disabled={!inputText.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MentorChatbot; 