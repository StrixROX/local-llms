"use client";

import { useState } from "react";
import useChatHistory from "../../hooks/useChatHistory";
import ModelSelectorDialog from "./components/ModelSelectorDialog";
import useModel from "@/app/hooks/useModel";

import styles from "./styles.module.css";
import ChatHistory from "./components/ChatHistory";
import InputArea from "./components/InputArea";
import Toolbar from "./components/Toolbar";

function ChatInterface() {
  const { selectedModel } = useModel();
  const { addMessage } = useChatHistory();

  const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false);

  return (
    <div className={styles.wrapper}>
      <ModelSelectorDialog
        open={isModelSelectorOpen}
        onClose={() => setIsModelSelectorOpen(false)}
      />

      <h1
        className={styles.modelName}
        onClick={() => setIsModelSelectorOpen(true)}
      >
        &gt; {selectedModel?.displayName}
      </h1>

      <ChatHistory />

      <Toolbar />

      <InputArea
        onSend={(value) => addMessage({ role: "user", content: value })}
      />
    </div>
  );
}

export default ChatInterface;
