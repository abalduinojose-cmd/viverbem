// A coreografia "estudio", da dobra da home (14/11/2026). Pedido: "quero
// reformular esse motion da hero [...] que a animação seja mais moderna;
// pode melhorar o fundo, a fonte, a escrita, a manipulação e homeopatia
// também pode mudar [...] uma reformulação significativa; use o
// HyperFrames". A coreografia anterior ("orbita", em cena.ts: ponto de
// ouro, fio, cápsula, anel e carrossel) continua lá, inteira: para voltar,
// basta o roteiro da dobra apontar para ela de novo.
//
// O conceito: um ESTÚDIO DE FOTOGRAFIA DE PRODUTO no azul-noite da marca.
// Tudo nasce e some pela luz (a doutrina do HyperFrames: cada movimento faz
// uma afirmação; aqui a afirmação é "acender"):
//
//   ato I, as luzes (0 a 3,6 s)
//     0,15  o refletor frio da direita acende; 0,5 o quente da esquerda; a
//           poeira de ouro aparece no facho
//     0,3   o sobretítulo "MANIPULAÇÃO ◆ HOMEOPATIA" fecha o espaçamento
//           (sem cápsula, editorial) e o losango de ouro gira para o lugar
//     0,6   "Especialistas" fecha o espaçamento do centro para as pontas,
//           saindo do desfoque (tracking-in); um brilho passa quando assenta
//     1,0   a mesa giratória acende: a borda de ouro se desenha da frente
//           para trás e os potes aparecem pela luz, entrando em foco, o da
//           frente primeiro
//     1,5   "em saúde" sobe palavra a palavra de uma fresta
//     2,05  "personalizada" se MONTA com a poeira de ouro que vem dos
//           refletores, letra a letra, e uma estrela pisca no fim
//   ato II, a mesa (3,7 a 12,7 s): quatro giros de 90° na curva
//     devagar-rápido-devagar, cada um trazendo um pote para a frente (ele
//     sobe um pouco, ganha o foco, a luz quente embaixo e uma faixa de luz
//     no rótulo; os de trás escurecem e desfocam), com um rastro de
//     movimento no meio do giro; o letreiro de entrega anda no mesmo quadro
//   ato III, o fecho (12,7 a 14,4 s): meia volta de 45° deixa os dois potes
//     da dobra lado a lado na frente, junto com as duas formas de receber
//   ato IV, as luzes se apagam (14,4 a 16 s): o título se desfaz (o ouro
//     volta a ser poeira), os potes saem de foco e escurecem, os refletores
//     apagam um depois do outro, e a volta recomeça no escuro, sem emenda
//
// O texto fica PRESO (fixed-anchor-cycle): a câmera anda só no estúdio (um
// avanço lento enquanto as luzes acendem, um passo a cada giro, um recuo no
// fecho); o título não balança nem inclina.
//
// Custo: os fachos são uma imagem pronta (degradê com borda macia, feita uma
// vez) desenhada em modo "lighter"; a mesa é um polígono projetado de 64
// pontos com dois degradês; a poeira do título são ~280 quadradinhos só
// durante a montagem. Os potes usam as imagens prontas da cena (nítido,
// desfocado, reflexo, máscara).
import type { Camera, Coreografia, Linha, Palco } from "./cena";
import { DURACAO, ORBITA_CENTRO, TAU, entraCubica, entraSaiSeno, fonteDe, limitar, mix, ouro, saiCubica, saiQuinta, trecho } from "./cena";

// ---------------------------------------------------------------- tempos (segundos reais da volta)

const LUZ_DIR = 0.15;
const LUZ_ESQ = 0.5;
const ACENDE = 0.85;
const ROTULO = 0.3;
const L1_INI = 0.6;
const L2_INI = 1.5;
const L3_INI = 2.05;
const REVELA = 1.0;
/** Os quatro giros da mesa (e as batidas do letreiro de entrega) */
const PASSOS = [3.7, 6.0, 8.3, 10.6];
/** A meia volta do fecho */
const FECHO = 12.7;
const GIRO = 0.95;
/** As luzes começam a apagar */
const SAI = 14.4;

/** O letreiro de entrega foi feito sobre a coreografia anterior: este é o
 *  mapa do tempo real desta volta para o tempo daquela, batida a batida
 *  (no meio das batidas ele corre a ~0,27 da velocidade, o mesmo ritmo de
 *  antes, então as letras do letreiro andam como andavam) */
const NOS_DO_LETREIRO: [number, number][] = [
  [PASSOS[0] - 1, 3.05 - 0.27],
  [PASSOS[0], 3.05],
  [PASSOS[1], 3.67],
  [PASSOS[2], 4.29],
  [PASSOS[3], 4.91],
  [FECHO, 5.53],
  [SAI, 6.22],
  [SAI + 1, 6.49],
];

const RAD = Math.PI / 180;
/** A curva "nudge" (devagar, rápido, devagar): 10/65/25 da distância em
 *  20/18/62 do tempo; a cauda longa é o que mata o tranco de parar */
const nudge = (p: number) =>
  p <= 0 ? 0 : p >= 1 ? 1 : p < 0.2 ? 0.1 * entraCubica(p / 0.2) : p < 0.38 ? 0.1 + (0.65 * (p - 0.2)) / 0.18 : 0.75 + 0.25 * (1 - (1 - (p - 0.38) / 0.62) ** 4);

