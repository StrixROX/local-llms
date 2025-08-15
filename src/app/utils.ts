import { ErrorResponse } from "./api/types";

export class NDJSONTransformStream<T> extends TransformStream<
  string,
  { ok: true; data: T } | ErrorResponse
> {
  constructor() {
    super({
      transform(chunk, controller) {
        chunk
          .trim()
          .split("\n")
          .map((jsonChunk) =>
            controller.enqueue(
              JSON.parse(jsonChunk) as { ok: true; data: T } | ErrorResponse
            )
          );
      },
    });
  }
}

export const parseNdjsonResponse = <T>(
  res: Response
): AsyncGenerator<T, void, unknown> => {
  const reader = res.body
    ?.pipeThrough(new TextDecoderStream("utf-8"))
    .pipeThrough(new NDJSONTransformStream<T>())
    .getReader();

  async function* generator() {
    if (!reader) return;

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const { ok, data } = value as { ok: true; data: T } | ErrorResponse;

      if (ok) {
        yield data as T;
      } else {
        throw new Error(data.message);
      }
    }
  }

  return generator();
};
