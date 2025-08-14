import React, { useState, useEffect } from 'react';
import StoryBlockBuilder from '../../components/Storytelling/StoryBlockBuilder';
import StoryBlockList, { StoryBlock } from '../../components/Storytelling/StoryBlockList';
import StoryDraftBuilder from '../../components/Storytelling/StoryDraftBuilder';
import StoryDraftList, { StoryDraft } from '../../components/Storytelling/StoryDraftList';
import KoreanText from '../../components/common/KoreanText';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  SparklesIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  XMarkIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

const API = '/api/storytelling';

// Simple toast component
const Toast: React.FC<{ message: string; type: 'success' | 'error'; onClose: () => void }> = ({ message, type, onClose }) => (
  <div className={`fixed top-6 right-6 z-50 px-4 py-2 rounded shadow-lg text-white ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}
    role="alert">
    <span>{message}</span>
    <button className="ml-4 text-white font-bold" onClick={onClose} aria-label="Close">×</button>
  </div>
);

const Modal: React.FC<{ open: boolean; onClose: () => void; children: React.ReactNode }> = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative">
        <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={onClose} aria-label="Close">×</button>
        {children}
      </div>
    </div>
  );
};

const CulturalStorytellingPage: React.FC = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const userId = user?.id; // Get real user ID from auth context
  const [blocks, setBlocks] = useState<StoryBlock[]>([]);
  const [drafts, setDrafts] = useState<StoryDraft[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [editingBlock, setEditingBlock] = useState<StoryBlock | null>(null);
  const [showDraftBuilder, setShowDraftBuilder] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  // --- AI Feedback Modal State ---
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackText, setFeedbackText] = useState<string | null>(null);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  // Fetch blocks
  const fetchBlocks = async () => {
    if (!userId) return;
    
    try {
      const res = await fetch(`${API}/story-blocks?userId=${userId}`);
      if (!res.ok) {
        throw new Error('Failed to fetch blocks');
      }
      const data = await res.json();
      setBlocks(data.data || []);
    } catch (error) {
      console.error('Failed to fetch blocks:', error);
      showError(language === 'ko' ? '블록을 불러오는데 실패했습니다.' : 'Failed to load blocks.');
    }
  };
  
  useEffect(() => { 
    if (userId) {
      fetchBlocks(); 
    }
  }, [userId]);

  // Fetch drafts
  const fetchDrafts = async () => {
    if (!userId) return;
    
    try {
      const res = await fetch(`${API}/story-drafts?userId=${userId}`);
      if (!res.ok) {
        throw new Error('Failed to fetch drafts');
      }
      const data = await res.json();
      setDrafts(data.data || []);
    } catch (error) {
      console.error('Failed to fetch drafts:', error);
      showError(language === 'ko' ? '초안을 불러오는데 실패했습니다.' : 'Failed to load drafts.');
    }
  };
  
  useEffect(() => { 
    if (userId) {
      fetchDrafts(); 
    }
  }, [userId]);

  // Toast helpers
  const showSuccess = (msg: string) => setToast({ message: msg, type: 'success' });
  const showError = (msg: string) => setToast({ message: msg, type: 'error' });

  // Handlers for blocks
  const handleSaveBlock = async (prompt: string, response: string) => {
    if (!userId) {
      showError(language === 'ko' ? '로그인이 필요합니다.' : 'Please log in to save blocks.');
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch(`${API}/story-blocks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, prompt, response, order: blocks.length + 1 })
      });
      
      if (!res.ok) {
        throw new Error('Failed to save block');
      }
      
      await fetchBlocks();
      setSelectedPrompt(null);
      showSuccess(language === 'ko' ? '블록이 저장되었습니다!' : 'Block saved!');
    } catch (error) {
      console.error('Save block error:', error);
      showError(language === 'ko' ? '블록 저장에 실패했습니다.' : 'Failed to save block.');
    } finally {
      setLoading(false);
    }
  };
  const handleEditBlock = (block: StoryBlock) => setEditingBlock(block);
  const handleDeleteBlock = async (id: string) => {
    setLoading(true);
    try {
      await fetch(`${API}/story-blocks/${id}`, { method: 'DELETE' });
      await fetchBlocks();
      showSuccess('Block deleted.');
    } catch {
      showError('Failed to delete block.');
    } finally {
      setLoading(false);
    }
  };
  const handleUpdateBlock = async (id: string, response: string) => {
    setLoading(true);
    try {
      await fetch(`${API}/story-blocks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ response })
      });
      await fetchBlocks();
      setEditingBlock(null);
      showSuccess('Block updated!');
    } catch {
      showError('Failed to update block.');
    } finally {
      setLoading(false);
    }
  };
  // --- Drag and Drop Block Reordering ---
  const handleReorderBlocks = async (reorderedBlocks: StoryBlock[]) => {
    setLoading(true);
    try {
      // Update order in DB for all blocks
      for (let i = 0; i < reorderedBlocks.length; i++) {
        await fetch(`${API}/story-blocks/${reorderedBlocks[i].id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: i + 1 })
        });
      }
      await fetchBlocks();
      showSuccess('Blocks reordered successfully!');
    } catch {
      showError('Failed to reorder blocks.');
    } finally {
      setLoading(false);
    }
  };

  // Block reordering (up/down) - keeping for backward compatibility
  const handleReorderBlock = async (id: string, direction: 'up' | 'down') => {
    const idx = blocks.findIndex(b => b.id === id);
    if (idx < 0) return;
    const newIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= blocks.length) return;
    const reordered = [...blocks];
    [reordered[idx], reordered[newIdx]] = [reordered[newIdx], reordered[idx]];
    // Update order in DB
    setLoading(true);
    try {
      for (let i = 0; i < reordered.length; i++) {
        await fetch(`${API}/story-blocks/${reordered[i].id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: i + 1 })
        });
      }
      await fetchBlocks();
      showSuccess('Blocks reordered.');
    } catch {
      showError('Failed to reorder blocks.');
    } finally {
      setLoading(false);
    }
  };

  // Handlers for drafts
  const handleSaveDraft = async (title: string, blockIds: string[], fullText: string) => {
    setLoading(true);
    try {
      await fetch(`${API}/story-drafts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, title, blockIds, fullText })
      });
      await fetchDrafts();
      setShowDraftBuilder(false);
      showSuccess('Draft saved!');
    } catch {
      showError('Failed to save draft.');
    } finally {
      setLoading(false);
    }
  };
  const handleEditDraft = (draft: StoryDraft) => {
    alert('Edit draft not implemented yet.');
  };
  const handleDeleteDraft = async (id: string) => {
    setLoading(true);
    try {
      await fetch(`${API}/story-drafts/${id}`, { method: 'DELETE' });
      await fetchDrafts();
      showSuccess('Draft deleted.');
    } catch {
      showError('Failed to delete draft.');
    } finally {
      setLoading(false);
    }
  };
  // --- New: Analyze Draft with Modal ---
  const handleAnalyzeDraft = async (id: string) => {
    setFeedbackModalOpen(true);
    setFeedbackLoading(true);
    setFeedbackText(null);
    setFeedbackError(null);
    try {
      const res = await fetch(`${API}/story-drafts/${id}/cultural-fit`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to analyze cultural fit.');
      const data = await res.json();
      // Assume feedback is in data.feedback or data.data.culturalFitFeedback
      const feedback = data.feedback || (data.data && data.data.culturalFitFeedback) || 'No feedback returned.';
      setFeedbackText(feedback);
      await fetchDrafts();
    } catch (err: any) {
      setFeedbackError(err.message || 'Failed to analyze cultural fit.');
    } finally {
      setFeedbackLoading(false);
    }
  };

  // --- Copy to clipboard helper ---
  const handleCopyFeedback = () => {
    if (feedbackText) {
      navigator.clipboard.writeText(feedbackText);
      setToast({ message: 'Feedback copied!', type: 'success' });
    }
  };

  // Example prompts (replace with your real prompt data)
  const storyPrompts = [
    'Describe a moment when your Korean background shaped your perspective.',
    'Reflect on a Korean tradition that influenced your values.',
    'Share a challenge you overcame as a bilingual student.'
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-4">
          <KoreanText>문화적 스토리텔링 코치</KoreanText> / Cultural Storytelling Coach
        </h1>
        {/* Prompt selection */}
        {!selectedPrompt && !editingBlock && !showDraftBuilder && (
          <>
            <div className="mb-6">
              <div className="font-semibold mb-2">Choose a prompt to start a new story block:</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {storyPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    className="bg-white border border-gray-300 rounded-lg p-4 hover:shadow"
                    onClick={() => setSelectedPrompt(prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold">Your Story Blocks</div>
                <button className="text-blue-600 hover:underline" onClick={() => setShowDraftBuilder(true)} disabled={blocks.length === 0}>
                  Assemble Draft
                </button>
              </div>
              <StoryBlockList
                blocks={blocks}
                onEdit={handleEditBlock}
                onDelete={handleDeleteBlock}
                onReorder={handleReorderBlocks}
                loading={loading}
              />
              {blocks.length > 1 && (
                <div className="flex gap-2 mt-2">
                  {blocks.map((block, idx) => (
                    <div key={block.id} className="flex items-center gap-1">
                      <button
                        className="px-2 py-1 text-xs bg-gray-200 rounded disabled:opacity-50"
                        disabled={idx === 0 || loading}
                        onClick={() => handleReorderBlock(block.id, 'up')}
                        aria-label="Move up"
                      >↑</button>
                      <button
                        className="px-2 py-1 text-xs bg-gray-200 rounded disabled:opacity-50"
                        disabled={idx === blocks.length - 1 || loading}
                        onClick={() => handleReorderBlock(block.id, 'down')}
                        aria-label="Move down"
                      >↓</button>
                    </div>
                  ))}
                </div>
              )}
              {blocks.length === 0 && <div className="text-gray-400 mt-4">No story blocks yet. Start with a prompt above!</div>}
            </div>
            <div>
              <div className="font-semibold mb-2">Your Story Drafts</div>
              <StoryDraftList
                drafts={drafts}
                onEdit={handleEditDraft}
                onDelete={handleDeleteDraft}
                onAnalyze={handleAnalyzeDraft}
              />
              {drafts.length === 0 && <div className="text-gray-400 mt-4">No drafts yet. Assemble one from your blocks!</div>}
            </div>
          </>
        )}
        {/* Block builder modal */}
        <Modal open={!!selectedPrompt} onClose={() => setSelectedPrompt(null)}>
          {selectedPrompt && (
            <StoryBlockBuilder
              prompt={selectedPrompt}
              onSave={async (response) => await handleSaveBlock(selectedPrompt, response)}
              loading={loading}
            />
          )}
        </Modal>
        {/* Edit block modal */}
        <Modal open={!!editingBlock} onClose={() => setEditingBlock(null)}>
          {editingBlock && (
            <StoryBlockBuilder
              prompt={editingBlock.prompt}
              initialResponse={editingBlock.response}
              onSave={async (response) => await handleUpdateBlock(editingBlock.id, response)}
              loading={loading}
            />
          )}
        </Modal>
        {/* Draft builder modal */}
        <Modal open={showDraftBuilder} onClose={() => setShowDraftBuilder(false)}>
          <StoryDraftBuilder
            blocks={blocks}
            onSave={handleSaveDraft}
            loading={loading}
          />
        </Modal>
        {/* --- AI Feedback Modal --- */}
        <Modal open={feedbackModalOpen} onClose={() => setFeedbackModalOpen(false)}>
          <div className="flex flex-col items-start">
            <div className="font-bold text-lg mb-2">Cultural Fit Feedback</div>
            {feedbackLoading && (
              <div className="flex items-center justify-center w-full py-8">
                <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
                <span className="ml-3 text-blue-700">Analyzing...</span>
              </div>
            )}
            {feedbackError && <div className="text-red-500 mb-2">{feedbackError}</div>}
            {feedbackText && !feedbackLoading && !feedbackError && (
              <>
                <div className="whitespace-pre-line mb-4 text-gray-800 border-l-4 border-blue-400 bg-blue-50 p-3 rounded">
                  {feedbackText}
                </div>
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={handleCopyFeedback}
                  >Copy</button>
                  <button
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    onClick={() => {
                      if (feedbackText) {
                        const subject = encodeURIComponent('Cultural Fit Feedback from AdmitAI Korea');
                        const body = encodeURIComponent(feedbackText);
                        window.open(`mailto:?subject=${subject}&body=${body}`);
                      }
                    }}
                  >Share</button>
                  <button
                    className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                    onClick={() => setFeedbackModalOpen(false)}
                  >Close</button>
                </div>
              </>
            )}
            {!feedbackLoading && !feedbackText && !feedbackError && (
              <div className="text-gray-500">No feedback to display.</div>
            )}
          </div>
        </Modal>
        {loading && (
          <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-20">
            <div className="bg-white rounded-full p-6 shadow-lg">
              <svg className="animate-spin h-8 w-8 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CulturalStorytellingPage; 