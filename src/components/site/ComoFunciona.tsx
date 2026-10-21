"use client";
// "Como funciona": a trilha do pedido pela receita, da foto da prescrição
// até a retirada ou a entrega, em quatro passos. Aparece na home, na
// página A Viver Bem e na página /como-funciona (sem o cabeçalho).
//
// Décima versão (21/10/2026, "quero o Como funciona muito melhor, é uma
// parte muito importante; use as melhores skills"), pela doutrina de
// movimento (skill movimento-premium): em vez de quatro cartões iguais,
// UM palco em azul-noite que conta um passo por vez, com uma cena viva
// ao lado do texto. Cada cena é o próprio passo acontecendo (rota "vida
// sequenciada": o movimento É a informação):
//   01 a foto da receita sobe na conversa, "digitando", a resposta chega;
//   02 a receita na prancheta e os três vistos do farmacêutico, um a um,
//      uma pausa, e o valor e o prazo pousam;
//   03 o frasco enche, o rótulo se escreve (nome, fórmula, validade) e o
//      selo de pronto pousa;
//   04 as três lojas pousam no mapa e o Delivery entra pela direita.
// No alto, a trilha: quatro nós ligados por um fio de ouro que se enche
// até o passo da vez (o progresso É a trilha). No computador o palco
// avança sozinho a cada 5,6 s só com a seção à vista, o mouse pausa, e a
// troca é um "cut the curve" para a esquerda: o que sai acelera e some em
// 30% do caminho, o que entra continua na mesma direção e assenta. Até o
// tablet os quatro palcos ficam numa faixa que arrasta para o lado
// (pedido de 10/10/2026), e a trilha acompanha o arrasto; cada cena toca
// quando o seu palco está à vista. Tudo em Web Animations, criado na
// hora de tocar e cancelado ao sair; roda também com "reduzir movimento"
// (pedido do usuário). Depois dos passos, o convite da receita (igual).
//
// Versões anteriores: 14/10 cartões com barra no pé e pontos (nona);
// 11/10 stories com barras no alto (oitava); 11/10 stepper (sétima);
// 10/10 lista com o convite preso (sexta); 08/10 quatro cartões (quinta).
//
// Texto de processo, não de resultado: manipulado não pode ter promessa
// de efeito (RDC 67/2007 e RDC 96/2008). Antes de mexer no texto, confirme
// com o farmacêutico responsável.
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { UNIDADES, WHATSAPP_NUMERO, linkMapaUnidade } from "@/lib/tipos";
import { BotaoEnviarReceita, IconeReceita } from "./BotaoEnviarReceita";
import { IconeLoja } from "./IconesVantagens";
import { IconeMoto } from "./IconeMoto";
import { IconeWhatsApp } from "./icones";

// Quanto tempo cada passo fica no palco (computador)
const DURACAO_PASSO = 5600;

const CURVA = {
  quint: "cubic-bezier(0.22, 1, 0.36, 1)",
  expo: "cubic-bezier(0.16, 1, 0.3, 1)",
  suave: "cubic-bezier(0.25, 1, 0.5, 1)",
  saida: "cubic-bezier(0.895, 0.03, 0.685, 0.22)",
  ambiente: "cubic-bezier(0.37, 0, 0.63, 1)",
};

// ---------------------------------------------------------------- ícones

