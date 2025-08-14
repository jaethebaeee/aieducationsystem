import React from 'react';
import { buildPromptSuggestions, PromptSuggestion, PromptContext } from '../../services/promptSuggestions';

export interface PromptSuggestionsProps {
  context?: PromptContext;
  onPick: (suggestion: PromptSuggestion) => void;
  className?: string;
}

const chipBase = 'text-xs px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 text-white border border-white/10';

const PromptSuggestions: React.FC<PromptSuggestionsProps> = ({ context, onPick, className }) => {
  const suggestions = buildPromptSuggestions(context);

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-[11px] uppercase tracking-wide text-white/60">Suggested prompts</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {suggestions.map((s) => (
          <button
            key={s.id}
            className={chipBase}
            onClick={() => onPick(s)}
            title={s.prompt}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PromptSuggestions;

