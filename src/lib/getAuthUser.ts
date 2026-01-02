import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export type AuthUser = {
    sub: string;
    role: "agent" | "agency";
    email?: string;
    login?: string;
};

export async function getAuthUser(): Promise<AuthUser | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) return null;

    try {
        const { payload } = await jwtVerify(
            token,
            new TextEncoder().encode(process.env.JWT_SECRET!)
        );

        return payload as AuthUser;
    } catch {
        return null;
    }
}
