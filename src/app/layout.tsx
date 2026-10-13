import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { Header } from "@/widgets/site-header/server";
import { Footer } from "@/widgets/site-footer";
import "./globals.css";
import Providers from "./providers";
import ScrollToTopOnNavigation from "./ScrollToTopOnNavigation";

const montserrat = Montserrat({
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "Rich Tour – ваш надійний партнер у подорожах!",
  description:
    "Організовуємо комфортні тури по всьому світу! Відпочинок на морі, екскурсії, гарячі тури. Підберемо ідеальний маршрут для вас!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" className="scroll-smooth" data-scroll-behavior="smooth">
      <body
        className={`${montserrat.variable} isolate flex min-h-screen flex-col antialiased text-14light lg:text-16light`}
      >
        <ScrollToTopOnNavigation />
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 pt-[68px] lg:pt-[77px] xl:pt-[99px]">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
