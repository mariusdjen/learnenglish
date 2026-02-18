"use client";

import { useUserProgressStore } from "@/store/user-progress";

export function useUserProgress() {
  return useUserProgressStore();
}
