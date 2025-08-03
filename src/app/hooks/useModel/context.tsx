"use client";

import { ErrorResponse } from "@/app/api/types";
import { NDJSONTransformStream, parseNdjsonResponse } from "@/app/utils";
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
  createModel: (
    model: Pick<Model, "name" | "displayName" | "description"> & {
      baseModel: string;
      prompt: string;
    }
  ) => Promise<void | AsyncGenerator<{ status: string }>>;
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
  createModel: () => Promise.resolve(),
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
    fetch("/api/models")
      .then((response) => response.json())
      .then((res: { ok: true; data: Model[] } | ErrorResponse) => {
        if (!res.ok) {
          throw new Error(res.data.message);
        }

        return res.data;
      })
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

  const createModel: ModelContext["createModel"] = ({
    name,
    displayName,
    description,
    prompt,
    baseModel,
  }) =>
    fetch("/api/models", {
      method: "POST",
      body: JSON.stringify({
        name,
        displayName,
        description,
        prompt,
        baseModel,
      }),
    }).then((res) => parseNdjsonResponse<{ status: string }>(res));

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
        createModel,
      }}
    >
      {children}
    </modelContext.Provider>
  );
}

export { ModelProvider, modelContext };
