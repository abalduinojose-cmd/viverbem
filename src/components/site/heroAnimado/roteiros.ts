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
  /** Encurta o ciclo sem refazer a coreografia: o tempo real corre por cima
   *  da linha do tempo original de 7 s em trechos de velocidades diferentes.
   *  Cada par é [segundo real, segundo da coreografia]; começa em [0, 0] e
   *  termina em [duração real, 7]. Sem ritmo, o ciclo dura os 7 s. */
  ritmo?: [number, number][];
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
    // O ritmo da apresentação (08/10/2026). Primeiro o ciclo foi encurtado
    // para 5,2 s ("encurte o segundo vídeo"); na mesma hora veio "os
    // medicamentos e nomes estão aparecendo muito rápido, deixe mais lento,
    // como um especialista em motion". Na coreografia original cada pote
    // ficava só 0,2 s parado na frente, e o nome dele no letreiro mal dava
    // para ler. Agora cada pote leva 0,75 s chegando (enquanto o anterior
    // volta e o letreiro corre) e 0,85 s quase parado na frente, flutuando
    // devagar, com o nome legível: 1,6 s por pote. A abertura segue no
    // tempo original, o pouso ganha um respiro e o ciclo fica com 11 s. A
    // velocidade muda em rampas suaves (curva monotônica em HeroAnimado.tsx),
    // nunca em degraus.
    ritmo: [
      [0, 0],
      [2.35, 2.35],
      [3.1, 2.88],
      [3.95, 3.07],
      [4.7, 3.6],
      [5.55, 3.79],
      [6.3, 4.32],
      [7.15, 4.51],
      [7.9, 5.04],
      [8.65, 5.2],
      [9.65, 6.05],
      [10.15, 6.2],
      [11, 7],
    ],
  },
} satisfies Record<string, Roteiro>;

export type NomeRoteiro = keyof typeof ROTEIROS;
