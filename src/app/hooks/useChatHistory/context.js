import { createContext, useReducer } from "react";

const chatHistoryContext = createContext({
  chatHistory: [],
  addMessage: () => {},
  updateLastMessage: () => {},
  clearHistory: () => {},
});

function ChatHistoryProvider({ children }) {
  const [chatHistory, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "ADD_MESSAGE":
        return [...state, action.payload];
      case "UPDATE_LAST_MESSAGE":
        const role = action.payload.role;
        const lastMessageIndex = state.findLastIndex(
          (message) => message.role === role
        );

        if (lastMessageIndex === -1) return state;

        state[lastMessageIndex].content = action.payload;

        return state;
      case "CLEAR_HISTORY":
        return [];
      default:
        return state;
    }
  }, []);

  const addMessage = (message) =>
    dispatch({ type: "ADD_MESSAGE", payload: message });

  const updateLastMessage = (message) =>
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
