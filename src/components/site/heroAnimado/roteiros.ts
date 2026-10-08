// Os roteiros das animações em canvas. A cena é uma só (cena.ts); o que
// muda de um banner para outro é o elenco: o texto, os potes, a cor da luz
// e o formato do palco.
//
//   dobra   a abertura da home (08/10/2026), banner alto
//   mulher  o banner da Saúde da Mulher (08/10/2026, pedido: "uma animação
//           no mesmo estilo, com os medicamentos em anexo, voltada para a
//           saúde da mulher"), banner de seção, mais baixo, com um link só
//           na base
//
// Nenhum texto promete efeito (RDC 67/2007 e RDC 96/2008): só o nome da
// linha, tipos de produto e o atendimento.

export type FontePote = { src: string; altura: number };

export type Roteiro = {
  /** dobra: o banner alto da abertura; cartao: um banner de seção */
  formato: "dobra" | "cartao";
  /** orbita: a coreografia da dobra (ponto, fio, cápsula, anel e
   *  carrossel); fases: a da Saúde da Mulher (a lua, o horizonte, a fila
   *  de potes e o foco), em fases.ts */
  coreografia: "orbita" | "fases";
  /** Os quatro potes. Na dobra, na ordem do carrossel (90° entre um e
   *  outro); nas fases, na ordem em que vêm para a frente. Nos dois, os
   *  dois primeiros ficam na frente no fecho. A altura é em unidades do
   *  palco. */
  potes: FontePote[];
  /** A linha grande, a ligação (pequena) e a palavra em ouro itálico */
  linhas: [string, string, string];
  /** O rótulo da cápsula: duas palavras em caixa alta e, no meio, a
   *  ligação em ouro itálico */
  rotulo: [string, string, string];
  /** O letreiro: número e texto (número vazio = ponto de ouro, o último
   *  fica até a saída) */
  passos: [string, string][];
  /** A cor da luz atrás dos potes e a segunda cor da poeira de luz (a
   *  primeira é sempre o ouro) */
  luz: [number, number, number];
  poeira: [number, number, number];
};

export const ROTEIROS = {
  dobra: {
    formato: "dobra",
    coreografia: "orbita",
    potes: [
      { src: "/uploads/caramelo-creatina.png", altura: 174 },
      { src: "/uploads/creatina-gummy.png", altura: 188 },
      { src: "/uploads/glow-cream.png", altura: 146 },
      { src: "/uploads/citorepair.png", altura: 194 },
    ],
    linhas: ["Especialistas", "em saúde", "personalizada"],
    rotulo: ["MANIPULAÇÃO", "e", "HOMEOPATIA"],
    passos: [
      ["01", "Envie a foto da receita"],
      ["02", "O farmacêutico confere"],
      ["03", "Manipulamos a sua fórmula"],
      ["04", "Retire ou receba em casa"],
      ["", "Petrópolis, desde 2006"],
    ],
    luz: [80, 160, 235],
    poeira: [138, 184, 234],
  },
  mulher: {
    formato: "cartao",
    coreografia: "fases",
    // Na frente, no fecho, o ZincBlock (alto, rosa) e o Pó finalizador
    // (largo); o Composto pousa atrás, na ponta
    potes: [
      { src: "/uploads/zincblock-fps.png", altura: 196 },
      { src: "/uploads/po-finalizador.png", altura: 150 },
      { src: "/uploads/bastao-clareador.png", altura: 140 },
      { src: "/uploads/composto-emagrecedor.png", altura: 186 },
    ],
    linhas: ["Saúde", "em cada fase da", "mulher"],
    rotulo: ["BELEZA", "e", "AUTOESTIMA"],
    // Um passo por pote, na ordem da fila (o letreiro anda com o foco), e o
    // último no fecho
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
  },
} satisfies Record<string, Roteiro>;

export type NomeRoteiro = keyof typeof ROTEIROS;
