import { Message } from "@/app/hooks/useChatHistory/context";
import styles from "../../styles.module.css";
import Markdown from "react-markdown";
import useChatHistory from "@/app/hooks/useChatHistory";
import { useEffect, useState } from "react";
import WaitingText from "../WaitingText";

function ChatBubble({
  message,
  isLastMessageOfRole,
}: {
  message: Message;
  isLastMessageOfRole: boolean;
}) {
  const { isLoading } = useChatHistory();

  const isThinking =
    isLastMessageOfRole &&
    message?.role !== "user" &&
    isLoading &&
    message?.thinking &&
    !message?.content;

  const processImageData = (imageData: object) => {
    const buffer = new Uint8Array(Object.values(imageData)).buffer;
    const blob = new Blob([buffer], { type: "image/png" });
    const blobUrl = URL.createObjectURL(blob);

    return blobUrl;
  };

  return (
    <div>
      {isThinking && <WaitingText text="Thinking" />}

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
        {message.content && <Markdown>{message.content}</Markdown>}
        {message.images &&
          message.images.map((imageData, index) => (
            <img
              className={styles.image}
              src={processImageData(imageData)}
              key={index}
            />
          ))}
      </div>
    </div>
  );
}

export default ChatBubble;
