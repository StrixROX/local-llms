"use client";

import { useContext } from "react";
import { chatHistoryContext } from "./context";

function useChatHistory() {
  const context = useContext(chatHistoryContext);
  return context;
}

export default useChatHistory;
