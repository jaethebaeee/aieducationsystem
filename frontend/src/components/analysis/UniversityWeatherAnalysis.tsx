import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  ChartBarIcon,
  GlobeAltIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  LightBulbIcon,
  AcademicCapIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import AccessibleButton from '../common/AccessibleButton';

interface UniversityWeatherData {
  universityName: string;
  currentYear: number;
  acceptanceRate: number;
  acceptanceRateChange: number;
  koreanStudentAcceptanceRate: number;
  internationalStudentAcceptanceRate: number;
  totalApplications: number;
  keyTrends: string[];
  newInitiatives: string[];
  culturalPreferences: {
    aspect: string;
    weight: number;
    description: string;
    koreanAlignment: string;
  }[];
  programPriorities: {
    program: string;
    priority: 'high' | 'medium' | 'low';
    enrollmentTarget: number;
    currentEnrollment: number;
    focusAreas: string[];
  }[];
  marketOpportunities: {
    trend: string;
    opportunity: string;
    howToLeverage: string;
  }[];
  riskFactors: {
    factor: string;
    risk: 'high' | 'medium' | 'low';
    mitigation: string;
  }[];
  strategicRecommendations: {
    category: string;
    priority: 'high' | 'medium' | 'low';
    recommendation: string;
    reasoning: string;
  }[];
}

interface Props {
  universityName: string;
  essayContent?: string;
  onRecommendationClick?: (recommendation: any) => void;
}

