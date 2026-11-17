// Gera o ícone do site com o LOGO COMPLETO, a pedido do cliente.
//
// 17/11/2026 ("quero o favicon só com o logo"): o logo vetorizado
// (public/logo.svg) sem o quadrado branco atrás, em fundo transparente,
// ocupando a largura toda. Só o ícone do iPhone (apple-icon.png) mantém o
// fundo branco, porque o iPhone pinta de preto o que for transparente.
//
// Aviso para quem mexer aqui: o logo é um wordmark deitado (proporção
// ~2,4:1). Dentro de um quadrado ele ocupa só a faixa do meio, então
// na aba do navegador (16px) ele aparece bem pequeno. Nos tamanhos
// grandes (atalho do celular, compartilhamento) fica ótimo.
//
// Rode com: node scripts/imagens/gerar-favicon.js
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const RAIZ = process.cwd();
const LOGO = path.join(RAIZ, "public", "logo.svg");
const DESTINO = path.join(RAIZ, "src", "app");

const LADO = 512;
// Margem lateral mínima: o logo encosta quase na borda
const MARGEM = 8;

/** O logo centrado no quadrado, com fundo transparente ou branco */
async function montar(comFundo) {
  const larguraLogo = LADO - MARGEM * 2;
  const marca = await sharp(fs.readFileSync(LOGO), { density: 600 })
    .trim()
    .resize({ width: larguraLogo })
    .png()
    .toBuffer({ resolveWithObject: true });
  const fundo = comFundo ? { r: 255, g: 255, b: 255, alpha: 1 } : { r: 0, g: 0, b: 0, alpha: 0 };
  return sharp({ create: { width: LADO, height: LADO, channels: 4, background: fundo } })
    .composite([{ input: marca.data, left: MARGEM, top: Math.round((LADO - marca.info.height) / 2) }])
    .png()
    .toBuffer();
}

async function principal() {
  const icone = await montar(false);
  const iconeComFundo = await montar(true);

  // Favicon das abas
  await sharp(icone).resize(192, 192).png().toFile(path.join(DESTINO, "icon.png"));
  // Ícone da tela inicial do iPhone (precisa ser opaco)
  await sharp(iconeComFundo).resize(180, 180).png().toFile(path.join(DESTINO, "apple-icon.png"));
  // Versão grande, para o compartilhamento e a instalação como app
  await sharp(icone).resize(512, 512).png().toFile(path.join(RAIZ, "public", "icone-512.png"));

  // O .ico ainda é pedido direto em /favicon.ico por buscadores e
  // agregadores, então vale manter um nosso no lugar do padrão do Next.
  const partes = await Promise.all(
    [16, 32, 48].map(async (lado) => ({
      lado,
      png: await sharp(icone).resize(lado, lado).png().toBuffer(),
    }))
  );
  fs.writeFileSync(path.join(DESTINO, "favicon.ico"), montarIco(partes));

  console.log("icon.png (192), apple-icon.png (180), favicon.ico (16/32/48) e public/icone-512.png gerados.");
}

/** Empacota PNGs em um .ico (o formato aceita PNG embutido desde o Vista). */
function montarIco(partes) {
  const cabecalho = Buffer.alloc(6);
  cabecalho.writeUInt16LE(0, 0); // reservado
  cabecalho.writeUInt16LE(1, 2); // 1 = ícone
  cabecalho.writeUInt16LE(partes.length, 4);

  let deslocamento = 6 + partes.length * 16;
  const entradas = partes.map((p) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(p.lado === 256 ? 0 : p.lado, 0); // largura
    e.writeUInt8(p.lado === 256 ? 0 : p.lado, 1); // altura
    e.writeUInt8(0, 2); // sem paleta
    e.writeUInt8(0, 3); // reservado
    e.writeUInt16LE(1, 4); // planos
    e.writeUInt16LE(32, 6); // bits por pixel
    e.writeUInt32LE(p.png.length, 8);
    e.writeUInt32LE(deslocamento, 12);
    deslocamento += p.png.length;
    return e;
  });

  return Buffer.concat([cabecalho, ...entradas, ...partes.map((p) => p.png)]);
}

principal();
