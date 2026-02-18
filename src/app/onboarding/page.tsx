import { Suspense } from "react";
import OnboardingFlow from "@/components/onboarding/OnboardingFlow";

export default function OnboardingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-primary-50 to-surface">
      <Suspense>
        <OnboardingFlow />
      </Suspense>
    </main>
  );
}
