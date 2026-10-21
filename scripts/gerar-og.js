// Gera public/og.png, a imagem padrão de compartilhamento (1200x630): o
// logo num ladrilho branco sobre o azul-noite da marca, com a linha de
// ouro e o que a farmácia é. As páginas de produto usam a própria foto.
// Rode de novo se o logo ou o texto mudarem: node scripts/gerar-og.js
const sharp = require("sharp");
const path = require("path");

const L = 1200;
const A = 630;
const saida = path.join(__dirname, "..", "public", "og.png");

async function main() {
  const logo = await sharp(path.join(__dirname, "..", "public", "logo.png")).resize({ width: 400 }).png().toBuffer();
  const meta = await sharp(logo).metadata();
  const ladrilhoL = meta.width + 96;
  const ladrilhoA = meta.height + 72;
  const ladrilhoX = Math.round((L - ladrilhoL) / 2);
  const ladrilhoY = 118;

  const fundo = Buffer.from(`
    <svg width="${L}" height="${A}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="noite" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#1b5ea6"/>
          <stop offset="0.45" stop-color="#124a86"/>
          <stop offset="1" stop-color="#0d2340"/>
        </linearGradient>
        <radialGradient id="luz" cx="0.85" cy="0.1" r="0.6">
          <stop offset="0" stop-color="#3f92e0" stop-opacity="0.55"/>
          <stop offset="1" stop-color="#3f92e0" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="ouro" cx="0.05" cy="1" r="0.5">
          <stop offset="0" stop-color="#c9a56b" stop-opacity="0.35"/>
          <stop offset="1" stop-color="#c9a56b" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="fio" x1="0" x2="1">
          <stop offset="0" stop-color="#b48f55"/>
          <stop offset="0.5" stop-color="#e8d4a6"/>
          <stop offset="1" stop-color="#b48f55"/>
        </linearGradient>
      </defs>
      <rect width="${L}" height="${A}" fill="url(#noite)"/>
      <rect width="${L}" height="${A}" fill="url(#luz)"/>
      <rect width="${L}" height="${A}" fill="url(#ouro)"/>
      <rect x="${ladrilhoX}" y="${ladrilhoY}" width="${ladrilhoL}" height="${ladrilhoA}" rx="28" fill="#ffffff"/>
      <rect x="${L / 2 - 60}" y="${ladrilhoY + ladrilhoA + 44}" width="120" height="3" rx="1.5" fill="url(#fio)"/>
      <text x="${L / 2}" y="${ladrilhoY + ladrilhoA + 104}" text-anchor="middle" font-family="Segoe UI, Arial, Helvetica, sans-serif" font-size="40" font-weight="600" fill="#ffffff">Manipulação e Homeopatia em Petrópolis</text>
      <text x="${L / 2}" y="${ladrilhoY + ladrilhoA + 156}" text-anchor="middle" font-family="Segoe UI, Arial, Helvetica, sans-serif" font-size="26" fill="#ffffff" fill-opacity="0.72">Fórmulas preparadas pela receita · 3 lojas · pedido pelo WhatsApp</text>
    </svg>`);

  await sharp(fundo)
    .composite([{ input: logo, left: ladrilhoX + 48, top: ladrilhoY + 36 }])
    .png({ compressionLevel: 9 })
    .toFile(saida);
  console.log("ok", saida);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
