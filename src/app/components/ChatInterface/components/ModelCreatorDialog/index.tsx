import useModel from "@/app/hooks/useModel";
import { useEffect, useReducer, useRef, useState } from "react";
import styles from "./styles.module.css";
import type { Model } from "@/app/hooks/useModel/context";
import Tabs from "../Tabs";

type FormState = {
  name: string;
  provider: string;
  displayName: string;
  description: string;
  prompt: string;
  baseModel: string;
};

type FormAction =
  | { type: "SET_NAME"; payload: string }
  | { type: "SET_PROVIDER"; payload: string }
  | { type: "SET_DISPLAY_NAME"; payload: string }
  | { type: "SET_DESCRIPTION"; payload: string }
  | { type: "SET_PROMPT"; payload: string }
  | { type: "SET_BASE_MODEL"; payload: string }
  | { type: "RESET_FORM" };

const initialState: FormState = {
  name: "",
  provider: "",
  displayName: "",
  description: "",
  prompt: "",
  baseModel: "",
};

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "SET_NAME":
      return { ...state, name: action.payload };
    case "SET_PROVIDER":
      return { ...state, provider: action.payload };
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
  const { createTextModel, createImageModel } = useModel();
  const [state, dispatch] = useReducer(formReducer, initialState);
  const { name, provider, displayName, description, prompt, baseModel } = state;
  const [forModelCategory, setForModelCategory] =
    useState<Model["category"]>("image-generation");

  const validateState = () => {
    if (forModelCategory === "text-generation") {
      return (
        !!name && !!displayName && !!description && !!prompt && !!baseModel
      );
    } else if (forModelCategory === "image-generation") {
      return !!name && !!displayName && !!description && !!provider;
    } else {
      return false;
    }
  };

  const isValid = validateState();

  const dialogRef = useRef<HTMLDialogElement>(null);

  const [isCreating, setIsCreating] = useState(false);
  const [creatingMessage, setCreatingMessage] = useState("");

  const createModel = () => {
    if (forModelCategory === "text-generation") {
      return createTextModel({
        name: name.trim(),
        displayName: displayName.trim(),
        description: description.trim(),
        baseModel: baseModel.trim(),
        prompt: prompt.trim(),
      });
    } else if (forModelCategory === "image-generation") {
      return createImageModel({
        name: name.trim(),
        provider: provider.trim(),
        displayName: displayName.trim(),
        description: description.trim(),
      });
    } else {
      return Promise.resolve();
    }
  };

  const handleCreate = () => {
    if (isValid) {
      setIsCreating(true);
      setCreatingMessage("Creating...");

      createModel()
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

      <Tabs
        tabData={[
          { id: "text-generation", label: "Text" },
          { id: "image-generation", label: "Image" },
        ]}
        onChange={(value) =>
          setForModelCategory(value as "text-generation" | "image-generation")
        }
      />

      <div className={styles.inputGroup}>
        <input
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

      {forModelCategory === "image-generation" && (
        <div className={styles.inputGroup}>
          <input
            id="model-provider"
            type="text"
            value={provider}
            onChange={(e) =>
              dispatch({ type: "SET_PROVIDER", payload: e.target.value })
            }
            placeholder="Provider"
            required
            className={styles.input}
          />
        </div>
      )}

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

      {forModelCategory === "text-generation" && (
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
      )}

      {forModelCategory === "text-generation" && (
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
      )}

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
