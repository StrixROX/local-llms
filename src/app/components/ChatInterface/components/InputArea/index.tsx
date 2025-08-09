import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import useModel from "@/app/hooks/useModel";

const MAX_ROWS = 5;

function InputArea({ onSend }: { onSend: (message: string) => void }) {
  const { selectedModels } = useModel();
  const [value, setValue] = useState("");
  const [textAreaRows, setTextAreaRows] = useState(1);

  const selectedModel = selectedModels["text-generation"];

  const isModelActive = selectedModel?.status === "ONLINE";

  const evaluateRowCount = (value: string) => {
    const newRows = value.split("\n").length;
    setTextAreaRows(Math.min(newRows, MAX_ROWS));
  };

  const updateValue = (value: string) => {
    setValue(value);
    evaluateRowCount(value);
  };

  const onEnter = () => {
    if (!isModelActive) return;

    onSend(value.trim());
    updateValue("");
  };

  useEffect(() => {
    evaluateRowCount(value);
  }, [value]);

  return (
    <div
      className={[
        styles.inputAreaWrapper,
        !isModelActive ? styles.disabled : "",
      ].join(" ")}
      title={isModelActive ? "" : "Text model is offline"}
    >
      <textarea
        className={["no-scrollbar", styles.inputArea].join(" ")}
        placeholder={isModelActive ? "Type here..." : "Text model is offline"}
        autoFocus={true}
        rows={textAreaRows}
        value={isModelActive ? value : ""}
        onInput={(e) => updateValue(e.currentTarget.value)}
        onKeyDown={(e) => {
          const target = e.target as HTMLTextAreaElement;
          if (!target || target.value.trim() === "") return;

          if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.altKey) {
            e.preventDefault();
            onEnter();
          }
        }}
        style={{ lineHeight: "1rem", whiteSpace: "normal" }}
        disabled={!isModelActive}
      ></textarea>
    </div>
  );
}

export default InputArea;
