import { ErrorResponse } from "./types";

export const createNdjsonReadableStream = <T>(
  generator: AsyncGenerator<T, void, unknown>
) =>
  new ReadableStream<string>({
    async start(controller) {
      try {
        for await (const data of generator) {
          const chunk = { ok: true, data };
          controller.enqueue(JSON.stringify(chunk) + "\n");
        }
      } catch (err) {
        const errorChunk: ErrorResponse = {
          ok: false,
          data: { message: (err as Error).message },
        };
        controller.enqueue(JSON.stringify(errorChunk) + "\n");
      }
      controller.close();
    },
  });
