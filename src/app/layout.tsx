import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Instrument_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";

// Instrument Sans: o texto corrido. Trocou a Fraunces + Inter em
// 05/10/2026, a pedido, por "uma fonte mais moderna" (só a fonte mudou).
const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

// Bricolage Grotesque: só os títulos. Entrou em 06/10/2026 na revisão
// anti-genérico, pelo guia de estética da Anthropic: ela tem desenho
// próprio (largura variável, cortes diagonais) e abre contraste com a
// Instrument Sans do texto, no lugar de uma fonte só para tudo.
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["400", "600", "800"],
});

// Instrument Serif itálico: só nas palavras em destaque dos títulos
// ("pela receita"), para manter o itálico serifado que era a cara do site
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: "italic",
});

// Endereço público do site (troque pela URL do domínio próprio no deploy,
// via variável NEXT_PUBLIC_SITE_URL — usada nos links de compartilhamento)
const URL_SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(URL_SITE),
  title: {
    default: "Manipulação Viver Bem · Manipulação e Homeopatia em Petrópolis",
    template: "%s",
  },
  description:
    "Há 19 anos em Petrópolis: fórmulas manipuladas, homeopatia e saúde personalizada. Monte seu pedido pelo site e finalize no WhatsApp.",
  openGraph: {
    siteName: "Manipulação Viver Bem",
    locale: "pt_BR",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${instrumentSans.variable} ${instrumentSerif.variable} ${bricolage.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
