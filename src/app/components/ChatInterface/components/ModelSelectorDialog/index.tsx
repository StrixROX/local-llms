import useModel from "@/app/hooks/useModel";
import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";
import { Model } from "@/app/hooks/useModel/context";
import Tabs from "../Tabs";

function ModelSelectorDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const {
    models: allModels,
    selectedModels,
    setTextModel,
    setImageModel,
    refresh,
  } = useModel();

  const [forModelCategory, setForModelCategory] =
    useState<Model["category"]>("image-generation");

  const models = allModels.filter(
    (model) => model.category === forModelCategory
  );
  const selectedModel = selectedModels[forModelCategory];

  const [checkedModel, setCheckedModel] = useState<Model | null>(selectedModel);

  const dialogRef = useRef<HTMLDialogElement>(null);
  const dropdownRef = useRef<HTMLSelectElement>(null);

  const onSelect = () => {
    if (!checkedModel) return;

    if (checkedModel.name === selectedModel?.name) {
      onClose();
      return;
    }

    if (forModelCategory === "text-generation") {
      setTextModel(checkedModel);
    } else if (forModelCategory === "image-generation") {
      setImageModel(checkedModel);
    }
    onClose();
  };

  useEffect(() => {
    if (open) {
      dialogRef?.current?.showModal();
    } else {
      dialogRef?.current?.close();
    }
  }, [open]);

  useEffect(() => {
    setCheckedModel(selectedModel);

    if (!dropdownRef.current) return;

    if (!selectedModel) {
      dropdownRef.current.value = "no-models";
      return;
    }

    dropdownRef.current.value = selectedModel.name;
    dropdownRef.current.onchange = () => {
      setCheckedModel(
        models.find((model) => model.name === dropdownRef.current?.value) ??
          null
      );
    };
  }, [selectedModel, models]);

  return (
    <dialog ref={dialogRef} id="model-select-dialog" onClose={onClose}>
      <h2>Select model</h2>

      <Tabs
        tabData={[
          { id: "text-generation", label: "Text" },
          { id: "image-generation", label: "Image" },
        ]}
        onChange={(value) =>
          setForModelCategory(value as "text-generation" | "image-generation")
        }
      />

      <div className={styles.selectContainer}>
        <select
          ref={dropdownRef}
          name="model"
          id="model-select"
          autoFocus={true}
        >
          {models.map((model) => (
            <option key={model.name} value={model.name}>
              {model.displayName}{" "}
              {model.status === "OFFLINE" ? "(Offline)" : ""}
            </option>
          ))}

          {models.length === 0 && (
            <option key="no-models" value="no-models">
              No models available
            </option>
          )}
        </select>

        <button onClick={() => refresh()} className={styles.refresh}>
          ⟳
        </button>
      </div>

      {checkedModel && (
        <table className={styles.modelDetails}>
          <tbody>
            <tr>
              <th>Name</th>
              <td>{checkedModel.name}</td>
            </tr>
            {checkedModel?.category === "image-generation" &&
              checkedModel.provider && (
                <tr>
                  <th>Provider</th>
                  <td>{checkedModel.provider}</td>
                </tr>
              )}
            <tr>
              <th>Display Name</th>
              <td>{checkedModel.displayName}</td>
            </tr>
            <tr>
              <th>Description</th>
              <td>{checkedModel.description}</td>
            </tr>
            <tr>
              <th>Status</th>
              <td>{checkedModel.status === "ONLINE" ? "Online" : "Offline"}</td>
            </tr>
          </tbody>
        </table>
      )}

      <button onClick={onSelect}>OK</button>
    </dialog>
  );
}

export default ModelSelectorDialog;
