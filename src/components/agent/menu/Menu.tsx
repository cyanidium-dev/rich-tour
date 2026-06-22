"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TabMenu from "./TabMenu";
import MenuContent from "./content/MenuContent";

export default function Menu({ user }: { user: any }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const menu = searchParams.get("menu") || "orders";

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (!params.get("menu")) {
      params.set("menu", "orders");
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  return (
    <section className="mb-[148px] xl:mb-[180px]">
      <TabMenu activeTab={menu} />
      <MenuContent user={user} />
    </section>
  );
}
