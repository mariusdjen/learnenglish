"use client";

import { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps {
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg";
  onClick?: () => void;
  disabled?: boolean;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  loading?: boolean;
  icon?: ReactNode;
}

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-primary-500 text-white font-semibold hover:bg-primary-600 active:bg-primary-700 shadow-[var(--shadow-elevation-1)] hover:shadow-[var(--shadow-elevation-2)] active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed",
  secondary:
    "bg-primary-50 text-primary-700 font-semibold hover:bg-primary-100 active:bg-primary-200 hover:shadow-[var(--shadow-elevation-1)] active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed",
  ghost:
    "bg-transparent text-primary-500 font-semibold hover:bg-primary-50 active:bg-primary-100 disabled:opacity-50 disabled:cursor-not-allowed",
};

const sizeStyles: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "py-2 px-4 text-sm min-h-[44px]",
  default: "py-3 px-6 text-base min-h-[44px]",
  lg: "py-4 px-8 text-lg min-h-[52px]",
};

export default function Button({
  children,
  className = "",
  variant = "primary",
  size = "default",
  onClick,
  disabled = false,
  type = "button",
  loading = false,
  icon,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`inline-flex items-center justify-center rounded-[0.75rem] transition-all duration-200 ${variantStyles[variant]} ${sizeStyles[size]} ${loading ? "opacity-80 cursor-wait" : ""} ${className}`}
    >
      {loading && (
        <svg
          className="animate-spin mr-2 flex-shrink-0"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <circle
            cx="8"
            cy="8"
            r="6"
            stroke="currentColor"
            strokeOpacity="0.3"
            strokeWidth="2"
          />
          <path
            d="M14 8a6 6 0 0 0-6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      )}
      {!loading && icon && <span className="mr-2 flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
