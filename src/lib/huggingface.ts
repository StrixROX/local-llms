"use server";
import "server-only";

import "@/lib/env";
import type { Message } from "@/app/hooks/useChatHistory/context";
import { InferenceClient } from "@huggingface/inference";
import { saveModel } from "./modelsDb";
import type { Model } from "@/app/hooks/useModel/context";

/**
 * Generate images using Hugging Face Inference Providers.
 * - Uses the last user message in the provided chat history as the prompt.
 * - Yields a single assistant message with an array of generated images as Uint8Array.
 */
export async function* generateImages(
  modelName: string,
  provider: string,
  prompt: string
): AsyncGenerator<Message, void, unknown> {
  const accessToken =
    process.env.HF_TOKEN || "";

  if (!accessToken) {
    throw new Error("Missing Hugging Face token.");
  }

  if (!provider) {
    throw new Error("No provider supplied.");
  }

  if (
    !["nebius", "nscale", "replicate", "hf-inference", "together"].includes(
      provider
    )
  ) {
    throw new Error(`Unsupported provider ${provider}.`);
  }

  const client = new InferenceClient(accessToken);

  // Request a single image as a Blob and convert to Uint8Array
  const blob = await client.textToImage(
    {
      provider: provider as
        | "nebius"
        | "nscale"
        | "replicate"
        | "hf-inference"
        | "together",
      model: modelName,
      inputs: prompt,
    },
    {
      outputType: "blob",
    }
  );

  const imageBytes = new Uint8Array(await blob.arrayBuffer());

  yield { role: "assistant", content: "", images: [imageBytes] };
}

export async function* createImageModel(
  model: Pick<Model, "name" | "displayName" | "description"> & {
    category: "image-generation";
  },
  provider: string
): AsyncGenerator<{ status: string }, void, unknown> {
  await saveModel(model, { provider });
  yield { status: "model saved successfully" };
}
