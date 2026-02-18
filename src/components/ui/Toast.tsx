"use client";

import { ReactNode } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  visible: boolean;
  duration?: number;
}

const typeStyles: Record<NonNullable<ToastProps["type"]>, string> = {
  success: "bg-accent-500 text-white",
  error: "bg-error-500 text-white",
  info: "bg-primary-500 text-white",
};

const typeIcons: Record<NonNullable<ToastProps["type"]>, ReactNode> = {
  success: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 8.5l2 2 4-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  error: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8.66 1.5a.76.76 0 0 0-1.32 0L1.18 13a.75.75 0 0 0 .66 1.1h12.32a.75.75 0 0 0 .66-1.1L8.66 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M8 6v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="11.5" r="0.75" fill="currentColor" />
    </svg>
  ),
  info: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 7v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="5" r="0.75" fill="currentColor" />
    </svg>
  ),
};

export default function Toast({
  message,
  type = "info",
  visible,
  duration = 3000,
}: ToastProps) {
  return (
    <div
      role="alert"
      aria-live="polite"
      className={`fixed bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-[100] flex flex-col rounded-[0.75rem] shadow-[var(--shadow-elevation-3)] transition-all duration-300 overflow-hidden ${typeStyles[type]} ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Icon */}
        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
          {typeIcons[type]}
        </span>

        {/* Message */}
        <p className="text-sm font-medium flex-1">{message}</p>
      </div>

      {/* Auto-dismiss progress bar */}
      {visible && (
        <div
          key={Date.now()}
          className="h-0.5 bg-white/30 origin-left"
          style={{
            animation: `toast-shrink ${duration}ms linear forwards`,
          }}
        />
      )}
    </div>
  );
}
