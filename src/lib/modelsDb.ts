import { Model } from "@/app/hooks/useModel/context";
import fs from "fs/promises";

export const getSavedModels = async (): Promise<Omit<Model, "status">[]> => {
  return (await import("../models/models.json")).default as Omit<
    Model,
    "status"
  >[];
};

export const saveModel = async (
  model: Pick<Model, "name" | "displayName" | "description" | "category">,
  options: { baseModel?: string; prompt?: string; provider?: string }
): Promise<Omit<Model, "status"> | null> => {
  let modelEntry = null;

  if (model.category === "text-generation") {
    const modelFile = `src/models/${model.name}.modelfile`;

    if (!options.baseModel) throw new Error("No base model supplied.");
    if (!options.prompt) throw new Error("No prompt supplied.");

    await fs.writeFile(
      modelFile,
      `FROM ${options.baseModel}\n\nSYSTEM """\n${options.prompt}\n"""`
    );

    modelEntry = {
      name: model.name,
      displayName: model.displayName,
      description: model.description,
      category: model.category,
      modelFile,
    } as Omit<Model, "status">;
  } else if (model.category === "image-generation") {
    if (!options.provider) throw new Error("No provider supplied.");

    modelEntry = {
      name: model.name,
      displayName: model.displayName,
      description: model.description,
      category: model.category,
      provider: options.provider,
    } as Omit<Model, "status">;
  }

  if (!modelEntry) {
    return null;
  }

  const models = await getSavedModels();
  models.push(modelEntry);
  await fs.writeFile("src/models/models.json", JSON.stringify(models, null, 2));

  return modelEntry;
};
