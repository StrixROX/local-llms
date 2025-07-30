import useChatHistory from "@/app/hooks/useChatHistory";
import Markdown from "react-markdown";

import styles from "./styles.module.css";

function ChatHistory() {
  const { chatHistory } = useChatHistory();

  return (
    <div className={`no-scrollbar ${styles.chatHistory}`}>
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
