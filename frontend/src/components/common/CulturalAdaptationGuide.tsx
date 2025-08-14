import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  LightBulbIcon, 
  GlobeAltIcon, 
  AcademicCapIcon, 
  UserGroupIcon,
  BookOpenIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

interface CulturalTip {
  id: string;
  title: string;
  description: string;
  examples: string[];
  category: 'storytelling' | 'context' | 'language' | 'values';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const CulturalAdaptationGuide: React.FC = () => {
  const { t } = useLanguage();
  const [expandedTip, setExpandedTip] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const culturalTips: CulturalTip[] = [
    {
      id: '1',
      title: t('culturalGuide.tips.storytelling.title'),
      description: t('culturalGuide.tips.storytelling.description'),
      examples: [
        t('culturalGuide.tips.storytelling.example1'),
        t('culturalGuide.tips.storytelling.example2'),
        t('culturalGuide.tips.storytelling.example3')
      ],
      category: 'storytelling',
      difficulty: 'beginner'
    },
    {
      id: '2',
      title: t('culturalGuide.tips.context.title'),
      description: t('culturalGuide.tips.context.description'),
      examples: [
        t('culturalGuide.tips.context.example1'),
        t('culturalGuide.tips.context.example2'),
        t('culturalGuide.tips.context.example3')
      ],
      category: 'context',
      difficulty: 'intermediate'
    },
    {
      id: '3',
      title: t('culturalGuide.tips.language.title'),
      description: t('culturalGuide.tips.language.description'),
      examples: [
        t('culturalGuide.tips.language.example1'),
        t('culturalGuide.tips.language.example2'),
        t('culturalGuide.tips.language.example3')
      ],
      category: 'language',
      difficulty: 'advanced'
    },
    {
      id: '4',
      title: t('culturalGuide.tips.values.title'),
      description: t('culturalGuide.tips.values.description'),
      examples: [
        t('culturalGuide.tips.values.example1'),
        t('culturalGuide.tips.values.example2'),
        t('culturalGuide.tips.values.example3')
      ],
      category: 'values',
      difficulty: 'intermediate'
    }
  ];

  const categories = [
    { id: 'all', name: t('culturalGuide.categories.all'), icon: BookOpenIcon },
    { id: 'storytelling', name: t('culturalGuide.categories.storytelling'), icon: LightBulbIcon },
    { id: 'context', name: t('culturalGuide.categories.context'), icon: GlobeAltIcon },
    { id: 'language', name: t('culturalGuide.categories.language'), icon: AcademicCapIcon },
    { id: 'values', name: t('culturalGuide.categories.values'), icon: UserGroupIcon }
  ];

  const filteredTips = selectedCategory === 'all' 
    ? culturalTips 
    : culturalTips.filter(tip => tip.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'storytelling': return LightBulbIcon;
      case 'context': return GlobeAltIcon;
      case 'language': return AcademicCapIcon;
      case 'values': return UserGroupIcon;
      default: return BookOpenIcon;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 text-korean">
          {t('culturalGuide.title')}
        </h1>
        <p className="text-lg text-gray-600 text-korean max-w-2xl mx-auto">
          {t('culturalGuide.subtitle')}
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-korean">{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tips Grid */}
      <div className="space-y-4">
        {filteredTips.map((tip) => {
          const CategoryIcon = getCategoryIcon(tip.category);
          const isExpanded = expandedTip === tip.id;
          
          return (
            <div key={tip.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CategoryIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 text-korean">
                          {tip.title}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(tip.difficulty)}`}>
                          {t(`culturalGuide.difficulty.${tip.difficulty}`)}
                        </span>
                      </div>
                      <p className="text-gray-600 text-korean mb-4">
                        {tip.description}
                      </p>
                      
                      {/* Examples */}
                      {isExpanded && (
                        <div className="mt-4 space-y-3">
                          <h4 className="font-medium text-gray-900 text-korean">
                            {t('culturalGuide.examples')}:
                          </h4>
                          <div className="space-y-2">
                            {tip.examples.map((example, index) => (
                              <div key={index} className="flex items-start space-x-2">
                                <CheckCircleIcon className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-gray-700 text-korean">{example}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setExpandedTip(isExpanded ? null : tip.id)}
                    className="ml-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label={isExpanded ? 'Collapse' : 'Expand'}
                  >
                    {isExpanded ? (
                      <ChevronDownIcon className="w-5 h-5" />
                    ) : (
                      <ChevronRightIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-12 bg-blue-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-korean">
          {t('culturalGuide.quickActions.title')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <BookOpenIcon className="w-6 h-6 text-blue-600" />
            <span className="text-sm font-medium text-gray-900 text-korean">
              {t('culturalGuide.quickActions.workshop')}
            </span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <AcademicCapIcon className="w-6 h-6 text-blue-600" />
            <span className="text-sm font-medium text-gray-900 text-korean">
              {t('culturalGuide.quickActions.mentor')}
            </span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <UserGroupIcon className="w-6 h-6 text-blue-600" />
            <span className="text-sm font-medium text-gray-900 text-korean">
              {t('culturalGuide.quickActions.community')}
            </span>
          </button>
        </div>
      </div>

      {/* Progress Tracking */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-korean">
          {t('culturalGuide.progress.title')}
        </h3>
        <div className="space-y-4">
          {categories.slice(1).map((category) => {
            const progress = Math.floor(Math.random() * 100); // Mock progress
            return (
              <div key={category.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <category.icon className="w-5 h-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-900 text-korean">
                    {category.name}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">{progress}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CulturalAdaptationGuide; 