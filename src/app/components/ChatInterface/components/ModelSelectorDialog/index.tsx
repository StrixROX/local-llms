import useModel from "@/app/hooks/useModel";
import { useEffect, useRef } from "react";

function ModelSelectorDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { models, selectedModel, setModel } = useModel();

  const dialogRef = useRef<HTMLDialogElement>(null);
  const dropdownRef = useRef<HTMLSelectElement>(null);

  const onSelect = (modelName: string) => {
    if (modelName === selectedModel?.name) {
      onClose();
      return;
    }

    const model = models.find((model) => model.name === modelName);
    if (model) {
      setModel(model);
      onClose();
    }
  };

  useEffect(() => {
    if (open) {
      dialogRef?.current?.showModal();
    } else {
      dialogRef?.current?.close();
    }
  }, [open]);

  return (
    <dialog ref={dialogRef} id="model-select-dialog" onClose={onClose}>
      <h2>Select model</h2>
      <select
        ref={dropdownRef}
        name="model"
        id="model-select"
        autoFocus={true}
        defaultValue={selectedModel?.name}
      >
        {models.map((model) => (
          <option key={model.name} value={model.name}>
            {model.displayName}
          </option>
        ))}
      </select>

      <button onClick={() => onSelect(dropdownRef.current?.value ?? "")}>
        OK
      </button>
    </dialog>
  );
}

export default ModelSelectorDialog;
