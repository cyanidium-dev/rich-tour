import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Header from "@/components/shared/header/Header";
import Footer from "@/components/shared/footer/Footer";
import "./globals.css";
import Providers from "./providers";

const montserrat = Montserrat({
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
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
    <html lang="uk" className="scroll-smooth">
      <body
        className={`${montserrat.variable} relative z-[1] flex min-h-screen flex-col antialiased text-14light lg:text-16light`}
      >
        <Providers>
          <Header />
          <main className="flex-1 pt-[68px] lg:pt-[77px] xl:pt-[99px]">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
