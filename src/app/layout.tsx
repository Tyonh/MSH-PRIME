import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "MSH PRIME | Suplementação de Alta Performance",
    template: "%s | MSH PRIME",
  },
  description:
    "O catálogo definitivo para quem busca foco, energia e resultados reais. Proteínas, Creatinas e muito mais.",
  openGraph: {
    title: "MSH PRIME | Catálogo de Suplementos",
    description: "Transforme seu potencial em resultado com a melhor suplementação do mercado.",
    images: ["/hero-banner.png"],
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
