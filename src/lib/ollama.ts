import { Message } from "@/app/hooks/useChatHistory/context";

export async function* generateResponse(
  chatHistory: Message[]
): AsyncGenerator<Message, void, void> {
  let iteration = 1;
  while (true) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    yield { role: "assistant", content: `abc ${iteration}\n` };
    iteration++;
  }
}
