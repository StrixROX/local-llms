import useModel from "@/app/hooks/useModel";
import styles from "./styles.module.css";

function Toolbar() {
  const { modelOptions, setModelOptions } = useModel();

  const toggleThinkingMode = () => {
    setModelOptions({ ...modelOptions, think: !modelOptions.think });
  };

  return (
    <div className={styles.toolbar}>
      <div className={styles.option}>
        <input
          type="checkbox"
          name="thinking-mode"
          id="option__thinkingMode"
          checked={modelOptions.think}
          onChange={toggleThinkingMode}
        />
        <label htmlFor="option__thinkingMode">💡Think</label>
      </div>
    </div>
  );
}

export default Toolbar;
