import useModel from "@/app/hooks/useModel";
import { useEffect, useReducer, useRef, useState } from "react";
import styles from "./styles.module.css";

type FormState = {
  name: string;
  displayName: string;
  description: string;
  prompt: string;
  baseModel: string;
};

type FormAction =
  | { type: "SET_NAME"; payload: string }
  | { type: "SET_DISPLAY_NAME"; payload: string }
  | { type: "SET_DESCRIPTION"; payload: string }
  | { type: "SET_PROMPT"; payload: string }
  | { type: "SET_BASE_MODEL"; payload: string }
  | { type: "RESET_FORM" };

const initialState: FormState = {
  name: "",
  displayName: "",
  description: "",
  prompt: "",
  baseModel: "",
};

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "SET_NAME":
      return { ...state, name: action.payload };
    case "SET_DISPLAY_NAME":
      return { ...state, displayName: action.payload };
    case "SET_DESCRIPTION":
      return { ...state, description: action.payload };
    case "SET_PROMPT":
      return { ...state, prompt: action.payload };
    case "SET_BASE_MODEL":
      return { ...state, baseModel: action.payload };
    case "RESET_FORM":
      return { ...initialState };
    default:
      return state;
  }
}

function ModelCreatorDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { createModel } = useModel();
  const [state, dispatch] = useReducer(formReducer, initialState);
  const { name, displayName, description, prompt, baseModel } = state;
  const isValid =
    !!name && !!displayName && !!description && !!prompt && !!baseModel;

  const dialogRef = useRef<HTMLDialogElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const [isCreating, setIsCreating] = useState(false);
  const [creatingMessage, setCreatingMessage] = useState("");

  const handleCreate = () => {
    if (isValid) {
      setIsCreating(true);
      setCreatingMessage("Creating...");
      createModel({
        name: name.trim(),
        displayName: displayName.trim(),
        description: description.trim(),
        baseModel: baseModel.trim(),
        prompt: prompt.trim(),
      })
        .then(async (res) => {
          if (!res) return;

          for await (const { status } of res) {
            setCreatingMessage(status);
          }
        })
        .then(() => {
          dispatch({ type: "RESET_FORM" });
          setTimeout(() => {
            setIsCreating(false);
            onClose();
          }, 2000);
        })
        .catch((e: Error) => {
          setCreatingMessage(e.message);
          setTimeout(() => setIsCreating(false), 2000);
        });
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
    <dialog ref={dialogRef} id="model-creator-dialog" onClose={onClose}>
      <h2>Create New Model</h2>

      <div className={styles.inputGroup}>
        <input
          ref={nameInputRef}
          autoFocus={true}
          id="model-name"
          type="text"
          value={name}
          onChange={(e) =>
            dispatch({ type: "SET_NAME", payload: e.target.value })
          }
          placeholder="Name"
          required
          className={styles.input}
        />
      </div>

      <div className={styles.inputGroup}>
        <input
          id="display-name"
          type="text"
          value={displayName}
          onChange={(e) =>
            dispatch({
              type: "SET_DISPLAY_NAME",
              payload: e.target.value,
            })
          }
          placeholder="Display Name"
          required
          className={styles.input}
        />
      </div>

      <div className={styles.inputGroup}>
        <input
          id="description"
          type="text"
          value={description}
          onChange={(e) =>
            dispatch({
              type: "SET_DESCRIPTION",
              payload: e.target.value,
            })
          }
          required
          placeholder="Description"
          className={styles.input}
        />
      </div>

      <div className={styles.inputGroup}>
        <input
          id="base-model-name"
          type="text"
          value={baseModel}
          onChange={(e) =>
            dispatch({
              type: "SET_BASE_MODEL",
              payload: e.target.value,
            })
          }
          required
          placeholder="Base Model Name"
          className={styles.input}
        />
      </div>

      <div className={styles.inputGroup}>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) =>
            dispatch({
              type: "SET_PROMPT",
              payload: e.target.value,
            })
          }
          rows={5}
          required
          placeholder="System Prompt"
          className={`${styles.textarea} no-scrollbar`}
        />
      </div>

      <div className={styles.buttonGroup}>
        {!isCreating && <button onClick={onClose}>Cancel</button>}

        <button
          onClick={handleCreate}
          disabled={!isValid || isCreating}
          className="primary"
        >
          {isCreating ? creatingMessage : "Create"}
        </button>
      </div>
    </dialog>
  );
}

export default ModelCreatorDialog;
