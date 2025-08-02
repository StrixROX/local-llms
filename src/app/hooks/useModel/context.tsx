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
};

const modelContext = createContext<ModelContext>({
  models: [],
  modelOptions: {
    think: false,
  },
  selectedModel: null,
  setModel: () => {},
  setModelOptions: () => {},
});

function ModelProvider({ children }: { children: React.ReactNode }) {
  const [modelList, setModelList] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [modelOptions, setModelOptions] = useState<ModelOptions>({
    think: false,
  });

  const updateSelectedModel = (model: Model) => {
    if (!model) return;
    if (!modelList.find((m) => m.name === model.name)) return;

    setSelectedModel(model);
    localStorage.setItem("selectedModel", JSON.stringify(model));
  };

  useEffect(() => {
    fetch("/models")
      .then((response) => response.json())
      .then((data: Model[]) => {
        setModelList(data);

        const savedModel = localStorage.getItem("selectedModel");

        setSelectedModel(savedModel ? JSON.parse(savedModel) : data[0]);
      });
  }, []);

  return (
    <modelContext.Provider
      value={{
        models: modelList,
        modelOptions,
        selectedModel,
        setModel: updateSelectedModel,
        setModelOptions,
      }}
    >
      {children}
    </modelContext.Provider>
  );
}

export { ModelProvider, modelContext };
