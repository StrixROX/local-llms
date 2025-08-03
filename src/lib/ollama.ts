"use server";

import type { Message } from "@/app/hooks/useChatHistory/context";
import { Model } from "@/app/hooks/useModel/context";
import { Ollama } from "ollama";
import { getSavedModels, saveModel } from "./modelsDb";

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
    yield {
      role: message.message.role as Message["role"],
      content: message.message.content,
      thinking: message.message.thinking,
    };
  }
}

export async function getModels() {
  const models = (await ollama.list()).models;

  return models;
}

export async function abort() {
  ollama.abort();
}

export async function* createModel(
  model: Omit<Model, "modelFile" | "status">,
  baseModel: string,
  prompt: string
): AsyncGenerator<{ status: string }, void, unknown> {
  const modelList = await getSavedModels();

  if (modelList.find((m) => m.name.split(":")[0] === model.name)) {
    throw new Error(`Model with name "${model.name}" already exists`);
  }

  console.log("creating with", model.name, baseModel, prompt);

  const responseStream = await ollama.create({
    model: model.name,
    from: baseModel,
    system: prompt,
    stream: true,
  });

  for await (const response of responseStream) {
    yield { status: response.status };
  }

  await saveModel(model, baseModel, prompt);
  yield { status: "model saved successfully" };
}
