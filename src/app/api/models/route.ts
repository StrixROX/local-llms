"use server";

import { NextRequest, NextResponse } from "next/server";
import { createTextModel, getModels } from "@/lib/ollama";
import { Model } from "../../hooks/useModel/context";
import { getSavedModels } from "@/lib/modelsDb";
import { createNdjsonReadableStream } from "../utils";
import { ErrorResponse } from "../types";
import { createImageModel } from "@/lib/huggingface";

export async function GET(): Promise<
  NextResponse<{ ok: true; data: Model[] } | ErrorResponse>
> {
  try {
    const modelList = await getSavedModels();
    const activeModels = await getModels();

    const modelListWithStatus = modelList.map(
      (modelData) =>
        ({
          ...modelData,
          status:
            activeModels.find(
              (activeModel) => activeModel.name === modelData.name
            ) || modelData.provider
              ? "ONLINE"
              : "OFFLINE",
        } as Model)
    );

    return NextResponse.json({ ok: true, data: modelListWithStatus });
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
  const body = (await req.json()) as Pick<
    Model,
    "name" | "displayName" | "description"
  > &
    (
      | {
          category: "text-generation";
          baseModel: string;
          prompt: string;
        }
      | {
          category: "image-generation";
          provider: string;
        }
    );

  let creationStatusGenerator;

  if (body.category === "image-generation") {
    const { provider, ...modelData } = body;

    creationStatusGenerator = createImageModel(modelData, provider);
  } else {
    const { baseModel, prompt, ...modelData } = body;

    creationStatusGenerator = createTextModel(
      modelData,
      body.baseModel,
      body.prompt
    );
  }

  const readableStream = createNdjsonReadableStream(creationStatusGenerator);

  return new NextResponse(readableStream, {
    headers: {
      "Content-Type": "application/x-ndjson",
      "Transfer-Encoding": "chunked",
    },
  });
}
