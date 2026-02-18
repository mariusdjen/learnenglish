"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useCallback, useEffect } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useNotebookStore } from "@/store/notebook-store";
import { HALL_MY_LIFE_PROMPT } from "@/lib/hall-prompts";

interface MyLifeResult {
  vocabulary: { en: string; fr: string; context: string }[];
  phrases: { en: string; fr: string }[];
  conjugations: { verb: string; example: string; explanation: string }[];
}

function MicIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
  );
}

export default function HallMyLife() {
  const [job, setJob] = useState("");
  const [routine, setRoutine] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<MyLifeResult | null>(null);
  const [error, setError] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const { isWordSaved, saveWord } = useNotebookStore();

  useEffect(() => {
    setSpeechSupported(
      typeof window !== "undefined" &&
        ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
    );
  }, []);

  const startListening = useCallback(() => {
    const w = window as any;
    const SpeechRecognitionCtor = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) return;

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = "fr-FR";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setRoutine(transcript);
    };

    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!job.trim() && !routine.trim()) return;
    setIsLoading(true);
    setError("");

    const userMessage = `Mon metier: ${job}\n\nMa routine quotidienne: ${routine}`;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: userMessage }],
          systemPrompt: HALL_MY_LIFE_PROMPT,
          maxTokens: 1024,
        }),
      });

      if (!response.ok) throw new Error("API error");

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let fullText = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });
      }
      fullText += decoder.decode();

      const parsed = JSON.parse(fullText) as MyLifeResult;
      setResult(parsed);
    } catch {
      setError("L'IA n'a pas pu generer le contenu. Reessaye !");
    } finally {
      setIsLoading(false);
    }
  }, [job, routine]);

  const handleSave = (word: { en: string; fr: string }) => {
    saveWord({
      en: word.en,
      fr: word.fr,
      sourceVerbId: "hall",
      sourceDayKey: "my-life",
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-heading font-bold text-text-primary">Ma vie</h2>
        <p className="text-caption text-text-secondary mt-1">
          Decris ton quotidien, l&apos;IA te prepare du vocabulaire personnalise
        </p>
      </div>

      {/* Input form */}
      {!result && (
        <Card>
          <div className="space-y-4">
            <div>
              <label className="block text-caption font-semibold text-text-secondary mb-1.5">
                Ton metier
              </label>
              <input
                type="text"
                value={job}
                onChange={(e) => setJob(e.target.value)}
                placeholder="Ex: developpeur, infirmier, prof..."
                className="w-full min-h-[44px] px-4 py-2.5 text-body bg-surface-muted rounded-[0.75rem] border border-primary-100 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
              />
            </div>

            <div>
              <label className="block text-caption font-semibold text-text-secondary mb-1.5">
                Ta routine quotidienne
              </label>
              <textarea
                value={routine}
                onChange={(e) => setRoutine(e.target.value)}
                placeholder="Decris ta journee type en francais... (Ex: Je me leve a 7h, je prends le metro, j'arrive au bureau...)"
                rows={4}
                className="w-full px-4 py-3 text-body bg-surface-muted rounded-[0.75rem] border border-primary-100 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all resize-none"
              />
            </div>

            {/* Voice input */}
            {speechSupported && (
              <div className="flex items-center gap-2">
                <Button
                  variant={isListening ? "primary" : "secondary"}
                  size="sm"
                  onClick={isListening ? stopListening : startListening}
                  icon={<MicIcon />}
                >
                  {isListening ? "Arreter" : "Dicter"}
                </Button>
                {isListening && (
                  <span className="text-caption text-warm-500 animate-pulse font-medium">
                    Ecoute en cours...
                  </span>
                )}
              </div>
            )}

            {error && (
              <p className="text-caption text-error-500 font-medium">{error}</p>
            )}

            <Button
              variant="primary"
              className="w-full"
              onClick={handleSubmit}
              loading={isLoading}
              disabled={!job.trim() && !routine.trim()}
            >
              Generer mon vocabulaire
            </Button>
          </div>
        </Card>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4 animate-fade-in">
          {/* Vocabulary */}
          {result.vocabulary.length > 0 && (
            <Card>
              <h3 className="text-body font-bold text-text-primary mb-3">
                Ton vocabulaire
              </h3>
              <ul className="space-y-0">
                {result.vocabulary.map((word) => {
                  const saved = isWordSaved(word.en);
                  return (
                    <li
                      key={word.en}
                      className="flex items-center justify-between py-2.5 border-b border-primary-50 last:border-b-0"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-body font-semibold text-text-primary">
                          {word.en}
                        </p>
                        <p className="text-caption text-text-secondary">{word.fr}</p>
                        <p className="text-caption text-text-muted italic mt-0.5">
                          {word.context}
                        </p>
                      </div>
                      {saved ? (
                        <div className="flex-shrink-0 ml-3 flex items-center justify-center w-10 h-10">
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M4 10.5l4.5 4.5L16 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-500" />
                          </svg>
                        </div>
                      ) : (
                        <div className="flex-shrink-0 ml-3">
                          <Button variant="ghost" size="sm" onClick={() => handleSave(word)} className="w-10 h-10 !p-0 !min-h-0">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                              <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                          </Button>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </Card>
          )}

          {/* Phrases */}
          {result.phrases.length > 0 && (
            <Card>
              <h3 className="text-body font-bold text-text-primary mb-3">
                Tes phrases cles
              </h3>
              <ul className="space-y-0">
                {result.phrases.map((phrase) => {
                  const saved = isWordSaved(phrase.en);
                  return (
                    <li
                      key={phrase.en}
                      className="flex items-center justify-between py-3 border-b border-primary-50 last:border-b-0"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-body font-semibold text-primary-700">
                          {phrase.fr}
                        </p>
                        <p className="text-caption text-text-secondary mt-0.5">
                          {phrase.en}
                        </p>
                      </div>
                      {saved ? (
                        <div className="flex-shrink-0 ml-3 flex items-center justify-center w-10 h-10">
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M4 10.5l4.5 4.5L16 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-500" />
                          </svg>
                        </div>
                      ) : (
                        <div className="flex-shrink-0 ml-3">
                          <Button variant="ghost" size="sm" onClick={() => handleSave(phrase)} className="w-10 h-10 !p-0 !min-h-0">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                              <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                          </Button>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </Card>
          )}

          {/* Conjugations */}
          {result.conjugations.length > 0 && (
            <Card>
              <h3 className="text-body font-bold text-text-primary mb-3">
                Conjugaisons utiles
              </h3>
              <ul className="space-y-3">
                {result.conjugations.map((conj) => (
                  <li key={conj.verb} className="border-b border-primary-50 last:border-b-0 pb-3 last:pb-0">
                    <p className="text-body font-bold text-primary-600">{conj.verb}</p>
                    <p className="text-body text-text-primary mt-0.5">{conj.example}</p>
                    <p className="text-caption text-text-secondary mt-0.5">
                      {conj.explanation}
                    </p>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Reset */}
          <Button
            variant="ghost"
            onClick={() => setResult(null)}
            className="w-full"
          >
            Recommencer
          </Button>
        </div>
      )}
    </div>
  );
}
