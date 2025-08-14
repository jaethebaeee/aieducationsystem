import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MagnifyingGlassIcon, DocumentTextIcon, ChartBarIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface UniversityResearchResult {
  universityName: string;
  admissionsTrends: string[];
  culturalPreferences: string[];
  essayPreferences: string[];
  opportunities: string[];
  risks: string[];
  recommendations: string[];
  lastUpdated: string;
  sources: string[];
}

const UniversityResearch: React.FC = () => {
  const { t } = useTranslation();
  const [universityName, setUniversityName] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<UniversityResearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleResearch = async () => {
    if (!universityName.trim()) {
      setError(t('agenticSeek.research.universityRequired'));
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const response = await fetch('/api/agentic-seek/research-university', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({ universityName: universityName.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Research failed');
      }

      const data = await response.json();
      setResult(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Research failed');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleResearch();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t('agenticSeek.research.title')}
        </h3>
        
        <div className="flex space-x-3">
          <div className="flex-1">
            <input
              type="text"
              value={universityName}
              onChange={(e) => setUniversityName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t('agenticSeek.research.placeholder')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
          </div>
          <button
            onClick={handleResearch}
            disabled={loading || !universityName.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>{t('agenticSeek.research.researching')}</span>
              </>
            ) : (
              <>
                <MagnifyingGlassIcon className="h-4 w-4" />
                <span>{t('agenticSeek.research.search')}</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-3 flex items-center space-x-2 text-red-600">
            <ExclamationTriangleIcon className="h-5 w-5" />
            <span className="text-sm">{error}</span>
          </div>
        )}
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {result.universityName}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {t('agenticSeek.research.lastUpdated')}: {formatDate(result.lastUpdated)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">
                  {t('agenticSeek.research.sources')}: {result.sources.length}
                </p>
              </div>
            </div>
          </div>

          {/* Admissions Trends */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-2 mb-4">
              <ChartBarIcon className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                {t('agenticSeek.research.admissionsTrends')}
              </h3>
            </div>
            <ul className="space-y-2">
              {result.admissionsTrends.map((trend, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span className="text-gray-700">{trend}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Cultural Preferences */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-2 mb-4">
              <DocumentTextIcon className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                {t('agenticSeek.research.culturalPreferences')}
              </h3>
            </div>
            <ul className="space-y-2">
              {result.culturalPreferences.map((preference, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span className="text-gray-700">{preference}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Essay Preferences */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-2 mb-4">
              <DocumentTextIcon className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                {t('agenticSeek.research.essayPreferences')}
              </h3>
            </div>
            <ul className="space-y-2">
              {result.essayPreferences.map((preference, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-purple-600 mt-1">•</span>
                  <span className="text-gray-700">{preference}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Opportunities */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-5 w-5 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-xs font-bold">✓</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {t('agenticSeek.research.opportunities')}
              </h3>
            </div>
            <ul className="space-y-2">
              {result.opportunities.map((opportunity, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span className="text-gray-700">{opportunity}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Risks */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-2 mb-4">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                {t('agenticSeek.research.risks')}
              </h3>
            </div>
            <ul className="space-y-2">
              {result.risks.map((risk, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-yellow-600 mt-1">•</span>
                  <span className="text-gray-700">{risk}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recommendations */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">
              {t('agenticSeek.research.recommendations')}
            </h3>
            <ul className="space-y-3">
              {result.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-blue-800">{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Sources */}
          {result.sources.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                {t('agenticSeek.research.sources')}:
              </h4>
              <div className="text-xs text-gray-600 space-y-1">
                {result.sources.map((source, index) => (
                  <div key={index} className="truncate">
                    {source}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UniversityResearch; 