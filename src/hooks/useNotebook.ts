"use client";

import { useNotebookStore } from "@/store/notebook-store";

export function useNotebook() {
  return useNotebookStore();
}
