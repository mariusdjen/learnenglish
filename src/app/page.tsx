"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const onboardingDone = localStorage.getItem("onboarding-complete");
    if (onboardingDone === "true") {
      router.replace("/home");
    } else {
      router.replace("/onboarding");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="animate-pulse text-primary-500 text-heading font-bold">
        English avec Marius
      </div>
    </div>
  );
}
