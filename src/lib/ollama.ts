"use server";

import type { Message } from "@/app/hooks/useChatHistory/context";
import { Model } from "@/app/hooks/useModel/context";
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
}

export async function getModels() {
  const models = (await ollama.list()).models;

  return models;
}

export async function abort() {
  ollama.abort();
}
