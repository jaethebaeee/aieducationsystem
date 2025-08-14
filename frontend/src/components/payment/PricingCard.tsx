import React from 'react';
import { useTranslation } from 'react-i18next';

interface PricingCardProps {
  plan: {
    id: string;
    name: string;
    nameKo: string;
    price: number;
    priceKo: string;
    features: string[];
    featuresKo: string[];
    popular?: boolean;
    stripePriceId: string;
  };
  onSelectPlan: (planId: string) => void;
  isLoading?: boolean;
  currentPlan?: string;
}

const PricingCard: React.FC<PricingCardProps> = ({
  plan,
  onSelectPlan,
  isLoading = false,
  currentPlan,
}) => {
  const { i18n } = useTranslation();
  const isKorean = i18n.language === 'ko';

  const isCurrentPlan = currentPlan === plan.id;
  const isPopular = plan.popular;

  return (
    <div className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
      isPopular ? 'border-blue-500 scale-105' : 'border-gray-200 hover:border-blue-300'
    } ${isCurrentPlan ? 'ring-2 ring-green-500' : ''}`}>
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
            {isKorean ? '인기' : 'Most Popular'}
          </span>
        </div>
      )}
      
      {isCurrentPlan && (
        <div className="absolute -top-4 right-4">
          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {isKorean ? '현재 플랜' : 'Current Plan'}
          </span>
        </div>
      )}

      <div className="p-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {isKorean ? plan.nameKo : plan.name}
          </h3>
          <div className="mb-4">
            <span className="text-4xl font-bold text-gray-900">
              ${plan.price}
            </span>
            <span className="text-gray-600 ml-2">
              {isKorean ? '/월' : '/month'}
            </span>
          </div>
          {isKorean && (
            <p className="text-sm text-gray-500 mb-4">
              {plan.priceKo}
            </p>
          )}
        </div>

        <ul className="space-y-4 mb-8">
          {(isKorean ? plan.featuresKo : plan.features).map((feature, index) => (
            <li key={index} className="flex items-start">
              <svg
                className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={() => onSelectPlan(plan.id)}
          disabled={isLoading || isCurrentPlan}
          className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
            isCurrentPlan
              ? 'bg-green-100 text-green-700 cursor-not-allowed'
              : isPopular
              ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-200'
              : 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-4 focus:ring-gray-200'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-2"></div>
              {isKorean ? '처리 중...' : 'Processing...'}
            </div>
          ) : isCurrentPlan ? (
            isKorean ? '현재 플랜' : 'Current Plan'
          ) : (
            isKorean ? '플랜 선택' : 'Choose Plan'
          )}
        </button>
      </div>
    </div>
  );
};

export default PricingCard; 