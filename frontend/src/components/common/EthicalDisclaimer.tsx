import React from 'react';
import KoreanText from './KoreanText';

interface EthicalDisclaimerProps {
  variant?: 'banner' | 'sticky' | 'inline';
  className?: string;
}

const EthicalDisclaimer: React.FC<EthicalDisclaimerProps> = ({ 
  variant = 'banner',
  className = ''
}) => {
  const content = {
    title: 'Ethical AI Use',
    koreanTitle: '윤리적 AI 사용',
    message: 'Our AI enhances your voice, not replaces it. Always review and personalize all suggestions to maintain authenticity.',
    koreanMessage: '우리의 AI는 여러분의 목소리를 대체하지 않고 향상시킵니다. 진정성을 유지하기 위해 모든 제안사항을 검토하고 개인화하세요.',
    details: [
      'AI suggestions are tools for improvement, not final content',
      'Your personal voice and experiences are irreplaceable',
      'Always review and edit AI-generated content',
      'Be authentic to your own story and perspective'
    ],
    koreanDetails: [
      'AI 제안사항은 개선을 위한 도구이며, 최종 콘텐츠가 아닙니다',
      '여러분의 개인적 목소리와 경험은 대체할 수 없습니다',
      'AI가 생성한 콘텐츠는 항상 검토하고 편집하세요',
      '여러분만의 이야기와 관점에 진정성을 유지하세요'
    ]
  };

  if (variant === 'banner') {
    return (
      <div className={`bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-400 p-4 ${className}`}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-orange-800 mb-1">
              <KoreanText>{content.koreanTitle}</KoreanText> / {content.title}
            </h3>
            <p className="text-sm text-orange-700 mb-2">
              <KoreanText>{content.koreanMessage}</KoreanText>
            </p>
            <p className="text-sm text-orange-700">
              {content.message}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'sticky') {
    return (
      <div className={`fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-white border border-orange-200 rounded-lg shadow-lg p-4 z-40 ${className}`}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-orange-800 mb-1">
              <KoreanText>{content.koreanTitle}</KoreanText>
            </h3>
            <p className="text-xs text-orange-700">
              <KoreanText>{content.koreanMessage}</KoreanText>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // inline variant
  return (
    <div className={`bg-orange-50 border border-orange-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-orange-800 mb-2">
            <KoreanText>{content.koreanTitle}</KoreanText> / {content.title}
          </h3>
          <p className="text-sm text-orange-700 mb-3">
            <KoreanText>{content.koreanMessage}</KoreanText>
          </p>
          <p className="text-sm text-orange-700 mb-3">
            {content.message}
          </p>
          <div className="space-y-1">
            {content.details.map((detail, index) => (
              <div key={index} className="flex items-start text-xs text-orange-700">
                <span className="text-orange-400 mr-2 mt-0.5">•</span>
                <div>
                  <KoreanText>{content.koreanDetails[index]}</KoreanText>
                  <br />
                  <span className="text-orange-600">{detail}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EthicalDisclaimer; 