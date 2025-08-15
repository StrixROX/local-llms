"use client";

import { useState } from "react";
import useChatHistory from "../../hooks/useChatHistory";
import ModelSelectorDialog from "./components/ModelSelectorDialog";

import styles from "./styles.module.css";
import ChatHistory from "./components/ChatHistory";
import InputArea from "./components/InputArea";
import Toolbar from "./components/Toolbar";
import Header from "./components/Header";
import ModelCreatorDialog from "./components/ModelCreatorDialog";

function ChatInterface() {
  const { addMessage } = useChatHistory();

  const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false);
  const [isModelCreatorOpen, setIsModelCreatorOpen] = useState(false);

  return (
    <div className={styles.wrapper}>
      <ModelSelectorDialog
        open={isModelSelectorOpen}
        onClose={() => setIsModelSelectorOpen(false)}
        key={"model-selector" + (isModelSelectorOpen ? "open" : "closed")}
      />

      <ModelCreatorDialog
        open={isModelCreatorOpen}
        onClose={() => setIsModelCreatorOpen(false)}
        key={"model-creator" + (isModelCreatorOpen ? "open" : "closed")}
      />

      <Header
        onRequestModelChange={() => setIsModelSelectorOpen(true)}
        onRequestModelCreate={() => setIsModelCreatorOpen(true)}
      />

      <ChatHistory />

      <Toolbar />

      <InputArea
        onSend={(value) => addMessage({ role: "user", content: value })}
      />
    </div>
  );
}

export default ChatInterface;
