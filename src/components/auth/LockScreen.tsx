"use client";

import { useState, useRef, useEffect } from "react";

interface LockScreenProps {
  onUnlock: () => void;
}

export default function LockScreen({ onUnlock }: LockScreenProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || loading) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("app-unlocked", "true");
        onUnlock();
      } else {
        setShake(true);
        setError("Code incorrect");
        setCode("");
        setTimeout(() => setShake(false), 400);
      }
    } catch {
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-surface flex flex-col items-center justify-center px-6">
      <div className="animate-fade-in w-full max-w-sm flex flex-col items-center gap-8">
        {/* Logo / Title */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-primary-500 flex items-center justify-center mx-auto mb-4 shadow-elevation-3">
            <span className="text-3xl">🇬🇧</span>
          </div>
          <h1 className="text-heading-lg font-bold text-text-primary">
            English avec Marius
          </h1>
          <p className="text-body text-text-secondary">
            Entre le code d&apos;acc&egrave;s pour continuer
          </p>
        </div>

        {/* Code Input */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className={shake ? "animate-shake" : ""}>
            <input
              ref={inputRef}
              type="password"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError("");
              }}
              placeholder="Code d'accès"
              autoComplete="off"
              className="w-full px-4 py-3.5 rounded-[var(--radius-button)] bg-surface-card border-2 border-primary-100
                text-body text-center font-semibold tracking-widest text-text-primary
                placeholder:text-text-muted placeholder:tracking-normal placeholder:font-normal
                focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100
                transition-all duration-200"
            />
          </div>

          {error && (
            <p className="text-center text-caption text-error-500 font-medium animate-fade-in">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={!code.trim() || loading}
            className="w-full py-3.5 rounded-[var(--radius-button)] bg-primary-500 text-white font-bold text-body
              hover:bg-primary-600 active:scale-[0.98]
              disabled:opacity-40 disabled:pointer-events-none
              shadow-elevation-2 transition-all duration-200"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Vérification...
              </span>
            ) : (
              "Entrer"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
