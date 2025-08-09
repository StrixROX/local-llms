import { NextRequest, NextResponse } from "next/server";
import { Message } from "@/app/hooks/useChatHistory/context";
import { createNdjsonReadableStream } from "../utils";
import { generateResponse, getRequestCategory } from "@/lib/ollama";
import { generateImages } from "@/lib/huggingface";
import type { Model } from "@/app/hooks/useModel/context";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as {
    model: string;
    provider?: Model["provider"];
    chatHistory: Message[];
    think: boolean;
  };

  const { model, chatHistory, think, provider } = body;

  const lastUserMessage =
    [...chatHistory].findLast((m) => m.role === "user")?.content || "";

  const { type: requestType } = await getRequestCategory(lastUserMessage);

  console.log(requestType)

  let generator;

  if (requestType === "image-generation") {
    const imageGenerator = generateImages(model, provider, lastUserMessage);

    generator = imageGenerator;
  } else {
    const chatGenerator = generateResponse(model, chatHistory, think);

    generator = chatGenerator;
  }

  const readableStream = createNdjsonReadableStream(generator);

  return new NextResponse(readableStream, {
    headers: {
      "Content-Type": "application/x-ndjson",
      "Transfer-Encoding": "chunked",
    },
  });
}
