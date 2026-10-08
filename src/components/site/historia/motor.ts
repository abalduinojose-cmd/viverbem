// O motor de rolagem da página A Viver Bem (08/10/2026, pedido: "efeitos
// de scroll, design profissional feito em JavaScript").
//
// Um laço só de requestAnimationFrame para a página inteira. Cada cena
// registrada diz como medir o próprio progresso (0 a 1) a partir da caixa
// do elemento na tela e como aplicá-lo, escrevendo transform e opacity
// direto no DOM (nada de estado do React a cada quadro). Em cada quadro
// vêm primeiro todas as leituras e depois todas as escritas, para não
// forçar o navegador a recalcular o layout no meio. O laço só roda quando
// a rolagem ou a janela mudam, e enquanto a suavização não assentou; as
// cenas longe da tela ficam paradas (IntersectionObserver).
//
// A suavização é o "deslize" das bibliotecas de animação: cada valor
// persegue o alvo um pouco a cada quadro, independente da taxa de quadros.
// A rolagem continua nativa (nada de sequestrar a roda do mouse).
//
// Por que JavaScript e não só CSS (animation-timeline): o CSS de rolagem
// ainda não roda no Safari do iPhone mais antigo nem no Firefox; este
// motor roda em todos.
//
// Roda com "reduzir movimento": tudo aqui anda com a rolagem da própria
// pessoa e nada se move sozinho (a máquina do usuário está com reduce e
// os efeitos foram pedidos por ele). Com reduce a suavização fica curta,
// para o efeito acompanhar a rolagem sem deslizar depois dela.

/** A caixa do elemento na tela, mais o tamanho da janela, em px */
export type Caixa = {
  topo: number;
  altura: number;
  esquerda: number;
  largura: number;
  janela: number;
  larguraJanela: number;
};

export type DefinicaoCena = {
  /** Progresso alvo a partir da caixa (só leitura, nada de escrever no DOM aqui) */
  medir: (c: Caixa) => number;
  /** Aplica o valor já suavizado */
  aplicar: (valor: number) => void;
  /** Quanto o valor persegue o alvo por quadro de 60 Hz (1 = sem suavização) */
  suavidade?: number;
  /** Fica ativa mesmo fora da tela (a barra de leitura, por exemplo) */
  sempre?: boolean;
};

type CenaViva = DefinicaoCena & {
  el: Element;
  atual: number;
  alvo: number;
  aplicado: number;
  ativa: boolean;
};

const cenas = new Set<CenaViva>();
const porElemento = new Map<Element, Set<CenaViva>>();
let pedido = 0;
let ultimoQuadro = 0;
let ligado = false;
let reduzido = false;
let observador: IntersectionObserver | null = null;

export const limitar = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** Saída suave (desacelera no fim), para escalas e entradas */
export const suavizarSaida = (p: number) => 1 - (1 - p) ** 3;

function caixaDe(el: Element, janela: number, larguraJanela: number): Caixa {
  const r = el.getBoundingClientRect();
  return { topo: r.top, altura: r.height, esquerda: r.left, largura: r.width, janela, larguraJanela };
}

function quadro(agora: number) {
  pedido = 0;
  const dt = ultimoQuadro ? Math.min(64, agora - ultimoQuadro) : 16.67;
  ultimoQuadro = agora;
  const janela = window.innerHeight;
  const larguraJanela = window.innerWidth;

  // 1) Leituras
  for (const c of cenas) {
    if (c.ativa) c.alvo = c.medir(caixaDe(c.el, janela, larguraJanela));
  }

  // 2) Escritas
  let mexendo = false;
  for (const c of cenas) {
    if (!c.ativa) continue;
    const base = c.suavidade ?? 0.14;
    const efetiva = reduzido ? Math.max(base, 0.45) : base;
    const fator = efetiva >= 1 ? 1 : 1 - Math.pow(1 - efetiva, dt / 16.67);
    const diferenca = c.alvo - c.atual;
    if (Math.abs(diferenca) < 0.0004) {
      c.atual = c.alvo;
    } else {
      c.atual += diferenca * fator;
      mexendo = true;
    }
    if (c.atual !== c.aplicado) {
      c.aplicado = c.atual;
      c.aplicar(c.atual);
    }
  }

  if (mexendo) agendar();
  else ultimoQuadro = 0;
}

/** Pede um quadro (no máximo um por vez) */
export function agendar() {
  if (!pedido) pedido = requestAnimationFrame(quadro);
}

/** Assenta a cena no valor final, sem suavização (ao sair da tela ou mudar de tamanho) */
function assentar(c: CenaViva) {
  const v = c.medir(caixaDe(c.el, window.innerHeight, window.innerWidth));
  c.alvo = c.atual = c.aplicado = v;
  c.aplicar(v);
}

function ligar() {
  if (ligado) return;
  ligado = true;
  reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.addEventListener("scroll", agendar, { passive: true });
  window.addEventListener("resize", agendar);
  // A rolagem suave (RolagemSuave) avisa a cada passo: os efeitos andam no
  // mesmo quadro da página, sem ficar um quadro atrás
  window.addEventListener("rolagemsuave", () => {
    if (pedido) cancelAnimationFrame(pedido);
    pedido = 0;
    quadro(performance.now());
  });
  observador = new IntersectionObserver(
    (entradas) => {
      for (const e of entradas) {
        const grupo = porElemento.get(e.target);
        if (!grupo) continue;
        for (const c of grupo) {
          if (c.sempre) continue;
          c.ativa = e.isIntersecting;
          // Ao sair, fica no ponto certo (0 ou 1) mesmo depois de uma rolagem rápida
          if (!c.ativa) assentar(c);
        }
      }
      agendar();
    },
    { rootMargin: "35% 0px 35% 0px" }
  );
}

/** Registra uma cena e devolve a função que a desliga. O estado inicial é
 *  aplicado na hora, sem suavização (nada anima na carga da página). */
export function registrarCena(el: Element, definicao: DefinicaoCena): () => void {
  ligar();
  const cena: CenaViva = { ...definicao, el, atual: 0, alvo: 0, aplicado: Number.NaN, ativa: Boolean(definicao.sempre) };
  assentar(cena);
  cenas.add(cena);
  let grupo = porElemento.get(el);
  if (!grupo) {
    grupo = new Set();
    porElemento.set(el, grupo);
    observador?.observe(el);
  }
  grupo.add(cena);
  agendar();
  return () => {
    cenas.delete(cena);
    const g = porElemento.get(el);
    if (!g) return;
    g.delete(cena);
    if (g.size === 0) {
      porElemento.delete(el);
      observador?.unobserve(el);
    }
  };
}

// ---------------------------------------------------------------- medidas

/** De quando o topo entra pela base da tela até quando a base sai pelo topo */
export const atravessar = (c: Caixa) => limitar((c.janela - c.topo) / (c.janela + c.altura));

/** Entre duas linhas da tela (frações da altura, de baixo para cima): começa
 *  quando o topo do elemento cruza `de` e termina quando cruza `ate` */
export const entre = (de: number, ate: number) => (c: Caixa) =>
  limitar((c.janela * de - c.topo) / (c.janela * (de - ate)));

/** Leitura de um bloco: começa com o topo na linha `de` e termina com a base
 *  na linha `ate` (as duas em frações da altura da tela) */
export const lerBloco = (de: number, ate: number) => (c: Caixa) =>
  limitar((c.janela * de - c.topo) / (c.janela * (de - ate) + c.altura));
