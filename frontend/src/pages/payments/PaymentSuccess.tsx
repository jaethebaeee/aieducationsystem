import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { api } from '../../services/api';
import './PaymentSuccess.css';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  priceKRW: number;
  features: string[];
  description: string;
}

interface LocationState {
  plan: SubscriptionPlan;
  subscriptionId: string;
}

const PaymentSuccess: React.FC = () => {
  const { language } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const state = location.state as LocationState;

  const t: Record<string, any> = {
    ko: {
      title: '구독 완료!',
      subtitle: 'AdmitAI Korea에 오신 것을 환영합니다',
      thankYou: '감사합니다!',
      subscriptionActive: '구독이 활성화되었습니다.',
      planName: '플랜',
      subscriptionId: '구독 ID',
      nextSteps: '다음 단계',
      startWriting: '에세이 작성 시작하기',
      exploreFeatures: '기능 둘러보기',
      dashboard: '대시보드로 이동',
      support: '지원팀에 문의',
      features: '주요 기능',
      unlimitedEssays: '무제한 에세이 분석',
      aiFeedback: 'AI 피드백',
      mentorAccess: '멘토 접근',
      prioritySupport: '우선 지원',
      customAnalysis: '맞춤형 분석',
      dedicatedMentor: '전담 멘토',
      whiteLabel: '화이트 라벨 옵션',
      communityAccess: '커뮤니티 접근',
      advancedAI: '고급 AI 분석',
      loading: '구독 정보를 불러오는 중...',
      error: '구독 정보를 불러오는 중 오류가 발생했습니다.',
      welcomeEmail: '환영 이메일을 발송했습니다.',
      checkInbox: '이메일을 확인해주세요.',
    },
    en: {
      title: 'Subscription Complete!',
      subtitle: 'Welcome to AdmitAI Korea',
      thankYou: 'Thank you!',
      subscriptionActive: 'Your subscription is now active.',
      planName: 'Plan',
      subscriptionId: 'Subscription ID',
      nextSteps: 'Next Steps',
      startWriting: 'Start Writing Essays',
      exploreFeatures: 'Explore Features',
      dashboard: 'Go to Dashboard',
      support: 'Contact Support',
      features: 'Key Features',
      unlimitedEssays: 'Unlimited Essay Analysis',
      aiFeedback: 'AI Feedback',
      mentorAccess: 'Mentor Access',
      prioritySupport: 'Priority Support',
      customAnalysis: 'Custom Analysis',
      dedicatedMentor: 'Dedicated Mentor',
      whiteLabel: 'White-label Options',
      communityAccess: 'Community Access',
      advancedAI: 'Advanced AI Analysis',
      loading: 'Loading subscription details...',
      error: 'Error loading subscription details.',
      welcomeEmail: 'Welcome email sent!',
      checkInbox: 'Please check your inbox.',
    },
  };

  useEffect(() => {
    if (state?.subscriptionId) {
      fetchSubscriptionDetails();
    } else {
      setLoading(false);
    }
  }, [state]);

  const fetchSubscriptionDetails = async () => {
    try {
      const response = await api.get('/payments/subscription');
      const data = response.data as any;
      if (data.success) {
        // setSubscription(data.data); // This line was removed as per the edit hint
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartWriting = () => {
    navigate('/essays/new');
  };

  const handleExploreFeatures = () => {
    navigate('/dashboard');
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  const handleContactSupport = () => {
    // Open support chat or email
    window.open('mailto:support@admitai.korea', '_blank');
  };

  if (loading) {
    return (
      <div className="payment-success-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>{t[language].loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-success-page">
      <div className="success-container">
        <div className="success-header">
          <div className="success-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22,4 12,14.01 9,11.01"></polyline>
            </svg>
          </div>
          <h1>{t[language].title}</h1>
          <p className="subtitle">{t[language].subtitle}</p>
          <p className="thank-you">{t[language].thankYou}</p>
        </div>

        <div className="subscription-details">
          <div className="detail-card">
            <h3>{t[language].subscriptionActive}</h3>
            
            {state?.plan && (
              <div className="plan-info">
                <div className="plan-item">
                  <span className="label">{t[language].planName}:</span>
                  <span className="value">{state.plan.name}</span>
                </div>
                {state.subscriptionId && (
                  <div className="plan-item">
                    <span className="label">{t[language].subscriptionId}:</span>
                    <span className="value">{state.subscriptionId}</span>
                  </div>
                )}
              </div>
            )}

            {state?.plan && (
              <div className="plan-features">
                <h4>{t[language].features}</h4>
                <ul>
                  {state.plan.features.map((feature: string, index: number) => (
                    <li key={index}>
                      <span className="checkmark">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="next-steps">
          <h3>{t[language].nextSteps}</h3>
          <div className="action-buttons">
            <button className="btn-primary" onClick={handleStartWriting}>
              {t[language].startWriting}
            </button>
            <button className="btn-secondary" onClick={handleExploreFeatures}>
              {t[language].exploreFeatures}
            </button>
            <button className="btn-outline" onClick={handleGoToDashboard}>
              {t[language].dashboard}
            </button>
          </div>
        </div>

        <div className="welcome-message">
          <div className="email-notification">
            <div className="email-icon">📧</div>
            <div className="email-content">
              <p>{t[language].welcomeEmail}</p>
              <p>{t[language].checkInbox}</p>
            </div>
          </div>
        </div>

        <div className="support-section">
          <p>질문이 있으신가요?</p>
          <button className="btn-support" onClick={handleContactSupport}>
            {t[language].support}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess; 