function IconeConfere() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 5H7.5A1.5 1.5 0 0 0 6 6.5v13A1.5 1.5 0 0 0 7.5 21h9a1.5 1.5 0 0 0 1.5-1.5v-13A1.5 1.5 0 0 0 16.5 5H15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M9 5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5v1H9V5Z" stroke="currentColor" strokeWidth="1.7" />
      <path d="M9 14l2 2 4-4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconeFrasco() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 3h6M10 3v6.5L4.6 19a1.5 1.5 0 0 0 1.3 2.2h12.2a1.5 1.5 0 0 0 1.3-2.2L14 9.5V3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.2 16h9.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function IconeEscudo() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3 5 5.8v5.4c0 4.4 3 8.3 7 9.8 4-1.5 7-5.4 7-9.8V5.8L12 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="m9.3 12 1.9 1.9 3.6-3.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconeCadeado() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="10.5" width="14" height="10" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function Visto({ tamanho = 12 }: { tamanho?: number }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12.5l4.3 4.3L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ---------------------------------------------------------------- os passos

const PASSOS = [
  {
    curto: "Envie a receita",
    titulo: "Envie a receita",
    texto: "Envie a foto pelo WhatsApp ou traga a receita na loja.",
    detalhe: "Pelo site, o pedido já vai com o seu código.",
    icone: <IconeReceita tamanho={22} />,
  },
  {
    curto: "Conferência",
    titulo: "O farmacêutico confere",
    texto: "Ele confere a receita e informa o valor e o prazo.",
    detalhe: "Você confirma só se estiver de acordo.",
    icone: <IconeConfere />,
  },
  {
    curto: "Preparo",
    titulo: "Preparo no laboratório",
    texto: "A fórmula é preparada depois do pedido. Nada fica pronto na prateleira.",
    detalhe: "O rótulo sai com o seu nome, a fórmula e a validade.",
    icone: <IconeFrasco />,
  },
  {
    curto: "Retire ou receba",
    titulo: "Retire ou receba",
    texto: `Sem custo em uma das ${UNIDADES.length} lojas, ou em casa, pelo Delivery, em Petrópolis e Região.`,
    detalhe: "A taxa e o prazo da entrega são combinados pelo WhatsApp.",
    icone: <IconeMoto tamanho={22} />,
    lojas: true,
  },
];

// A linha de confiança, no convite: o aviso legal em dois pontos curtos
const CONFIANCA = [
  { icone: <IconeEscudo />, texto: "Manipulação com receita válida." },
  { icone: <IconeCadeado />, texto: "Sua receita e seus dados ficam só com a nossa equipe." },
];

// ---------------------------------------------------------------- o roteiro das cenas

/** Uma batida do roteiro: os elementos [data-k] recebem os quadros, com o
 *  atraso somado por índice (passo) para os que se repetem */
interface Batida {
  k: string;
  quadros: Keyframe[];
  duracao: number;
  atraso: number;
  curva?: string;
  passo?: number;
  iteracoes?: number;
}

/** Toca um roteiro dentro da cena e devolve como cancelar. Criado na hora
 *  de tocar, cancelado ao sair: o estado de repouso é o das classes. */
function tocar(raiz: HTMLElement, roteiro: Batida[]) {
  const animacoes: Animation[] = [];
  for (const b of roteiro) {
    raiz.querySelectorAll<HTMLElement>(`[data-k="${b.k}"]`).forEach((el, i) => {
      animacoes.push(
        el.animate(b.quadros, {
          duration: b.duracao,
          delay: b.atraso + (b.passo ?? 0) * i,
          easing: b.curva ?? CURVA.quint,
          iterations: b.iteracoes ?? 1,
          fill: "both",
        })
      );
    });
  }
  return () => animacoes.forEach((a) => a.cancel());
}

// Chegadas: opacidade binária (acende em 12% do tempo) + um movimento só
const chega = (de: string): Keyframe[] => [
  { transform: de, opacity: 0 },
  { opacity: 1, offset: 0.12 },
  { transform: "none", opacity: 1 },
];

// O ponto de apoio quando a cena não toca: tudo no estado de repouso
const ROTEIROS: Batida[][] = [
  // 01 a conversa: a foto sobe, "digitando", a resposta chega, os vistos azulam
  [
    { k: "foto", quadros: chega("translateY(16px)"), duracao: 560, atraso: 220, curva: CURVA.expo },
    { k: "visto-cinza", quadros: [{ opacity: 1 }, { opacity: 1, offset: 0.99 }, { opacity: 0 }], duracao: 1300, atraso: 0 },
    { k: "visto-azul", quadros: [{ opacity: 0 }, { opacity: 0, offset: 0.99 }, { opacity: 1 }], duracao: 1300, atraso: 0 },
    { k: "digitando", quadros: [{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none", offset: 0.15 }, { opacity: 1, transform: "none", offset: 0.9 }, { opacity: 0, transform: "none" }], duracao: 1500, atraso: 1400 },
    { k: "ponto", quadros: [{ transform: "translateY(0)" }, { transform: "translateY(-3px)", offset: 0.5 }, { transform: "translateY(0)" }], duracao: 460, atraso: 1550, passo: 150, iteracoes: 3, curva: CURVA.ambiente },
    { k: "resposta", quadros: chega("translateY(16px)"), duracao: 560, atraso: 2900, curva: CURVA.expo },
  ],
  // 02 a prancheta: a receita assenta, três vistos (vãos que encolhem), uma pausa, valor e prazo
  [
    { k: "prancheta", quadros: chega("translateY(14px)"), duracao: 600, atraso: 180, curva: CURVA.expo },
    { k: "linha", quadros: [{ opacity: 0 }, { opacity: 1 }], duracao: 240, atraso: 420, passo: 90 },
    { k: "check", quadros: [{ transform: "scale(0)", opacity: 0 }, { opacity: 1, offset: 0.2 }, { transform: "scale(1)", opacity: 1 }], duracao: 520, atraso: 900, passo: 380 },
    { k: "valor", quadros: chega("translateY(12px)"), duracao: 520, atraso: 2550, curva: CURVA.quint },
  ],
  // 03 o laboratório: o frasco enche, o rótulo se escreve, o selo pousa
  [
    { k: "frasco", quadros: chega("translateY(12px)"), duracao: 560, atraso: 160, curva: CURVA.expo },
    { k: "liquido", quadros: [{ transform: "scaleY(0.06)" }, { transform: "scaleY(1)" }], duracao: 2300, atraso: 500, curva: CURVA.suave },
    { k: "rotulo", quadros: chega("translateY(10px)"), duracao: 520, atraso: 700 },
    { k: "escreve", quadros: [{ clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0 0 0)" }], duracao: 520, atraso: 1150, passo: 330, curva: CURVA.suave },
    { k: "pronto", quadros: [{ transform: "scale(0.6)", opacity: 0 }, { opacity: 1, offset: 0.15 }, { transform: "scale(1)", opacity: 1 }], duracao: 560, atraso: 3000, curva: CURVA.quint },
  ],
  // 04 o mapa: as lojas pousam (vãos que encolhem), a retirada e o Delivery entram pela direita
  [
    { k: "mapa", quadros: chega("translateY(12px)"), duracao: 560, atraso: 160, curva: CURVA.expo },
    { k: "pino", quadros: [{ transform: "scale(0)", opacity: 0 }, { opacity: 1, offset: 0.15 }, { transform: "scale(1)", opacity: 1 }], duracao: 520, atraso: 650, passo: 190 },
    { k: "retirada", quadros: chega("translateX(18px)"), duracao: 520, atraso: 1700 },
    { k: "delivery", quadros: chega("translateX(26px)"), duracao: 600, atraso: 2300, curva: CURVA.expo },
  ],
];

// ---------------------------------------------------------------- as cenas

// A "tela" branca onde a cena acontece, sobre o azul-noite
const TELA = "relative w-full max-w-[20rem] rounded-[1.25rem] bg-white text-navy ring-1 ring-white/20 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)] overflow-hidden";

function CenaReceita() {
  return (
    <div className={`${TELA} p-3 flex flex-col gap-2`} aria-hidden="true">
      <div className="flex items-center gap-2 px-1 pb-2 border-b border-fio">
        <span className="text-[#25D366]">
          <IconeWhatsApp tamanho={16} />
        </span>
        <span className="text-xs font-semibold">Manipulação Viver Bem</span>
        <span className="ml-auto size-1.5 rounded-full bg-[#25D366]" />
      </div>
      {/* A foto da receita, do lado da pessoa */}
      <div data-k="foto" className="self-end max-w-[78%] rounded-2xl rounded-br-md bg-[#e5f6d8] px-2.5 pt-2.5 pb-1.5 opacity-0">
        <div className="flex items-center gap-2.5 rounded-xl bg-white/80 px-2.5 py-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-gelo text-tinta">
            <IconeReceita tamanho={16} />
          </span>
          <span className="text-[0.72rem] leading-tight">
            <span className="block font-semibold">Receita</span>
            <span className="text-cinza">foto · pedido VB-2041</span>
          </span>
        </div>
        <span className="mt-1 flex items-center justify-end gap-1 text-[0.62rem] text-cinza tabular-nums">
          09:41
          <span className="relative inline-block w-4 h-3">
            <span data-k="visto-cinza" className="absolute inset-0 text-grafite-claro"><VistoDuplo /></span>
            <span data-k="visto-azul" className="absolute inset-0 text-[#1c69b5] opacity-0"><VistoDuplo /></span>
          </span>
        </span>
      </div>
      {/* "digitando" */}
      <div data-k="digitando" className="self-start inline-flex items-center gap-1 rounded-2xl rounded-bl-md bg-nevoa px-3 py-2.5 opacity-0">
        <span data-k="ponto" className="size-1.5 rounded-full bg-grafite-claro" />
        <span data-k="ponto" className="size-1.5 rounded-full bg-grafite-claro" />
        <span data-k="ponto" className="size-1.5 rounded-full bg-grafite-claro" />
      </div>
      {/* A resposta da farmácia */}
      <div data-k="resposta" className="self-start max-w-[86%] rounded-2xl rounded-bl-md bg-nevoa px-3 py-2 text-[0.74rem] leading-snug opacity-0">
        Recebemos! O farmacêutico já vai conferir e responder com o valor e o prazo.
      </div>
    </div>
  );
}

function VistoDuplo() {
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden="true">
      <path d="M1 6.5l3 3L10 3M6 9.5l1 1L13 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const LINHAS_RECEITA = ["Ácido hialurônico 1%", "Creme base, 30 g", "Uso tópico, 2x ao dia"];

function CenaConfere() {
  return (
    <div className={`${TELA} p-4`} aria-hidden="true">
      <div data-k="prancheta" className="rounded-xl ring-1 ring-fio bg-nevoa/60 p-3 opacity-0">
        <div className="flex items-center justify-between">
          <span className="text-[0.62rem] font-semibold tracking-[0.14em] uppercase text-cinza">Receita</span>
          <span className="text-[0.62rem] text-grafite-claro tabular-nums">VB-2041</span>
        </div>
        <ul className="mt-2.5 flex flex-col gap-2">
          {LINHAS_RECEITA.map((l) => (
            <li key={l} data-k="linha" className="flex items-center gap-2.5 opacity-0">
              <span className="relative flex size-5 shrink-0 items-center justify-center rounded-full ring-1 ring-fio bg-white">
                <span data-k="check" className="absolute inset-0 flex items-center justify-center rounded-full bg-[#128C4B] text-white opacity-0">
                  <Visto tamanho={11} />
                </span>
              </span>
              <span className="text-[0.78rem] font-medium">{l}</span>
            </li>
          ))}
        </ul>
      </div>
      <div data-k="valor" className="mt-3 flex items-center justify-between rounded-xl bg-navy px-3.5 py-2.5 text-white opacity-0">
        <span className="text-[0.72rem] leading-tight">
          <span className="block text-white/60">Valor e prazo</span>
          <span className="font-semibold">informados pelo WhatsApp</span>
        </span>
        <span className="rounded-full bg-[image:var(--ouro-degrade)] px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-wider text-navy">
          conferido
        </span>
      </div>
    </div>
  );
}

const LINHAS_ROTULO = ["Para: nome do cliente", "Fórmula e dose, como na receita", "Validade e lote"];

function CenaPreparo() {
  return (
    <div className={`${TELA} p-4 flex items-center gap-4`} aria-hidden="true">
      {/* O frasco que enche */}
      <svg data-k="frasco" width="78" height="118" viewBox="0 0 78 118" fill="none" className="shrink-0 opacity-0">
        <defs>
          <clipPath id="cf-frasco">
            <path d="M28 10h22v30l20 54a8 8 0 0 1-7.6 10.4H15.6A8 8 0 0 1 8 94l20-54V10Z" />
          </clipPath>
        </defs>
        <g clipPath="url(#cf-frasco)">
          <rect x="0" y="0" width="78" height="118" fill="#eef3f8" />
          <g data-k="liquido" style={{ transformOrigin: "39px 112px", transform: "scaleY(0.06)" }}>
            <rect x="0" y="22" width="78" height="96" fill="#c9a56b" opacity="0.9" />
            <rect x="0" y="22" width="78" height="6" fill="#e8d4a6" />
          </g>
        </g>
        <path d="M28 10h22v30l20 54a8 8 0 0 1-7.6 10.4H15.6A8 8 0 0 1 8 94l20-54V10Z" stroke="#0d2340" strokeWidth="2" strokeLinejoin="round" />
        <path d="M24 10h30" stroke="#0d2340" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
      {/* O rótulo que se escreve */}
      <div className="min-w-0 flex-1">
        <div data-k="rotulo" className="rounded-xl ring-1 ring-fio bg-nevoa/60 p-3 opacity-0">
          <span className="block text-[0.62rem] font-semibold tracking-[0.14em] uppercase text-cinza">Rótulo</span>
          <ul className="mt-2 flex flex-col gap-1.5">
            {LINHAS_ROTULO.map((l) => (
              <li key={l} data-k="escreve" className="text-[0.74rem] font-medium leading-snug whitespace-nowrap overflow-hidden text-ellipsis" style={{ clipPath: "inset(0 100% 0 0)" }}>
                {l}
              </li>
            ))}
          </ul>
        </div>
        <span data-k="pronto" className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-[#128C4B]/12 px-2.5 py-1 text-[0.68rem] font-semibold text-[#128C4B] opacity-0">
          <Visto tamanho={11} />
          Fórmula pronta
        </span>
      </div>
    </div>
  );
}

// As três lojas no mapa da cena (posições relativas, como no mapa das lojas)
const PINOS = [
  { nome: "Posse", x: 72, y: 22 },
  { nome: "Corrêas", x: 48, y: 50 },
  { nome: "Centro", x: 26, y: 76 },
];

function CenaEntrega() {
  return (
    <div className={`${TELA} p-3`} aria-hidden="true">
      <div data-k="mapa" className="relative h-[8.5rem] overflow-hidden rounded-xl bg-gelo/70 ring-1 ring-fio opacity-0">
        {/* As ruas: linhas finas, como papel milimetrado */}
        <span className="absolute inset-0 opacity-[0.35] [background-image:linear-gradient(rgba(28,105,181,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(28,105,181,0.18)_1px,transparent_1px)] [background-size:1.25rem_1.25rem]" />
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <path d="M18 92 C 30 70, 42 62, 50 50 S 66 30, 80 12" stroke="#c9a56b" strokeWidth="1.2" strokeDasharray="3 2.5" fill="none" vectorEffect="non-scaling-stroke" />
        </svg>
        {PINOS.map((p) => (
          <span key={p.nome} data-k="pino" className="absolute flex flex-col items-center opacity-0" style={{ left: `${p.x}%`, top: `${p.y}%`, transform: "translate(-50%, -100%)", transformOrigin: "50% 100%" }}>
            <span className="rounded-full bg-white px-1.5 py-0.5 text-[0.6rem] font-semibold text-navy ring-1 ring-fio shadow-sm">{p.nome}</span>
            <span className="mt-0.5 size-2.5 rounded-full bg-tinta ring-2 ring-white shadow" />
          </span>
        ))}
      </div>
      <div className="mt-2.5 flex items-center gap-2">
        <span data-k="retirada" className="inline-flex items-center gap-1.5 rounded-full bg-nevoa px-2.5 py-1.5 text-[0.68rem] font-semibold text-navy opacity-0">
          <span className="text-ouro-escuro">
            <IconeLoja tamanho={12} />
          </span>
          Retirada sem custo
        </span>
        <span data-k="delivery" className="inline-flex items-center gap-1.5 rounded-full bg-navy px-2.5 py-1.5 text-[0.68rem] font-semibold text-white opacity-0">
          <span className="text-[#e1c68f]">
            <IconeMoto tamanho={14} />
          </span>
          Delivery
        </span>
      </div>
    </div>
  );
}

const CENAS = [CenaReceita, CenaConfere, CenaPreparo, CenaEntrega];

// ---------------------------------------------------------------- computador ou faixa

// Só o computador troca os palcos sozinho; até o tablet a pessoa arrasta
const CONSULTA_COMPUTADOR = "(min-width: 64rem)";
function assinarLargura(avisar: () => void) {
  const consulta = window.matchMedia(CONSULTA_COMPUTADOR);
  consulta.addEventListener("change", avisar);
  return () => consulta.removeEventListener("change", avisar);
}
const lerLargura = () => window.matchMedia(CONSULTA_COMPUTADOR).matches;
const lerLarguraNoServidor = () => false;

/** O palco de um passo: o texto e a cena. Toca a cena quando é a vez dele
 *  (no computador, o passo ativo; na faixa, quando está à vista). */
function Palco({
  i,
  ativo,
  computador,
  posicao,
  aoEscolher,
}: {
  i: number;
  ativo: boolean;
  computador: boolean;
  /** 0 = em cena; 1 e 2 = esperando à direita; 3 = acabou de sair, à esquerda */
  posicao: number;
  aoEscolher: () => void;
}) {
  const p = PASSOS[i];
  const Cena = CENAS[i];
  const raiz = useRef<HTMLDivElement>(null);
  const cena = useRef<HTMLDivElement>(null);
  const [aVista, setAVista] = useState(false);

  useEffect(() => {
    const el = raiz.current;
    if (!el) return;
    const observador = new IntersectionObserver(([e]) => setAVista(e.isIntersecting && e.intersectionRatio >= 0.35), { threshold: [0, 0.35] });
    observador.observe(el);
    return () => observador.disconnect();
  }, []);

  // A cena toca de novo a cada vez que o palco volta à cena
  const toca = computador ? ativo && aVista : aVista;
  useEffect(() => {
    const el = cena.current;
    if (!toca || !el) return;
    return tocar(el, ROTEIROS[i]);
  }, [toca, i]);

  // No computador: o cut the curve para a esquerda. O que sai acelera
  // (power4.in, 0,32 s) e some em 30% do caminho; o que entra vem da
  // direita, já aceso a 35%, e assenta (quint, 0,5 s) começando no meio do
  // voo do outro. Até o tablet não há transição: é a faixa que anda.
  const estilo: React.CSSProperties = computador
    ? posicao === 0
      ? { transform: "none", opacity: 1, visibility: "visible", transition: `transform 500ms ${CURVA.quint} 150ms, opacity 320ms ${CURVA.suave} 150ms, visibility 0s` }
      : {
          transform: posicao === 3 ? "translateX(-9%)" : "translateX(9%)",
          opacity: 0,
          visibility: "hidden",
          transition: posicao === 3 ? `transform 320ms ${CURVA.saida}, opacity 200ms linear, visibility 0s 320ms` : "none",
        }
    : {};

  return (
    <article
      ref={raiz}
      aria-hidden={computador && !ativo ? true : undefined}
      data-ativo={ativo}
      onClick={aoEscolher}
      style={estilo}
      className="relative w-[min(22rem,86vw)] shrink-0 snap-start lg:w-auto lg:shrink lg:[grid-area:1/1] lg:invisible lg:data-[ativo=true]:visible grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center p-6 md:p-8 lg:p-12 rounded-[1.75rem] lg:rounded-none ring-1 ring-inset ring-white/10 lg:ring-0 bg-white/[0.04] lg:bg-transparent"
    >
      {/* A cena (no celular em cima, no computador à direita) */}
      <div ref={cena} className="relative order-first lg:order-last lg:col-span-5 flex justify-center lg:justify-end">
        <Cena />
      </div>

      {/* O texto do passo */}
      <div className="relative lg:col-span-7">
        <span className="flex items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-[#e1c68f] ring-1 ring-white/15">{p.icone}</span>
          <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-white/60">
            Passo {String(i + 1).padStart(2, "0")} de {String(PASSOS.length).padStart(2, "0")}
          </span>
        </span>
        <h3 className="mt-5 text-[1.5rem] md:text-[1.9rem] lg:text-[2.2rem] font-semibold tracking-[-0.035em] leading-[1.06] text-white text-balance">
          <span className="sr-only">Passo {i + 1}: </span>
          {p.titulo}
        </h3>
        <p className="mt-3 max-w-[40ch] text-[0.98rem] md:text-[1.05rem] leading-relaxed text-white/80">{p.texto}</p>
        <p className="mt-3 flex gap-2 text-[0.85rem] leading-snug text-white/60">
          <span className="mt-0.5 shrink-0 text-[#e1c68f]">
            <Visto tamanho={14} />
          </span>
          {p.detalhe}
        </p>
        {p.lojas && (
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {UNIDADES.map((u) => (
              <li key={u.bairro}>
                <a
                  href={linkMapaUnidade(u.bairro, u.endereco)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[0.78rem] font-medium text-white ring-1 ring-white/15 transition-colors hover:bg-white/20"
                  title={u.endereco}
                >
                  <span className="text-[#e1c68f]">
                    <IconeLoja tamanho={12} />
                  </span>
                  {u.bairro}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}

export function ComoFunciona({
  className = "secao",
  cabecalho = true,
}: {
  className?: string;
  /** Falso na página /como-funciona, que já tem o próprio título */
  cabecalho?: boolean;
}) {
  const computador = useSyncExternalStore(assinarLargura, lerLargura, lerLarguraNoServidor);
  const faixa = useRef<HTMLDivElement>(null);
  const [ativo, setAtivo] = useState(0);
  const [pausado, setPausado] = useState(false);
  const [visivel, setVisivel] = useState(false);
  // Conta as retomadas: a barra da trilha remonta e recomeça junto com o tempo
  const [rodada, setRodada] = useState(0);

  // Só anda com o palco à vista
  useEffect(() => {
    const el = faixa.current;
    if (!el) return;
    const observador = new IntersectionObserver(([e]) => setVisivel(e.isIntersecting), { threshold: 0.3 });
    observador.observe(el);
    return () => observador.disconnect();
  }, []);

  // O próximo passo, depois da duração (pausa com o mouse em cima)
  useEffect(() => {
    if (!computador || !visivel || pausado) return;
    const tempo = setTimeout(() => setAtivo((a) => (a + 1) % PASSOS.length), DURACAO_PASSO);
    return () => clearTimeout(tempo);
  }, [ativo, rodada, computador, visivel, pausado]);

  // Até o tablet: qual palco está à vista na faixa (pelo arrasto)
  const aoRolarFaixa = useCallback(() => {
    const el = faixa.current;
    if (!el || computador) return;
    const primeiro = el.firstElementChild as HTMLElement | null;
    if (!primeiro) return;
    const passo = primeiro.offsetWidth + 16;
    const i = Math.max(0, Math.min(PASSOS.length - 1, Math.round(el.scrollLeft / passo)));
    setAtivo((atual) => (i !== atual ? i : atual));
  }, [computador]);

  const escolher = (i: number) => {
    setAtivo(i);
    setRodada((r) => r + 1);
    if (!computador) {
      const el = faixa.current;
      const alvo = el?.children[i] as HTMLElement | undefined;
      if (el && alvo) el.scrollTo({ left: alvo.offsetLeft - el.offsetLeft - 20, behavior: "smooth" });
    }
  };

  return (
    <section
      id="como-funciona"
      aria-labelledby={cabecalho ? "titulo-como-funciona" : "titulo-passos"}
      className={`max-w-7xl mx-auto px-5 md:px-8 scroll-mt-[calc(var(--altura-cabecalho)+1rem)] ${className}`}
    >
      {!cabecalho && (
        <h2 id="titulo-passos" className="sr-only">
          Os quatro passos do pedido
        </h2>
      )}

      {/* ---------- Cabeçalho: rótulo, título em duas vozes e o apoio ---------- */}
      {cabecalho && (
        <div className="revelar grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-4 lg:items-end">
          <div className="lg:col-span-7">
            <p className="rotulo-pilula">como funciona</p>
            <h2 id="titulo-como-funciona" className="titulo-secao vao-rotulo">
              Do envio da receita <span className="italic">à entrega</span>
            </h2>
          </div>
          <p className="texto-apoio lg:col-span-5 max-w-md lg:pb-1.5 lg:text-right">
            Quatro passos, pelo WhatsApp e com o farmacêutico. Cada fórmula é preparada depois
            do pedido, conforme a receita.
          </p>
        </div>
      )}

      <div className={cabecalho ? "vao-titulo" : ""}>
        {/* ---------- A trilha: quatro nós e o fio de ouro que se enche ---------- */}
        <ol className="relative grid grid-cols-4 gap-2 px-1 sm:px-0" aria-label="Os passos">
          {PASSOS.map((p, i) => {
            const feito = i < ativo;
            const vez = i === ativo;
            return (
              <li key={p.curto} className="relative flex flex-col items-center sm:items-start gap-2.5">
                {/* O fio até o próximo nó: cheio nos passados, enchendo no da vez (só no computador), vazio nos próximos */}
                {i < PASSOS.length - 1 && (
                  <span aria-hidden="true" className="absolute left-1/2 sm:left-[2.6rem] right-[-50%] sm:right-[-0.5rem] top-[1.1rem] h-[2px] -translate-y-1/2 overflow-hidden rounded-full bg-fio">
                    {feito && <span className="block h-full w-full rounded-full bg-[image:var(--ouro-degrade)]" />}
                    {vez && computador && (
                      <span
                        key={`${ativo}-${rodada}`}
                        className="passo-barra-enche block h-full w-full rounded-full bg-[image:var(--ouro-degrade)]"
                        style={{ animationDuration: `${DURACAO_PASSO}ms`, animationPlayState: pausado ? "paused" : "running" }}
                      />
                    )}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => escolher(i)}
                  aria-current={vez ? "step" : undefined}
                  aria-label={`Passo ${i + 1}: ${p.titulo}`}
                  className={`group relative z-[1] flex size-9 items-center justify-center rounded-full ring-2 transition-[background-color,box-shadow,transform] duration-500 ${
                    vez
                      ? "bg-noite ring-ouro text-[#e1c68f] shadow-[0_12px_24px_-12px_rgba(13,35,64,0.7)] scale-110"
                      : feito
                        ? "bg-[image:var(--ouro-degrade)] ring-transparent text-navy"
                        : "bg-white ring-fio text-cinza hover:ring-ouro/60"
                  }`}
                >
                  {feito ? (
                    <Visto tamanho={14} />
                  ) : (
                    <span className="numero-tinta !bg-none !text-current text-[0.95rem]">{String(i + 1).padStart(2, "0")}</span>
                  )}
                </button>
                <span className={`hidden sm:block text-[0.8rem] font-semibold leading-tight transition-colors duration-500 ${vez ? "text-navy" : feito ? "text-ouro-escuro" : "text-cinza"}`}>
                  {p.curto}
                </span>
              </li>
            );
          })}
        </ol>

        {/* ---------- O palco em azul-noite ---------- */}
        <div
          className="relative mt-5 sm:mt-7 overflow-hidden rounded-[2rem] banner-noite em-noite text-white ring-1 ring-inset ring-white/10 shadow-[0_30px_60px_-36px_rgba(13,35,64,0.65)]"
          onMouseEnter={() => setPausado(true)}
          onMouseLeave={() => {
            setPausado(false);
            setRodada((r) => r + 1);
          }}
        >
          <span aria-hidden="true" className="malha-banner" />
          <span aria-hidden="true" className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(201,165,107,0.28),transparent_62%)]" />
          <span aria-hidden="true" className="pointer-events-none absolute -left-20 -bottom-24 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(63,146,224,0.35),transparent_62%)]" />
          <div
            ref={faixa}
            onScroll={aoRolarFaixa}
            className="relative flex gap-4 overflow-x-auto rolagem-sem-barra snap-x snap-mandatory scroll-pl-5 p-5 lg:grid lg:p-0 lg:overflow-visible"
          >
            {PASSOS.map((_, i) => (
              <Palco key={i} i={i} ativo={i === ativo} computador={computador} posicao={(i - ativo + PASSOS.length) % PASSOS.length} aoEscolher={() => escolher(i)} />
            ))}
          </div>
        </div>
        <p className="mt-3 text-center text-xs text-grafite-claro lg:hidden">Arraste para o lado para ver os quatro passos.</p>
      </div>

      {/* ---------- O convite da receita, largo ---------- */}
      <div className="revelar relative mt-10 md:mt-14 overflow-hidden rounded-[2rem] banner-noite em-noite p-6 md:p-8 lg:px-10 lg:py-9 text-white ring-1 ring-inset ring-white/10 shadow-[0_30px_60px_-36px_rgba(13,35,64,0.6)]">
        <span aria-hidden="true" className="malha-banner" />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(201,165,107,0.3),transparent_62%)]"
        />
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 lg:items-center">
          <div className="lg:col-span-7">
            <p className="rotulo-pilula">receita em mãos?</p>
            <p className="titulo-banner mt-3 text-[1.6rem] md:text-[2rem] font-semibold leading-[1.05] tracking-[-0.035em] text-balance">
              Envie a foto <span className="italic">da sua receita.</span>
            </p>
            <p className="mt-3 max-w-[46ch] text-[0.95rem] leading-relaxed text-white/70">
              A foto vai pelo WhatsApp. O farmacêutico confere e responde com o valor e o
              prazo.
            </p>
          </div>
          <div className="lg:col-span-5 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row lg:justify-end">
            <BotaoEnviarReceita comIcone={false} className="botao botao-vivo !gap-2.5">
              <span className="text-ouro-escuro">
                <IconeReceita tamanho={20} />
              </span>
              Enviar receita
            </BotaoEnviarReceita>
            <a
              href={`https://wa.me/${WHATSAPP_NUMERO}`}
              target="_blank"
              rel="noopener noreferrer"
              className="botao botao-vidro !gap-2.5"
            >
              <IconeWhatsApp tamanho={18} className="text-[#25D366]" />
              Tirar uma dúvida
            </a>
          </div>
        </div>
        {/* A linha de confiança */}
        <ul className="relative mt-6 flex flex-col gap-2 border-t border-white/10 pt-5 text-[0.8rem] leading-snug text-white/70 sm:flex-row sm:flex-wrap sm:gap-x-6">
          {CONFIANCA.map((c) => (
            <li key={c.texto} className="flex items-center gap-2.5">
              <span className="shrink-0 text-ouro-claro">{c.icone}</span>
              {c.texto}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
