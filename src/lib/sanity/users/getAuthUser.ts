import { cookies } from "next/headers";
import {AuthUser, verifySessionToken} from "@/lib/auth/session";

export async function getAuthUser(): Promise<AuthUser | null> {
    const cookieStore = await cookies();

    const token = cookieStore.get("auth_token")?.value;
    if (!token) return null;

    return verifySessionToken(token);
}
