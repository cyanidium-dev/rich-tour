import HeaderMob from "@/widgets/site-header/ui/HeaderMob";
import HeaderDesk from "@/widgets/site-header/ui/HeaderDesk";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import { getAuthUser } from "@/lib/sanity/users/getAuthUser";
import { hasSmartTours } from "@/entities/tour/server";

export const dynamic = "force-dynamic";

export default async function Header() {
  const [user, showSmartTours] = await Promise.all([getAuthUser(), hasSmartTours()]);

  const isAuthenticated = Boolean(user);
  const role = user?.role;

  return (
    <header className="fixed top-0 left-0 z-50 w-dvw bg-white">
      <AnimatedWrapper>
        <HeaderMob isAuthenticated={isAuthenticated} role={role} showSmartTours={showSmartTours} />
        <HeaderDesk isAuthenticated={isAuthenticated} role={role} showSmartTours={showSmartTours} />
      </AnimatedWrapper>
    </header>
  );
}
