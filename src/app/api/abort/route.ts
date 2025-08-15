import { abort } from "@/lib/ollama";
import { NextResponse } from "next/server";
import { ErrorResponse } from "../types";

export async function GET(): Promise<
  NextResponse<{ ok: true; data: { message: "Aborted" } } | ErrorResponse>
> {
  try {
    abort();

    return NextResponse.json({ ok: true, data: { message: "Aborted" } });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        data: { message: (err as Error).message },
      },
      { status: 500 }
    );
  }
}
