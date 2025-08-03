import { NextRequest, NextResponse } from "next/server";
import { Message } from "@/app/hooks/useChatHistory/context";
import { createNdjsonReadableStream } from "../utils";
import { generateResponse } from "@/lib/ollama";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as {
    model: string;
    chatHistory: Message[];
    think: boolean;
  };

  const { model, chatHistory, think } = body;

  const chatGenerator = generateResponse(model, chatHistory, think);

  const readableStream = createNdjsonReadableStream(chatGenerator);

  return new NextResponse(readableStream, {
    headers: {
      "Content-Type": "application/x-ndjson",
      "Transfer-Encoding": "chunked",
    },
  });
}
