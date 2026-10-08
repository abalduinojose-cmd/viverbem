import type { Metadata, Viewport } from "next";
import "./globals.css";
// Duas vozes e nada mais (sistema "Receita e rótulo", 06/10/2026). As
// instâncias vivem em src/lib/fontes-site.ts, compartilhadas com a
// animação da dobra (que desenha as mesmas fontes no canvas).
import { instrumentSans, instrumentSerif } from "@/lib/fontes-site";

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
    "Há 20 anos em Petrópolis: fórmulas manipuladas, homeopatia e saúde personalizada. Monte seu pedido pelo site e finalize no WhatsApp.",
  openGraph: {
    siteName: "Manipulação Viver Bem",
    locale: "pt_BR",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      // O site rola suave (globals.css); com este atributo o Next desliga a
      // suavidade só durante a troca de página, para não animar o salto ao topo
      data-scroll-behavior="smooth"
      className={`${instrumentSans.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
