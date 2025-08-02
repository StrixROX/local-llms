import { Message } from "@/app/hooks/useChatHistory/context";
import styles from "../../styles.module.css";
import Markdown from "react-markdown";
import useChatHistory from "@/app/hooks/useChatHistory";
import { useEffect, useState } from "react";

function ChatBubble({
  message,
  isLastMessageOfRole,
}: {
  message: Message;
  isLastMessageOfRole: boolean;
}) {
  const { isLoading, error } = useChatHistory();

  const isThinking =
    isLastMessageOfRole &&
    message?.role !== "user" &&
    isLoading &&
    message?.thinking &&
    !message?.content;

  const [thinkingMessage, setThinkingMessage] = useState<string>("Thinking");

  useEffect(() => {
    if (isThinking) {
      const interval = setInterval(() => {
        setThinkingMessage((prev) =>
          prev === "Thinking..." ? "Thinking" : prev + "."
        );
      }, 500);

      return () => clearInterval(interval);
    }
  }, [isThinking]);

  if (error) {
    return (
      <div>
        <div className={`${styles.message} ${styles.error}`}>
          <Markdown>
            {"An error occurred while fetching response.\n```plain\n" +
              error +
              "\n```"}
          </Markdown>
        </div>
      </div>
    );
  }

  return (
    <div>
      {isThinking && (
        <div className={`${styles.message} ${styles.thinking}`}>
          <Markdown>{`_${thinkingMessage}_`}</Markdown>
        </div>
      )}

      {message.thinking && (
        <div
          className={`${styles.message} ${styles[message.role]} ${
            styles.thinking
          }`}
        >
          <Markdown>{message.thinking}</Markdown>
        </div>
      )}

      <div className={`${styles.message} ${styles[message.role]}`}>
        <Markdown>{message.content}</Markdown>
      </div>
    </div>
  );
}

export default ChatBubble;
