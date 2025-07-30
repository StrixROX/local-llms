"use server";

export async function GET() {
  const modelList = (await import("../../models/models.json")).default;
  return Response.json(modelList);
}