/** Aleatório com semente (mulberry32): a mesma poeira em todo carregamento */
function sorteio(semente: number) {
  let s = semente;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let q = Math.imul(s ^ (s >>> 15), 1 | s);
    q = (q + Math.imul(q ^ (q >>> 7), 61 | q)) ^ q;
    return ((q ^ (q >>> 14)) >>> 0) / 4294967296;
  };
}

/** Em que ordem os potes acendem: o da frente primeiro, os dos lados, o de trás */
const ORDEM_LUZ = [0, 1, 3, 2];

type Grao = { tx: number; ty: number; dx: number; dy: number; curva: number; atraso: number };

export function criarEstudio(palco: Palco): Coreografia {
  const { ctx } = palco;
  const ritmo = palco.roteiro.ritmo;
  const CICLO = ritmo ? ritmo[ritmo.length - 1][0] : DURACAO;
  /** Do tempo da coreografia (0 a 7) para os segundos reais da volta */
  const seg = (t: number) => (t * CICLO) / DURACAO;

  // ---------------------------------------------------------------- os fachos de luz

  /** Um facho (degradê com borda macia), feito uma vez: estreito e forte
   *  em cima, largo e sumindo embaixo */
  function fazerFacho(cor: string) {
    const c = document.createElement("canvas");
    c.width = 128;
    c.height = 512;
    const g = c.getContext("2d");
    if (!g) return c;
    g.filter = "blur(9px)";
    const d = g.createLinearGradient(0, 0, 0, 512);
    d.addColorStop(0, `rgba(${cor}, 0.95)`);
    d.addColorStop(0.3, `rgba(${cor}, 0.5)`);
    d.addColorStop(0.75, `rgba(${cor}, 0.14)`);
    d.addColorStop(1, `rgba(${cor}, 0)`);
    g.fillStyle = d;
    g.beginPath();
    g.moveTo(54, 6);
    g.lineTo(74, 6);
    g.lineTo(118, 506);
    g.lineTo(10, 506);
    g.closePath();
    g.fill();
    return c;
  }
  let fachoFrio: HTMLCanvasElement | null = null;
  let fachoQuente: HTMLCanvasElement | null = null;

  /** Quanto um refletor está aceso: acende rápido com um leve clarão (a
   *  lâmpada esquentando) e apaga no fim */
  const aceso = (r: number, liga: number, desliga: number) => {
    const p = trecho(r, liga, liga + ACENDE);
    const sobe = saiCubica(p) * (1 + 0.22 * Math.sin(Math.PI * p));
    return sobe * (1 - entraCubica(trecho(r, desliga, desliga + 0.7)));
  };

  // ---------------------------------------------------------------- a câmera (só o estúdio)

  function camera(t: number): Camera {
    const r = seg(t);
    // Avanço lento enquanto as luzes acendem, um passo a cada giro (com
    // intenção, junto do giro), um recuo no fecho; no escuro do fim volta
    // ao começo (escondida pela falta de luz)
    let z = mix(-46, 0, entraSaiSeno(trecho(r, 0, 3.4)));
    for (const p of PASSOS) z += 6 * entraSaiSeno(trecho(r, p, p + GIRO + 0.25));
    z -= 16 * entraSaiSeno(trecho(r, FECHO, FECHO + 1.3));
    z = mix(z, -46, entraSaiSeno(trecho(r, SAI + 0.7, CICLO)));
    return { x: 0, y: 0, z, giro: 0 };
  }

  // ---------------------------------------------------------------- a mesa giratória

  function anguloMesa(r: number) {
    let g = 0;
    for (const p of PASSOS) g -= 90 * nudge(trecho(r, p, p + GIRO));
    g -= 45 * nudge(trecho(r, FECHO, FECHO + GIRO));
    return g * RAD;
  }

  /** Quanto a mesa está à vista (acende com a luz, apaga no fim) */
  const mesaAcesa = (r: number) => saiCubica(trecho(r, REVELA - 0.1, REVELA + 0.7)) * (1 - entraCubica(trecho(r, SAI + 0.6, SAI + 1.3)));

  function raioMesa() {
    const e = palco.enq();
    return (e.modo === "retrato" ? 138 : 150) * e.ep;
  }

  /** Um ponto da borda da mesa (theta 0 é a frente) */
  function naBorda(raio: number, y: number, th: number, cam: Camera) {
    const e = palco.enq();
    return palco.P(e.potesX + raio * Math.sin(th), y, ORBITA_CENTRO - raio * Math.cos(th), cam);
  }

  function desenharMesa(r: number, cam: Camera) {
    const vis = mesaAcesa(r);
    if (vis <= 0.003) return;
    const e = palco.enq();
    const R = raioMesa();
    const esp = 9 * e.ep;
    const N = 64;
    const topo = [];
    for (let k = 0; k < N; k++) topo.push(naBorda(R, e.chao, (k / N) * TAU, cam));
    const centro = palco.P(e.potesX, e.chao, ORBITA_CENTRO, cam);
    const esq = naBorda(R, e.chao, -Math.PI / 2, cam);
    const dir = naBorda(R, e.chao, Math.PI / 2, cam);
    const frente = naBorda(R, e.chao, 0, cam);
    const fundo = naBorda(R, e.chao, Math.PI, cam);
    const largura = dir.x - esq.x;

    // A sombra no chão, embaixo da mesa
    ctx.globalAlpha = 0.55 * vis;
    palco.luz(palco.sombra, centro.x - largura * 0.62, frente.y - largura * 0.04, largura * 1.24, largura * 0.2);

    // A lateral (a metade da frente, com a espessura)
    ctx.beginPath();
    for (let k = 0; k <= 32; k++) {
      const p = naBorda(R, e.chao, -Math.PI / 2 + (k / 32) * Math.PI, cam);
      if (k === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }
    for (let k = 32; k >= 0; k--) {
      const p = naBorda(R, e.chao + esp, -Math.PI / 2 + (k / 32) * Math.PI, cam);
      ctx.lineTo(p.x, p.y);
    }
    ctx.closePath();
    const lado = ctx.createLinearGradient(0, frente.y - 2, 0, frente.y + esp * frente.s + 2);
    lado.addColorStop(0, "rgba(214, 184, 126, 0.85)");
    lado.addColorStop(0.25, "rgba(40, 62, 98, 0.95)");
    lado.addColorStop(1, "rgba(7, 18, 40, 0.98)");
    ctx.globalAlpha = vis;
    ctx.fillStyle = lado;
    ctx.fill();

    // O tampo: vidro escuro, mais claro no meio, com o reflexo do facho
    ctx.beginPath();
    topo.forEach((p, k) => (k === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
    ctx.closePath();
    const tampo = ctx.createRadialGradient(centro.x, centro.y, 0, centro.x, centro.y, largura * 0.55);
    tampo.addColorStop(0, "rgba(46, 92, 156, 0.62)");
    tampo.addColorStop(0.65, "rgba(16, 38, 76, 0.82)");
    tampo.addColorStop(1, "rgba(9, 24, 52, 0.92)");
    ctx.fillStyle = tampo;
    ctx.fill();
    ctx.globalAlpha = 0.22 * vis;
    const rr = largura * 0.3;
    palco.luz(palco.luzFundo, centro.x + largura * 0.08 - rr, fundo.y - rr * 0.35, rr * 2, rr * 0.8);

    // A borda de ouro: na entrada ela se desenha da frente para trás, pelos
    // dois lados; a metade de trás fica mais apagada
    const traco = trecho(r, REVELA, REVELA + 0.9);
    const ate = saiCubica(traco) * Math.PI;
    ctx.lineWidth = 1.3;
    ctx.strokeStyle = ouro(ctx, esq.x, dir.x, -1);
    const contorno = (de: number, a: number, alfa: number) => {
      if (a <= de) return;
      ctx.globalAlpha = alfa * vis;
      ctx.beginPath();
      const passos = Math.max(2, Math.ceil(((a - de) / TAU) * N));
      for (let k = 0; k <= passos; k++) {
        const p = naBorda(R, e.chao, de + ((a - de) * k) / passos, cam);
        if (k === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
    };
    // A frente (de -90° a 90°) forte, a de trás fraca
    contorno(-Math.min(ate, Math.PI / 2), Math.min(ate, Math.PI / 2), 0.95);
    if (ate > Math.PI / 2) {
      contorno(Math.PI / 2, ate, 0.4);
      contorno(-ate, -Math.PI / 2, 0.4);
    }
    // A ponta de luz que corre a borda enquanto ela se desenha
    if (traco > 0 && traco < 1) {
      for (const lado of [-1, 1]) {
        const p = naBorda(R, e.chao, lado * ate, cam);
        const g = 26 * p.s;
        ctx.globalAlpha = 0.8 * Math.sin(Math.PI * traco);
        palco.luz(palco.luzOuro, p.x - g, p.y - g * 0.5, g * 2, g);
      }
    }

    // As marcas da borda, como num bisel de relógio: giram com a mesa e
    // contam o giro (o brilho fixo, logo abaixo, é a luz parada)
    const giro = anguloMesa(r);
    ctx.fillStyle = "rgb(232, 210, 160)";
    for (let k = 0; k < 32; k++) {
      const th = giro + (k / 32) * TAU;
      const fr = (Math.cos(th) + 1) / 2;
      const p = naBorda(R - 7 * e.ep, e.chao, th, cam);
      ctx.globalAlpha = vis * trecho(traco, 0.6, 1) * (0.12 + 0.55 * fr);
      const rm = (k % 4 === 0 ? 1.3 : 0.75) * p.s;
      ctx.fillRect(p.x - rm, p.y - rm * 0.5, rm * 2, rm);
    }
    // O brilho fixo da luz na borda (frente, à direita)
    const b = naBorda(R, e.chao, 0.55, cam);
    const gb = 34 * b.s;
    ctx.globalAlpha = 0.55 * vis * trecho(traco, 0.5, 1);
    palco.luz(palco.luzOuro, b.x - gb, b.y - gb * 0.4, gb * 2, gb * 0.8);
    ctx.globalAlpha = 1;
  }

  // ---------------------------------------------------------------- os potes

  /** Quanto o pote i está aceso: acende pela luz na entrada (o da frente
   *  primeiro) e apaga no fim */
  const potAceso = (i: number, r: number) => {
    const o = ORDEM_LUZ[i % 4];
    return saiCubica(trecho(r, REVELA + 0.2 + o * 0.13, REVELA + 1.1 + o * 0.13)) * (1 - entraCubica(trecho(r, SAI + 0.25 + o * 0.08, SAI + 1.05 + o * 0.08)));
  };

  function geometriaPote(i: number, r: number, cam: Camera) {
    const e = palco.enq();
    const a = anguloMesa(r) + i * (Math.PI / 2);
    const frente = (Math.cos(a) + 1) / 2;
    // O pote que chega à frente se solta um pouco da mesa (o herói)
    const sobe = 5 * e.ep * limitar((Math.cos(a) - 0.9) / 0.1);
    const x = e.potesX + 104 * e.ep * Math.sin(a);
    const z = ORBITA_CENTRO - 125 * e.ep * Math.cos(a);
    const base = palco.P(x, e.chao, z, cam);
    const q = palco.P(x, e.chao - sobe, z, cam);
    const sp = palco.potes[i];
    const h = sp.altura * e.ep * q.s;
    const l = h * sp.proporcao;
    const vis = potAceso(i, r);
    // Profundidade de campo: foco na frente da mesa; na entrada, o pote
    // entra em foco junto com a luz
    const desfoque = limitar(limitar((z - 50) / 320) + (1 - vis) * 0.7);
    return { a, frente, base, q, h, l, vis, desfoque, z };
  }

  /** A faixa de luz no rótulo do pote que chega à frente: em cada giro, no
   *  pote que vem; na entrada, no pote da frente; no fecho, nos dois */
  function luzNoRotulo(i: number, r: number) {
    const janelas: number[] = [REVELA + 1.05];
    PASSOS.forEach((p, k) => {
      if ((k + 1) % 4 === i) janelas.push(p + GIRO * 0.55);
    });
    if (i === 0) janelas.push(FECHO + GIRO * 0.6);
    if (i === 1) janelas.push(FECHO + GIRO * 0.6 + 0.14);
    for (const j of janelas) {
      if (i !== 0 && j === REVELA + 1.05) continue;
      const p = trecho(r, j, j + 0.85);
      if (p > 0 && p < 1) return p;
    }
    return -1;
  }

  function desenharPotes(r: number, cam: Camera) {
    const lista = palco.potes.map((_, i) => ({ i, g: geometriaPote(i, r, cam) })).filter((p) => p.g.vis > 0.004);
    lista.sort((a, b) => b.g.z - a.g.z);

    // A luz quente embaixo do pote da frente e os reflexos no tampo
    for (const { i, g } of lista) {
      const sp = palco.potes[i];
      const brilho = g.frente ** 4 * g.vis;
      if (brilho > 0.01) {
        const rl = g.l * 0.95;
        ctx.globalAlpha = 0.42 * brilho;
        palco.luz(palco.luzOuro, g.base.x - rl, g.base.y - rl * 0.22, rl * 2, rl * 0.44);
      }
      ctx.globalAlpha = 0.36 * g.vis * mix(0.35, 1, g.frente);
      palco.pote(sp.reflexo, g.q.x - g.l / 2, g.base.y, g.l, g.h * 0.4, true);
      ctx.globalAlpha = 0.5 * g.vis;
      palco.luz(palco.sombra, g.base.x - g.l * 0.55, g.base.y - g.l * 0.09, g.l * 1.1, g.l * 0.18);
    }

    for (const { i, g } of lista) {
      const sp = palco.potes[i];
      // Mais escuro atrás: o estúdio só ilumina a frente
      const alfa = g.vis * mix(0.42, 1, g.frente ** 1.3);
      // Rastro de movimento no meio do giro (amostras um pouco antes)
      const antes = geometriaPote(i, r - 0.05, cam);
      const anda = Math.hypot(g.q.x - antes.q.x, g.q.y - antes.q.y);
      if (anda > 5) {
        for (const [dt, a] of [
          [0.05, 0.16],
          [0.1, 0.08],
        ] as const) {
          const k = geometriaPote(i, r - dt, cam);
          ctx.globalAlpha = alfa * a;
          palco.pote(sp.desfocado, k.q.x - k.l * 0.58, k.q.y - k.h * 1.08, k.l * 1.16, k.h * 1.16, true);
        }
      }
      const x = g.q.x - g.l / 2;
      const y = g.q.y - g.h;
      if (g.desfoque > 0.01) {
        ctx.globalAlpha = alfa * Math.min(1, g.desfoque * 1.6);
        palco.pote(sp.desfocado, g.q.x - g.l * 0.58, g.q.y - g.h * 1.08, g.l * 1.16, g.h * 1.16, true);
      }
      const nitido = alfa * (1 - g.desfoque);
      if (nitido > 0.01) {
        ctx.globalAlpha = nitido;
        palco.pote(sp.nitido, x, y, g.l, g.h);
      }
      const p = luzNoRotulo(i, r);
      if (p >= 0) {
        const centro = mix(-0.35, 1.35, saiCubica(p));
        palco.faixaDeLuz(sp.mascara, x, y, g.l, g.h, x + centro * g.l, g.l * 0.34, 0.6 * Math.sin(Math.PI * p) * g.vis, Infinity, true);
      }
    }
    ctx.globalAlpha = 1;
  }

  // ---------------------------------------------------------------- a luz do estúdio

  /** O escuro do estúdio: uma camada azul-noite por cima do fundo do banner
   *  (o azul da marca), que se abre onde a luz bate, na mesa, quando os
   *  refletores acendem, e volta a fechar no fim. É o contraste que faz os
   *  fachos, a mesa e o texto aparecerem; nas bordas fica o azul-noite da
   *  marca (#0D2340), no centro o azul claro */
  function desenharEscuro(r: number, cam: Camera) {
    const e = palco.enq();
    const luz = limitar(Math.max(aceso(r, LUZ_DIR, SAI + 0.9), aceso(r, LUZ_ESQ, SAI + 0.6) * 0.85));
    const R = raioMesa();
    const c = palco.P(e.potesX, e.chao - R * 0.55, ORBITA_CENTRO, cam);
    const raio = Math.max(e.largura * (e.modo === "retrato" ? 1.1 : 0.62), e.altura * 0.9);
    const g = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, raio);
    const apagado = 0.84;
    g.addColorStop(0, `rgba(3, 11, 28, ${mix(apagado, 0.04, luz).toFixed(3)})`);
    g.addColorStop(0.4, `rgba(3, 11, 28, ${mix(apagado, 0.36, luz).toFixed(3)})`);
    g.addColorStop(1, `rgba(3, 11, 28, ${mix(apagado, 0.66, luz).toFixed(3)})`);
    ctx.globalAlpha = 1;
    ctx.fillStyle = g;
    ctx.fillRect(-e.largura, -e.altura, e.largura * 3, e.altura * 3);
  }

  function desenharLuzes(r: number, cam: Camera) {
    const e = palco.enq();
    const frio = aceso(r, LUZ_DIR, SAI + 0.9);
    const quente = aceso(r, LUZ_ESQ, SAI + 0.6);
    const geral = Math.max(frio, quente * 0.8);
    if (geral <= 0.003) return;
    const R = raioMesa();
    const centro = palco.P(e.potesX, e.chao - R * 0.55, ORBITA_CENTRO + 60, cam);
    const largura = R * 2 * centro.s;

    // O halo azul atrás da mesa (a luz batendo no fundo do estúdio)
    const halo = largura * 0.95;
    ctx.globalAlpha = 0.42 * geral;
    palco.luz(palco.luzFundo, centro.x - halo, centro.y - halo * 0.8, halo * 2, halo * 1.6);
    // O círculo de luz no chão, sob a mesa
    const chao = palco.P(e.potesX, e.chao, ORBITA_CENTRO, cam);
    const poca = largura * 0.7;
    ctx.globalAlpha = 0.3 * geral;
    palco.luz(palco.luzOuro, chao.x - poca, chao.y - poca * 0.2, poca * 2, poca * 0.4);
    ctx.globalAlpha = 1;

    // Os dois fachos, somando luz ("lighter")
    fachoFrio ??= fazerFacho("196, 220, 255");
    fachoQuente ??= fazerFacho("240, 208, 150");
    const facho = (img: HTMLCanvasElement, xFonte: number, xAlvo: number, abre: number, forca: number) => {
      if (forca <= 0.003) return;
      const fonte = palco.P(xFonte, 0, ORBITA_CENTRO + 40, cam);
      const alvo = palco.P(xAlvo, e.chao, ORBITA_CENTRO, cam);
      const sx = fonte.x;
      const sy = -40;
      const dx = alvo.x - sx;
      const dy = alvo.y - sy;
      const comp = Math.hypot(dx, dy) * 1.12;
      const w = largura * abre;
      ctx.save();
      ctx.translate(sx, sy);
      ctx.rotate(Math.atan2(-dx, dy));
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = forca;
      palco.luz(img, -w / 2, 0, w, comp);
      ctx.restore();
    };
    facho(fachoFrio, e.potesX + 175 * e.ep, e.potesX + 12 * e.ep, 0.95, 0.46 * frio);
    facho(fachoQuente, e.potesX - 235 * e.ep, e.potesX - 18 * e.ep, 0.8, 0.32 * quente);
  }

  // ---------------------------------------------------------------- o texto (preso, sem câmera)

  /** A origem de uma linha no palco */
  const origem = (x: number, y: number) => {
    const e = palco.enq();
    return { x: e.cx + x, y: e.cy + y };
  };

  /** O sobretítulo: "MANIPULAÇÃO ◆ HOMEOPATIA", sem cápsula. As letras
   *  fecham o espaçamento a partir do centro; o losango gira para o lugar */
  function desenharRotulo(r: number) {
    const e = palco.enq();
    const tx = palco.textos();
    const p1 = tx.rotulo.partes[0].linha;
    const p2 = tx.rotulo.partes[2].linha;
    const tr = e.tamanhoRotulo;
    const o = origem(e.textoX, tx.baseRotulo);
    const xLosango = p1.largura + tr * 1.05;
    const x2 = p1.largura + tr * 2.1;
    const letras: { ch: string; x: number; l: Linha }[] = [];
    p1.texto.split("").forEach((ch, i) => letras.push({ ch, x: p1.xs[i], l: p1 }));
    p2.texto.split("").forEach((ch, i) => letras.push({ ch, x: x2 + p2.xs[i], l: p2 }));
    const meio = (x2 + p2.largura) / 2;
    const sai = entraCubica(trecho(r, SAI + 0.05, SAI + 0.6));
    if (r < ROTULO || sai >= 1) return;
    ctx.save();
    ctx.translate(o.x, o.y);
    // Um pouco maior que o rótulo de antes: sem a cápsula, ele tem de
    // segurar o alto sozinho
    ctx.scale(1.15, 1.15);
    ctx.font = fonteDe(p1);
    ctx.fillStyle = "rgba(255, 255, 255, 0.88)";
    letras.forEach((le) => {
      const d = Math.abs(le.x - meio) / Math.max(1, meio);
      const p = trecho(r, ROTULO + 0.1 + d * 0.18, ROTULO + 0.85 + d * 0.18);
      if (p <= 0) return;
      const fecha = saiQuinta(p);
      const abre = (1 - fecha) * 0.9 + sai * 0.6;
      ctx.globalAlpha = limitar(p * 4) * (1 - sai);
      ctx.fillText(le.ch, le.x + (le.x - meio) * abre, 0);
    });
    // O losango de ouro: gira 90° e cresce para o lugar
    const pl = trecho(r, ROTULO, ROTULO + 0.55);
    if (pl > 0) {
      const s = tr * 0.3 * saiQuinta(pl) * (1 - sai);
      ctx.save();
      ctx.translate(xLosango, -tr * 0.36);
      ctx.rotate(Math.PI / 4 + (1 - saiQuinta(pl)) * Math.PI * 0.5);
      ctx.globalAlpha = 1 - sai;
      ctx.fillStyle = ouro(ctx, -s, s, -1);
      ctx.fillRect(-s, -s, s * 2, s * 2);
      ctx.restore();
      ctx.globalAlpha = 0.45 * (1 - sai) * Math.sin(Math.PI * limitar(pl * 1.2));
      const g = tr * 1.6;
      palco.luz(palco.luzOuro, xLosango - g, -tr * 0.36 - g, g * 2, g * 2);
    }
    ctx.restore();
  }

  /** "Especialistas": as letras fecham o espaçamento do centro para as
   *  pontas, saindo do desfoque (cópias de lado que se juntam), com um
   *  degradê de luz (branco em cima, um azul-gelo na base: a letra
   *  iluminada pelo refletor); assentada, um brilho passa uma vez */
  function desenharLinha1(r: number) {
    const e = palco.enq();
    const tx = palco.textos();
    const l = tx.l1;
    const n = l.texto.length;
    const c = (n - 1) / 2;
    const o = origem(e.textoX + l.recuo, tx.base1);
    const fim = L1_INI + c * 0.028 + 1.0;
    const saiDe = (i: number) => SAI + 0.12 + Math.abs(i - c) * 0.012;
    if (r < L1_INI || r > SAI + 0.9) return;
    ctx.save();
    ctx.translate(o.x, o.y);
    const luzDaLetra = ctx.createLinearGradient(0, -l.ascent, 0, l.descent * 0.3);
    luzDaLetra.addColorStop(0, "#ffffff");
    luzDaLetra.addColorStop(0.5, "#f3f7fc");
    luzDaLetra.addColorStop(1, "#c3d5ee");
    ctx.font = fonteDe(l);
    ctx.fillStyle = luzDaLetra;
    const sprites = palco.sprites();
    if (r >= fim && r < SAI + 0.12) {
      for (let i = 0; i < n; i++) ctx.fillText(l.texto[i], l.xs[i], 0);
      const b = trecho(r, fim, fim + 0.55);
      if (b > 0 && b < 1 && sprites) {
        const v = sprites.l1Luz;
        palco.faixaDeLuz(v.tela, v.x0, v.y0, v.l, v.a, mix(-0.25, 1.25, saiCubica(b)) * l.largura, l.largura * 0.22, 0.85);
      }
      ctx.restore();
      return;
    }
    for (let i = 0; i < n; i++) {
      const p = trecho(r, L1_INI + Math.abs(i - c) * 0.028, L1_INI + Math.abs(i - c) * 0.028 + 1.0);
      if (p <= 0) continue;
      const q = entraCubica(trecho(r, saiDe(i), saiDe(i) + 0.5));
      if (q >= 1) continue;
      const fecha = saiQuinta(p);
      const aberto = (1 - fecha) + q * 0.7;
      const x = l.xs[i] + (i - c) * l.tamanho * 0.28 * aberto;
      const borrao = (1 - fecha) * l.tamanho * 0.16 + q * l.tamanho * 0.12;
      const alfa = limitar(p * 5) * (1 - q);
      if (borrao > 0.6) {
        ctx.globalAlpha = alfa * 0.16;
        for (const k of [-1, -0.5, 0.5, 1]) ctx.fillText(l.texto[i], x + k * borrao, 0);
      }
      ctx.globalAlpha = alfa * mix(0.35, 1, fecha) * (1 - q * 0.5);
      ctx.fillText(l.texto[i], x, 0);
    }
    ctx.restore();
  }

  /** "em saúde": cada palavra sobe de uma fresta na sua base */
  function desenharLinha2(r: number) {
    const e = palco.enq();
    const tx = palco.textos();
    const l = tx.l2;
    if (r < L2_INI || r > SAI + 0.8) return;
    const o = origem(e.textoX + l.recuo, tx.base2);
    const palavras: { ini: number; fim: number }[] = [];
    let comeco = 0;
    for (let i = 0; i <= l.texto.length; i++) {
      if (i === l.texto.length || l.texto[i] === " ") {
        if (i > comeco) palavras.push({ ini: comeco, fim: i });
        comeco = i + 1;
      }
    }
    const curso = l.ascent + l.descent + 6;
    ctx.save();
    ctx.translate(o.x, o.y);
    ctx.beginPath();
    ctx.rect(-l.tamanho, -l.ascent * 1.6, l.largura + l.tamanho * 2, l.ascent * 1.6 + l.descent + 3);
    ctx.clip();
    ctx.font = fonteDe(l);
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    palavras.forEach((w, j) => {
      const p = trecho(r, L2_INI + j * 0.12, L2_INI + j * 0.12 + 0.62);
      if (p <= 0) return;
      const q = entraCubica(trecho(r, SAI + 0.08 + (palavras.length - 1 - j) * 0.06, SAI + 0.45 + (palavras.length - 1 - j) * 0.06));
      const dy = (1 - saiQuinta(p)) * curso + q * curso;
      for (let i = w.ini; i < w.fim; i++) ctx.fillText(l.texto[i], l.xs[i], dy);
    });
    ctx.restore();
  }

  // ---- "personalizada": a poeira de ouro que monta as letras

  let chavePoeira = "";
  let poeira: Grao[][] = [];

  /** Os grãos de cada letra: pontos sorteados dentro do desenho da letra
   *  (rasterizada uma vez, no tamanho do palco) e de onde cada um vem: da
   *  direita, onde estão os refletores, numa curva */
  function prepararPoeira(l: Linha) {
    const chave = `${l.texto}|${l.tamanho}|${l.familia}|${l.peso}`;
    if (chave === chavePoeira) return poeira;
    chavePoeira = chave;
    const rnd = sorteio(1406);
    const tam = l.tamanho;
    const c = document.createElement("canvas");
    c.width = Math.ceil(tam * 1.8);
    c.height = Math.ceil(tam * 1.9);
    const g = c.getContext("2d", { willReadFrequently: true });
    poeira = l.texto.split("").map((ch) => {
      if (!g || ch === " ") return [];
      const px = Math.round(tam * 0.35);
      const py = Math.round(tam * 1.3);
      g.clearRect(0, 0, c.width, c.height);
      g.font = fonteDe(l);
      g.fillStyle = "#fff";
      g.fillText(ch, px, py);
      const dados = g.getImageData(0, 0, c.width, c.height).data;
      const dentro: [number, number][] = [];
      for (let y = 0; y < c.height; y += 2) {
        for (let x = 0; x < c.width; x += 2) {
          if (dados[(y * c.width + x) * 4 + 3] > 140) dentro.push([x - px, y - py]);
        }
      }
      const graos: Grao[] = [];
      const quantos = Math.min(22, dentro.length);
      for (let k = 0; k < quantos; k++) {
        const [tx, ty] = dentro[Math.floor(rnd() * dentro.length)];
        graos.push({
          tx,
          ty,
          dx: tam * (0.9 + rnd() * 3.2),
          dy: tam * ((rnd() - 0.35) * 1.6),
          curva: (rnd() - 0.5) * tam * 1.1,
          atraso: rnd() * 0.16,
        });
      }
      return graos;
    });
    return poeira;
  }

  function desenharLinha3(r: number) {
    const e = palco.enq();
    const tx = palco.textos();
    const l = tx.l3;
    const n = l.texto.length;
    if (n === 0 || r < L3_INI || r > SAI + 1.2) return;
    const graos = prepararPoeira(l);
    const o = origem(e.textoX - l.tamanho * 0.03, tx.base3);
    const inicio = (i: number) => L3_INI + i * 0.055;
    const pronta = inicio(n - 1) + 0.78;
    const desfaz = (i: number) => SAI + 0.15 + (n - 1 - i) * 0.03;
    ctx.save();
    ctx.translate(o.x, o.y);
    const sprites = palco.sprites();
    // Assentada (e antes de se desfazer): a imagem pronta, com a estrela no
    // fim da montagem e o brilho do fecho
    if (r >= pronta && r < desfaz(n - 1) && sprites) {
      palco.pintarSprite(sprites.l3);
      const brilho = r < FECHO ? trecho(r, pronta - 0.05, pronta + 0.5) : trecho(r, FECHO + 0.9, FECHO + 1.5);
      if (brilho > 0 && brilho < 1) {
        const v = sprites.l3Luz;
        palco.faixaDeLuz(v.tela, v.x0, v.y0, v.l, v.a, mix(-0.3, 1.3, saiCubica(brilho)) * l.largura, l.largura * 0.24, 0.8);
      }
      estrela(l, trecho(r, pronta - 0.12, pronta + 0.32));
      ctx.restore();
      return;
    }
    // Letra a letra: o ouro (degradê na palavra inteira, com o contorno
    // fino que encorpa o itálico) e os grãos
    ctx.font = fonteDe(l);
    ctx.lineJoin = "round";
    const estilo = ouro(ctx, 0, l.largura, -1);
    const contorno = 0.012 * l.tamanho;
    const pontos: { x: number; y: number; a: number }[] = [];
    for (let i = 0; i < n; i++) {
      const s = inicio(i);
      const enche = saiCubica(trecho(r, s + 0.42, s + 0.76));
      const some = saiCubica(trecho(r, desfaz(i), desfaz(i) + 0.3));
      const letra = enche * (1 - some);
      if (letra > 0.01) {
        ctx.globalAlpha = letra;
        ctx.strokeStyle = estilo;
        ctx.lineWidth = contorno;
        ctx.strokeText(l.texto[i], l.xs[i], 0);
        ctx.fillStyle = estilo;
        ctx.fillText(l.texto[i], l.xs[i], 0);
      }
      // Os grãos: chegam numa curva e se apagam quando a letra acende; na
      // saída, saem da letra para cima e para a esquerda, acelerando
      for (const gr of graos[i] ?? []) {
        const chega = trecho(r, s + gr.atraso, s + gr.atraso + 0.62);
        const vai = entraCubica(trecho(r, desfaz(i) + gr.atraso * 0.5, desfaz(i) + gr.atraso * 0.5 + 0.7));
        let x: number;
        let y: number;
        let a: number;
        if (vai > 0) {
          x = l.xs[i] + gr.tx - vai * (gr.dx * 0.6);
          y = gr.ty - vai * (gr.dx * 0.5) + Math.sin(Math.PI * vai) * gr.curva * 0.5;
          a = Math.sin(Math.PI * limitar(vai * 1.4)) * 0.9;
        } else if (chega > 0) {
          const ec = saiCubica(chega);
          x = l.xs[i] + gr.tx + (1 - ec) * gr.dx;
          y = gr.ty + (1 - ec) * gr.dy + Math.sin(Math.PI * ec) * gr.curva;
          a = limitar(chega * 6) * (1 - enche) * 0.95;
        } else continue;
        if (a > 0.02) pontos.push({ x, y, a });
      }
      // Um brilho miúdo onde a letra está se formando
      const forma = trecho(r, s + 0.2, s + 0.8);
      if (forma > 0 && forma < 1) {
        const gx = l.xs[i] + l.tamanho * 0.25;
        const rr = l.tamanho * 0.45;
        ctx.globalAlpha = 0.28 * Math.sin(Math.PI * forma);
        palco.luz(palco.luzOuro, gx - rr, -l.ascent * 0.45 - rr, rr * 2, rr * 2);
      }
    }
    ctx.fillStyle = "rgb(236, 214, 164)";
    const gt = Math.max(1, l.tamanho * 0.026);
    for (const p of pontos) {
      ctx.globalAlpha = p.a;
      ctx.fillRect(p.x - gt / 2, p.y - gt / 2, gt, gt);
    }
    ctx.restore();
  }

  /** A estrela de brilho no fim de "personalizada" */
  function estrela(l: Linha, g: number) {
    if (g <= 0 || g >= 1) return;
    const a = Math.sin(Math.PI * g);
    const r = l.tamanho * 0.32 * a;
    ctx.save();
    ctx.translate(l.largura - l.tamanho * 0.08, -l.ascent * 0.88);
    ctx.globalAlpha = 0.4 * a;
    palco.luz(palco.luzOuro, -r * 1.8, -r * 1.8, r * 3.6, r * 3.6);
    ctx.rotate(g * Math.PI * 0.5);
    ctx.globalAlpha = 0.95 * a;
    ctx.fillStyle = "#fff6dc";
    ctx.beginPath();
    ctx.moveTo(0, -r);
    ctx.quadraticCurveTo(0, 0, r * 0.7, 0);
    ctx.quadraticCurveTo(0, 0, 0, r);
    ctx.quadraticCurveTo(0, 0, -r * 0.7, 0);
    ctx.quadraticCurveTo(0, 0, 0, -r);
    ctx.fill();
    ctx.restore();
  }

  // ---------------------------------------------------------------- o letreiro de entrega

  /** O tempo da coreografia anterior em que o letreiro deve estar */
  function tempoDoLetreiro(r: number) {
    const nos = NOS_DO_LETREIRO;
    if (r <= nos[0][0]) return nos[0][1] - (nos[0][0] - r) * 0.27;
    for (let i = 0; i < nos.length - 1; i++) {
      const [a, ya] = nos[i];
      const [b, yb] = nos[i + 1];
      if (r <= b) return mix(ya, yb, (r - a) / (b - a));
    }
    return 9;
  }

  // ---------------------------------------------------------------- o quadro

  function desenhar(t: number, cam: Camera) {
    const r = seg(t);
    desenharEscuro(r, cam);
    desenharLuzes(r, cam);
    palco.particulas(t, cam, false);
    desenharMesa(r, cam);
    desenharPotes(r, cam);
    palco.particulas(t, cam, true);
    desenharRotulo(r);
    desenharLinha1(r);
    desenharLinha2(r);
    desenharLinha3(r);
    palco.entrega(tempoDoLetreiro(r));
    ctx.globalAlpha = 1;
  }

  return { camera, desenhar };
}
