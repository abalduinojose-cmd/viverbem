// As fontes da animação da dobra (08/10/2026: "quero fontes melhores" no
// vídeo; depois "a tipografia pode melhorar, faça como um especialista
// em motion, mantendo a essência").
//
// A essência tipográfica do site são duas vozes: a sans (Instrument Sans)
// e a serifa itálica em ouro (Instrument Serif). A animação mantém as
// duas, nas linhas pequenas e na palavra em ouro, e acrescenta UMA voz de
// display, variável, só na linha grande ("Especialistas"): o peso dela
// anima de leve a pesado enquanto cada letra pousa (o "bloom" de peso),
// coisa que só uma fonte variável permite. Sem preload: o navegador baixa
// quando a animação pede (document.fonts.load), não antes.
//
// Jogos disponíveis em dev (?heroFonte=nome); FONTES_PADRAO é o escolhido.
import { Bricolage_Grotesque, Fraunces, Host_Grotesk, Schibsted_Grotesk } from "next/font/google";
import { instrumentSans, instrumentSerif } from "@/lib/fontes-site";

// Com o eixo de tamanho óptico: em tamanho de display a Bricolage fecha
// as aberturas e mostra os "ink traps"
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], axes: ["opsz"], display: "swap", preload: false });
const host = Host_Grotesk({ subsets: ["latin"], display: "swap", preload: false });
const schibsted = Schibsted_Grotesk({ subsets: ["latin"], display: "swap", preload: false });
const fraunces = Fraunces({ subsets: ["latin"], style: ["normal", "italic"], display: "swap", preload: false });

const sans = instrumentSans.style.fontFamily;
const serif = instrumentSerif.style.fontFamily;

export type FontesDaCena = {
  /** A linha grande ("Especialistas") */
  display: string;
  pesoDisplay: number;
  /** De onde o peso parte no bloom (e para onde volta na saída) */
  pesoDisplayLeve: number;
  /** Espaçamento da linha grande, em em (negativo aperta) */
  trackingDisplay: number;
  /** A linha de ligação ("em saúde"): menor e leve, entre as duas fortes */
  conector: string;
  pesoConector: number;
  escalaConector: number;
  trackingConector: number;
  /** A palavra em ouro itálico ("personalizada"), a maior do bloco */
  destaque: string;
  pesoDestaque: number;
  escalaDestaque: number;
  /** Contorno (em em) que encorpa o itálico no tamanho grande; 0 = nenhum */
  contornoDestaque: number;
  /** O rótulo do topo ("MANIPULAÇÃO e HOMEOPATIA"), em caixa alta dentro
   *  da cápsula de vidro: a mesma família da linha grande, pequena */
  rotulo: string;
  pesoRotulo: number;
  /** Letreiro dos passos */
  apoio: string;
  pesoApoio: number;
};

const vozesDoSite = {
  conector: sans,
  pesoConector: 400,
  escalaConector: 0.56,
  trackingConector: 0.02,
  destaque: serif,
  pesoDestaque: 400,
  escalaDestaque: 1.14,
  contornoDestaque: 0.012,
  apoio: sans,
  pesoApoio: 600,
};

export const JOGOS_DE_FONTES: Record<string, FontesDaCena> = {
  // Bricolage Grotesque: display com personalidade (ink traps, aberturas
  // fechadas), já usada em outros sites do estúdio
  bricolage: { display: bricolage.style.fontFamily, pesoDisplay: 800, pesoDisplayLeve: 300, trackingDisplay: -0.04, rotulo: bricolage.style.fontFamily, pesoRotulo: 600, ...vozesDoSite },
  // Host Grotesk: a grotesca neutra e firme (escolhida no Grand Palazzo)
  host: { display: host.style.fontFamily, pesoDisplay: 800, pesoDisplayLeve: 300, trackingDisplay: -0.045, rotulo: host.style.fontFamily, pesoRotulo: 600, ...vozesDoSite },
  // Schibsted Grotesk: o preto 900, mais punch
  schibsted: { display: schibsted.style.fontFamily, pesoDisplay: 900, pesoDisplayLeve: 400, trackingDisplay: -0.045, rotulo: schibsted.style.fontFamily, pesoRotulo: 600, ...vozesDoSite },
  // A própria voz do site na linha grande (a Instrument Sans só vai a 700)
  instrument: { display: sans, pesoDisplay: 700, pesoDisplayLeve: 400, trackingDisplay: -0.04, rotulo: sans, pesoRotulo: 600, ...vozesDoSite },
  // Serifada na linha grande também (a versão anterior, para comparar)
  fraunces: { display: fraunces.style.fontFamily, pesoDisplay: 700, pesoDisplayLeve: 300, trackingDisplay: -0.02, rotulo: sans, pesoRotulo: 600, ...vozesDoSite },
};

export const FONTES_PADRAO = "bricolage";

/** As fontes que precisam estar prontas antes de medir as letras (as duas
 *  pontas do bloom carregam o mesmo arquivo variável) */
export function fontesParaCarregar(f: FontesDaCena): string[] {
  return [
    `${f.pesoDisplayLeve} 48px ${f.display}`,
    `${f.pesoDisplay} 48px ${f.display}`,
    `${f.pesoConector} 48px ${f.conector}`,
    `italic ${f.pesoDestaque} 48px ${f.destaque}`,
    `${f.pesoRotulo} 12px ${f.rotulo}`,
    `${f.pesoApoio} 16px ${f.apoio}`,
    `400 16px ${f.apoio}`,
  ];
}
