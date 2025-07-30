"use client";

import { useState } from "react";
import useChatHistory from "../../hooks/useChatHistory";
import ModelSelectorDialog from "./components/ModelSelectorDialog";
import useModel from "@/app/hooks/useModel";

import styles from "./styles.module.css";
import ChatHistory from "./components/ChatHistory";

function ChatInterface() {
  const { selectedModel } = useModel();
  const { addMessage } = useChatHistory();

  const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false);

  const onUserInput = function (target: HTMLTextAreaElement) {
    const maxRows = parseInt(target.dataset.maxRows ?? "", 10);
    target.rows = 1; // Reset to the initial rows to recalculate height
    const lineHeight = parseInt(window.getComputedStyle(target).lineHeight, 10);
    const scrollHeight = target.scrollHeight;
    const yPadding =
      parseInt(window.getComputedStyle(target).paddingTop.slice(0, -2), 10) +
      parseInt(window.getComputedStyle(target).paddingBottom.slice(0, -2), 10);

    const newRows = Math.min(
      Math.floor((scrollHeight - yPadding) / lineHeight),
      maxRows
    );
    console.log(newRows, scrollHeight, yPadding, lineHeight);
    target.rows = newRows;
  };

  return (
    <div>
      <ModelSelectorDialog
        open={isModelSelectorOpen}
        onClose={() => setIsModelSelectorOpen(false)}
      />

      <div className={styles.wrapper}>
        <h1
          className={styles.modelName}
          onClick={() => setIsModelSelectorOpen(true)}
        >
          &gt; {selectedModel?.displayName}
        </h1>

        <ChatHistory />

        <div id="user-input-wrapper">
          <textarea
            id="user-input"
            className="no-scrollbar"
            placeholder="Type here..."
            autoFocus={true}
            rows={1}
            data-max-rows="5"
            onInput={(e) => onUserInput(e.currentTarget)}
            onKeyDown={(e) => {
              const target = e.target as HTMLTextAreaElement;
              if (!target || target.value.trim() === "") return;

              if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.altKey) {
                addMessage({ role: "user", content: target.value });
                target.value = "";
              }
            }}
            style={{ lineHeight: "1rem", whiteSpace: "normal" }}
          ></textarea>
        </div>
      </div>
    </div>
  );
}

export default ChatInterface;
