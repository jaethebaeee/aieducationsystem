import React, { useState } from 'react';
import SEOHead from '../components/seo/SEOHead';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import KoreanText from '../components/common/KoreanText';
import { 
  UserIcon,
  AcademicCapIcon,
  GlobeAltIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const ContactPage: React.FC = () => {
  const navigate = useNavigate();
  const { language, toggleLanguage } = useLanguage();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'STUDENT',
    school: '',
    grade: '',
    targetUniversities: '',
    message: '',
    howDidYouHear: '',
    agreeToContact: false,
    agreeToTerms: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Submit contact form to API
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit contact form');
      }

      // Store contact info in localStorage for later use
      localStorage.setItem('contactInfo', JSON.stringify(formData));
      
      // Show success message
      alert(language === 'ko' ? '문의가 성공적으로 제출되었습니다!' : 'Contact form submitted successfully!');
      
      // Redirect to registration
      navigate('/register', { 
        state: { 
          fromContact: true,
          contactData: formData 
        } 
      });
    } catch (err) {
      setError(language === 'ko' ? '문의 제출에 실패했습니다. 다시 시도해주세요.' : 'Failed to submit contact form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <SEOHead
        title="문의하기 | AdmitAI Korea"
        description="AdmitAI Korea에 문의하고 데모/상담을 요청하세요. 한국 학생을 위한 미국 대학 입학 AI 플랫폼."
        canonical="https://admitai.kr/contact"
        ogImage="/og-image.jpg"
        language="ko"
      />
      {/* Header */}
      <header className="relative z-10">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">
                <KoreanText>AdmitAI Korea</KoreanText>
              </span>
            </div>
            
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <GlobeAltIcon className="w-4 h-4" />
              <span>{language === 'ko' ? 'English' : '한국어'}</span>
            </button>
          </div>
        </nav>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            <KoreanText>AdmitAI Korea와 함께 시작하세요</KoreanText>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            <KoreanText>
              개인화된 AI 입학 준비를 시작하기 전에, 귀하의 목표와 상황을 파악하여 
              최적의 서비스를 제공할 수 있도록 도와주세요.
            </KoreanText>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="rounded-xl bg-red-50 border border-red-200 p-4">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <UserIcon className="w-5 h-5 mr-2" />
                  <KoreanText>기본 정보</KoreanText>
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <KoreanText>이름</KoreanText>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.firstName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <KoreanText>성</KoreanText>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.lastName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <KoreanText>이메일</KoreanText>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <KoreanText>전화번호 (선택사항)</KoreanText>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Academic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <AcademicCapIcon className="w-5 h-5 mr-2" />
                  <KoreanText>학업 정보</KoreanText>
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <KoreanText>역할</KoreanText>
                  </label>
                  <select
                    name="role"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.role}
                    onChange={handleInputChange}
                  >
                    <option value="STUDENT">학생</option>
                    <option value="PARENT">학부모</option>
                    <option value="MENTOR">멘토/상담사</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <KoreanText>현재 학교</KoreanText>
                    </label>
                    <input
                      type="text"
                      name="school"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.school}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <KoreanText>학년</KoreanText>
                    </label>
                    <input
                      type="text"
                      name="grade"
                      placeholder="예: 12학년, 고3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.grade}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <KoreanText>목표 대학 (선택사항)</KoreanText>
                  </label>
                  <textarea
                    name="targetUniversities"
                    rows={3}
                    placeholder="예: Harvard, Stanford, MIT, Yale..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.targetUniversities}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  <KoreanText>추가 정보</KoreanText>
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <KoreanText>어떻게 알게 되셨나요?</KoreanText>
                  </label>
                  <select
                    name="howDidYouHear"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.howDidYouHear}
                    onChange={handleInputChange}
                  >
                    <option value="">선택해주세요</option>
                    <option value="search">검색 엔진</option>
                    <option value="social">소셜 미디어</option>
                    <option value="friend">친구/가족 추천</option>
                    <option value="school">학교/학원</option>
                    <option value="advertisement">광고</option>
                    <option value="other">기타</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <KoreanText>메시지 (선택사항)</KoreanText>
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    placeholder="특별한 요구사항이나 질문이 있으시면 알려주세요..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.message}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Agreements */}
              <div className="space-y-4">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    name="agreeToContact"
                    required
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                    checked={formData.agreeToContact}
                    onChange={handleInputChange}
                  />
                  <label className="ml-3 text-sm text-gray-700">
                    <KoreanText>
                      AdmitAI Korea가 이메일과 전화번호로 연락할 수 있도록 동의합니다.
                    </KoreanText>
                  </label>
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    required
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                  />
                  <label className="ml-3 text-sm text-gray-700">
                    <KoreanText>
                      <a href="/terms" className="text-blue-600 hover:text-blue-500">이용약관</a>과{' '}
                      <a href="/privacy" className="text-blue-600 hover:text-blue-500">개인정보처리방침</a>에 동의합니다.
                    </KoreanText>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span><KoreanText>제출 중...</KoreanText></span>
                  </>
                ) : (
                  <>
                    <span><KoreanText>다음 단계로 진행</KoreanText></span>
                    <ArrowRightIcon className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Information Panel */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                <KoreanText>왜 연락 정보가 필요한가요?</KoreanText>
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-semibold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      <KoreanText>개인화된 서비스</KoreanText>
                    </h4>
                    <p className="text-gray-600 text-sm">
                      <KoreanText>
                        귀하의 목표와 상황에 맞는 맞춤형 AI 분석과 가이드를 제공합니다.
                      </KoreanText>
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 font-semibold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      <KoreanText>전문 상담</KoreanText>
                    </h4>
                    <p className="text-gray-600 text-sm">
                      <KoreanText>
                        입학 전문가와의 무료 상담을 통해 전략을 수립할 수 있습니다.
                      </KoreanText>
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 font-semibold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      <KoreanText>진행 상황 추적</KoreanText>
                    </h4>
                    <p className="text-gray-600 text-sm">
                      <KoreanText>
                        정기적인 업데이트와 진행 상황을 이메일로 받아보실 수 있습니다.
                      </KoreanText>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
              <h3 className="text-xl font-bold mb-4">
                <KoreanText>무료 체험 혜택</KoreanText>
              </h3>
              <ul className="space-y-3 text-blue-100">
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <KoreanText>14일 무료 체험</KoreanText>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <KoreanText>신용카드 불필요</KoreanText>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <KoreanText>언제든지 취소 가능</KoreanText>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage; 