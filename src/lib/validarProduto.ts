// Valida e normaliza o corpo do produto enviado pelo formulário do
// painel (usado nas rotas de criar e editar produto).
//
// Regra de conformidade aplicada aqui, e não só na tela, para valer
// qualquer que seja o caminho: produto MANIPULADO não guarda o que
// faria dele um "produto de prateleira" no site (dosagem escolhível,
// apresentação fixa, modo de uso, indicações de efeito, selos de
// novidade e destaque, preço exposto). O preço, se vier, fica só para
// uso interno.
import {
  MAX_FOTOS_PRODUTO,
  TIPO_COMBO,
  TIPO_PRODUTO,
  VENDA_INDUSTRIALIZADO,
  VENDA_MANIPULADO,
} from "@/lib/tipos";

function textoOuNulo(valor: unknown): string | null {
  return valor ? String(valor).trim() || null : null;
}

// Só caminhos públicos (/uploads/...) ou URLs completas (Vercel Blob)
const URL_IMAGEM = /^(\/|https?:\/\/)\S+$/;

/** A galeria enviada pelo formulário: até 5 URLs válidas, na ordem. */
export function validarFotos(corpo: Record<string, unknown>): { fotos: string[] } | { erro: string } {
  if (!Array.isArray(corpo.fotos)) {
    // Formulário antigo, só com a capa
    return { fotos: corpo.fotoUrl ? [String(corpo.fotoUrl)] : [] };
  }
  const fotos = corpo.fotos.filter((f): f is string => typeof f === "string" && URL_IMAGEM.test(f));
  if (fotos.length > MAX_FOTOS_PRODUTO) {
    return { erro: `Cada produto pode ter até ${MAX_FOTOS_PRODUTO} fotos.` };
  }
  return { fotos: [...new Set(fotos)] };
}

export function validarCorpoProduto(corpo: Record<string, unknown>) {
  const nome = String(corpo.nome ?? "").trim();
  const descricao = String(corpo.descricao ?? "").trim();
  const tipo = corpo.tipo === TIPO_COMBO ? TIPO_COMBO : TIPO_PRODUTO;
  const venda = corpo.venda === VENDA_INDUSTRIALIZADO ? VENDA_INDUSTRIALIZADO : VENDA_MANIPULADO;
  const industrializado = venda === VENDA_INDUSTRIALIZADO;

  // Preço só é obrigatório para quem é vendido com preço
  const precoBruto = corpo.precoCentavos;
  const precoCentavos = precoBruto === null || precoBruto === undefined || precoBruto === "" ? 0 : Number(precoBruto);

  if (!nome) return { erro: "Informe o nome do produto." } as const;
  if (!descricao) return { erro: "Informe a descrição." } as const;
  if (!Number.isInteger(precoCentavos) || precoCentavos < 0)
    return { erro: "Preço inválido." } as const;
  if (industrializado && precoCentavos === 0)
    return { erro: "Produto industrializado precisa de preço." } as const;

  const galeria = validarFotos(corpo);
  if ("erro" in galeria) return { erro: galeria.erro } as const;

  return {
    dados: {
      nome,
      descricao,
      precoCentavos,
      tipo,
      venda,
      // A capa é sempre a primeira foto da galeria
      fotoUrl: galeria.fotos[0] ?? null,
      ativo: corpo.ativo !== false,
      novidade: industrializado && corpo.novidade === true,
      destaque: industrializado && corpo.destaque === true,
      // Preço no site só para industrializado (RDC 67/2007)
      mostrarPreco: industrializado && corpo.mostrarPreco === true,
      categoriaId: corpo.categoriaId ? Number(corpo.categoriaId) : null,
      // Dosagens: texto livre separado por vírgula (ex.: "250mg, 500mg")
      dosagens: industrializado ? textoOuNulo(corpo.dosagens) : null,
      composicao: textoOuNulo(corpo.composicao),
      modoUso: industrializado ? textoOuNulo(corpo.modoUso) : null,
      indicacoes: industrializado ? textoOuNulo(corpo.indicacoes) : null,
      apresentacao: industrializado ? textoOuNulo(corpo.apresentacao) : null,
    },
    fotos: galeria.fotos,
  } as const;
}
