// Fotos enviadas pelo painel viram WebP no servidor (15/10/2026, revisão
// de velocidade: as fotos dos produtos eram PNG de 70 a 160 KB e a home do
// celular baixava 2 MB delas; em WebP ficaram uns 90% menores, sem
// diferença visível). Também limita o lado maior a 1600 px e acerta a
// rotação das fotos de celular. GIF fica como veio (a animação se perderia)
// e, se a conversão falhar por qualquer motivo, vale o arquivo original.
import sharp from "sharp";

const LADO_MAXIMO = 1600;

export async function otimizarImagem(
  arquivo: File,
  extensao: string
): Promise<{ arquivo: File; extensao: string }> {
  if (extensao === ".gif" || extensao === ".webp") return { arquivo, extensao };
  try {
    const entrada = Buffer.from(await arquivo.arrayBuffer());
    const saida = await sharp(entrada)
      .rotate()
      .resize({ width: LADO_MAXIMO, height: LADO_MAXIMO, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 86, alphaQuality: 100, effort: 5 })
      .toBuffer();
    // Só troca quando ficou menor de fato
    if (saida.length >= entrada.length) return { arquivo, extensao };
    return { arquivo: new File([new Uint8Array(saida)], "foto.webp", { type: "image/webp" }), extensao: ".webp" };
  } catch {
    return { arquivo, extensao };
  }
}
