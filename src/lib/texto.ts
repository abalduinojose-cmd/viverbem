/**
 * Texto comparável: sem acento e em caixa baixa.
 *
 * Quem digita no celular escreve "omega", "colageno", "magnesio". Sem
 * isto a busca não achava "Ômega 3", "Colágeno" nem "Magnésio", que é
 * boa parte do catálogo.
 *
 * NFD separa a letra do acento e a faixa ̀-ͯ apaga os acentos.
 */
export function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

/** Palavras da busca, já normalizadas e sem vazios. */
export function termosDaBusca(busca: string): string[] {
  return normalizar(busca).split(/\s+/).filter(Boolean);
}

function escaparRegex(texto: string): string {
  return texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * O texto do produto atende a todas as palavras da busca?
 *
 * Palavra de uma ou duas letras só vale como palavra inteira: em
 * "vitamina c", o "c" solto casava com quase todo produto do catálogo
 * (qualquer "cápsulas", "creme", "com"), e a busca trazia 15 de 32.
 */
export function combinaComTermos(alvo: string, termos: string[]): boolean {
  return termos.every((t) =>
    t.length <= 2
      ? new RegExp(`(^|[^a-z0-9])${escaparRegex(t)}([^a-z0-9]|$)`).test(alvo)
      : alvo.includes(t)
  );
}
