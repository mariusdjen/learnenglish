"use client";

import { useEffect, useRef, useCallback } from "react";
import { useChatStore } from "@/store/chat-store";
import { useNotebookStore } from "@/store/notebook-store";
import { useCurrentLesson } from "@/hooks/useCurrentLesson";
import { useUserProgressStore } from "@/store/user-progress";
import {
  buildSystemPrompt,
  buildDayPrompt,
  SUGGESTED_PROMPTS,
} from "@/lib/chat-prompts";
import MessageBubble from "@/components/chat/MessageBubble";
import ChatInput from "@/components/chat/ChatInput";
import SuggestedPrompts from "@/components/chat/SuggestedPrompts";

function TypingIndicator() {
  return (
    <div className="flex justify-start mb-3">
      <div className="bg-surface-card rounded-[1rem] rounded-bl-sm px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full bg-text-muted animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <span
            className="w-2 h-2 rounded-full bg-text-muted animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <span
            className="w-2 h-2 rounded-full bg-text-muted animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Parse an API response that may begin with a fenced JSON correction block.
 *
 * Expected format when a correction is present:
 *   ```json
 *   {"correction":{"original":"...","corrected":"...","explanation":"..."}}
 *   ```
 *   <remaining assistant text>
 *
 * Also supports a bare (un-fenced) JSON line for robustness:
 *   {"correction":{"original":"...","corrected":"...","explanation":"..."}}
 *   <remaining assistant text>
 */
function parseResponse(text: string): {
  correction: {
    original: string;
    corrected: string;
    explanation: string;
  } | null;
  reply: string;
} {
  const trimmed = text.trim();

  // Try fenced code block first: ```json\n{...}\n```
  const fencedPattern =
    /^```json\s*\n\s*(\{"correction"\s*:\s*\{.*?\}\s*\})\s*\n\s*```\s*\n?([\s\S]*)$/;
  const fencedMatch = trimmed.match(fencedPattern);
  if (fencedMatch) {
    try {
      const parsed = JSON.parse(fencedMatch[1]);
      if (parsed.correction) {
        return {
          correction: parsed.correction,
          reply: fencedMatch[2].trim(),
        };
      }
    } catch {
      // JSON parse failed, fall through
    }
  }

  // Try bare JSON line: {"correction":...}\n<rest>
  if (trimmed.startsWith('{"correction"')) {
    const firstNewline = trimmed.indexOf("\n");
    if (firstNewline !== -1) {
      const jsonLine = trimmed.slice(0, firstNewline).trim();
      const rest = trimmed.slice(firstNewline).trim();
      try {
        const parsed = JSON.parse(jsonLine);
        if (parsed.correction) {
          return {
            correction: parsed.correction,
            reply: rest,
          };
        }
      } catch {
        // JSON parse failed, fall through
      }
    }
  }

  // No correction found
  return { correction: null, reply: trimmed };
}

export default function ChatInterface() {
  const { messages, isLoading, addMessage, setLoading } = useChatStore();
  const addCorrection = useNotebookStore((s) => s.addCorrection);
  const { verb, tense } = useCurrentLesson();
  const level = useUserProgressStore((s) => s.level);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages or loading change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isLoading]);

  const handleSend = useCallback(
    async (text: string) => {
      // Add the user message to the store
      addMessage("user", text);
      setLoading(true);

      // Determine if this is a "my day" prompt
      const isDayPrompt =
        text.toLowerCase().includes("describe my day") ||
        text.toLowerCase().includes("ma journee");

      // Build the system prompt
      const verbName = verb?.name_en ?? "be";
      const tenseName = tense?.name_simple ?? "Present Simple";
      const systemPrompt = isDayPrompt
        ? buildDayPrompt(verbName)
        : buildSystemPrompt(verbName, tenseName, level);

      // Build the messages payload for the API
      const apiMessages = [
        ...messages.map((m) => ({
          role: m.role === "correction" ? ("assistant" as const) : m.role,
          content: m.content,
        })),
        { role: "user" as const, content: text },
      ];

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: apiMessages,
            systemPrompt,
          }),
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        // Handle streaming response
        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error("No response body");
        }

        const decoder = new TextDecoder();
        let fullText = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          fullText += decoder.decode(value, { stream: true });
        }

        // Flush decoder
        fullText += decoder.decode();

        // Parse the response for corrections
        const { correction, reply } = parseResponse(fullText);

        if (correction) {
          // Add correction message to chat
          addMessage("correction", correction.original, correction);

          // Also save to notebook store
          addCorrection({
            original: correction.original,
            corrected: correction.corrected,
            explanation: correction.explanation,
            verbRelated: verbName,
          });
        }

        // Add the assistant reply
        if (reply) {
          addMessage("assistant", reply);
        }
      } catch (error) {
        console.error("Chat error:", error);
        addMessage(
          "assistant",
          "Oops, something went wrong! Let\u2019s try again. What were you saying?",
        );
      } finally {
        setLoading(false);
      }
    },
    [messages, addMessage, setLoading, addCorrection, verb, tense, level],
  );

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-4 pt-4 pb-2"
      >
        {/* Empty state: welcome + suggested prompts */}
        {!hasMessages && (
          <div className="flex flex-col items-center justify-center py-12">
            {/* Avatar */}
            <div
              className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mb-4 opacity-0 animate-stagger-item"
              style={{ animationDelay: '0ms' }}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary-500"
              >
                <path d="M12 8V4H8" />
                <rect width="16" height="12" x="4" y="8" rx="2" />
                <path d="m2 14 2-2-2-2" />
                <path d="m22 14-2-2 2-2" />
                <path d="M9 13v2" />
                <path d="M15 13v2" />
              </svg>
            </div>
            <h2
              className="text-heading font-bold text-text-primary mb-1 opacity-0 animate-stagger-item"
              style={{ animationDelay: '80ms' }}
            >
              Salut ! Je suis Marius
            </h2>
            <p
              className="text-body text-text-secondary text-center max-w-xs mb-6 opacity-0 animate-stagger-item"
              style={{ animationDelay: '160ms' }}
            >
              Ton ami pour pratiquer l&apos;anglais. Ecris-moi en anglais, je
              t&apos;aide si tu fais des erreurs !
            </p>

            <div
              className="opacity-0 animate-stagger-item"
              style={{ animationDelay: '240ms' }}
            >
              <SuggestedPrompts
                prompts={SUGGESTED_PROMPTS}
                onSelect={handleSend}
                verbName={verb?.name_en}
              />
            </div>
          </div>
        )}

        {/* Message list */}
        {hasMessages && (
          <div className="space-y-1">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </div>
        )}

        {/* Typing indicator */}
        {isLoading && <TypingIndicator />}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested prompts shown above input when there are messages */}
      {hasMessages && !isLoading && messages.length < 4 && (
        <SuggestedPrompts
          prompts={SUGGESTED_PROMPTS.slice(0, 3)}
          onSelect={handleSend}
          verbName={verb?.name_en}
        />
      )}

      {/* Chat input */}
      <ChatInput onSend={handleSend} disabled={isLoading} />
    </div>
  );
}
