import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  ChatBubbleLeftRightIcon, 
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  HeartIcon,
  BookmarkIcon,
  ShareIcon,
  FlagIcon,
  UserCircleIcon,
  EyeIcon,
  GlobeAltIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  QuestionMarkCircleIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import AccessibleButton from '../../components/common/AccessibleButton';
import ResponsiveContainer from '../../components/layout/ResponsiveContainer';
import PrivateSEO from '../../components/seo/PrivateSEO';

interface CommunityPost {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    role: 'student' | 'parent' | 'mentor' | 'admin';
  };
  category: PostCategory;
  tags: string[];
  likes: number;
  comments: number;
  views: number;
  isLiked: boolean;
  isBookmarked: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    role: 'student' | 'parent' | 'mentor' | 'admin';
  };
  likes: number;
  isLiked: boolean;
  createdAt: string;
}

type PostCategory = 'general' | 'essay-help' | 'application-tips' | 'cultural-advice' | 'mentorship' | 'success-stories' | 'questions' | 'resources';

const CommunityPage: React.FC = () => {
  const { t } = useLanguage();
  
  const [activeTab, setActiveTab] = useState<'posts' | 'create' | 'my-posts'>('posts');
  const [selectedCategory, setSelectedCategory] = useState<PostCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'trending'>('recent');
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Mock data - replace with actual API calls
  const mockPosts: CommunityPost[] = [
    {
      id: '1',
      title: '한국 문화를 Personal Statement에 어떻게 자연스럽게 통합할 수 있을까요?',
      content: 'Personal Statement를 작성하면서 한국 문화적 배경을 어떻게 자연스럽게 표현할 수 있는지 궁금합니다. 특히 효(孝) 정신이나 집단주의 문화를 어떻게 서양 독자들에게 이해시키면서도 개인적 경험으로 연결할 수 있을까요?',
      author: {
        id: '1',
        name: '김민수',
        role: 'student'
      },
      category: 'cultural-advice',
      tags: ['personal-statement', '한국문화', '효', '문화적적응'],
      likes: 24,
      comments: 8,
      views: 156,
      isLiked: false,
      isBookmarked: false,
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      title: 'Harvard 지원 경험 공유 - 한국 학생의 관점에서',
      content: '지난해 Harvard에 합격한 경험을 공유하고 싶습니다. 특히 한국 학생들이 자주 놓치는 부분들과 준비 과정에서 도움이 되었던 팁들을 정리해보았습니다.',
      author: {
        id: '2',
        name: '이지은',
        role: 'student'
      },
      category: 'success-stories',
      tags: ['harvard', '합격경험', '준비팁', '한국학생'],
      likes: 45,
      comments: 12,
      views: 289,
      isLiked: true,
      isBookmarked: true,
      createdAt: '2024-01-14T15:45:00Z',
      updatedAt: '2024-01-14T15:45:00Z'
    },
    {
      id: '3',
      title: 'Supplemental Essay 작성 시 주의할 점들',
      content: 'Supplemental Essay를 작성할 때 한국 학생들이 자주 하는 실수들과 개선 방법에 대해 정리해보았습니다. 특히 "Why this school?" 에세이에서 한국적 관점을 어떻게 활용할 수 있는지도 포함했습니다.',
      author: {
        id: '3',
        name: '박준호',
        role: 'mentor'
      },
      category: 'essay-help',
      tags: ['supplemental-essay', 'why-this-school', '작성팁', '한국학생'],
      likes: 32,
      comments: 15,
      views: 203,
      isLiked: false,
      isBookmarked: false,
      createdAt: '2024-01-13T09:15:00Z',
      updatedAt: '2024-01-13T09:15:00Z'
    }
  ];

  const mockComments: Comment[] = [
    {
      id: '1',
      content: '저도 같은 고민을 하고 있었는데, 이 글을 보니 많은 도움이 되었습니다. 특히 한국 문화의 가치를 개인적 경험과 연결하는 부분이 인상적이었어요.',
      author: {
        id: '4',
        name: '최수진',
        role: 'student'
      },
      likes: 5,
      isLiked: false,
      createdAt: '2024-01-15T11:00:00Z'
    },
    {
      id: '2',
      content: '한국 문화를 설명할 때 구체적인 예시를 들어가며 설명하는 것이 중요합니다. 추상적인 개념보다는 실제 경험을 바탕으로 한 스토리가 더 효과적이에요.',
      author: {
        id: '5',
        name: '김멘토',
        role: 'mentor'
      },
      likes: 8,
      isLiked: true,
      createdAt: '2024-01-15T11:30:00Z'
    }
  ];

  const categories = [
    { id: 'all', label: t('community.categories.all'), icon: GlobeAltIcon },
    { id: 'general', label: t('community.categories.general'), icon: ChatBubbleLeftRightIcon },
    { id: 'essay-help', label: t('community.categories.essayHelp'), icon: DocumentTextIcon },
    { id: 'application-tips', label: t('community.categories.applicationTips'), icon: AcademicCapIcon },
    { id: 'cultural-advice', label: t('community.categories.culturalAdvice'), icon: GlobeAltIcon },
    { id: 'mentorship', label: t('community.categories.mentorship'), icon: UserCircleIcon },
    { id: 'success-stories', label: t('community.categories.successStories'), icon: LightBulbIcon },
    { id: 'questions', label: t('community.categories.questions'), icon: QuestionMarkCircleIcon },
    { id: 'resources', label: t('community.categories.resources'), icon: BookmarkIcon }
  ];

  // Filter posts based on search and category
  const filteredPosts = mockPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort posts
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.likes - a.likes;
      case 'trending':
        return (b.views + b.comments) - (a.views + a.comments);
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const handleLikePost = (postId: string) => {
    // Toggle like status
    console.log('Liking post:', postId);
  };

  const handleBookmarkPost = (postId: string) => {
    // Toggle bookmark status
    console.log('Bookmarking post:', postId);
  };

  const handleSharePost = (postId: string) => {
    // Share post
    console.log('Sharing post:', postId);
  };

  const handleReportPost = (postId: string) => {
    // Report post
    console.log('Reporting post:', postId);
  };

  const getCategoryIcon = (category: PostCategory) => {
    const categoryData = categories.find(c => c.id === category);
    if (categoryData) {
      const Icon = categoryData.icon;
      return <Icon className="w-4 h-4" />;
    }
    return <ChatBubbleLeftRightIcon className="w-4 h-4" />;
  };

  const getCategoryColor = (category: PostCategory) => {
    switch (category) {
      case 'essay-help': return 'bg-blue-100 text-blue-800';
      case 'cultural-advice': return 'bg-green-100 text-green-800';
      case 'success-stories': return 'bg-yellow-100 text-yellow-800';
      case 'mentorship': return 'bg-purple-100 text-purple-800';
      case 'questions': return 'bg-red-100 text-red-800';
      case 'resources': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <ResponsiveContainer>
      <PrivateSEO title={t('community.title')} language="ko" />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 text-korean">
              {t('community.title')}
            </h1>
            <p className="text-gray-600 text-korean mt-1">
              {t('community.subtitle')}
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <AccessibleButton
              variant="outline"
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
                              <FunnelIcon className="w-4 h-4 mr-2" />
              {t('community.filters')}
            </AccessibleButton>
            <AccessibleButton onClick={() => setActiveTab('create')}>
              <PlusIcon className="w-4 h-4 mr-2" />
              {t('community.newPost')}
            </AccessibleButton>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('community.search.placeholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-korean"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex-shrink-0">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as PostCategory | 'all')}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-korean"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="flex-shrink-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'recent' | 'popular' | 'trending')}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-korean"
              >
                <option value="recent">{t('community.sort.recent')}</option>
                <option value="popular">{t('community.sort.popular')}</option>
                <option value="trending">{t('community.sort.trending')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'posts', label: t('community.tabs.posts'), icon: ChatBubbleLeftRightIcon },
                { id: 'create', label: t('community.tabs.create'), icon: PlusIcon },
                { id: 'my-posts', label: t('community.tabs.myPosts'), icon: UserCircleIcon }
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
            {activeTab === 'posts' && (
              <div className="space-y-6">
                {sortedPosts.map((post) => (
                  <div key={post.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    {/* Post Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-korean">
                            {post.author.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 text-korean cursor-pointer hover:text-blue-600"
                              onClick={() => setSelectedPost(post)}>
                            {post.title}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-sm text-gray-500 text-korean">{post.author.name}</span>
                            <span className="text-xs text-gray-400 text-korean">•</span>
                            <span className="text-sm text-gray-500 text-korean">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                          {getCategoryIcon(post.category)}
                          <span className="ml-1 text-korean">
                            {categories.find(c => c.id === post.category)?.label}
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Post Content */}
                    <div className="mb-4">
                      <p className="text-gray-700 text-korean line-clamp-3">
                        {post.content}
                      </p>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700 text-korean">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Post Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <button
                          onClick={() => handleLikePost(post.id)}
                          className={`flex items-center space-x-1 text-sm transition-colors ${
                            post.isLiked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
                          }`}
                        >
                          {post.isLiked ? (
                            <HeartIconSolid className="w-4 h-4" />
                          ) : (
                            <HeartIcon className="w-4 h-4" />
                          )}
                          <span className="text-korean">{post.likes}</span>
                        </button>
                        <button
                          onClick={() => setSelectedPost(post)}
                          className="flex items-center space-x-1 text-sm text-gray-500 hover:text-blue-600 transition-colors"
                        >
                          <ChatBubbleLeftRightIcon className="w-4 h-4" />
                          <span className="text-korean">{post.comments}</span>
                        </button>
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <EyeIcon className="w-4 h-4" />
                          <span className="text-korean">{post.views}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleBookmarkPost(post.id)}
                          className={`p-1 rounded transition-colors ${
                            post.isBookmarked ? 'text-blue-600' : 'text-gray-400 hover:text-blue-600'
                          }`}
                        >
                          <BookmarkIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleSharePost(post.id)}
                          className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                        >
                          <ShareIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleReportPost(post.id)}
                          className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors"
                        >
                          <FlagIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'create' && (
              <div className="space-y-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900 text-korean mb-2">
                    {t('community.create.guidelines.title')}
                  </h3>
                  <ul className="text-sm text-blue-800 text-korean space-y-1">
                    <li>• {t('community.create.guidelines.respectful')}</li>
                    <li>• {t('community.create.guidelines.relevant')}</li>
                    <li>• {t('community.create.guidelines.constructive')}</li>
                    <li>• {t('community.create.guidelines.cultural')}</li>
                  </ul>
                </div>
                
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 text-korean">
                      {t('community.create.title')}
                    </label>
                    <input
                      type="text"
                      placeholder={t('community.create.titlePlaceholder')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-korean"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 text-korean">
                      {t('community.create.category')}
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-korean">
                      {categories.slice(1).map(category => (
                        <option key={category.id} value={category.id}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 text-korean">
                      {t('community.create.content')}
                    </label>
                    <textarea
                      rows={6}
                      placeholder={t('community.create.contentPlaceholder')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-korean"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 text-korean">
                      {t('community.create.tags')}
                    </label>
                    <input
                      type="text"
                      placeholder={t('community.create.tagsPlaceholder')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-korean"
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <AccessibleButton variant="outline">
                      {t('community.create.cancel')}
                    </AccessibleButton>
                    <AccessibleButton>
                      {t('community.create.submit')}
                    </AccessibleButton>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'my-posts' && (
              <div className="text-center py-8">
                <UserCircleIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2 text-korean">
                  {t('community.myPosts.empty')}
                </h3>
                <p className="text-gray-600 text-korean mb-4">
                  {t('community.myPosts.emptyDescription')}
                </p>
                <AccessibleButton onClick={() => setActiveTab('create')}>
                  {t('community.myPosts.createFirst')}
                </AccessibleButton>
              </div>
            )}
          </div>
        </div>

        {/* Post Detail Modal */}
        {selectedPost && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 text-korean">
                    {selectedPost.title}
                  </h2>
                  <button
                    onClick={() => setSelectedPost(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="mb-6">
                  <p className="text-gray-700 text-korean whitespace-pre-wrap">
                    {selectedPost.content}
                  </p>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-medium text-gray-900 mb-4 text-korean">
                    {t('community.comments.title')} ({mockComments.length})
                  </h3>
                  <div className="space-y-4">
                    {mockComments.map((comment) => (
                      <div key={comment.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="text-gray-600 font-semibold text-sm text-korean">
                              {comment.author.name.charAt(0)}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="font-medium text-gray-900 text-korean">
                                {comment.author.name}
                              </span>
                              <span className="text-sm text-gray-500 text-korean">
                                {new Date(comment.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-gray-700 text-korean">{comment.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ResponsiveContainer>
  );
};

export default CommunityPage; 