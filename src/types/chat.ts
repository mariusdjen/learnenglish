export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "correction";
  content: string;
  timestamp: string;
  correction?: {
    original: string;
    corrected: string;
    explanation: string;
  };
}