const UniversityWeatherAnalysis: React.FC<Props> = ({
  universityName,
  essayContent,
  onRecommendationClick
}) => {
  const { t } = useLanguage();
  const [weatherData, setWeatherData] = useState<UniversityWeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'opportunities' | 'risks' | 'recommendations'>('overview');

  // Mock data - replace with actual API call
  useEffect(() => {
    const loadWeatherData = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData: UniversityWeatherData = {
        universityName: universityName,
        currentYear: 2024,
        acceptanceRate: 3.2,
        acceptanceRateChange: -0.3,
        koreanStudentAcceptanceRate: 3.1,
        internationalStudentAcceptanceRate: 2.8,
        totalApplications: 57000,
        keyTrends: [
          'Increased focus on global leadership',
          'Emphasis on interdisciplinary studies',
          'Greater attention to socioeconomic diversity',
          'Climate change research priority'
        ],
        newInitiatives: [
          'AI and ethics program expansion',
          'Global health initiatives',
          'Sustainability research center',
          'Cross-cultural leadership program'
        ],
        culturalPreferences: [
          {
            aspect: 'leadership',
            weight: 9,
            description: 'Demonstrates exceptional leadership potential',
            koreanAlignment: 'Emphasize collective leadership and community harmony'
          },
          {
            aspect: 'global_perspective',
            weight: 8,
            description: 'Strong international outlook and cross-cultural understanding',
            koreanAlignment: 'Highlight Korean cultural background as unique global perspective'
          },
          {
            aspect: 'innovation',
            weight: 7,
            description: 'Creative problem-solving and innovative thinking',
            koreanAlignment: 'Combine Korean cultural values with innovative approaches'
          }
        ],
        programPriorities: [
          {
            program: 'Computer Science',
            priority: 'high',
            enrollmentTarget: 200,
            currentEnrollment: 180,
            focusAreas: ['AI/ML', 'Ethics in Technology', 'Social Impact']
          },
          {
            program: 'Environmental Science',
            priority: 'high',
            enrollmentTarget: 150,
            currentEnrollment: 120,
            focusAreas: ['Climate Change', 'Sustainability', 'Policy']
          }
        ],
        marketOpportunities: [
          {
            trend: 'Korean students have higher acceptance rate',
            opportunity: 'University values Korean cultural background',
            howToLeverage: 'Emphasize authentic Korean cultural experiences'
          },
          {
            trend: 'New AI ethics program',
            opportunity: 'High priority program with enrollment targets',
            howToLeverage: 'Align essay with AI ethics and social impact themes'
          }
        ],
        riskFactors: [
          {
            factor: 'Decreasing overall acceptance rate',
            risk: 'high',
            mitigation: 'Focus on exceptional fit and unique value proposition'
          },
          {
            factor: 'Increased competition in STEM programs',
            risk: 'medium',
            mitigation: 'Highlight interdisciplinary approach and cultural perspective'
          }
        ],
        strategicRecommendations: [
          {
            category: 'content',
            priority: 'high',
            recommendation: 'Emphasize leadership and global perspective themes',
            reasoning: 'University heavily weights these aspects (9/10 and 8/10 respectively)'
          },
          {
            category: 'cultural',
            priority: 'high',
            recommendation: 'Highlight Korean cultural background authentically',
            reasoning: 'Korean students have 3.1% acceptance rate vs 2.8% international average'
          },
          {
            category: 'timing',
            priority: 'medium',
            recommendation: 'Apply early decision to AI ethics program',
            reasoning: 'High priority program with enrollment targets not yet met'
          }
        ]
      };
      
      setWeatherData(mockData);
      setLoading(false);
    };

    loadWeatherData();
  }, [universityName]);

  const getAcceptanceRateColor = (rate: number) => {
    if (rate < 5) return 'text-red-600';
    if (rate < 10) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getTrendIcon = (change: number) => {
    if (change > 0) return <ArrowTrendingUpIcon className="w-4 h-4 text-green-600" />;
    if (change < 0) return <ArrowTrendingDownIcon className="w-4 h-4 text-red-600" />;
    return <ChartBarIcon className="w-4 h-4 text-gray-600" />;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2 text-korean">
            {t('universityWeather.noData')}
          </h3>
          <p className="text-gray-600 text-korean">
            {t('universityWeather.noDataDescription')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 text-korean">
              Admissions outlook: {weatherData.universityName}
            </h2>
            <p className="text-gray-600 text-korean mt-1">
              University-specific signals for this cycle
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <GlobeAltIcon className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-500 text-korean">
              {t('universityWeather.lastUpdated')}: {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {[
            { id: 'overview', label: t('universityWeather.tabs.overview'), icon: ChartBarIcon },
            { id: 'trends', label: t('universityWeather.tabs.trends'), icon: ArrowTrendingUpIcon },
            { id: 'opportunities', label: t('universityWeather.tabs.opportunities'), icon: LightBulbIcon },
            { id: 'risks', label: t('universityWeather.tabs.risks'), icon: ExclamationTriangleIcon },
            { id: 'recommendations', label: t('universityWeather.tabs.recommendations'), icon: CheckCircleIcon }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-korean">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600 text-korean">
                      {t('universityWeather.metrics.overallAcceptance')}
                    </p>
                    <p className={`text-2xl font-bold ${getAcceptanceRateColor(weatherData.acceptanceRate)}`}>
                      {weatherData.acceptanceRate}%
                    </p>
                  </div>
                  {getTrendIcon(weatherData.acceptanceRateChange)}
                </div>
                <p className="text-xs text-blue-600 text-korean mt-1">
                  {weatherData.acceptanceRateChange > 0 ? '+' : ''}{weatherData.acceptanceRateChange}% {t('universityWeather.fromLastYear')}
                </p>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600 text-korean">
                      {t('universityWeather.metrics.koreanAcceptance')}
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {weatherData.koreanStudentAcceptanceRate}%
                    </p>
                  </div>
                  <UserGroupIcon className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-xs text-green-600 text-korean mt-1">
                  {t('universityWeather.koreanAdvantage')}
                </p>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600 text-korean">
                      {t('universityWeather.metrics.totalApplications')}
                    </p>
                    <p className="text-2xl font-bold text-purple-600">
                      {weatherData.totalApplications.toLocaleString()}
                    </p>
                  </div>
                  <AcademicCapIcon className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-xs text-purple-600 text-korean mt-1">
                  {t('universityWeather.competitive')}
                </p>
              </div>
            </div>

            {/* Cultural Preferences */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-korean">
                {t('universityWeather.culturalPreferences.title')}
              </h3>
              <div className="space-y-3">
                {weatherData.culturalPreferences.map((preference, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 text-korean">
                        {preference.aspect}
                      </h4>
                      <span className="text-sm text-gray-500 text-korean">
                        {t('universityWeather.weight')}: {preference.weight}/10
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 text-korean mb-2">
                      {preference.description}
                    </p>
                    <div className="bg-blue-50 rounded p-3">
                      <p className="text-sm text-blue-800 text-korean">
                        <strong>{t('universityWeather.koreanAlignment')}:</strong> {preference.koreanAlignment}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Program Priorities */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-korean">
                {t('universityWeather.programPriorities.title')}
              </h3>
              <div className="space-y-3">
                {weatherData.programPriorities.map((program, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 text-korean">
                        {program.program}
                      </h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(program.priority)}`}>
                        {t(`universityWeather.priority.${program.priority}`)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 text-korean">{t('universityWeather.enrollmentTarget')}: {program.enrollmentTarget}</p>
                        <p className="text-gray-600 text-korean">{t('universityWeather.currentEnrollment')}: {program.currentEnrollment}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-korean">{t('universityWeather.focusAreas')}:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {program.focusAreas.map((area, idx) => (
                            <span key={idx} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700 text-korean">
                              {area}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-korean">
                {t('universityWeather.trends.keyTrends')}
              </h3>
              <div className="space-y-3">
                {weatherData.keyTrends.map((trend, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                    <ArrowTrendingUpIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-blue-800 text-korean">{trend}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-korean">
                {t('universityWeather.trends.newInitiatives')}
              </h3>
              <div className="space-y-3">
                {weatherData.newInitiatives.map((initiative, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                    <LightBulbIcon className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-green-800 text-korean">{initiative}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'opportunities' && (
          <div className="space-y-4">
            {weatherData.marketOpportunities.map((opportunity, index) => (
              <div key={index} className="border border-green-200 rounded-lg p-4 bg-green-50">
                <div className="flex items-start space-x-3">
                  <LightBulbIcon className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-medium text-green-900 text-korean mb-2">
                      {opportunity.trend}
                    </h4>
                    <p className="text-sm text-green-800 text-korean mb-2">
                      {opportunity.opportunity}
                    </p>
                    <div className="bg-white rounded p-3">
                      <p className="text-sm text-green-700 text-korean">
                        <strong>{t('universityWeather.howToLeverage')}:</strong> {opportunity.howToLeverage}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'risks' && (
          <div className="space-y-4">
            {weatherData.riskFactors.map((risk, index) => (
              <div key={index} className="border border-red-200 rounded-lg p-4 bg-red-50">
                <div className="flex items-start space-x-3">
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-red-900 text-korean">
                        {risk.factor}
                      </h4>
                      <span className={`text-sm font-medium ${getRiskColor(risk.risk)}`}>
                        {t(`universityWeather.risk.${risk.risk}`)}
                      </span>
                    </div>
                    <div className="bg-white rounded p-3">
                      <p className="text-sm text-red-700 text-korean">
                        <strong>{t('universityWeather.mitigation')}:</strong> {risk.mitigation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div className="space-y-4">
            {weatherData.strategicRecommendations.map((recommendation, index) => (
              <div key={index} className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-blue-900 text-korean">
                        {recommendation.recommendation}
                      </h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(recommendation.priority)}`}>
                        {t(`universityWeather.priority.${recommendation.priority}`)}
                      </span>
                    </div>
                    <p className="text-sm text-blue-800 text-korean mb-2">
                      {recommendation.reasoning}
                    </p>
                    <div className="flex justify-end">
                      <AccessibleButton
                        variant="outline"
                        size="sm"
                        onClick={() => onRecommendationClick?.(recommendation)}
                      >
                        {t('universityWeather.applyRecommendation')}
                      </AccessibleButton>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UniversityWeatherAnalysis; 