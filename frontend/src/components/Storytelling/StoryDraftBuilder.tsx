import React, { useState, useEffect, useCallback } from 'react';
import AccessibleButton from '../common/AccessibleButton';

import type { StoryBlock } from './StoryBlockList';

interface StoryDraftBuilderProps {
  blocks: StoryBlock[];
  onSave: (title: string, blockIds: string[], fullText: string) => Promise<void>;
  loading?: boolean;
  draftId?: string; // For autosaving existing drafts
}

const StoryDraftBuilder: React.FC<StoryDraftBuilderProps> = ({ 
  blocks, 
  onSave, 
  loading = false,
  draftId 
}) => {
  const [selectedBlockIds, setSelectedBlockIds] = useState<string[]>(blocks.map(b => b.id));
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  // --- Autosave State ---
  const [autosaveStatus, setAutosaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // --- Debounced Autosave Function ---
  const debouncedAutosave = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (title: string, blockIds: string[], fullText: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(async () => {
          if (!title.trim() || blockIds.length === 0) return;
          
          setAutosaveStatus('saving');
          try {
            await onSave(title, blockIds, fullText);
            setAutosaveStatus('saved');
            setLastSaved(new Date());
            // Clear saved status after 3 seconds
            setTimeout(() => setAutosaveStatus('idle'), 3000);
          } catch (err) {
            setAutosaveStatus('error');
            console.error('Autosave failed:', err);
          }
        }, 2000); // Save 2 seconds after user stops typing
      };
    })(),
    [onSave]
  );

  // --- Trigger Autosave on Changes ---
  useEffect(() => {
    if (title.trim() && selectedBlockIds.length > 0) {
      const selectedBlocks = blocks.filter(b => selectedBlockIds.includes(b.id));
      const fullText = selectedBlocks.map(b => b.response).join('\n\n');
      debouncedAutosave(title, selectedBlockIds, fullText);
    }
  }, [title, selectedBlockIds, blocks, debouncedAutosave]);

  const handleToggle = (id: string) => {
    setSelectedBlockIds(ids => ids.includes(id) ? ids.filter(bid => bid !== id) : [...ids, id]);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const selectedBlocks = blocks.filter(b => selectedBlockIds.includes(b.id));
      const fullText = selectedBlocks.map(b => b.response).join('\n\n');
      await onSave(title, selectedBlockIds, fullText);
      setAutosaveStatus('saved');
      setLastSaved(new Date());
    } catch (e) {
      setError('Failed to save draft. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="mb-2 font-semibold text-gray-700">Assemble Your Story Draft</div>
      <div className="relative">
        <input
          className="w-full border border-gray-300 rounded-lg p-2 mb-2"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Draft Title"
          disabled={saving || loading}
        />
        {/* --- Autosave Status Indicator --- */}
        {autosaveStatus === 'saving' && (
          <div className="absolute right-2 top-2 text-blue-600 text-sm">
            <svg className="animate-spin h-4 w-4 inline mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            Saving...
          </div>
        )}
        {autosaveStatus === 'saved' && (
          <div className="absolute right-2 top-2 text-green-600 text-sm">
            ✓ Saved
          </div>
        )}
        {autosaveStatus === 'error' && (
          <div className="absolute right-2 top-2 text-red-600 text-sm">
            Save failed
          </div>
        )}
      </div>
      <div className="mb-2 text-gray-600">Select which blocks to include:</div>
      <div className="space-y-2 mb-4">
        {blocks.map(block => (
          <label key={block.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedBlockIds.includes(block.id)}
              onChange={() => handleToggle(block.id)}
              disabled={saving || loading}
            />
            <span className="font-medium text-gray-800">{block.prompt}</span>
          </label>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <AccessibleButton onClick={handleSave} disabled={saving || loading || !title.trim() || selectedBlockIds.length === 0}>
          {saving ? 'Saving...' : 'Save Draft'}
        </AccessibleButton>
        {lastSaved && (
          <div className="text-xs text-gray-500">
            Last saved: {lastSaved.toLocaleTimeString()}
          </div>
        )}
      </div>
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
    </div>
  );
};

export default StoryDraftBuilder; 