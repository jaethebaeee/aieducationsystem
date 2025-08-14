import React, { useState } from 'react';
import AccessibleButton from '../common/AccessibleButton';
import Skeleton from '../common/Skeleton';

interface StoryBlockBuilderProps {
  prompt: string;
  onSave: (response: string) => Promise<void>;
  initialResponse?: string;
  aiFeedback?: string;
  loading?: boolean;
}

// Story block templates for quick insertion
const STORY_TEMPLATES = {
  challenge: {
    name: 'Challenge',
    template: `Describe a specific challenge you faced:

• What was the situation?
• How did your Korean background influence your approach?
• What did you learn from this experience?

[Your response here...]`
  },
  turningPoint: {
    name: 'Turning Point',
    template: `Share a moment that changed your perspective:

• What happened that made you see things differently?
• How did this relate to your cultural background?
• How did this experience shape your future goals?

[Your response here...]`
  },
  culturalInsight: {
    name: 'Cultural Insight',
    template: `Reflect on a Korean tradition or value that shaped you:

• Which tradition or value is most meaningful to you?
• How has it influenced your decisions and actions?
• How do you see this applying to your future studies?

[Your response here...]`
  },
  achievement: {
    name: 'Achievement',
    template: `Describe an accomplishment you're proud of:

• What did you achieve and why was it significant?
• What obstacles did you overcome?
• How did your background help you succeed?

[Your response here...]`
  },
  growth: {
    name: 'Personal Growth',
    template: `Share how you've grown as a person:

• What experience led to your biggest personal growth?
• How did your Korean identity play a role?
• How will this growth help you in college and beyond?

[Your response here...]`
  }
};

const StoryBlockBuilder: React.FC<StoryBlockBuilderProps> = ({
  prompt,
  onSave,
  initialResponse = '',
  aiFeedback,
  loading = false,
}) => {
  const [response, setResponse] = useState(initialResponse);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await onSave(response);
    } catch (e) {
      setError('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const insertTemplate = (templateKey: keyof typeof STORY_TEMPLATES) => {
    const template = STORY_TEMPLATES[templateKey];
    setResponse(prev => prev + (prev ? '\n\n' : '') + template.template);
    setShowTemplates(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="mb-2 text-gray-700 font-semibold">{prompt}</div>
      
      {/* Template Selector */}
      <div className="mb-3">
        <button
          type="button"
          onClick={() => setShowTemplates(!showTemplates)}
          className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
          disabled={saving || loading}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Use Template
        </button>
        
        {showTemplates && (
          <div className="mt-2 p-3 bg-gray-50 rounded-lg border">
            <div className="text-sm font-medium text-gray-700 mb-2">Choose a template:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.entries(STORY_TEMPLATES).map(([key, template]) => (
                <button
                  key={key}
                  onClick={() => insertTemplate(key as keyof typeof STORY_TEMPLATES)}
                  className="text-left p-2 text-sm bg-white border border-gray-200 rounded hover:bg-blue-50 hover:border-blue-300 transition-colors"
                  disabled={saving || loading}
                >
                  <div className="font-medium text-gray-800">{template.name}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {template.template.split('\n')[0].replace('Describe a ', '').replace('Share a ', '').replace('Reflect on a ', '')}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <textarea
        className="w-full border border-gray-300 rounded-lg p-2 mb-2 min-h-[100px]"
        value={response}
        onChange={e => setResponse(e.target.value)}
        disabled={saving || loading}
        placeholder="Write your story here..."
      />
      <div className="flex items-center gap-2">
        <AccessibleButton onClick={handleSave} disabled={saving || loading || !response.trim()}>
          {saving ? 'Saving...' : 'Save Block'}
        </AccessibleButton>
        {error && <span className="text-red-500 text-sm">{error}</span>}
      </div>
      {loading && <Skeleton className="h-6 mt-4" />}
      {aiFeedback && (
        <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-blue-900 rounded">
          <div className="font-semibold mb-1">AI Feedback</div>
          <div>{aiFeedback}</div>
        </div>
      )}
    </div>
  );
};

export default StoryBlockBuilder; 