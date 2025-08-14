export type PromptCategory =
  | 'Research'
  | 'Cultural Fit'
  | 'Ideation'
  | 'Timeline'
  | 'Prompt Pack'
  | 'Reuse Map'
  | 'Gap Scan'
  | 'General';

export interface PromptSuggestion {
  id: string;
  label: string;
  prompt: string;
  category: PromptCategory;
}

export interface PromptContext {
  university?: string;
  backgroundSnippet?: string;
}

const withFallback = (value: string | undefined, fallback: string): string =>
  (value && value.trim().length > 0 ? value : fallback);

export function buildPromptSuggestions(context?: PromptContext): PromptSuggestion[] {
  const uni = withFallback(context?.university, 'the target university');
  const bg = withFallback(context?.backgroundSnippet, 'my background and activities');

  const suggestions: PromptSuggestion[] = [
    {
      id: 'research-1',
      label: 'Research this university',
      prompt: `Research and summarize current admissions priorities, recent policy shifts, and cultural values emphasized by ${uni}. Provide 5 bullet insights with sources.`,
      category: 'Research',
    },
    {
      id: 'cultural-1',
      label: 'Cultural fit check',
      prompt: `Evaluate how my draft aligns with ${uni}'s institutional values and culture. Suggest concrete edits to improve authenticity and specificity.`,
      category: 'Cultural Fit',
    },
    {
      id: 'ideation-1',
      label: '5 authentic topics',
      prompt: `Given ${bg}, propose 5 authentic, non‑cliché essay topics tailored for ${uni}. Include a 1‑sentence angle and why it fits.`,
      category: 'Ideation',
    },
    {
      id: 'ideation-2',
      label: 'Hardship → growth arc',
      prompt: `Turn a hardship I faced into a growth‑focused narrative outline with hook, scenes, reflection, and outcome. Avoid generic claims; prioritize specific moments.`,
      category: 'Ideation',
    },
    {
      id: 'timeline-1',
      label: '8‑week plan',
      prompt: `Create an 8‑week application plan from today until the deadline, including weekly focuses and concrete tasks for personal statement and supplements.`,
      category: 'Timeline',
    },
    {
      id: 'prompt-pack-1',
      label: 'Prompt pack from story',
      prompt: `Generate a prompt pack (3–5 suggestions) tailored to my core story that could fit common supplemental themes for ${uni}. Include reuse potential.`,
      category: 'Prompt Pack',
    },
    {
      id: 'reuse-1',
      label: 'Reuse map',
      prompt: `Build a reuse map showing which parts of my personal statement can be adapted for common supplemental prompts (why us, community, failure, activity).`,
      category: 'Reuse Map',
    },
    {
      id: 'gap-1',
      label: 'Gap scan',
      prompt: `Scan my profile for gaps relative to ${uni}'s priorities; output 3 concrete actions to improve fit in the next 30–60 days.`,
      category: 'Gap Scan',
    },
    {
      id: 'general-1',
      label: 'Revise for clarity',
      prompt: `Rewrite my paragraph at an 11th–12th grade reading level with clearer structure and stronger verbs while preserving meaning.`,
      category: 'General',
    },
    {
      id: 'general-2',
      label: 'Cliché diagnosis',
      prompt: `Identify clichés and generic claims in my draft and propose specific replacements with concrete details.`,
      category: 'General',
    },
  ];

  return suggestions;
}

