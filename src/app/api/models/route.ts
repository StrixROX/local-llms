"use server";

import { NextRequest, NextResponse } from "next/server";
import { createModel, getModels } from "@/lib/ollama";
import { Model } from "../../hooks/useModel/context";
import { getSavedModels } from "@/lib/modelsDb";
import { createNdjsonReadableStream } from "../utils";
import { ErrorResponse } from "../types";

export async function GET(): Promise<
  NextResponse<{ ok: true; data: Model[] } | ErrorResponse>
> {
  try {
    const modelList = await getSavedModels();
    const activeModels = await getModels();

    const parsedModelList = modelList.map(
      (modelData) =>
        ({
          ...modelData,
          status: activeModels.find(
            (activeModel) => activeModel.name === modelData.name
          )
            ? "ONLINE"
            : "OFFLINE",
        } as Model)
    );

    return NextResponse.json({ ok: true, data: parsedModelList });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        data: { message: (err as Error).message },
      },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest
): Promise<NextResponse<ReadableStream<string>>> {
  const body = (await req.json()) as Omit<Model, "modelFile" | "status"> & {
    baseModel: string;
    prompt: string;
  };

  const { baseModel, prompt, ...modelData } = body;

  const creationStatusGenerator = createModel(
    modelData,
    body.baseModel,
    body.prompt
  );

  const readableStream = createNdjsonReadableStream(creationStatusGenerator);

  return new NextResponse(readableStream, {
    headers: {
      "Content-Type": "application/x-ndjson",
      "Transfer-Encoding": "chunked",
    },
  });
}
