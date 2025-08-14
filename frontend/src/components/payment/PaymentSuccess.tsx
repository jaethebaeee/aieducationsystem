import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, Link } from 'react-router-dom';

const PaymentSuccess: React.FC = () => {
  const { i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionData, setSubscriptionData] = useState<any>(null);

  const sessionId = searchParams.get('session_id');
  const isKorean = i18n.language === 'ko';

  useEffect(() => {
    if (sessionId) {
      // In a real implementation, you might want to verify the session with your backend
      // For now, we'll simulate a successful payment
      setTimeout(() => {
        setSubscriptionData({
          plan: 'Premium',
          status: 'active',
          nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
        });
        setIsLoading(false);
      }, 2000);
    }
  }, [sessionId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            {isKorean ? '결제 처리 중...' : 'Processing Payment...'}
          </h2>
          <p className="text-gray-600">
            {isKorean ? '잠시만 기다려 주세요.' : 'Please wait a moment.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {isKorean ? '결제 성공!' : 'Payment Successful!'}
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            {isKorean 
              ? 'AdmitAI Korea 구독이 성공적으로 활성화되었습니다.'
              : 'Your AdmitAI Korea subscription has been successfully activated.'
            }
          </p>

          {/* Subscription Details */}
          {subscriptionData && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {isKorean ? '구독 정보' : 'Subscription Details'}
              </h3>
              <div className="space-y-3 text-left">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {isKorean ? '플랜:' : 'Plan:'}
                  </span>
                  <span className="font-semibold text-gray-900">
                    {subscriptionData.plan}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {isKorean ? '상태:' : 'Status:'}
                  </span>
                  <span className="font-semibold text-green-600">
                    {isKorean ? '활성' : 'Active'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {isKorean ? '다음 결제일:' : 'Next Billing:'}
                  </span>
                  <span className="font-semibold text-gray-900">
                    {subscriptionData.nextBillingDate}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {isKorean ? '다음 단계' : 'Next Steps'}
            </h3>
            <div className="space-y-3 text-left">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-blue-600 text-sm font-semibold">1</span>
                </div>
                <span className="text-gray-700">
                  {isKorean 
                    ? '프로필을 완성하여 맞춤형 AI 피드백을 받으세요'
                    : 'Complete your profile to receive personalized AI feedback'
                  }
                </span>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-blue-600 text-sm font-semibold">2</span>
                </div>
                <span className="text-gray-700">
                  {isKorean 
                    ? '첫 번째 에세이를 작성하고 AI 피드백을 받아보세요'
                    : 'Write your first essay and receive AI feedback'
                  }
                </span>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-blue-600 text-sm font-semibold">3</span>
                </div>
                <span className="text-gray-700">
                  {isKorean 
                    ? '커뮤니티에 참여하여 다른 학생들과 경험을 공유하세요'
                    : 'Join the community to share experiences with other students'
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link
              to="/dashboard"
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 block"
            >
              {isKorean ? '대시보드로 이동' : 'Go to Dashboard'}
            </Link>
            
            <Link
              to="/essays/new"
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 block"
            >
              {isKorean ? '첫 번째 에세이 작성' : 'Write First Essay'}
            </Link>

            <Link
              to="/profile"
              className="w-full bg-gray-100 text-gray-900 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-200 block"
            >
              {isKorean ? '프로필 완성하기' : 'Complete Profile'}
            </Link>
          </div>

          {/* Support Contact */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-2">
              {isKorean ? '질문이 있으신가요?' : 'Have questions?'}
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

export default PaymentSuccess; 