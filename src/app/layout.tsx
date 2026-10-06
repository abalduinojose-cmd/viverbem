import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";

// Duas vozes e nada mais (sistema "Receita e rótulo", 06/10/2026).
// Instrument Sans: texto, títulos em peso 400 e rótulos em caixa alta.
// Trocou a Fraunces + Inter em 05/10/2026, a pedido ("uma fonte mais
// moderna"). A Bricolage Grotesque, que entrou nos títulos por um dia,
// saiu: o contraste vem do tamanho e da voz serifada, não de uma
// terceira fonte.
const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

// Instrument Serif itálico: a "tinta azul da receita", nas palavras em
// destaque dos títulos, nos números e nas frases dos clientes
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
      className={`${instrumentSans.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
