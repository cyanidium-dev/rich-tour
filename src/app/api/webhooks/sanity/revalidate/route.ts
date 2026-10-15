import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";

import { getInvalidationForType } from "./invalidation";

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "NOT_CONFIGURED" }, { status: 500 });
  }

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
  }

  const signature = request.headers.get(SIGNATURE_HEADER_NAME);
  if (!signature || !(await isValidSignature(rawBody, signature, secret))) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const projectId = process.env.SANITY_PROJECT_ID || "elggedkx";
  const dataset = process.env.SANITY_DATASET || "production";
  if (
    request.headers.get("sanity-project-id") !== projectId ||
    request.headers.get("sanity-dataset") !== dataset
  ) {
    return NextResponse.json({ error: "WRONG_DATASET" }, { status: 400 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "INVALID_JSON" }, { status: 400 });
  }

  if (!payload || typeof payload !== "object" || !("_type" in payload)) {
    return NextResponse.json({ error: "INVALID_PAYLOAD" }, { status: 400 });
  }

  const documentType = payload._type;
  if (typeof documentType !== "string") {
    return NextResponse.json({ error: "INVALID_PAYLOAD" }, { status: 400 });
  }

  const invalidation = getInvalidationForType(documentType);
  if (!invalidation) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  // Give a newly published change time to reach the Content Lake read API.
  await new Promise((resolve) => setTimeout(resolve, 3000));
  revalidateTag(invalidation.tag, { expire: 0 });
  for (const { path, type } of invalidation.paths) {
    revalidatePath(path, type);
  }

  return NextResponse.json({ ok: true, revalidated: documentType });
}
