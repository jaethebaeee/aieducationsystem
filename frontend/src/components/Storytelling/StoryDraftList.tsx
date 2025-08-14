import React from 'react';

export interface StoryDraft {
  id: string;
  title: string;
  blockIds: string[];
  fullText: string;
  culturalFitFeedback?: string;
  updatedAt: string;
}

interface StoryDraftListProps {
  drafts: StoryDraft[];
  onEdit: (draft: StoryDraft) => void;
  onDelete: (id: string) => void;
  onAnalyze: (id: string) => void;
}

const StoryDraftList: React.FC<StoryDraftListProps> = ({ drafts, onEdit, onDelete, onAnalyze }) => {
  return (
    <div className="space-y-4">
      {drafts.length === 0 && <div className="text-gray-500">No drafts yet.</div>}
      {drafts.map(draft => (
        <div key={draft.id} className="bg-white rounded shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <div className="font-semibold text-gray-800 mb-1">{draft.title}</div>
            <div className="text-gray-700 mb-1 whitespace-pre-line">{draft.fullText}</div>
            {draft.culturalFitFeedback && (
              <div className="mt-2 p-2 bg-green-50 border-l-4 border-green-400 text-green-900 rounded">
                <div className="font-semibold mb-1">Cultural Fit Feedback</div>
                <div>{draft.culturalFitFeedback}</div>
              </div>
            )}
          </div>
          <div className="flex flex-row md:flex-col gap-2 mt-2 md:mt-0 md:ml-4">
            <button className="text-blue-600 hover:underline" onClick={() => onEdit(draft)}>Edit</button>
            <button className="text-red-600 hover:underline" onClick={() => onDelete(draft.id)}>Delete</button>
            <button className="text-green-600 hover:underline" onClick={() => onAnalyze(draft.id)}>Analyze Cultural Fit</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StoryDraftList; 