"use client";

import { createContext, useEffect, useState } from "react";

export type Model = {
  name: string;
  displayName: string;
  description: string;
  modelFile: string;
};

type ModelContext = {
  models: Model[];
  selectedModel: Model | null;
  setModel: (model: Model) => void;
};

const modelContext = createContext<ModelContext>({
  models: [],
  selectedModel: null,
  setModel: () => {},
});

function ModelProvider({ children }: { children: React.ReactNode }) {
  const [modelList, setModelList] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);

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
        selectedModel,
        setModel: updateSelectedModel,
      }}
    >
      {children}
    </modelContext.Provider>
  );
}

export { ModelProvider, modelContext };
