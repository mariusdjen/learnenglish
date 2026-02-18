"use client";

import type { ChatMessage } from "@/types/chat";
import CorrectionBubble from "@/components/chat/CorrectionBubble";

interface MessageBubbleProps {
  message: ChatMessage;
}

function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const isCorrection = message.role === "correction";

  if (isCorrection && message.correction) {
    return (
      <div className="animate-slide-up flex justify-start mb-3">
        <div className="max-w-[85%]">
          <CorrectionBubble correction={message.correction} />
          <p className="text-caption text-text-muted mt-1 ml-3">
            {formatTime(message.timestamp)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`animate-slide-up flex mb-3 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div className={`max-w-[85%] ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`px-4 py-3 text-body leading-relaxed shadow-[var(--shadow-elevation-1)] ${
            isUser
              ? "bg-primary-500 text-white rounded-[1rem] rounded-br-sm"
              : "bg-surface-card text-text-primary rounded-[1rem] rounded-bl-sm border-l-2 border-primary-100"
          }`}
        >
          {message.content}
        </div>
        <p
          className={`text-caption text-text-muted mt-1 ${
            isUser ? "text-right mr-2" : "text-left ml-3"
          }`}
        >
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
}
