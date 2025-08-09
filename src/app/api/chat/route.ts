import { NextRequest, NextResponse } from "next/server";
import { Message } from "@/app/hooks/useChatHistory/context";
import { createNdjsonReadableStream } from "../utils";
import { generateResponse, getRequestCategory } from "@/lib/ollama";
import { generateImages } from "@/lib/huggingface";
import { getSavedModels } from "@/lib/modelsDb";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as {
    textModel: string;
    imageModel: string;
    chatHistory: Message[];
    provider?: string;
    think?: boolean;
  };

  const { textModel, imageModel, provider, chatHistory, think } = body;

  const lastUserMessage =
    [...chatHistory].findLast((m) => m.role === "user")?.content || "";

  const { type: requestType } = await getRequestCategory(lastUserMessage);

  let generator;

  if (requestType === "image-generation") {
    generator = generateImages(imageModel, provider || "", lastUserMessage);
  } else {
    generator = generateResponse(textModel, chatHistory, !!think);
  }

  const readableStream = createNdjsonReadableStream(generator);

  return new NextResponse(readableStream, {
    headers: {
      "Content-Type": "application/x-ndjson",
      "Transfer-Encoding": "chunked",
    },
  });
}
