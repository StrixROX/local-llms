import { useEffect, useState } from "react";
import styles from "./styles.module.css";

function Tabs({
  tabData,
  onChange,
}: {
  tabData: { id: string; label: string }[];
  onChange: (value: string) => void;
}) {
  const [value, setValue] = useState<string>(tabData[0].id);

  useEffect(() => {
    onChange(value);
  }, [value, onChange]);

  return (
    <div className={styles.tabsWrapper}>
      {tabData.map((tab) => (
        <div
          className={[styles.tab, value === tab.id ? styles.selected : ""]
            .filter(Boolean)
            .join(" ")}
          onClick={() => setValue(tab.id)}
          key={tab.id}
        >
          {tab.label}
        </div>
      ))}
    </div>
  );
}

export default Tabs;
