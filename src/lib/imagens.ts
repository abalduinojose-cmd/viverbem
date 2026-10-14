// Regras das imagens enviadas pelo painel (fotos de produto e a arte da
// dobra), num lugar só para as duas rotas de upload concordarem.

export const TIPOS_IMAGEM: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

export const TAMANHO_MAXIMO_IMAGEM = 8 * 1024 * 1024; // 8 MB

/** Confere tipo e tamanho; devolve a extensão ou a mensagem de erro. */
export function validarImagem(arquivo: unknown): { extensao: string } | { erro: string } {
  if (!(arquivo instanceof File)) return { erro: "Nenhum arquivo enviado." };
  const extensao = TIPOS_IMAGEM[arquivo.type];
  if (!extensao) return { erro: "Formato não suportado. Envie JPG, PNG, WEBP ou GIF." };
  if (arquivo.size > TAMANHO_MAXIMO_IMAGEM) return { erro: "Arquivo muito grande (máximo 8 MB)." };
  return { extensao };
}

// Vídeo de fundo dos banners (14/10/2026): MP4 ou WEBM, sem som, em laço.
// 40 MB é o teto; acima disso o banner pesa mais que o site inteiro.
export const TIPOS_VIDEO: Record<string, string> = {
  "video/mp4": ".mp4",
  "video/webm": ".webm",
};
export const TAMANHO_MAXIMO_VIDEO = 40 * 1024 * 1024;

/** Imagem (JPG, PNG, WEBP, GIF) ou, quando permitido, vídeo (MP4, WEBM). */
export function validarMidia(
  arquivo: unknown,
  aceitaVideo: boolean
): { extensao: string; tipo: "imagem" | "video" } | { erro: string } {
  if (!(arquivo instanceof File)) return { erro: "Nenhum arquivo enviado." };
  const imagem = TIPOS_IMAGEM[arquivo.type];
  if (imagem) {
    if (arquivo.size > TAMANHO_MAXIMO_IMAGEM) return { erro: "Imagem muito grande (máximo 8 MB)." };
    return { extensao: imagem, tipo: "imagem" };
  }
  const video = TIPOS_VIDEO[arquivo.type];
  if (video && aceitaVideo) {
    if (arquivo.size > TAMANHO_MAXIMO_VIDEO) return { erro: "Vídeo muito grande (máximo 40 MB)." };
    return { extensao: video, tipo: "video" };
  }
  return { erro: aceitaVideo ? "Formato não suportado. Envie JPG, PNG, WEBP, GIF, MP4 ou WEBM." : "Formato não suportado. Envie JPG, PNG, WEBP ou GIF." };
}
