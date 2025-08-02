"use server";

import { NextResponse } from "next/server";
import { getModels } from "@/lib/ollama";
import { Model } from "../hooks/useModel/context";

export async function GET(): Promise<NextResponse<Model[]>> {
  const modelList: Omit<Model, "status">[] = (
    await import("../../models/models.json")
  ).default;
  const activeModels = await getModels();

  const parsedModelList: Model[] = modelList.map((modelData) =>
    activeModels.find((activeModel) => activeModel.name === modelData.name)
      ? {
          ...modelData,
          status: "ONLINE",
        }
      : {
          ...modelData,
          status: "OFFLINE",
        }
  );

  return NextResponse.json(parsedModelList);
}
