// Gera o ícone do site com o LOGO COMPLETO, a pedido do cliente.
//
// Aviso para quem mexer aqui: o logo é um wordmark deitado (proporção
// ~2,3:1). Dentro de um quadrado ele ocupa só a faixa do meio, então
// na aba do navegador (16px) ele aparece bem pequeno. Nos tamanhos
// grandes (atalho do celular, compartilhamento) fica ótimo.
//
// Rode com: node scripts/imagens/gerar-favicon.js
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const RAIZ = process.cwd();
const LOGO = path.join(RAIZ, "public", "logo.png");
const DESTINO = path.join(RAIZ, "src", "app");

const LADO = 512;
// Margem lateral: o logo encosta quase na borda, para render o máximo
// de tamanho possível dentro do quadrado.
const MARGEM = 26;

function fundo() {
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${LADO}" height="${LADO}">
       <rect width="${LADO}" height="${LADO}" rx="112" fill="#ffffff"/>
     </svg>`
  );
}

async function principal() {
  const larguraLogo = LADO - MARGEM * 2;

  const marca = await sharp(LOGO)
    .resize({ width: larguraLogo })
    .png()
    .toBuffer({ resolveWithObject: true });

  const icone = await sharp(fundo())
    .composite([
      {
        input: marca.data,
        left: MARGEM,
        top: Math.round((LADO - marca.info.height) / 2),
      },
    ])
    .png()
    .toBuffer();

  // Favicon das abas e ícone da tela inicial do iPhone
  await sharp(icone).resize(192, 192).png().toFile(path.join(DESTINO, "icon.png"));
  await sharp(icone).resize(180, 180).png().toFile(path.join(DESTINO, "apple-icon.png"));
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
