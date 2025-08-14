import React, { useState } from 'react';

export interface StoryBlock {
  id: string;
  prompt: string;
  response: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface StoryBlockListProps {
  blocks: StoryBlock[];
  onEdit: (block: StoryBlock) => void;
  onDelete: (id: string) => void;
  onReorder: (reorderedBlocks: StoryBlock[]) => void;
  loading?: boolean;
}

const StoryBlockList: React.FC<StoryBlockListProps> = ({ 
  blocks, 
  onEdit, 
  onDelete, 
  onReorder,
  loading = false 
}) => {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, blockId: string) => {
    setDraggedId(blockId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', blockId);
  };

  const handleDragOver = (e: React.DragEvent, blockId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedId && draggedId !== blockId) {
      setDragOverId(blockId);
    }
  };

  const handleDragLeave = () => {
    setDragOverId(null);
  };

  const handleDrop = (e: React.DragEvent, targetBlockId: string) => {
    e.preventDefault();
    const draggedBlockId = e.dataTransfer.getData('text/plain');
    
    if (draggedBlockId === targetBlockId) return;

    const draggedIndex = blocks.findIndex(b => b.id === draggedBlockId);
    const targetIndex = blocks.findIndex(b => b.id === targetBlockId);
    
    if (draggedIndex === -1 || targetIndex === -1) return;

    const reorderedBlocks = [...blocks];
    const [draggedBlock] = reorderedBlocks.splice(draggedIndex, 1);
    reorderedBlocks.splice(targetIndex, 0, draggedBlock);
    
    // Update order numbers
    reorderedBlocks.forEach((block, index) => {
      block.order = index + 1;
    });

    onReorder(reorderedBlocks);
    setDraggedId(null);
    setDragOverId(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverId(null);
  };

  const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-2">
      {sortedBlocks.length === 0 && <div className="text-gray-500">No story blocks yet.</div>}
      {sortedBlocks.map((block, index) => (
        <div
          key={block.id}
          draggable={!loading}
          onDragStart={(e) => handleDragStart(e, block.id)}
          onDragOver={(e) => handleDragOver(e, block.id)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, block.id)}
          onDragEnd={handleDragEnd}
          className={`
            bg-white rounded-lg shadow-sm border-2 p-4 transition-all duration-200
            ${draggedId === block.id ? 'opacity-50 scale-95 shadow-lg' : ''}
            ${dragOverId === block.id ? 'border-blue-400 bg-blue-50' : 'border-transparent'}
            ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-move hover:shadow-md'}
          `}
          role="button"
          tabIndex={0}
          aria-label={`Story block ${index + 1}: ${block.prompt}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onEdit(block);
            }
          }}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {/* Drag Handle */}
                <div className="flex flex-col gap-1 cursor-move opacity-60 hover:opacity-100">
                  <div className="w-4 h-0.5 bg-gray-400"></div>
                  <div className="w-4 h-0.5 bg-gray-400"></div>
                  <div className="w-4 h-0.5 bg-gray-400"></div>
                </div>
                <div className="font-semibold text-gray-800">{block.prompt}</div>
              </div>
              <div className="text-gray-700 whitespace-pre-line ml-6">{block.response}</div>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <button
                className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
                onClick={() => onEdit(block)}
                disabled={loading}
                aria-label="Edit block"
              >
                Edit
              </button>
              <button
                className="text-red-600 hover:text-red-800 hover:underline text-sm"
                onClick={() => onDelete(block.id)}
                disabled={loading}
                aria-label="Delete block"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StoryBlockList; 