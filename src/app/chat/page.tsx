"use client";

import AppShell from "@/components/layout/AppShell";
import ChatInterface from "@/components/chat/ChatInterface";

export default function ChatPage() {
  return (
    <AppShell activeTab="chat" title="Marius">
      <ChatInterface />
    </AppShell>
  );
}
