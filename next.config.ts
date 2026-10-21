import type { NextConfig } from "next";

// DEMO=1 gera a "vitrine estática" publicada no GitHub Pages
// (só o site do cliente, com os dados congelados em
// src/lib/dados-demo.json). Veja scripts/gerar-demo.js.
const ehDemo = process.env.DEMO === "1";

// No GitHub Pages o site fica em /viverbem (repositório da remodelagem,
// criado em 06/10/2026), e não na raiz do domínio. A primeira versão
// continua em /app_viverbem-, no repositório antigo.
const basePath = ehDemo ? process.env.DEMO_BASE_PATH || "/viverbem" : "";

// A prévia precisa do próprio endereço: sem ele o link compartilhado no
// WhatsApp sai sem imagem e o canonical aponta para um domínio que não existe
const urlDemo = `https://abalduinojose-cmd.github.io${basePath}`;

const nextConfig: NextConfig = {
  // Esconde o indicador de desenvolvimento do Next.js (o botão flutuante
  // no canto da tela)
  devIndicators: false,

  // Permite abrir o app em outros aparelhos da mesma rede durante o
  // desenvolvimento. Ajuste o IP se a rede mudar.
  allowedDevOrigins: ["192.168.10.4", "192.168.10.*"],

  ...(ehDemo
    ? {
        output: "export" as const,
        basePath,
        // O Pages não tem o otimizador de imagens do Next
        images: { unoptimized: true },
        // Serve /produtos como /produtos/index.html
        trailingSlash: true,
      }
    : {}),

  // Cabeçalhos de segurança (21/10/2026). O export estático do Pages não
  // tem servidor, então só valem na hospedagem de verdade: o painel e o
  // site não abrem dentro de outro site, o navegador não "adivinha" o tipo
  // dos arquivos, e câmera, microfone e localização ficam desligados.
  ...(ehDemo
    ? {}
    : {
        async headers() {
          const comuns = [
            { key: "X-Content-Type-Options", value: "nosniff" },
            { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
            { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
            { key: "X-Frame-Options", value: "DENY" },
            { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
          ];
          return [
            { source: "/(.*)", headers: comuns },
            {
              source: "/admin/:path*",
              headers: [...comuns, { key: "Cache-Control", value: "no-store" }, { key: "X-Robots-Tag", value: "noindex, nofollow" }],
            },
          ];
        },
      }),

  env: {
    // Usado pelos <img> e <video> comuns para montar o caminho certo
    NEXT_PUBLIC_BASE_PATH: basePath,
    // Na vitrine não há servidor: o pedido vai direto para o WhatsApp
    NEXT_PUBLIC_DEMO: ehDemo ? "1" : "",
    ...(ehDemo ? { NEXT_PUBLIC_SITE_URL: urlDemo } : {}),
  },
};

export default nextConfig;
