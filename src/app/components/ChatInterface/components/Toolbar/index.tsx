import useModel from "@/app/hooks/useModel";
import styles from "./styles.module.css";

function Toolbar() {
  const { modelOptions, setModelOptions } = useModel();

  const toggleThinkingMode = () => {
    setModelOptions({ ...modelOptions, think: !modelOptions.think });
  };

  return (
    <div className={styles.toolbar}>
      <div
        className={[
          styles.option,
          modelOptions.think ? styles.checked : "",
        ].join(" ")}
        onClick={toggleThinkingMode}
      >
        💡Think
      </div>
    </div>
  );
}

export default Toolbar;
