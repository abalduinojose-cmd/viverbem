// Gera a capa (pôster) de cada reel em public/videos/, a partir de um
// quadro do próprio vídeo, para a home não mostrar caixas pretas enquanto
// o vídeo não é tocado.
//
//   node scripts/gerar-posteres.js
//
// Precisa do ffmpeg: no PATH, ou apontado pela variável FFMPEG
// (ex.: FFMPEG="C:\caminho\ffmpeg.exe"). Para trocar o segundo da capa,
// ajuste a lista abaixo e rode de novo.
const { execFileSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const REELS = [
  { arquivo: "reel-1.mp4", capaEm: 3 },
  { arquivo: "reel-2.mp4", capaEm: 2 },
  { arquivo: "reel-3.mp4", capaEm: 0.6 },
  { arquivo: "reel-4.mp4", capaEm: 44.5 },
];

const ffmpeg = process.env.FFMPEG || "ffmpeg";
const pasta = path.join(__dirname, "..", "public", "videos");

for (const reel of REELS) {
  const entrada = path.join(pasta, reel.arquivo);
  const saida = path.join(pasta, reel.arquivo.replace(/\.mp4$/, ".jpg"));
  if (!fs.existsSync(entrada)) {
    console.warn("Vídeo não encontrado:", entrada);
    continue;
  }
  // 540px de largura basta para o cartão do reel (até 2x em tela retina);
  // -q:v 4 é um JPEG de boa qualidade sem passar de ~60 KB
  execFileSync(
    ffmpeg,
    ["-hide_banner", "-loglevel", "error", "-y", "-ss", String(reel.capaEm), "-i", entrada, "-frames:v", "1", "-vf", "scale=540:-2", "-q:v", "4", saida],
    { stdio: "inherit" }
  );
  console.log("Capa gerada:", path.relative(process.cwd(), saida));
}
