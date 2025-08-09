import useChatHistory from "@/app/hooks/useChatHistory";
import Markdown from "react-markdown";

import styles from "./styles.module.css";
import { useEffect } from "react";
import ChatBubble from "./components/ChatBubble";
import WaitingText from "./components/WaitingText";

function ChatHistory() {
  const { chatHistory, isLoading, error } = useChatHistory();

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

      {isLoading && <WaitingText text="Loading" />}

      {error && (
        <div>
          <div className={`${styles.message} ${styles.error}`}>
            <Markdown>
              {"An error occurred while fetching response.\n```plain\n" +
                error +
                "\n```"}
            </Markdown>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatHistory;
