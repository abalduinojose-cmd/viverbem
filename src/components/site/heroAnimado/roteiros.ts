// Os roteiros das animações em canvas. A cena é uma só (cena.ts); o que
// muda de um banner para outro é o elenco: o texto, os potes, a cor da luz
// e o formato do palco.
//
//   dobra   a abertura da home (08/10/2026), banner alto
//   mulher  o banner da Saúde da Mulher (08/10/2026, pedido: "uma animação
//           no mesmo estilo, com os medicamentos em anexo, voltada para a
//           saúde da mulher"), banner de seção, mais baixo, com um link só
//           na base; desde 14/10/2026 na coreografia "vitrine"
//
// Nenhum texto promete efeito (RDC 67/2007 e RDC 96/2008): só o nome da
// linha, tipos de produto e o atendimento.
import { UNIDADES } from "@/lib/tipos";

export type FontePote = { src: string; altura: number };

export type Roteiro = {
  /** dobra: o banner alto da abertura; cartao: um banner de seção */
  formato: "dobra" | "cartao";
  /** orbita: a coreografia da dobra (ponto, fio, cápsula, anel e
   *  carrossel); vitrine: a da Saúde da Mulher (os quatro potes lado a
   *  lado sobre um espelho, com olas), em vitrine.ts */
  coreografia: "orbita" | "vitrine";
  /** Os quatro potes. Na dobra, na ordem do carrossel (90° entre um e
   *  outro), e os dois primeiros ficam na frente no fecho; na vitrine, da
   *  esquerda para a direita. A altura é em unidades do palco. */
  potes: FontePote[];
  /** A linha grande, a ligação (pequena) e a palavra em ouro itálico */
  linhas: [string, string, string];
  /** O rótulo da cápsula: duas palavras em caixa alta e, no meio, a
   *  ligação em ouro itálico */
  rotulo: [string, string, string];
  /** O letreiro dos passos (a Saúde da Mulher, em HTML): número e texto
   *  (número vazio = ponto de ouro, o último fica até a saída) */
  passos?: [string, string][];
  /** A dobra (29/10/2026): as duas formas de receber, uma de cada vez e as
   *  duas juntas no fecho. O verbo vai na voz display, o lugar em ouro
   *  itálico, e o apoio numa linha menor embaixo. Com o mesmo número de
   *  letras por palavra nas duas frases, a troca gira letra a letra. */
  entrega?: { verbo: string; nome: string; apoio: string; icone: "loja" | "moto" }[];
  /** A cor da luz atrás dos potes e a segunda cor da poeira de luz (a
   *  primeira é sempre o ouro) */
  luz: [number, number, number];
  poeira: [number, number, number];
  /** Muda a velocidade de trechos sem refazer a coreografia (encurta ou
   *  alonga o ciclo): o tempo real corre por cima da linha do tempo
   *  original de 7 s em trechos de velocidades diferentes.
   *  Cada par é [segundo real, segundo da coreografia]; começa em [0, 0] e
   *  termina em [duração real, 7]. Sem ritmo, o ciclo dura os 7 s. */
  ritmo?: [number, number][];
};

export const ROTEIROS = {
  dobra: {
    formato: "dobra",
    coreografia: "orbita",
    potes: [
      { src: "/uploads/caramelo-creatina.webp", altura: 174 },
      { src: "/uploads/creatina-gummy.webp", altura: 188 },
      { src: "/uploads/glow-cream.webp", altura: 146 },
      { src: "/uploads/citorepair.webp", altura: 194 },
    ],
    linhas: ["Especialistas", "em saúde", "personalizada"],
    rotulo: ["MANIPULAÇÃO", "e", "HOMEOPATIA"],
    // 29/10/2026: no lugar dos quatro passos do pedido ("envie a foto da
    // receita pode sair, farmacêutico confere pode sair [...] são duas
    // informações falando do delivery ou da retirada na loja"), as duas
    // formas de receber, só com o que o site já afirma (lojas, página do
    // produto): as 3 lojas em Petrópolis e o Delivery em Petrópolis e
    // Região ("Grátis" na retirada saiu a pedido, no mesmo dia). "Retire na loja" e "Receba em casa" têm 6, 2 e
    // 4 letras nas três palavras: é isso que deixa a troca girar letra a
    // letra (cena.ts, desenharEntrega)
    entrega: [
      { verbo: "Retire na", nome: "loja", apoio: `Numa das ${UNIDADES.length} lojas em Petrópolis`, icone: "loja" },
      { verbo: "Receba em", nome: "casa", apoio: "Delivery em Petrópolis e Região", icone: "moto" },
    ],
    luz: [80, 160, 235],
    poeira: [138, 184, 234],
    // 10/10/2026: "tá muito rápido o envie a foto da receita, o
    // farmacêutico confere e os outros escritos, deixe mais leve e
    // devagar". Cada passo ficava 0,62 s na tela. A abertura (o título se
    // formando) segue no tempo original; do carrossel em diante a cena
    // corre a 0,28 da velocidade, por igual, e cada passo fica ~2,2 s
    // (0,9 s parado e inteiro). O carrossel e o fecho ficam lentos junto,
    // e a saída volta quase à velocidade normal. Ciclo de 15,6 s.
    ritmo: [
      [0, 0],
      [2, 2],
      [2.7, 2.7],
      [3.3, 3.05],
      [6.07, 3.825],
      [8.84, 4.6],
      [11.6, 5.375],
      [14.37, 6.15],
      [14.87, 6.4],
      [15.6, 7],
    ],
  },
  mulher: {
    formato: "cartao",
    // 14/10/2026: a vitrine (vitrine.ts) no lugar das fases. O texto é HTML
    // vetorial por cima do canvas (TituloCinetico), e o canvas desenha só a
    // cena
    coreografia: "vitrine",
    // Da esquerda para a direita: os dois altos nas pontas emolduram a fila
    // (ZincBlock e Composto), os dois baixos no meio; a mesma ordem do
    // letreiro
    potes: [
      { src: "/uploads/zincblock-fps.webp", altura: 196 },
      { src: "/uploads/po-finalizador.webp", altura: 150 },
      { src: "/uploads/bastao-clareador.webp", altura: 140 },
      { src: "/uploads/composto-emagrecedor.webp", altura: 186 },
    ],
    linhas: ["Saúde", "em cada fase da", "mulher"],
    rotulo: ["BELEZA", "e", "AUTOESTIMA"],
    // Cinco itens, um por 1/5 da volta (o último fecha a volta)
    passos: [
      ["01", "Proteção solar diária"],
      ["02", "Pele e maquiagem"],
      ["03", "Dermocosméticos"],
      ["04", "Fórmulas com receita"],
      ["", "Com orientação farmacêutica"],
    ],
    // Uma luz rosada no lugar da azul: a cor dos próprios potes, sobre o
    // mesmo azul-noite e o mesmo ouro do site
    luz: [232, 150, 168],
    poeira: [240, 186, 198],
    // A volta inteira esticada por igual, de 7 para 11,9 s: cada item do
    // letreiro fica ~2,4 s na tela (pausa de leitura, como ele pediu em
    // 08/10 e 10/10), e o flutuar e as olas ficam calmos
    ritmo: [
      [0, 0],
      [11.9, 7],
    ],
  },
} satisfies Record<string, Roteiro>;

export type NomeRoteiro = keyof typeof ROTEIROS;
