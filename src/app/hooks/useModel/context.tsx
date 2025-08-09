"use client";

import { ErrorResponse } from "@/app/api/types";
import { NDJSONTransformStream, parseNdjsonResponse } from "@/app/utils";
import { createContext, useEffect, useState } from "react";

export type Model = {
  name: string;
  displayName: string;
  description: string;
  category: "text-generation" | "image-generation";
  modelFile?: string;
  provider?: string;
  status: "ONLINE" | "OFFLINE";
};

export type ModelOptions = {
  think: boolean;
};

type ModelContext = {
  models: Model[];
  modelOptions: ModelOptions;
  selectedModels: Record<Model["category"], Model | null>;
  setTextModel: (model: Model) => void;
  setImageModel: (model: Model) => void;
  setModelOptions: (options: ModelOptions) => void;
  refresh: () => void;
  createTextModel: (
    model: Pick<Model, "name" | "displayName" | "description"> & {
      baseModel: string;
      prompt: string;
    }
  ) => Promise<void | AsyncGenerator<{ status: string }>>;
  createImageModel: (
    model: Pick<Model, "name" | "provider" | "displayName" | "description">
  ) => Promise<void | AsyncGenerator<{ status: string }>>;
};

const modelContext = createContext<ModelContext>({
  models: [],
  modelOptions: {
    think: false,
  },
  selectedModels: {
    "image-generation": null,
    "text-generation": null,
  },
  setTextModel: () => {},
  setImageModel: () => {},
  setModelOptions: () => {},
  refresh: () => {},
  createTextModel: () => Promise.resolve(),
  createImageModel: () => Promise.resolve(),
});

const defaultModelOptions = {
  think: false,
};

function ModelProvider({ children }: { children: React.ReactNode }) {
  const [modelList, setModelList] = useState<Model[]>([]);
  const [selectedModels, setSelectedModels] = useState<
    Record<Model["category"], Model | null>
  >({
    "text-generation": null,
    "image-generation": null,
  });
  const [modelOptions, setModelOptions] =
    useState<ModelOptions>(defaultModelOptions);

  const updateSelectedModel = (model: Model, type: Model["category"]) => {
    if (!model || !type) return;
    if (!modelList.find((m) => m.name === model.name)) return;

    setSelectedModels({ ...selectedModels, [type]: model });
    localStorage.setItem(
      "selectedModels",
      JSON.stringify({ ...selectedModels, [type]: model.name })
    );
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

        let savedModelNames;
        try {
          savedModelNames = JSON.parse(
            localStorage.getItem("selectedModels") ?? "{}"
          );
        } catch {
          savedModelNames = {};
        }

        const savedTextModelName = savedModelNames["text-generation"] as
          | string
          | undefined;
        const savedImageModelName = savedModelNames["image-generation"] as
          | string
          | undefined;

        const savedModels = {
          "text-generation":
            data.find((m) => m.name === savedTextModelName) ??
            data.find((model) => model.category === "text-generation") ??
            null,
          "image-generation":
            data.find((m) => m.name === savedImageModelName) ??
            data.find((model) => model.category === "image-generation") ??
            null,
        };

        setSelectedModels(savedModels);
        localStorage.setItem(
          "selectedModels",
          JSON.stringify({
            "text-generation": savedModels["text-generation"]?.name ?? null,
            "image-generation": savedModels["image-generation"]?.name ?? null,
          })
        );
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

  const createTextModel: ModelContext["createTextModel"] = ({
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
        prompt,
        baseModel,
        displayName,
        description,
        category: "text-generation",
      }),
    }).then((res) => parseNdjsonResponse<{ status: string }>(res));

  const createImageModel: ModelContext["createImageModel"] = ({
    name,
    provider,
    displayName,
    description,
  }) =>
    fetch("/api/models", {
      method: "POST",
      body: JSON.stringify({
        name,
        provider,
        displayName,
        description,
        category: "image-generation",
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
        selectedModels,
        setTextModel: (model: Model) =>
          updateSelectedModel(model, "text-generation"),
        setImageModel: (model: Model) =>
          updateSelectedModel(model, "image-generation"),
        setModelOptions: updateModelOptions,
        refresh,
        createTextModel,
        createImageModel,
      }}
    >
      {children}
    </modelContext.Provider>
  );
}

export { ModelProvider, modelContext };
