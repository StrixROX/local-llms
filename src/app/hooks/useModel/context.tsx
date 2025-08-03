"use client";

import { createContext, useEffect, useState } from "react";

export type Model = {
  name: string;
  displayName: string;
  description: string;
  modelFile: string;
  status: "ONLINE" | "OFFLINE";
};

export type ModelOptions = {
  think: boolean;
};

type ModelContext = {
  models: Model[];
  modelOptions: ModelOptions;
  selectedModel: Model | null;
  setModel: (model: Model) => void;
  setModelOptions: (options: ModelOptions) => void;
  refresh: () => void;
};

const modelContext = createContext<ModelContext>({
  models: [],
  modelOptions: {
    think: false,
  },
  selectedModel: null,
  setModel: () => {},
  setModelOptions: () => {},
  refresh: () => {},
});

const defaultModelOptions = {
  think: false,
};

function ModelProvider({ children }: { children: React.ReactNode }) {
  const [modelList, setModelList] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [modelOptions, setModelOptions] =
    useState<ModelOptions>(defaultModelOptions);

  const updateSelectedModel = (model: Model) => {
    if (!model) return;
    if (!modelList.find((m) => m.name === model.name)) return;

    setSelectedModel(model);
    localStorage.setItem("selectedModel", model.name);
  };
  const updateModelOptions = (options: ModelOptions) => {
    setModelOptions(options);
    localStorage.setItem("modelOptions", JSON.stringify(options));
  };

  const fetchModelList = () => {
    fetch("/models")
      .then((response) => response.json())
      .catch(() => [])
      .then((data: Model[]) => {
        setModelList(data);

        const savedModelName = localStorage.getItem("selectedModel");
        const model = data.find((m) => m.name === savedModelName);

        if (model) {
          setSelectedModel(model);
        } else if (data.length > 0) {
          setSelectedModel(data[0]);
          localStorage.setItem("selectedModel", data[0].name);
        } else {
          setSelectedModel(null);
        }
      });
  };
  const fetchSavedOptions = () => {
    const savedOptions = localStorage.getItem("modelOptions");
    if (savedOptions) {
      setModelOptions(JSON.parse(savedOptions));
    } else {
      setModelOptions(defaultModelOptions);
    }
  };

  const refresh = () => {
    fetchModelList();
    fetchSavedOptions();
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <modelContext.Provider
      value={{
        models: modelList,
        modelOptions,
        selectedModel,
        setModel: updateSelectedModel,
        setModelOptions: updateModelOptions,
        refresh,
      }}
    >
      {children}
    </modelContext.Provider>
  );
}

export { ModelProvider, modelContext };
