"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUserProgressStore } from "@/store/user-progress";
import { useNotebookStore } from "@/store/notebook-store";
import { useChatStore } from "@/store/chat-store";
import type { UserLevel, PreferredTime } from "@/types/progress";
import QuestionStep from "./QuestionStep";
import FirstVictory from "./FirstVictory";
import Button from "@/components/ui/Button";
import { subscribeToPush } from "@/lib/notifications";
import { identifyUser, setUserId, setUserName } from "@/lib/sync";

const LEVEL_OPTIONS = [
  {
    value: "beginner",
    label: "Debutant total",
    description: "Je ne parle pas du tout anglais",
  },
  {
    value: "some_basics",
    label: "Quelques bases",
    description: "Je connais des mots mais j'ai du mal",
  },
  {
    value: "getting_by",
    label: "Je me debrouille",
    description: "Je comprends mais je fais des erreurs",
  },
];

const TIME_OPTIONS = [
  {
    value: "morning",
    label: "Le matin",
    description: "Avant le travail, dans le metro",
  },
  {
    value: "lunch",
    label: "Le midi",
    description: "Pendant la pause dejeuner",
  },
  {
    value: "evening",
    label: "Le soir",
    description: "Apres le travail, au calme",
  },
  {
    value: "anytime",
    label: "N'importe quand",
    description: "Je suis flexible",
  },
];

