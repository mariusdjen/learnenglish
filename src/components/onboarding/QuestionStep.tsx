"use client";

import { useState } from "react";

interface Option {
  value: string;
  label: string;
  description?: string;
}

interface QuestionStepProps {
  title: string;
  subtitle: string;
  options: Option[];
  onSelect: (value: string) => void;
}

export default function QuestionStep({
  title,
  subtitle,
  options,
  onSelect,
}: QuestionStepProps) {
  const [selected, setSelected] = useState<string | null>(null);

  function handleSelect(value: string) {
    setSelected(value);
    // Short delay so the user sees the selection highlight before transitioning
    setTimeout(() => {
      onSelect(value);
    }, 300);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12 animate-slide-up">
      {/* Header */}
      <div className="text-center mb-10 max-w-sm">
        <h1 className="text-heading-lg font-bold text-primary-700 mb-3">
          {title}
        </h1>
        <p className="text-body text-text-secondary">{subtitle}</p>
      </div>

      {/* Options */}
      <div className="w-full max-w-sm space-y-3">
        {options.map((option, index) => {
          const isSelected = selected === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              style={{ animationDelay: `${index * 80}ms` }}
              className={`
                opacity-0 animate-stagger-item
                w-full min-h-[56px] rounded-[1rem] p-4 text-left
                border-2 transition-all duration-200
                active:scale-[0.98]
                ${
                  isSelected
                    ? "bg-primary-100 border-primary-500 shadow-md"
                    : "bg-surface-card border-primary-100 hover:border-primary-300 shadow-sm"
                }
              `}
            >
              <p
                className={`text-body font-semibold ${
                  isSelected ? "text-primary-700" : "text-text-primary"
                }`}
              >
                {option.label}
              </p>
              {option.description && (
                <p
                  className={`text-caption mt-1 ${
                    isSelected ? "text-primary-600" : "text-text-secondary"
                  }`}
                >
                  {option.description}
                </p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
