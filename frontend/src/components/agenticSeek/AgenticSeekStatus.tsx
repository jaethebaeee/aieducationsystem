import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface AgenticSeekStatus {
  agenticSeek: {
    enabled: boolean;
    healthy: boolean;
    status: {
      isLocal: boolean;
      model: string;
      voiceEnabled: boolean;
      webBrowsingEnabled: boolean;
    };
  };
  openai: {
    enabled: boolean;
    configured: boolean;
  };
  recommendedProvider: string;
}

const AgenticSeekStatus: React.FC = () => {
  const { t } = useTranslation();
  const [status, setStatus] = useState<AgenticSeekStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/agentic-seek/status', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch status');
      }

      const data = await response.json();
      setStatus(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (healthy: boolean) => {
    if (healthy) {
      return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
    }
    return <XCircleIcon className="h-6 w-6 text-red-500" />;
  };

  const getProviderBadge = (provider: string) => {
    const isRecommended = status?.recommendedProvider === provider;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isRecommended 
          ? 'bg-green-100 text-green-800 border border-green-200' 
          : 'bg-gray-100 text-gray-800 border border-gray-200'
      }`}>
        {provider}
        {isRecommended && (
          <span className="ml-1 text-green-600">★</span>
        )}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-2 text-red-600">
          <ExclamationTriangleIcon className="h-5 w-5" />
          <span className="font-medium">{t('agenticSeek.status.error')}</span>
        </div>
        <p className="text-sm text-gray-600 mt-2">{error}</p>
        <button
          onClick={fetchStatus}
          className="mt-3 text-sm text-blue-600 hover:text-blue-800 underline"
        >
          {t('agenticSeek.status.retry')}
        </button>
      </div>
    );
  }

  if (!status) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {t('agenticSeek.status.title')}
        </h3>
        <button
          onClick={fetchStatus}
          className="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          {t('agenticSeek.status.refresh')}
        </button>
      </div>

      <div className="space-y-4">
        {/* AgenticSeek Status */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">
              {t('agenticSeek.status.agenticSeek')}
            </h4>
            {getStatusIcon(status.agenticSeek.healthy)}
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">{t('agenticSeek.status.enabled')}:</span>
              <span className={status.agenticSeek.enabled ? 'text-green-600' : 'text-red-600'}>
                {status.agenticSeek.enabled ? t('common.yes') : t('common.no')}
              </span>
            </div>
            
            {status.agenticSeek.enabled && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('agenticSeek.status.model')}:</span>
                  <span className="font-mono text-sm">{status.agenticSeek.status.model}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('agenticSeek.status.mode')}:</span>
                  <span className="text-blue-600">
                    {status.agenticSeek.status.isLocal ? t('agenticSeek.status.local') : t('agenticSeek.status.api')}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('agenticSeek.status.voice')}:</span>
                  <span className={status.agenticSeek.status.voiceEnabled ? 'text-green-600' : 'text-gray-400'}>
                    {status.agenticSeek.status.voiceEnabled ? t('common.enabled') : t('common.disabled')}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('agenticSeek.status.webBrowsing')}:</span>
                  <span className={status.agenticSeek.status.webBrowsingEnabled ? 'text-green-600' : 'text-gray-400'}>
                    {status.agenticSeek.status.webBrowsingEnabled ? t('common.enabled') : t('common.disabled')}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* OpenAI Status */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">
              {t('agenticSeek.status.openai')}
            </h4>
            {getStatusIcon(status.openai.configured)}
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">{t('agenticSeek.status.enabled')}:</span>
              <span className={status.openai.enabled ? 'text-green-600' : 'text-red-600'}>
                {status.openai.enabled ? t('common.yes') : t('common.no')}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">{t('agenticSeek.status.configured')}:</span>
              <span className={status.openai.configured ? 'text-green-600' : 'text-red-600'}>
                {status.openai.configured ? t('common.yes') : t('common.no')}
              </span>
            </div>
          </div>
        </div>

        {/* Recommended Provider */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-blue-900">
              {t('agenticSeek.status.recommendedProvider')}:
            </span>
            {getProviderBadge(status.recommendedProvider)}
          </div>
          <p className="text-sm text-blue-700 mt-2">
            {status.recommendedProvider === 'agentic-seek' 
              ? t('agenticSeek.status.recommendationLocal')
              : t('agenticSeek.status.recommendationOpenAI')
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default AgenticSeekStatus; 