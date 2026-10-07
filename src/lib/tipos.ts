// Tipos compartilhados entre servidor e componentes de cliente.
// (Espelham o schema do Prisma, mas em formato serializável simples.)

export const TIPO_PRODUTO = "PRODUTO";
export const TIPO_COMBO = "COMBO";

export const PAPEL_ADMIN = "ADMIN";
export const PAPEL_OPERADOR = "OPERADOR";

/** Como cada papel aparece nas telas: o ADMIN é o gestor e o OPERADOR é o
 *  colaborador da loja (nome pedido pelo usuário em 07/10/2026). */
export function nomePapel(papel: string | null | undefined): string {
  return papel === PAPEL_ADMIN ? "Gestor" : "Colaborador";
}

// Até quantas fotos um produto pode ter na galeria (painel, 07/10/2026;
// eram 5, o usuário pediu "a opção de colocar mais fotos")
export const MAX_FOTOS_PRODUTO = 10;

// Como o produto pode ser oferecido no site. Manipulado não pode ser
// exposto ao público com preço para venda (RDC 67/2007, item 5.14):
// aparece sem preço e o pedido parte da receita. Industrializado com
// registro na Anvisa segue a venda normal, com preço e carrinho.
export const VENDA_MANIPULADO = "MANIPULADO";
export const VENDA_INDUSTRIALIZADO = "INDUSTRIALIZADO";

/** Na dúvida (registro antigo sem o campo), trata como manipulado. */
export function ehIndustrializado(p: { venda?: string | null }): boolean {
  return p.venda === VENDA_INDUSTRIALIZADO;
}

export interface CategoriaDTO {
  id: number;
  nome: string;
  slug: string;
  ordem: number;
  // false = fora do site inteiro (menu, home, catálogo), cadastro mantido
  visivel: boolean;
  // false = sem a faixa própria na home (segue no menu e no catálogo)
  vitrineHome: boolean;
}

export interface ProdutoDTO {
  id: number;
  nome: string;
  // Endereço do produto no site (ex.: "omega-3-viver-bem")
  slug: string;
  descricao: string;
  precoCentavos: number;
  tipo: string; // "PRODUTO" | "COMBO"
  venda: string; // "MANIPULADO" | "INDUSTRIALIZADO"
  aprovado: boolean;
  // A capa (sempre a primeira da galeria)
  fotoUrl: string | null;
  // A galeria inteira, até MAX_FOTOS_PRODUTO, na ordem de exibição
  fotos: string[];
  // Preço exposto no site (só industrializado; manipulado nunca)
  mostrarPreco: boolean;
  ativo: boolean;
  novidade: boolean;
  destaque: boolean;
  ordem: number;
  categoriaId: number | null;
  categoriaNome?: string | null;
  // Dosagens disponíveis separadas por vírgula (ex.: "250mg, 500mg") ou null
  dosagens: string | null;
  // Campos ricos da página do produto (opcionais)
  composicao: string | null;
  modoUso: string | null;
  indicacoes: string | null;
  apresentacao: string | null;
}

export interface DepoimentoDTO {
  id: number;
  nome: string;
  texto: string;
  nota: number; // estrelas (1 a 5)
  fonte: string; // "Google" | "Loja"
  fotoUrl: string | null; // foto do cliente (opcional)
  ativo: boolean;
  ordem: number;
}

/** O preço que pode aparecer no site, ou null. Desde 05/10/2026 o site não
 *  mostra preço de nada por padrão; o painel liga produto a produto, e só
 *  para industrializado com registro (RDC 67/2007). */
export function precoVisivel(p: { venda?: string | null; mostrarPreco?: boolean; precoCentavos: number }): number | null {
  return ehIndustrializado(p) && p.mostrarPreco && p.precoCentavos > 0 ? p.precoCentavos : null;
}

/** Quebra um texto em itens por quebra de linha ou ";".
 *  Não usa vírgula como separador porque ela aparece nos números
 *  (ex.: "Melatonina 0,21mg" precisa ficar em um item só). */
export function listarItens(texto: string | null | undefined): string[] {
  if (!texto) return [];
  return texto
    .split(/[\n;]/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
}

/** "250mg, 500mg" -> ["250mg", "500mg"]; null/vazio -> [] */
export function listarDosagens(dosagens: string | null | undefined): string[] {
  if (!dosagens) return [];
  return dosagens
    .split(",")
    .map((d) => d.trim())
    .filter((d) => d.length > 0);
}

// Contato oficial da loja
export const WHATSAPP_LOJA = "(24) 98873-3934"; // exibição
export const WHATSAPP_NUMERO = "5524988733934"; // formato do link wa.me
// A manipulação nasceu em outubro de 2006 (a drogaria, em 1999)
export const ANOS_TRADICAO = 20;

// As 3 lojas, conforme o perfil de cada uma no Google. Ficam aqui
// porque o rodapé, a página Sobre e a retirada no carrinho usam a
// mesma lista — se abrir uma loja nova, muda só neste ponto.
export const UNIDADES = [
  {
    bairro: "Centro",
    endereco: "Rua Dom Pedro Segundo, 31, Loja 37",
    telefone: "(24) 2242-3621",
  },
  {
    bairro: "Corrêas",
    endereco: "Rua Dr. Agostinho Goulão, 22",
    telefone: null,
  },
  {
    bairro: "Posse",
    endereco: "Estrada União e Indústria, 33.383",
    telefone: null,
  },
];

/** Link do Google Maps já com a busca da unidade pronta. */
export function linkMapaUnidade(bairro: string, endereco: string): string {
  const busca = `Manipulação Viver Bem, ${endereco}, ${bairro}, Petrópolis RJ`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(busca)}`;
}

// Como o pedido chega até o cliente
export const ENTREGA_RETIRADA = "Retirada na loja";
export const ENTREGA_DELIVERY = "Entrega em casa";

export const INSTAGRAM_PERFIL = "manipulacaoviverbem";
export const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_PERFIL}/`;

// CNPJ da farmácia (do contrato de 28/09/2026). Vai na linha legal do rodapé,
// como pede a RDC 44/2009 para site de farmácia.
export const CNPJ_FARMACIA = "08.303.445/0001-52";

// Total de avaliações no perfil do Google (o site mostra só uma
// seleção delas). Conferido em ago/2026 — atualize quando crescer.
export const AVALIACOES_GOOGLE_TOTAL = 680; // perfil do Centro em 07/10/2026
export const AVALIACOES_GOOGLE_NOTA = 5.0;

export const PERFIL_GOOGLE_URL =
  "https://www.google.com/maps/search/?api=1&query=Viver%20Bem%20-%20Farm%C3%A1cia%20de%20Manipula%C3%A7%C3%A3o&query_place_id=ChIJnz1PkICpmQARI67bD1sFiE8";
