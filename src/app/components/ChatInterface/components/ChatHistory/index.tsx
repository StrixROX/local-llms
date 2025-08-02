import useChatHistory from "@/app/hooks/useChatHistory";
import Markdown from "react-markdown";

import styles from "./styles.module.css";
import { useEffect } from "react";
import ChatBubble from "./components/ChatBubble";

function ChatHistory() {
  const { chatHistory } = useChatHistory();

  const scrollToBottom = () => {
    const chatHistoryWrapper = document.getElementById("chat-history-wrapper");

    if (!chatHistoryWrapper) return;

    chatHistoryWrapper.scrollTop = chatHistoryWrapper.scrollHeight;
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  return (
    <div
      id="chat-history-wrapper"
      className={`no-scrollbar ${styles.chatHistory}`}
    >
      {chatHistory.map((message, index) => (
        <ChatBubble
          key={index}
          message={message}
          isLastMessageOfRole={
            index ===
            chatHistory.findLastIndex(
              (_message) => _message.role === message.role
            )
          }
        />
      ))}
    </div>
  );
}

export default ChatHistory;
