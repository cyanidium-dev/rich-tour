import { NextRequest, NextResponse } from "next/server";

import {
  createTourPreviewSession,
  isTourDocumentId,
  TOUR_PREVIEW_COOKIE,
} from "@/lib/tour-preview/session";

export const dynamic = "force-dynamic";

type SanityCurrentUser = {
  id?: unknown;
  roles?: Array<{ name?: unknown }>;
};

type StudioAccess =
  | { status: "authorized"; userId: string }
  | { status: "invalid-session" }
  | { status: "not-admin" };

async function getStudioAccess(token: string): Promise<StudioAccess> {
  const projectId = process.env.SANITY_PROJECT_ID || "elggedkx";
  const response = await fetch(`https://${projectId}.api.sanity.io/v2025-04-26/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
    signal: AbortSignal.timeout(5000),
  });
  if (response.status === 401 || response.status === 403) return { status: "invalid-session" };
  if (!response.ok) throw new Error("Sanity user lookup failed");
  const user = (await response.json()) as SanityCurrentUser;
  if (typeof user.id !== "string") throw new Error("Invalid Sanity user response");
  return user.roles?.some((role) => role.name === "administrator")
    ? { status: "authorized", userId: user.id }
    : { status: "not-admin" };
}

export async function POST(request: NextRequest) {
  if (
    !process.env.PREVIEW_SESSION_SECRET ||
    process.env.PREVIEW_SESSION_SECRET.length < 32 ||
    !process.env.SANITY_API_TOKEN
  ) {
    return NextResponse.json({ error: "NOT_CONFIGURED" }, { status: 500 });
  }
  if (Number(request.headers.get("content-length") || 0) > 8192) {
    return NextResponse.json({ error: "INVALID_BODY" }, { status: 413 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
  }

  const id = form.get("id");
  const token = form.get("token");
  if (
    typeof id !== "string" ||
    !isTourDocumentId(id) ||
    typeof token !== "string" ||
    !token ||
    token.length > 4096
  ) {
    return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
  }

  let access: StudioAccess;
  try {
    access = await getStudioAccess(token);
  } catch {
    return NextResponse.json({ error: "SANITY_UNAVAILABLE" }, { status: 503 });
  }
  if (access.status === "invalid-session") {
    return NextResponse.json({ error: "INVALID_STUDIO_SESSION" }, { status: 401 });
  }
  if (access.status === "not-admin") {
    return NextResponse.json({ error: "ADMIN_REQUIRED" }, { status: 403 });
  }

  const session = await createTourPreviewSession(id, access.userId);
  const response = NextResponse.redirect(
    new URL(`/tours/preview/${encodeURIComponent(id)}`, request.url),
    {
      status: 303,
    },
  );
  response.cookies.set(TOUR_PREVIEW_COOKIE, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: `/tours/preview/${id}`,
    maxAge: 300,
  });
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("Referrer-Policy", "no-referrer");
  return response;
}
