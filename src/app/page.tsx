"use client";

import ChatInterface from "./components/ChatInterface";
import { ChatHistoryProvider } from "./hooks/useChatHistory/context";
import { ModelProvider } from "./hooks/useModel/context";

export default function Home() {
  return (
    <ModelProvider>
      <ChatHistoryProvider>
        <ChatInterface />
      </ChatHistoryProvider>
    </ModelProvider>
  );
}
