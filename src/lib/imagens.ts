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
