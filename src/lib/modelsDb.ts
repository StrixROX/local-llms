import { Model } from "@/app/hooks/useModel/context";
import fs from "fs/promises";

export const getSavedModels = async (): Promise<Omit<Model, "status">[]> => {
  return (await import("../models/models.json")).default;
};

export const saveModel = async (
  model: Omit<Model, "modelFile" | "status">,
  baseModel: string,
  prompt: string
): Promise<Omit<Model, "status">> => {
  const modelFile = `src/models/${model.name}.modelfile`;

  await fs.writeFile(
    modelFile,
    `FROM ${baseModel}\n\nSYSTEM """\n${prompt}\n"""`
  );

  const modelWithModelFile = { ...model, modelFile };

  const models = await getSavedModels();
  models.push(modelWithModelFile);
  await fs.writeFile("src/models/models.json", JSON.stringify(models, null, 2));

  return modelWithModelFile;
};
