"use client";

import { createContext, useReducer } from "react";

type Message = {
  role: "user" | "assisstant";
  content: string;
};

type ChatHistoryContext = {
  chatHistory: Message[];
  addMessage: (message: Message) => void;
  updateLastMessage: (message: Message) => void;
  clearHistory: () => void;
};

const chatHistoryContext = createContext<ChatHistoryContext>({
  chatHistory: [],
  addMessage: () => {},
  updateLastMessage: () => {},
  clearHistory: () => {},
});

function ChatHistoryProvider({ children }: { children: React.ReactNode }) {
  const [chatHistory, dispatch] = useReducer(
    (
      state: Message[],
      action:
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
          }
    ) => {
      if (action.type === "ADD_MESSAGE") {
        const { content } = action.payload;

        return content ? [...state, action.payload] : state;
      } else if (action.type === "UPDATE_LAST_MESSAGE") {
        const { role, content } = action.payload;

        const lastMessageIndex = state.findLastIndex(
          (message) => message.role === role
        );

        if (lastMessageIndex !== -1) {
          state[lastMessageIndex].content = content;
        }

        return state;
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

  return (
    <chatHistoryContext.Provider
      value={{ chatHistory, addMessage, updateLastMessage, clearHistory }}
    >
      {children}
    </chatHistoryContext.Provider>
  );
}

export { ChatHistoryProvider, chatHistoryContext };
