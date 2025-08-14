import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import './PaymentCancel.css';

const PaymentCancel: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const t: Record<string, any> = {
    ko: {
      title: '결제가 취소되었습니다',
      subtitle: '걱정하지 마세요. 언제든지 다시 시도할 수 있습니다.',
      message: '결제 과정이 취소되었습니다. 다른 방법으로 구독하거나 나중에 다시 시도해보세요.',
      tryAgain: '다시 시도하기',
      backToPricing: '가격 보기',
      contactSupport: '지원팀에 문의',
      supportMessage: '결제에 문제가 있으시면 언제든지 연락주세요.',
    },
    en: {
      title: 'Payment Cancelled',
      subtitle: 'Don\'t worry, you can try again anytime.',
      message: 'Your payment process was cancelled. You can subscribe using a different method or try again later.',
      tryAgain: 'Try Again',
      backToPricing: 'View Pricing',
      contactSupport: 'Contact Support',
      supportMessage: 'If you\'re having trouble with payment, please contact us anytime.',
    },
  };

  const handleTryAgain = () => {
    navigate('/payments/pricing');
  };

  const handleBackToPricing = () => {
    navigate('/payments/pricing');
  };

  const handleContactSupport = () => {
    window.open('mailto:support@admitai.korea', '_blank');
  };

  return (
    <div className="payment-cancel-page">
      <div className="cancel-container">
        <div className="cancel-header">
          <div className="cancel-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>
          <h1>{t[language].title}</h1>
          <p className="subtitle">{t[language].subtitle}</p>
        </div>

        <div className="cancel-message">
          <p>{t[language].message}</p>
        </div>

        <div className="cancel-actions">
          <button className="btn-primary" onClick={handleTryAgain}>
            {t[language].tryAgain}
          </button>
          <button className="btn-secondary" onClick={handleBackToPricing}>
            {t[language].backToPricing}
          </button>
        </div>

        <div className="support-section">
          <p>{t[language].supportMessage}</p>
          <button className="btn-support" onClick={handleContactSupport}>
            {t[language].contactSupport}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel; 