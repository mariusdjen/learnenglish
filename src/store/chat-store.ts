import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ChatMessage } from "@/types/chat";

interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
}

interface ChatActions {
  addMessage: (
    role: ChatMessage["role"],
    content: string,
    correction?: ChatMessage["correction"],
  ) => void;
  setLoading: (loading: boolean) => void;
  clearMessages: () => void;
}

type ChatStore = ChatState & ChatActions;

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      messages: [],
      isLoading: false,

      addMessage: (
        role: ChatMessage["role"],
        content: string,
        correction?: ChatMessage["correction"],
      ) => {
        const newMessage: ChatMessage = {
          id: crypto.randomUUID(),
          role,
          content,
          timestamp: new Date().toISOString(),
          ...(correction && { correction }),
        };

        set((state) => ({
          messages: [...state.messages, newMessage],
        }));
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      clearMessages: () => {
        set({ messages: [], isLoading: false });
      },
    }),
    {
      name: "english-chat",
    },
  ),
);
