"use server";

import type { Message } from "@/app/hooks/useChatHistory/context";
import { Ollama } from "ollama";

const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";

const ollama = new Ollama({
  host: OLLAMA_URL,
});

export async function* generateResponse(
  model: string,
  chatHistory: Message[],
  think: boolean
): AsyncGenerator<Message, void, unknown> {
  try {
    const response = await ollama.chat({
      model,
      messages: chatHistory,
      stream: true,
      think,
      options: {
        seed: 8,
      },
    });

    for await (const message of response) {
      yield message.message as Message;
    }
  } catch (err) {
    yield {
      role: "assistant",
      content:
        "An error occurred when trying to generate a response.\n" +
        "```plain\n" +
        err +
        "\n```",
    } as Message;
  }
}
