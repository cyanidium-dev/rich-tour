"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Container from "@/components/shared/container/Container";
import TabMenu from "./TabMenu";
import MenuContent from "./MenuContent";

export default function Menu() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const menu = searchParams.get("menu") || "orders";
  const [activeTab, setActiveTab] = useState(menu);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (!params.get("menu")) {
      params.set("menu", "orders");
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  return (
    <section>
      <TabMenu activeTab={activeTab} setActiveTab={setActiveTab} />
      <Container>
        <MenuContent />
      </Container>
    </section>
  );
}