export default function OnboardingFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const migrate = searchParams.get("migrate") === "true";

  const completeOnboarding = useUserProgressStore(
    (s) => s.completeOnboarding,
  );
  const setNotifications = useUserProgressStore((s) => s.setNotifications);
  const setIdentity = useUserProgressStore((s) => s.setIdentity);
  const hydrateProgress = useUserProgressStore((s) => s.hydrateFromServer);
  const hydrateNotebook = useNotebookStore((s) => s.hydrateFromServer);
  const hydrateChat = useChatStore((s) => s.hydrateFromServer);

  const [currentStep, setCurrentStep] = useState(0);
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [nameLoading, setNameLoading] = useState(false);
  const [level, setLevel] = useState<UserLevel | null>(null);
  const [preferredTime, setPreferredTime] = useState<PreferredTime | null>(
    null,
  );
  const [notificationsChoice, setNotificationsChoice] = useState(false);

  // If migrate mode, show only the name step (step 0)
  // totalSteps changes accordingly
  const totalSteps = migrate ? 1 : 5;

  // Step 0: Name identification
  const handleNameSubmit = useCallback(async () => {
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      setNameError("Entre au moins 2 caracteres");
      return;
    }

    setNameLoading(true);
    setNameError("");

    try {
      const result = await identifyUser(trimmed);

      // Save identity in localStorage
      setUserId(result.userId);
      setUserName(result.name);
      setIdentity(result.userId, result.name);

      if (result.isReturning && result.state) {
        // Returning user — hydrate all stores from server data
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        hydrateProgress(result.state.progress as any);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        hydrateNotebook(result.state.notebook as any);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        hydrateChat(result.state.chat as any);

        // Mark onboarding as complete and redirect
        localStorage.setItem("onboarding-complete", "true");
        router.replace("/home");
        return;
      }

      if (migrate) {
        // Legacy user migrating — just needed the name, data already in stores
        localStorage.setItem("onboarding-complete", "true");
        router.replace("/home");
        return;
      }

      // New user — continue to level step
      setCurrentStep(1);
    } catch (err) {
      setNameError(err instanceof Error ? err.message : "Erreur serveur");
    } finally {
      setNameLoading(false);
    }
  }, [name, migrate, router, setIdentity, hydrateProgress, hydrateNotebook, hydrateChat]);

  // Step 1: Level selection
  const handleLevelSelect = useCallback((value: string) => {
    setLevel(value as UserLevel);
    setCurrentStep(2);
  }, []);

  // Step 2: Preferred time selection
  const handleTimeSelect = useCallback((value: string) => {
    setPreferredTime(value as PreferredTime);
    setCurrentStep(3);
  }, []);

  // Step 3: Notifications confirm
  const handleNotificationsContinue = useCallback(async () => {
    if (notificationsChoice && preferredTime) {
      await subscribeToPush(preferredTime);
    }
    setNotifications(notificationsChoice);
    setCurrentStep(4);
  }, [notificationsChoice, preferredTime, setNotifications]);

  // Step 4: First victory complete
  const handleVictoryComplete = useCallback(() => {
    if (level && preferredTime) {
      completeOnboarding(level, preferredTime);
      localStorage.setItem("onboarding-complete", "true");
      router.push("/home");
    }
  }, [level, preferredTime, completeOnboarding, router]);

  const progressDots = (
    <div className="flex gap-2 justify-center mb-6">
      {Array.from({ length: totalSteps }, (_, i) => {
        let dotClass = "bg-surface-muted";
        if (i === currentStep) dotClass = "bg-primary-500 scale-125";
        else if (i < currentStep) dotClass = "bg-primary-300";
        return (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${dotClass}`}
          />
        );
      })}
    </div>
  );

  // -- Step 0: Name --
  if (currentStep === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12 animate-slide-up">
        {progressDots}
        <div className="text-center mb-10 max-w-sm">
          <h1 className="text-heading-lg font-bold text-primary-700 mb-3">
            Comment tu t&apos;appelles ?
          </h1>
          <p className="text-body text-text-secondary">
            {migrate
              ? "Entre ton prenom pour retrouver tes donnees"
              : "Ton prenom pour personnaliser ton experience"}
          </p>
        </div>

        <div className="w-full max-w-sm space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setNameError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleNameSubmit();
            }}
            placeholder="Ton prenom..."
            autoFocus
            className={`
              w-full rounded-[1rem] p-4 text-body font-semibold
              border-2 transition-all duration-200 outline-none
              bg-surface-card
              ${
                nameError
                  ? "border-red-400 focus:border-red-500"
                  : "border-primary-100 focus:border-primary-500"
              }
            `}
          />
          {nameError && (
            <p className="text-caption text-red-500 text-center">{nameError}</p>
          )}
          <Button
            variant="primary"
            size="lg"
            onClick={handleNameSubmit}
            disabled={nameLoading || name.trim().length < 2}
            className="w-full"
          >
            {nameLoading ? "Chargement..." : "Continuer"}
          </Button>
        </div>
      </div>
    );
  }

  // -- Step 1: Level --
  if (currentStep === 1) {
    return (
      <div>
        {progressDots}
        <QuestionStep
          key="level"
          title="Quel est ton niveau ?"
          subtitle="Pas de jugement, on adapte tout pour toi"
          options={LEVEL_OPTIONS}
          onSelect={handleLevelSelect}
        />
      </div>
    );
  }

  // -- Step 2: Preferred time --
  if (currentStep === 2) {
    return (
      <div>
        {progressDots}
        <QuestionStep
          key="time"
          title="Quand preferes-tu apprendre ?"
          subtitle="3 minutes suffisent, promis"
          options={TIME_OPTIONS}
          onSelect={handleTimeSelect}
        />
      </div>
    );
  }

  // -- Step 3: Notifications --
  if (currentStep === 3) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12 animate-slide-up">
        {progressDots}
        <div className="text-center mb-10 max-w-sm">
          <h1 className="text-heading-lg font-bold text-primary-700 mb-3">
            Rester motive ?
          </h1>
          <p className="text-body text-text-secondary">
            Un petit rappel quotidien pour ne pas oublier ta lecon
          </p>
        </div>

        <div className="w-full max-w-sm space-y-4">
          {/* Notification toggle card */}
          <button
            type="button"
            onClick={() => setNotificationsChoice(true)}
            className={`
              w-full min-h-[56px] rounded-[1rem] p-4 text-left
              border-2 transition-all duration-200
              active:scale-[0.98]
              ${
                notificationsChoice
                  ? "bg-primary-100 border-primary-500 shadow-md"
                  : "bg-surface-card border-primary-100 hover:border-primary-300 shadow-sm"
              }
            `}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  notificationsChoice ? "bg-primary-500" : "bg-surface-muted"
                }`}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M10 2C7.24 2 5 4.24 5 7V11L3 13V14H17V13L15 11V7C15 4.24 12.76 2 10 2ZM10 18C11.1 18 12 17.1 12 16H8C8 17.1 8.9 18 10 18Z"
                    fill={notificationsChoice ? "white" : "#94A3B8"}
                  />
                </svg>
              </div>
              <div>
                <p
                  className={`text-body font-semibold ${
                    notificationsChoice
                      ? "text-primary-700"
                      : "text-text-primary"
                  }`}
                >
                  Oui, rappelle-moi !
                </p>
                <p
                  className={`text-caption ${
                    notificationsChoice
                      ? "text-primary-600"
                      : "text-text-secondary"
                  }`}
                >
                  Une notification par jour, pas plus
                </p>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setNotificationsChoice(false)}
            className={`
              w-full min-h-[56px] rounded-[1rem] p-4 text-left
              border-2 transition-all duration-200
              active:scale-[0.98]
              ${
                !notificationsChoice
                  ? "bg-primary-100 border-primary-500 shadow-md"
                  : "bg-surface-card border-primary-100 hover:border-primary-300 shadow-sm"
              }
            `}
          >
            <p
              className={`text-body font-semibold ${
                !notificationsChoice
                  ? "text-primary-700"
                  : "text-text-primary"
              }`}
            >
              Non merci, pas maintenant
            </p>
          </button>

          <div className="pt-4">
            <Button
              variant="primary"
              size="lg"
              onClick={handleNotificationsContinue}
              className="w-full"
            >
              Continuer
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // -- Step 4: First Victory --
  return (
    <div>
      {progressDots}
      <FirstVictory onComplete={handleVictoryComplete} />
    </div>
  );
}
