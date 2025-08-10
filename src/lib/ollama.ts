"use server";

import "@/lib/env";
import type { Message } from "@/app/hooks/useChatHistory/context";
import { Model } from "@/app/hooks/useModel/context";
import { Ollama } from "ollama";
import { getSavedModels, saveModel } from "./modelsDb";
import requestCategorization from "./RequestCategorizationPrompt.json";

const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";

const ollama = new Ollama({
  host: OLLAMA_URL,
});

export async function* generateResponse(
  model: string,
  chatHistory: Message[],
  think: boolean
): AsyncGenerator<Message, void, unknown> {
  const responseStream = await ollama.chat({
    model,
    messages: chatHistory,
    stream: true,
    think,
    options: {
      seed: 8,
    },
  });

  for await (const message of responseStream) {
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

// this function exists to parse the response from ollama.create
// and return a new AsyncGenerator
// especially, adding the final message of "model saved successfully"
// would not be possible with out creating a new AsyncGenerator
export async function* createTextModel(
  model: Pick<Model, "name" | "displayName" | "description"> & {
    category: "text-generation";
  },
  baseModel: string,
  prompt: string
): AsyncGenerator<{ status: string }, void, unknown> {
  const modelList = await getSavedModels();

  if (modelList.find((m) => m.name.split(":")[0] === model.name)) {
    throw new Error(`Model with name '${model.name}' already exists`);
  }

  const responseStream = await ollama.create({
    model: model.name,
    from: baseModel,
    system: prompt,
    stream: true,
  });

  for await (const response of responseStream) {
    yield { status: response.status };
  }

  await saveModel(model, { baseModel, prompt });
  yield { status: "model saved successfully" };
}

export type RequestCategory = {
  type: "image-generation" | "video-generation" | "text-generation";
};

export async function getRequestCategory(
  userPrompt: string
): Promise<RequestCategory> {
  const model = "deepseek-r1:latest";
  const system = requestCategorization.system as string | undefined;
  const format = requestCategorization.format as unknown;

  // Force non-streaming call to get a single response object
  const result = await ollama.generate({
    model,
    prompt: userPrompt,
    ...(system ? { system } : {}),
    stream: false,
    ...(format ? { format: format as string | object } : {}),
  });

  let parsed: unknown = (result as { response?: unknown }).response ?? result;
  if (typeof parsed === "string") {
    parsed = JSON.parse(parsed);
  }

  const out = parsed as RequestCategory;
  if (
    !out ||
    typeof out !== "object" ||
    !("type" in out) ||
    !["image-generation", "video-generation", "text-generation"].includes(
      (out as RequestCategory).type
    )
  ) {
    throw new Error("Invalid categorization response from model");
  }

  return out;
}
