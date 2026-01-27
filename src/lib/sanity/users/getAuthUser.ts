import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

type AuthUser = {
    sub: string;
    role: "agent" | "agency";
};

export async function getAuthUser(): Promise<AuthUser | null> {
    const cookieStore = await cookies();

    const token = cookieStore.get("auth_token")?.value;
    if (!token) return null;

    try {
        return jwt.verify(token, process.env.JWT_SECRET!) as AuthUser;
    } catch {
        return null;
    }
}
