import useChatHistory from "@/app/hooks/useChatHistory";
import Markdown from "react-markdown";

import styles from "./styles.module.css";
import { useEffect } from "react";

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
        <div
          className={`${styles.message} ${styles[message.role]} ${
            message.thinking ? styles.thinking : ""
          }`}
          key={index}
        >
          <Markdown>{message.content}</Markdown>
        </div>
      ))}
    </div>
  );
}

export default ChatHistory;
