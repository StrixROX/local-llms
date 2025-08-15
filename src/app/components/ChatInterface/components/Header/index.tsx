import styles from "./styles.module.css";
import useModel from "@/app/hooks/useModel";

function Header({
  onRequestModelChange,
  onRequestModelCreate,
}: {
  onRequestModelChange: () => void;
  onRequestModelCreate: () => void;
}) {
  const { selectedModels } = useModel();

  return (
    <div className={styles.header}>
      {Object.entries(selectedModels).map(
        ([modelCategory, selectedModel], index) => (
          <h1
            className={[
              styles.modelName,
              selectedModel?.status === "ONLINE"
                ? styles.online
                : styles.offline,
            ].join(" ")}
            title={modelCategory}
            key={`${selectedModel?.name}_${index}`}
          >
            {selectedModel?.displayName ?? "No Model Selected"}
          </h1>
        )
      )}

      <button
        className={styles.modelAction}
        onClick={onRequestModelChange}
        title="Change model"
      >
        ✏️
      </button>

      <button
        className={styles.modelAction}
        onClick={onRequestModelCreate}
        title="Create new model"
      >
        ➕
      </button>
    </div>
  );
}

export default Header;
