"use client";

import { generateResponse } from "@/lib/ollama";
import { createContext, useEffect, useReducer } from "react";

export type Message = {
  role: "user" | "assistant";
  content: string;
  thinking?: string;
};

type ChatHistoryContext = {
  chatHistory: Message[];
  addMessage: (message: Message) => void;
  updateLastMessage: (message: Message) => void;
  clearHistory: () => void;
};

type ReducerType =
  | {
      type: "ADD_MESSAGE";
      payload: Message;
    }
  | {
      type: "UPDATE_LAST_MESSAGE";
      payload: Message;
    }
  | {
      type: "CLEAR_HISTORY";
    };

const chatHistoryContext = createContext<ChatHistoryContext>({
  chatHistory: [],
  addMessage: () => {},
  updateLastMessage: () => {},
  clearHistory: () => {},
});

function ChatHistoryProvider({ children }: { children: React.ReactNode }) {
  const [chatHistory, dispatch] = useReducer(
    (state: Message[], action: ReducerType) => {
      if (action.type === "ADD_MESSAGE") {
        const { content } = action.payload;

        return content ? [...state, action.payload] : state;
      } else if (action.type === "UPDATE_LAST_MESSAGE") {
        const { role, content } = action.payload;

        const lastMessageIndex = state.findLastIndex(
          (message) => message.role === role
        );

        if (lastMessageIndex === state.length - 1) {
          return state.map((message, index) =>
            index === lastMessageIndex
              ? { ...message, content: message.content + content }
              : message
          );
        } else {
          return [...state, action.payload];
        }
      } else if (action.type === "CLEAR_HISTORY") {
        return [];
      } else {
        return state;
      }
    },
    []
  );

  const addMessage = (message: Message) =>
    dispatch({ type: "ADD_MESSAGE", payload: message });

  const updateLastMessage = (message: Message) =>
    dispatch({ type: "UPDATE_LAST_MESSAGE", payload: message });

  const clearHistory = () => dispatch({ type: "CLEAR_HISTORY" });

  useEffect(() => {
    if (chatHistory.length === 0) return;

    async function streamResponse() {
      if (chatHistory.length === 0) return;

      for await (const message of generateResponse(chatHistory)) {
        updateLastMessage(message);
      }
    }

    if (chatHistory[chatHistory.length - 1].role === "user") streamResponse();
  }, [chatHistory]);

  return (
    <chatHistoryContext.Provider
      value={{ chatHistory, addMessage, updateLastMessage, clearHistory }}
    >
      {children}
    </chatHistoryContext.Provider>
  );
}

export { ChatHistoryProvider, chatHistoryContext };
