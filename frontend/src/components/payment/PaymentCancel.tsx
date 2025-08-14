import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const PaymentCancel: React.FC = () => {
  const { i18n } = useTranslation();
  const isKorean = i18n.language === 'ko';

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Cancel Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-6">
            <svg className="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>

          {/* Cancel Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {isKorean ? '결제가 취소되었습니다' : 'Payment Cancelled'}
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            {isKorean 
              ? '결제가 취소되었습니다. 언제든지 다시 시도하실 수 있습니다.'
              : 'Your payment was cancelled. You can try again anytime.'
            }
          </p>

          {/* Why Subscribe */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {isKorean ? '왜 AdmitAI Korea를 선택해야 할까요?' : 'Why Choose AdmitAI Korea?'}
            </h3>
            <div className="space-y-3 text-left">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-700 text-sm">
                  {isKorean 
                    ? '한국 학생들을 위한 맞춤형 AI 피드백'
                    : 'Customized AI feedback for Korean students'
                  }
                </span>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-700 text-sm">
                  {isKorean 
                    ? '대학별 맞춤 전략 및 정보'
                    : 'University-specific strategies and information'
                  }
                </span>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-700 text-sm">
                  {isKorean 
                    ? '30일 무료 환불 보장'
                    : '30-day money-back guarantee'
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link
              to="/pricing"
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 block"
            >
              {isKorean ? '다시 시도하기' : 'Try Again'}
            </Link>
            
            <Link
              to="/dashboard"
              className="w-full bg-gray-100 text-gray-900 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-200 block"
            >
              {isKorean ? '대시보드로 돌아가기' : 'Back to Dashboard'}
            </Link>

            <Link
              to="/essays"
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 block"
            >
              {isKorean ? '무료 기능 체험하기' : 'Try Free Features'}
            </Link>
          </div>

          {/* Support Contact */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-2">
              {isKorean ? '도움이 필요하신가요?' : 'Need help?'}
            </p>
            <a
              href="mailto:support@admitai.kr"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              support@admitai.kr
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel; 