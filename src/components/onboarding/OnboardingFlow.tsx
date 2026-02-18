"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUserProgressStore } from "@/store/user-progress";
import type { UserLevel, PreferredTime } from "@/types/progress";
import QuestionStep from "./QuestionStep";
import FirstVictory from "./FirstVictory";
import Button from "@/components/ui/Button";
import { requestNotificationPermission } from "@/lib/notifications";

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
  const completeOnboarding = useUserProgressStore(
    (s) => s.completeOnboarding,
  );
  const setNotifications = useUserProgressStore((s) => s.setNotifications);

  const [currentStep, setCurrentStep] = useState(0);
  const [level, setLevel] = useState<UserLevel | null>(null);
  const [preferredTime, setPreferredTime] = useState<PreferredTime | null>(
    null,
  );
  const [notificationsChoice, setNotificationsChoice] = useState(false);

  // Step 0: Level selection
  const handleLevelSelect = useCallback((value: string) => {
    setLevel(value as UserLevel);
    setCurrentStep(1);
  }, []);

  // Step 1: Preferred time selection
  const handleTimeSelect = useCallback((value: string) => {
    setPreferredTime(value as PreferredTime);
    setCurrentStep(2);
  }, []);

  // Step 2: Notifications confirm
  const handleNotificationsContinue = useCallback(async () => {
    if (notificationsChoice) {
      await requestNotificationPermission();
      if (preferredTime) {
        localStorage.setItem('notification-preferred-time', preferredTime);
      }
    }
    setNotifications(notificationsChoice);
    setCurrentStep(3);
  }, [notificationsChoice, preferredTime, setNotifications]);

  // Step 3: First victory complete
  const handleVictoryComplete = useCallback(() => {
    if (level && preferredTime) {
      completeOnboarding(level, preferredTime);
      localStorage.setItem("onboarding-complete", "true");
      router.push("/home");
    }
  }, [level, preferredTime, completeOnboarding, router]);

  const totalSteps = 4;

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

  // -- Step 0: Level --
  if (currentStep === 0) {
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

  // -- Step 1: Preferred time --
  if (currentStep === 1) {
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

  // -- Step 2: Notifications --
  if (currentStep === 2) {
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

  // -- Step 3: First Victory --
  return (
    <div>
      {progressDots}
      <FirstVictory onComplete={handleVictoryComplete} />
    </div>
  );
}
