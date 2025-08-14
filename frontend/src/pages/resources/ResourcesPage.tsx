import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  MagnifyingGlassIcon,
  BookOpenIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  UserGroupIcon,
  StarIcon,
  ArrowDownTrayIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

interface Resource {
  id: string;
  title: string;
  titleKo: string;
  description: string;
  descriptionKo: string;
  category: 'essay' | 'application' | 'cultural' | 'test-prep' | 'video' | 'community';
  type: 'pdf' | 'video' | 'article' | 'template' | 'guide';
  url: string;
  thumbnail?: string;
  downloads: number;
  rating: number;
  tags: string[];
  tagsKo: string[];
  featured: boolean;
  createdAt: string;
  duration?: string; // for videos
  pages?: number; // for PDFs
}

const ResourcesPage: React.FC = () => {
  const { language } = useLanguage();
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'rating'>('newest');
  const [loading, setLoading] = useState(true);

  // Mock data - replace with API call
  useEffect(() => {
    const mockResources: Resource[] = [
      {
        id: '1',
        title: 'Personal Statement Writing Guide',
        titleKo: '개인 성명서 작성 가이드',
        description: 'Complete guide to writing compelling personal statements for US universities',
        descriptionKo: '미국 대학 지원을 위한 매력적인 개인 성명서 작성 완전 가이드',
        category: 'essay',
        type: 'guide',
        url: '/resources/personal-statement-guide.pdf',
        downloads: 1247,
        rating: 4.8,
        tags: ['personal statement', 'writing', 'guide'],
        tagsKo: ['개인 성명서', '작성법', '가이드'],
        featured: true,
        createdAt: '2024-01-15',
        pages: 45
      },
      {
        id: '2',
        title: 'Korean Cultural Context in Essays',
        titleKo: '에세이에서의 한국 문화적 맥락',
        description: 'How to effectively incorporate Korean cultural elements in your essays',
        descriptionKo: '에세이에 한국 문화적 요소를 효과적으로 통합하는 방법',
        category: 'cultural',
        type: 'article',
        url: '/resources/korean-cultural-context.pdf',
        downloads: 892,
        rating: 4.9,
        tags: ['cultural', 'Korean', 'identity'],
        tagsKo: ['문화적', '한국', '정체성'],
        featured: true,
        createdAt: '2024-01-10',
        pages: 23
      },
      {
        id: '3',
        title: 'Common App Essay Examples',
        titleKo: 'Common App 에세이 예시',
        description: 'Successful Common Application essay examples with analysis',
        descriptionKo: '성공적인 Common Application 에세이 예시와 분석',
        category: 'essay',
        type: 'template',
        url: '/resources/common-app-examples.pdf',
        downloads: 2156,
        rating: 4.7,
        tags: ['common app', 'examples', 'templates'],
        tagsKo: ['커먼앱', '예시', '템플릿'],
        featured: false,
        createdAt: '2024-01-05',
        pages: 67
      },
      {
        id: '4',
        title: 'SAT Essay Writing Workshop',
        titleKo: 'SAT 에세이 작성 워크샵',
        description: 'Video workshop on mastering the SAT essay section',
        descriptionKo: 'SAT 에세이 섹션 마스터링을 위한 비디오 워크샵',
        category: 'test-prep',
        type: 'video',
        url: '/resources/sat-essay-workshop.mp4',
        downloads: 567,
        rating: 4.6,
        tags: ['SAT', 'essay', 'workshop'],
        tagsKo: ['SAT', '에세이', '워크샵'],
        featured: false,
        createdAt: '2024-01-12',
        duration: '45:30'
      },
      {
        id: '5',
        title: 'Application Timeline Template',
        titleKo: '지원 일정 템플릿',
        description: 'Comprehensive timeline template for college applications',
        descriptionKo: '대학 지원을 위한 종합 일정 템플릿',
        category: 'application',
        type: 'template',
        url: '/resources/application-timeline.xlsx',
        downloads: 743,
        rating: 4.5,
        tags: ['timeline', 'planning', 'organization'],
        tagsKo: ['일정', '계획', '정리'],
        featured: false,
        createdAt: '2024-01-08'
      },
      {
        id: '6',
        title: 'Student Success Stories',
        titleKo: '학생 성공 사례',
        description: 'Real stories from Korean students who got into top US universities',
        descriptionKo: '상위 미국 대학에 합격한 한국 학생들의 실제 사례',
        category: 'community',
        type: 'article',
        url: '/resources/success-stories.pdf',
        downloads: 1234,
        rating: 4.9,
        tags: ['success stories', 'motivation', 'inspiration'],
        tagsKo: ['성공 사례', '동기부여', '영감'],
        featured: true,
        createdAt: '2024-01-20',
        pages: 34
      }
    ];

    setResources(mockResources);
    setFilteredResources(mockResources);
    setLoading(false);
  }, []);

  // Filter and sort resources
  useEffect(() => {
    let filtered = resources;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(resource => 
        resource.title.toLowerCase().includes(query) ||
        resource.titleKo.toLowerCase().includes(query) ||
        resource.description.toLowerCase().includes(query) ||
        resource.descriptionKo.toLowerCase().includes(query) ||
        resource.tags.some(tag => tag.toLowerCase().includes(query)) ||
        resource.tagsKo.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(resource => resource.category === selectedCategory);
    }

    // Apply type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(resource => resource.type === selectedType);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'popular':
          return b.downloads - a.downloads;
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

    setFilteredResources(filtered);
  }, [resources, searchQuery, selectedCategory, selectedType, sortBy]);

  const categories = [
    { id: 'all', name: language === 'ko' ? '전체' : 'All', icon: BookOpenIcon },
    { id: 'essay', name: language === 'ko' ? '에세이' : 'Essays', icon: DocumentTextIcon },
    { id: 'application', name: language === 'ko' ? '지원서' : 'Applications', icon: AcademicCapIcon },
    { id: 'cultural', name: language === 'ko' ? '문화적' : 'Cultural', icon: UserGroupIcon },
    { id: 'test-prep', name: language === 'ko' ? '시험 준비' : 'Test Prep', icon: StarIcon },
    { id: 'community', name: language === 'ko' ? '커뮤니티' : 'Community', icon: UserGroupIcon }
  ];

  const types = [
    { id: 'all', name: language === 'ko' ? '전체' : 'All' },
    { id: 'guide', name: language === 'ko' ? '가이드' : 'Guides' },
    { id: 'template', name: language === 'ko' ? '템플릿' : 'Templates' },
    { id: 'article', name: language === 'ko' ? '기사' : 'Articles' },
    { id: 'video', name: language === 'ko' ? '비디오' : 'Videos' },
    { id: 'pdf', name: 'PDF' }
  ];



  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'essay':
        return 'bg-blue-100 text-blue-800';
      case 'application':
        return 'bg-green-100 text-green-800';
      case 'cultural':
        return 'bg-purple-100 text-purple-800';
      case 'test-prep':
        return 'bg-orange-100 text-orange-800';
      case 'community':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDownload = (resource: Resource) => {
    // TODO: Implement actual download logic
    console.log(`Downloading: ${resource.title}`);
    // For now, just open in new tab
    window.open(resource.url, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {language === 'ko' ? '학습 자료' : 'Learning Resources'}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {language === 'ko' 
                ? '미국 대학 지원을 위한 종합적인 학습 자료를 찾아보세요. 에세이 작성법부터 문화적 맥락까지 모든 것을 제공합니다.'
                : 'Discover comprehensive learning resources for US college applications. From essay writing to cultural context, we have everything you need.'
              }
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={language === 'ko' ? '자료 검색...' : 'Search resources...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {types.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sort Options */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {language === 'ko' ? '정렬:' : 'Sort by:'}
              </span>
              <div className="flex space-x-2">
                {[
                  { id: 'newest', label: language === 'ko' ? '최신순' : 'Newest' },
                  { id: 'popular', label: language === 'ko' ? '인기순' : 'Popular' },
                  { id: 'rating', label: language === 'ko' ? '평점순' : 'Rating' }
                ].map(option => (
                  <button
                    key={option.id}
                    onClick={() => setSortBy(option.id as any)}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      sortBy === option.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="text-sm text-gray-600">
              {language === 'ko' 
                ? `${filteredResources.length}개의 자료`
                : `${filteredResources.length} resources`
              }
            </div>
          </div>
        </div>

        {/* Featured Resources */}
        {filteredResources.filter(r => r.featured).length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {language === 'ko' ? '추천 자료' : 'Featured Resources'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources
                .filter(resource => resource.featured)
                .slice(0, 3)
                .map(resource => (
                  <div key={resource.id} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(resource.category)}`}>
                            {categories.find(c => c.id === resource.category)?.name}
                          </div>
                          {resource.featured && (
                            <StarIcon className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <EyeIcon className="h-4 w-4" />
                          <span>{resource.downloads}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {language === 'ko' ? resource.titleKo : resource.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {language === 'ko' ? resource.descriptionKo : resource.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <StarIcon
                                key={i}
                                className={`h-4 w-4 ${
                                  i < Math.floor(resource.rating)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">{resource.rating}</span>
                        </div>
                        
                        <button
                          onClick={() => handleDownload(resource)}
                          className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          <ArrowDownTrayIcon className="h-4 w-4" />
                          <span className="text-sm">
                            {language === 'ko' ? '다운로드' : 'Download'}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* All Resources */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {language === 'ko' ? '모든 자료' : 'All Resources'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map(resource => (
              <div key={resource.id} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(resource.category)}`}>
                        {categories.find(c => c.id === resource.category)?.name}
                      </div>
                      {resource.featured && (
                        <StarIcon className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <EyeIcon className="h-4 w-4" />
                      <span>{resource.downloads}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {language === 'ko' ? resource.titleKo : resource.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {language === 'ko' ? resource.descriptionKo : resource.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {(language === 'ko' ? resource.tagsKo : resource.tags).slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(resource.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">{resource.rating}</span>
                    </div>
                    
                    <button
                      onClick={() => handleDownload(resource)}
                      className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <ArrowDownTrayIcon className="h-4 w-4" />
                      <span className="text-sm">
                        {language === 'ko' ? '다운로드' : 'Download'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {language === 'ko' ? '자료를 찾을 수 없습니다' : 'No resources found'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {language === 'ko' 
                ? '검색 조건을 변경해보세요.'
                : 'Try adjusting your search criteria.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourcesPage; 