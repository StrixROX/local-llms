import { useEffect, useState } from "react";
import styles from "./styles.module.css";

function InputArea({ onSend }: { onSend: (message: string) => void }) {
  const MAX_ROWS = 5;

  const [value, setValue] = useState("");
  const [textAreaRows, setTextAreaRows] = useState(1);

  const evaluateRowCount = (value: string) => {
    const newRows = value.split("\n").length;
    setTextAreaRows(Math.min(newRows, MAX_ROWS));
  };

  const updateValue = (value: string) => {
    setValue(value);
    evaluateRowCount(value);
  };

  const onEnter = () => {
    onSend(value);
    updateValue("");
  };

  useEffect(() => {
    evaluateRowCount(value);
  }, [value]);

  return (
    <div className={styles.inputAreaWrapper}>
      <textarea
        className={`no-scrollbar ${styles.inputArea}`}
        placeholder="Type here..."
        autoFocus={true}
        rows={textAreaRows}
        value={value}
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
      ></textarea>
    </div>
  );
}

export default InputArea;
