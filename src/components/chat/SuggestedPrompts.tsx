"use client";

interface SuggestedPromptsProps {
  prompts: string[];
  onSelect: (prompt: string) => void;
  verbName?: string;
}

export default function SuggestedPrompts({
  prompts,
  onSelect,
  verbName,
}: SuggestedPromptsProps) {
  return (
    <div className="animate-fade-in px-4 py-3">
      <p className="text-caption text-text-muted mb-3">
        Commence la conversation :
      </p>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {/* Special "My day" chip with star icon */}
        <button
          onClick={() =>
            onSelect(
              verbName
                ? `I want to describe my day using "${verbName}".`
                : "I want to describe my day in English.",
            )
          }
          className="shrink-0 flex items-center gap-1.5 px-4 py-2 bg-warm-50 text-warm-500 font-semibold rounded-pill text-caption border border-warm-200 transition-all duration-150 hover:bg-warm-100 active:scale-95 opacity-0 animate-stagger-item"
          style={{ animationDelay: '0ms' }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="none"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          Ma journee en anglais
        </button>

        {/* Regular prompt chips */}
        {prompts.map((prompt, index) => (
          <button
            key={prompt}
            onClick={() => onSelect(prompt)}
            className="shrink-0 px-4 py-2 bg-primary-50 text-primary-600 font-medium rounded-pill text-caption border border-primary-100 transition-all duration-150 hover:bg-primary-100 active:scale-95 opacity-0 animate-stagger-item"
            style={{ animationDelay: `${(index + 1) * 60}ms` }}
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}
