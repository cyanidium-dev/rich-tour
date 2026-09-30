import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken } from "@/lib/auth/session";

export async function proxy(req: NextRequest) {
    const token = req.cookies.get("auth_token")?.value;

    if (!token) {
        return NextResponse.redirect(new URL("/auth/sign-in", req.url));
    }

    const session = await verifySessionToken(token);
    if (!session) {
        return NextResponse.redirect(new URL("/auth/sign-in", req.url));
    }

    const requiredRole = req.nextUrl.pathname.startsWith("/agency") ? "agency" : "agent";
    if (session.role !== requiredRole) {
        return NextResponse.redirect(new URL(`/${session.role}`, req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/agent/:path*", "/agency/:path*"],
};
