"use client";

import { useState, useRef } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const canSend = text.trim().length > 0 && !disabled;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSend) return;
    onSend(text.trim());
    setText("");
    inputRef.current?.focus();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="sticky bottom-0 z-10 flex items-center gap-2 px-4 py-3 bg-surface-card/90 glass border-t border-surface-muted/50"
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <input
        ref={inputRef}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ecris en anglais..."
        disabled={disabled}
        className="flex-1 min-h-[44px] px-4 py-2 text-body bg-surface-muted text-text-primary rounded-pill placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-300 transition-shadow disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={!canSend}
        className="flex items-center justify-center min-h-[44px] min-w-[44px] rounded-full bg-primary-500 text-white transition-all duration-150 hover:bg-primary-600 active:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Envoyer"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m5 12 7-7 7 7" />
          <path d="M12 19V5" />
        </svg>
      </button>
    </form>
  );
}
