import HeaderMob from "./HeaderMob";
import HeaderDesk from "./HeaderDesk";
import AnimatedWrapper from "../animation/AnimatedWrapper";
import { getAuthUser } from "@/lib/getAuthUser";

export default async function Header() {
    const user = await getAuthUser();

    const isAuthenticated = Boolean(user);
    const role = user?.role;

    return (
        <header className="fixed top-0 left-0 z-50 w-dvw bg-white">
            <AnimatedWrapper>
                <HeaderMob
                    isAuthenticated={isAuthenticated}
                    role={role}
                />
                <HeaderDesk
                    isAuthenticated={isAuthenticated}
                    role={role}
                />
            </AnimatedWrapper>
        </header>
    );
}
