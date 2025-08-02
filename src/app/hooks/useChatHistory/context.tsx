"use client";

import { generateResponse } from "@/lib/ollama";
import { createContext, useEffect, useReducer, useState } from "react";
import useModel from "../useModel";

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
  isLoading: boolean;
  error: Error | null;
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
  isLoading: false,
  error: null,
});

function ChatHistoryProvider({ children }: { children: React.ReactNode }) {
  const {
    selectedModel,
    modelOptions: { think },
  } = useModel();

  const [chatHistory, dispatch] = useReducer(
    (state: Message[], action: ReducerType) => {
      if (action.type === "ADD_MESSAGE") {
        const { content } = action.payload;

        return content ? [...state, action.payload] : state;
      } else if (action.type === "UPDATE_LAST_MESSAGE") {
        const { role, content, thinking } = action.payload;

        const lastMessageIndex = state.findLastIndex(
          (message) => message.role === role
        );

        if (lastMessageIndex === state.length - 1) {
          return state.map((message, index) => {
            if (index !== lastMessageIndex) return message;

            const newMessage = {
              ...message,
              content: message.content + content,
            };

            if (thinking) {
              newMessage.thinking = message.thinking + thinking;
            }

            return newMessage;
          });
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const addMessage = (message: Message) =>
    dispatch({ type: "ADD_MESSAGE", payload: message });

  const updateLastMessage = (message: Message) =>
    dispatch({ type: "UPDATE_LAST_MESSAGE", payload: message });

  const clearHistory = () => dispatch({ type: "CLEAR_HISTORY" });

  const fetchResponse = async () => {
    if (chatHistory.length === 0 || !selectedModel) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await generateResponse(
        selectedModel.name,
        chatHistory,
        think
      );

      for await (const message of response) {
        updateLastMessage(message);
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (chatHistory.length === 0) return;

    if (chatHistory[chatHistory.length - 1].role === "user") fetchResponse();
  }, [chatHistory, selectedModel]);

  return (
    <chatHistoryContext.Provider
      value={{
        chatHistory,
        addMessage,
        updateLastMessage,
        clearHistory,
        isLoading,
        error,
      }}
    >
      {children}
    </chatHistoryContext.Provider>
  );
}

export { ChatHistoryProvider, chatHistoryContext };
