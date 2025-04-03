import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

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
    <html lang="uk">
      <body
        className={`${montserrat.variable} antialiased text-14light lg:text-16light`}
      >
        {children}
      </body>
    </html>
  );
}
