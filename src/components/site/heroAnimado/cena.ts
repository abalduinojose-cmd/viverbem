// A cena animada da dobra (08/10/2026, pedido do usuário: "uma animação
// como se fosse After Effects para o banner, tipografia cinética,
// transições suaves entre as formas, potes em 3D, movimento de câmera,
// 7 segundos"). Primeiro só no celular; no mesmo dia, também no desktop,
// com a frase "Especialistas em saúde personalizada" e fontes próprias.
// A tipografia foi remodelada no mesmo dia ("como um especialista em
// motion, mantendo a essência"): bloco empilhado pela tinta das letras,
// bloom de peso na fonte variável, rastro de movimento, inclinação pela
// velocidade, escrita em ouro com borda macia e saída em espelho.
//
// É uma composição de 7 s que repete sem emenda: o último quadro é igual
// ao primeiro (o ponto de ouro com a câmera de perto). Tudo é função pura
// do tempo t, como numa linha do tempo do After Effects: desenhar(t) monta
// o quadro inteiro, então dá para pular para qualquer instante.
//
//   0,0 a 1,3  a câmera recua; o ponto de ouro vira um fio e
//              "Especialistas" sobe de trás dele, letra por letra, com o
//              peso florescendo de leve a pesado e um rastro de movimento
//   1,25 a 2,1 o título voa para o lugar, "em saúde" (menor e leve) chega
//              da direita fechando o espaçamento e inclinado pela
//              velocidade; o fio vira uma cápsula que gira
//   2,0 a 3,1  a cápsula tomba e vira o anel no chão; os quatro potes
//              chegam do fundo com desfoque de movimento; "personalizada"
//              se escreve em ouro, com uma borda macia e uma luz na ponta
//   3,0 a 5,6  os potes giram em carrossel 3D (profundidade de campo,
//              reflexo e luz que corre pelo rótulo), a câmera balança e o
//              letreiro rola os 4 passos do pedido
//   5,3 a 6,4  fecho: os dois potes da dobra vêm para a frente, os outros
//              dois somem no fundo, um brilho passa pelos rótulos
//   6,25 a 7,0 em espelho: as letras grandes caem atrás da própria base
//              afinando o peso, "em saúde" abre o espaçamento e some,
//              "personalizada" se desescreve; tudo se recolhe para o ponto
//              de ouro e a câmera volta a chegar perto, encaixando no começo
//
// Dois enquadramentos, escolhidos pela largura do banner:
//   retrato  (celular)  palco 360 x 720: título em cima, potes no meio,
//                       botões (HTML) na base
//   paisagem (desktop)  palco com 560 de altura e a largura que sobrar:
//                       título à esquerda, potes à direita, botões (HTML)
//                       embaixo à esquerda
import type { FontesDaCena } from "./fontes";
import type { Roteiro } from "./roteiros";

export const DURACAO = 7;

export const FOCAL = 700;
export const ORBITA_CENTRO = 90; // profundidade do centro do carrossel
const N_PONTOS = 96;
const RAD = Math.PI / 180;
export const TAU = Math.PI * 2;

// ---------------------------------------------------------------- tempo

export const limitar = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
export const trecho = (t: number, a: number, b: number) => limitar((t - a) / (b - a));
export const mix = (a: number, b: number, p: number) => a + (b - a) * p;

export const saiCubica = (p: number) => 1 - (1 - p) ** 3;
export const saiQuarta = (p: number) => 1 - (1 - p) ** 4;
export const saiQuinta = (p: number) => 1 - (1 - p) ** 5;
export const saiExpo = (p: number) => (p >= 1 ? 1 : 1 - 2 ** (-10 * p));
export const entraCubica = (p: number) => p * p * p;
export const entraSaiCubica = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2);
export const entraSaiSeno = (p: number) => -(Math.cos(Math.PI * p) - 1) / 2;
/** Mola amortecida: passa 6% do alvo e assenta, como uma letra que pousa */
export const mola = (p: number) => (p >= 1 ? 1 : 1 - Math.exp(-5.5 * p) * Math.cos(6.2 * p));

// ---------------------------------------------------------------- câmera

export type Camera = { x: number; y: number; z: number; giro: number };

function camera(t: number): Camera {
  const meio = trecho(t, 2.4, 6.2);
  let z: number;
  let giro: number;
  if (t < 1.3) {
    const p = saiQuarta(trecho(t, 0, 1.3));
    z = mix(220, 0, p);
    giro = mix(-4, 0, p);
  } else if (t < 6.45) {
    // Um empurrão lento para dentro durante o carrossel e mais um no fecho
    z = 30 * entraSaiSeno(trecho(t, 2.4, 5.2)) + 10 * entraSaiSeno(trecho(t, 5.2, 6.2));
    giro = 1.2 * Math.sin(TAU * meio);
  } else {
    const p = entraCubica(trecho(t, 6.45, DURACAO));
    z = mix(40, 220, p);
    giro = mix(0, -4, p);
  }
  return { x: 14 * Math.sin(TAU * meio), y: -6 * Math.sin(Math.PI * meio), z, giro: giro * RAD };
}

/** O texto acompanha a câmera pela metade: fica mais estável que os
 *  potes e ganha paralaxe contra eles */
const cameraDoTexto = (c: Camera): Camera => ({ x: c.x * 0.5, y: c.y * 0.5, z: c.z * 0.5, giro: c.giro });

// ---------------------------------------------------------------- enquadramento

export type Enquadramento = {
  modo: "retrato" | "paisagem";
  largura: number; // palco
  altura: number;
  cx: number; // ponto de fuga, no palco
  cy: number;
  /** Centro do carrossel (mundo, x) e o chão (mundo, y) */
  potesX: number;
  chao: number;
  /** Escala dos potes e do carrossel */
  ep: number;
  /** A cápsula, no plano z = 0 */
  capsula: { x: number; y: number };
  // Texto
  textoX: number;
  larguraTexto: number;
  tamanhoMax: number;
  rotuloTela: number;
  tamanhoRotulo: number;
  tamanhoPasso: number;
  /** Até onde o letreiro dos passos pode descer (mundo, y): acima dos botões */
  limitePassos: number;
};

// Os dois formatos de palco. A dobra é o banner alto da abertura, com os
// botões na base; o cartão é um banner de seção, mais baixo, com um link
// só na base. Medidas em unidades do palco (no retrato, 360 de largura)
const FORMATOS = {
  dobra: {
    retrato: { altura: 720, cy: 330, chao: 195, ep: 1, capsulaY: 120, rotuloTela: 54, tamanhoMax: 48, tamanhoRotulo: 11, tamanhoPasso: 16, limitePassos: 568 - 44 - 330 },
    paisagem: { altura: 560, cy: 250, reservaBase: 40 + 56, rotuloTela: 66, tamanhoMax: 84, tamanhoRotulo: 13, tamanhoPasso: 18, capsulaY: 70, epMax: 1.42 },
  },
  cartao: {
    retrato: { altura: 520, cy: 250, chao: 188, ep: 0.74, capsulaY: 100, rotuloTela: 44, tamanhoMax: 54, tamanhoRotulo: 11, tamanhoPasso: 15, limitePassos: 268 - 250 },
    paisagem: { altura: 440, cy: 196, reservaBase: 32 + 28, rotuloTela: 54, tamanhoMax: 78, tamanhoRotulo: 12.5, tamanhoPasso: 17, capsulaY: 56, epMax: 1.22 },
  },
} as const;

/** Monta o enquadramento para um banner de l x a px CSS. Devolve também a
 *  escala e o deslocamento do palco dentro do canvas. */
function enquadrar(l: number, a: number, formato: Roteiro["formato"]) {
  // O mesmo corte do CSS (md): o banner muda de altura no mesmo ponto
  const celular = typeof window === "undefined" || !window.matchMedia("(min-width: 768px)").matches;
  if (celular) {
    const f = FORMATOS[formato].retrato;
    const largura = 360;
    const altura = f.altura;
    const k = Math.min(l / largura, a / altura);
    const enq: Enquadramento = {
      modo: "retrato",
      largura,
      altura,
      cx: 180,
      cy: f.cy,
      potesX: 0,
      chao: f.chao,
      ep: f.ep,
      capsula: { x: 0, y: f.capsulaY },
      textoX: 24 - 180,
      larguraTexto: 312,
      tamanhoMax: f.tamanhoMax,
      rotuloTela: f.rotuloTela,
      tamanhoRotulo: f.tamanhoRotulo,
      tamanhoPasso: f.tamanhoPasso,
      limitePassos: f.limitePassos,
    };
    // O palco encosta na base, onde estão os botões
    return { enq, k, ox: (l - largura * k) / 2, oy: a - altura * k };
  }
  const f = FORMATOS[formato].paisagem;
  const altura = f.altura;
  const k = a / altura;
  const largura = l / k;
  const cx = largura / 2;
  const cy = f.cy;
  const margem = 48 / k; // o mesmo recuo dos botões (md:px-12)
  // Os botões ocupam a base: a frente dos potes para 34 px acima deles
  const topoBotoes = altura - f.reservaBase / k;
  const frente = FOCAL / (FOCAL - 35); // escala do pote da frente
  const centroPotes = largura * (largura > 1200 ? 0.69 : 0.71);
  // Os potes crescem com a altura livre, mas sem invadir o título no tablet
  const ep = Math.min(f.epMax, (largura / 860) * 1.2, Math.max(0.95, (topoBotoes - 34 - 95) / (205 * frente)));
  const sCentro = FOCAL / (FOCAL + ORBITA_CENTRO);
  const enq: Enquadramento = {
    modo: "paisagem",
    largura,
    altura,
    cx,
    cy,
    potesX: (centroPotes - cx) / sCentro,
    chao: (topoBotoes - 34 - cy) / frente,
    ep,
    capsula: { x: centroPotes - cx, y: f.capsulaY },
    textoX: margem - cx,
    larguraTexto: Math.min(largura * 0.5, 640) - margem,
    tamanhoMax: f.tamanhoMax,
    rotuloTela: f.rotuloTela,
    tamanhoRotulo: f.tamanhoRotulo,
    tamanhoPasso: f.tamanhoPasso,
    limitePassos: topoBotoes - 52 - cy,
  };
  return { enq, k, ox: 0, oy: 0 };
}

export type Ponto = { x: number; y: number; s: number };

function projetar(e: Enquadramento, x: number, y: number, z: number, cam: Camera): Ponto {
  const s = FOCAL / Math.max(60, FOCAL + z - cam.z);
  return { x: e.cx + (x - cam.x) * s, y: e.cy + (y - cam.y) * s, s };
}

// ---------------------------------------------------------------- formas

type P3 = { x: number; y: number; z: number };

/** Uma pílula (estádio) amostrada por raios a partir do centro: com
 *  meio-comprimento 0 é um círculo, com raio pequeno é um fio. Como toda
 *  forma usa os mesmos 96 raios, qualquer uma vira qualquer outra. */
function estadio(cx: number, cy: number, meio: number, raio: number, angulo: number): P3[] {
  const pts: P3[] = [];
  for (let i = 0; i < N_PONTOS; i++) {
    const phi = (i / N_PONTOS) * TAU;
    const local = phi - angulo;
    const c = Math.cos(local);
    const s = Math.sin(local);
    let d: number;
    if (Math.abs(s) > 1e-6 && (raio * Math.abs(c)) / Math.abs(s) <= meio) d = raio / Math.abs(s);
    else d = meio * Math.abs(c) + Math.sqrt(Math.max(0, raio * raio - meio * meio * s * s));
    pts.push({ x: cx + d * Math.cos(phi), y: cy + d * Math.sin(phi), z: 0 });
  }
  return pts;
}

function misturarPontos(a: P3[], b: P3[], p: number): P3[] {
  return a.map((pa, i) => ({ x: mix(pa.x, b[i].x, p), y: mix(pa.y, b[i].y, p), z: mix(pa.z, b[i].z, p) }));
}

// ---------------------------------------------------------------- potes

export type Sprites = {
  nitido: HTMLCanvasElement;
  desfocado: HTMLCanvasElement;
  reflexo: HTMLCanvasElement;
  /** A silhueta clara, para a faixa de luz que corre pelo rótulo */
  mascara: HTMLCanvasElement;
  proporcao: number; // largura / altura
  altura: number;
};

function novaTela(l: number, a: number) {
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(l));
  c.height = Math.max(1, Math.round(a));
  return c;
}

/** Recorta o pote pela parte opaca da foto e prepara as três versões:
 *  nítida, desfocada (profundidade de campo, já com a névoa azul) e o
 *  reflexo no chão. Tudo uma vez só, no carregamento. */
function prepararPote(img: HTMLImageElement, altura: number): Sprites {
  const base = novaTela(img.naturalWidth, img.naturalHeight);
  // Tela de CPU: os pixels são lidos logo abaixo, e ler de uma tela de GPU
  // obriga a GPU a devolver a imagem inteira
  const bctx = base.getContext("2d", { willReadFrequently: true })!;
  bctx.drawImage(img, 0, 0);
  const { data, width, height } = bctx.getImageData(0, 0, base.width, base.height);
  let x0 = width, y0 = height, x1 = 0, y1 = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] > 12) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  }
  if (x1 <= x0 || y1 <= y0) { x0 = 0; y0 = 0; x1 = width - 1; y1 = height - 1; }
  const l = x1 - x0 + 1;
  const a = y1 - y0 + 1;

  const nitido = novaTela(l, a);
  nitido.getContext("2d")!.drawImage(base, x0, y0, l, a, 0, 0, l, a);

  // Desfoque por redução e ampliação: funciona em todo navegador (o
  // filter do canvas não existe em Safari antigo)
  const folga = Math.round(l * 0.08);
  const pequeno = novaTela((l + folga * 2) / 7, (a + folga * 2) / 7);
  const pctx = pequeno.getContext("2d")!;
  pctx.imageSmoothingQuality = "high";
  pctx.drawImage(nitido, folga / 7, folga / 7, l / 7, a / 7);
  const desfocado = novaTela(l + folga * 2, a + folga * 2);
  const dctx = desfocado.getContext("2d")!;
  dctx.imageSmoothingQuality = "high";
  dctx.drawImage(pequeno, 0, 0, desfocado.width, desfocado.height);
  dctx.globalCompositeOperation = "source-atop";
  dctx.fillStyle = "rgba(54, 52, 107, 0.38)";
  dctx.fillRect(0, 0, desfocado.width, desfocado.height);

  const altReflexo = Math.round(a * 0.42);
  const reflexo = novaTela(l, altReflexo);
  const rctx = reflexo.getContext("2d")!;
  rctx.save();
  rctx.translate(0, a);
  rctx.scale(1, -1);
  rctx.drawImage(nitido, 0, 0);
  rctx.restore();
  rctx.globalCompositeOperation = "destination-in";
  const g = rctx.createLinearGradient(0, 0, 0, altReflexo);
  g.addColorStop(0, "rgba(0,0,0,0.3)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  rctx.fillStyle = g;
  rctx.fillRect(0, 0, l, altReflexo);

  const mascara = novaTela(l, a);
  const mctx = mascara.getContext("2d")!;
  mctx.drawImage(nitido, 0, 0);
  mctx.globalCompositeOperation = "source-in";
  mctx.fillStyle = "#fffaf0";
  mctx.fillRect(0, 0, l, a);

  return { nitido, desfocado, reflexo, mascara, proporcao: l / a, altura };
}

/** O ângulo do carrossel: três quartos de volta entre 2,1 s e 5,3 s,
 *  parando com o Caramelo na frente à esquerda e a Gummy à direita. */
const anguloCarrossel = (t: number) => (-45 - 270 * (1 - entraSaiSeno(trecho(t, 2.1, 5.3)))) * RAD;

const ORDEM_CHEGADA = [1, 0, 3, 2];

type EstadoPote = { x: number; y: number; z: number; alfa: number; angulo: number };

function estadoPote(e: Enquadramento, i: number, t: number): EstadoPote {
  const a = anguloCarrossel(t) + i * (Math.PI / 2);
  const rx = e.potesX + 104 * e.ep * Math.sin(a);
  const rz = ORBITA_CENTRO - 125 * e.ep * Math.cos(a);

  // Chegada do fundo, de cima, com uma curva de saída exponencial
  const tChegada = 2.1 + ORDEM_CHEGADA[i] * 0.11;
  const pc = trecho(t, tChegada, tChegada + 0.8);
  const ec = saiExpo(pc);
  const lado = i % 2 === 0 ? -1 : 1;
  let x = mix(e.potesX + (rx - e.potesX) * 2.2 + lado * 140, rx, ec);
  let y = mix(-300, e.chao, ec);
  let z = mix(rz + 1200, rz, ec);
  let alfa = limitar(pc * 5);

  // Fecho: os dois da dobra na frente, os outros dois indo para o fundo
  const fecho: P3[] = [
    { x: e.potesX - 58 * e.ep, y: e.chao, z: -25 },
    { x: e.potesX + 60 * e.ep, y: e.chao, z: 5 },
    { x: e.potesX + 300, y: -140, z: 1100 },
    { x: e.potesX - 300, y: -180, z: 1150 },
  ];
  const pf = entraSaiCubica(trecho(t, 5.25, 6.0));
  x = mix(x, fecho[i].x, pf);
  y = mix(y, fecho[i].y, pf);
  z = mix(z, fecho[i].z, pf);
  if (i >= 2) alfa *= 1 - trecho(t, 5.45, 5.95);

  // Saída: os dois da frente recuam para o centro do anel e somem
  const ps = entraCubica(trecho(t, 6.38, 6.85));
  if (ps > 0) {
    x = mix(x, e.potesX, ps);
    y = mix(y, e.chao, ps);
    z = mix(z, 700, ps);
    alfa *= 1 - ps;
  }
  if (t < tChegada) alfa = 0;
  return { x, y, z, alfa, angulo: a };
}

// ---------------------------------------------------------------- partículas

type Particula = { nx: number; ny: number; z: number; r: number; cor: number; fase: number; vel: number; alfa: number };

function gerarParticulas(): Particula[] {
  // Semente fixa: a mesma poeira de luz em todo carregamento
  let s = 20061999;
  const rnd = () => {
    s = (s + 0x6d2b79f5) | 0;
    let q = Math.imul(s ^ (s >>> 15), 1 | s);
    q = (q + Math.imul(q ^ (q >>> 7), 61 | q)) ^ q;
    return ((q ^ (q >>> 14)) >>> 0) / 4294967296;
  };
  const lista: Particula[] = [];
  for (let i = 0; i < 30; i++) {
    const z = mix(-260, 950, rnd());
    lista.push({
      nx: mix(-1, 1, rnd()),
      ny: rnd(),
      z,
      r: mix(2, z < 0 ? 9 : 14, rnd()),
      cor: rnd() < 0.5 ? 0 : rnd() < 0.6 ? 1 : 2,
      fase: rnd() * TAU,
      vel: 1 + Math.floor(rnd() * 3), // voltas inteiras em 7 s: o laço não emenda
      alfa: mix(0.25, 0.75, rnd()) * (z < 0 ? 0.45 : 1),
    });
  }
  return lista;
}

/** Um círculo de luz pronto (degradê radial de uma cor até transparente):
 *  desenhar a imagem escalada custa muito menos que refazer o degradê */
function luzPronta(r: number, g: number, b: number, alfaCentro = 1) {
  const c = novaTela(128, 128);
  const ctx = c.getContext("2d")!;
  const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alfaCentro})`);
  grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);
  return c;
}

function bolinha(cor: string) {
  const c = novaTela(64, 64);
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, cor.replace("A", "1"));
  g.addColorStop(0.45, cor.replace("A", "0.45"));
  g.addColorStop(1, cor.replace("A", "0"));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return c;
}

// ---------------------------------------------------------------- texto

export type Linha = {
  texto: string;
  familia: string;
  estilo: "" | "italic ";
  peso: number;
  tamanho: number;
  tracking: number; // px entre as letras
  xs: number[]; // a pena de cada letra, no peso final
  largura: number;
  ascent: number; // tinta acima da base
  descent: number; // tinta abaixo da base
  recuo: number; // deslocamento da pena para a tinta começar em x = 0
};

// O peso anda em degraus de 50: cada peso novo da fonte variável é uma
// instância nova (dezenas de ms na primeira vez), e o olho não distingue
// o degrau num pouso de meio segundo
const PASSO_PESO = 50;
export const fonteDe = (l: Linha, peso = l.peso) =>
  `${l.estilo}${Math.round(peso / PASSO_PESO) * PASSO_PESO} ${l.tamanho}px ${l.familia}`;

/** Mede uma linha no peso final: a pena de cada letra (já com o kerning do
 *  par anterior), a largura, a tinta acima e abaixo da base e o recuo
 *  óptico (alinha a tinta da primeira letra, não a pena; o itálico fica
 *  de fora porque a cauda do "p" sairia da margem). */
function medirLinha(
  ctx: CanvasRenderingContext2D,
  texto: string,
  familia: string,
  estilo: "" | "italic ",
  peso: number,
  tamanho: number,
  trackingEm: number,
): Linha {
  const tracking = tamanho * trackingEm;
  ctx.font = `${estilo}${peso} ${tamanho}px ${familia}`;
  const xs: number[] = [];
  for (let i = 0; i < texto.length; i++) {
    xs.push(ctx.measureText(texto.slice(0, i + 1)).width - ctx.measureText(texto[i]).width + i * tracking);
  }
  const m = ctx.measureText(texto);
  return {
    texto,
    familia,
    estilo,
    peso,
    tamanho,
    tracking,
    xs,
    largura: m.width + Math.max(0, texto.length - 1) * tracking,
    ascent: m.actualBoundingBoxAscent,
    descent: m.actualBoundingBoxDescent,
    recuo: estilo === "" && texto ? ctx.measureText(texto[0]).actualBoundingBoxLeft : 0,
  };
}

// A frase vem do roteiro, em três vozes: a linha grande, a ligação
// pequena e leve, e a palavra em ouro itálico, a maior do bloco (na dobra,
// "Especialistas em saúde personalizada")

/** O rótulo do topo: um ponto de ouro, "MANIPULAÇÃO e HOMEOPATIA" (o "e"
 *  na voz em ouro itálico) e a cápsula de vidro em volta. Medidas em
 *  relação à margem do texto (x) e à base do rótulo (y). */
export type Rotulo = {
  partes: { linha: Linha; x: number; ouro: boolean }[];
  inicioTexto: number;
  fimTexto: number;
  pontoX: number;
  raioPonto: number;
  capsula: { x0: number; x1: number; topo: number; base: number };
};

export type Textos = {
  l1: Linha;
  l2: Linha;
  l3: Linha;
  rotulo: Rotulo;
  passos: { numero: Linha; texto: Linha }[];
  // Bases das linhas (mundo, plano z = 0)
  base1: number;
  base2: number;
  base3: number;
  baseRotulo: number;
  basePassos: number;
  /** Quanto a linha grande nasce maior, centrada, antes de voar ao lugar */
  escalaIntro: number;
  larguraPassos: number;
};

function medirRotulo(ctx: CanvasRenderingContext2D, tr: number, f: FontesDaCena, palavras: Roteiro["rotulo"]): Rotulo {
  const p1 = medirLinha(ctx, palavras[0], f.rotulo, "", f.pesoRotulo, tr, 0.2);
  const conj = medirLinha(ctx, palavras[1], f.destaque, "italic ", f.pesoDestaque, Math.round(tr * 1.5), 0);
  const p2 = medirLinha(ctx, palavras[2], f.rotulo, "", f.pesoRotulo, tr, 0.2);
  const raioPonto = tr * 0.27;
  const pontoX = tr * 1.05 + raioPonto;
  const inicioTexto = pontoX + raioPonto + tr * 0.8;
  const vao = tr * 0.5;
  const xE = inicioTexto + p1.largura + vao;
  const x2 = xE + conj.largura + vao;
  const fimTexto = x2 + p2.largura;
  // A cápsula centrada no meio da caixa-alta (que mede ~0,72 do corpo)
  const altura = tr * 2.55;
  const meio = -tr * 0.36;
  return {
    partes: [
      { linha: p1, x: inicioTexto, ouro: false },
      { linha: conj, x: xE, ouro: true },
      { linha: p2, x: x2, ouro: false },
    ],
    inicioTexto,
    fimTexto,
    pontoX,
    raioPonto,
    capsula: { x0: 0, x1: fimTexto + tr * 1.2, topo: meio - altura / 2, base: meio + altura / 2 },
  };
}

function prepararTextos(ctx: CanvasRenderingContext2D, e: Enquadramento, f: FontesDaCena, r: Roteiro): Textos {
  const [texto1, texto2, texto3] = r.linhas;
  // O tamanho que faz a linha mais larga caber na coluna do texto
  const prova = (T: number) =>
    Math.max(
      medirLinha(ctx, texto1, f.display, "", f.pesoDisplay, T, f.trackingDisplay).largura,
      medirLinha(ctx, texto3, f.destaque, "italic ", f.pesoDestaque, Math.round(T * f.escalaDestaque), 0).largura,
    );
  const T = Math.floor(e.tamanhoMax * Math.min(1, e.larguraTexto / prova(e.tamanhoMax)));
  const l1 = medirLinha(ctx, texto1, f.display, "", f.pesoDisplay, T, f.trackingDisplay);
  const l2 = medirLinha(ctx, texto2, f.conector, "", f.pesoConector, Math.round(T * f.escalaConector), f.trackingConector);
  const l3 = medirLinha(ctx, texto3, f.destaque, "italic ", f.pesoDestaque, Math.round(T * f.escalaDestaque), 0);
  const tp = e.tamanhoPasso;
  // O bloco se empilha pela tinta medida (ascendente e descendente de cada
  // linha), com respiros proporcionais ao tamanho: o mesmo vão óptico em
  // qualquer fonte
  const baseRotulo = e.rotuloTela - e.cy;
  const rotulo = medirRotulo(ctx, e.tamanhoRotulo, f, r.rotulo);
  const base1 = baseRotulo + rotulo.capsula.base + T * 0.3 + l1.ascent;
  const base2 = base1 + l1.descent + T * 0.1 + l2.ascent;
  const base3 = base2 + l2.descent + T * 0.08 + l3.ascent;
  return {
    l1,
    l2,
    l3,
    rotulo,
    passos: r.passos.map(([n, t]) => ({
      numero: medirLinha(ctx, n, f.destaque, "italic ", f.pesoDestaque, Math.round(tp * 1.3), 0),
      texto: medirLinha(ctx, t, f.apoio, "", 500, tp, 0),
    })),
    base1,
    base2,
    base3,
    baseRotulo,
    basePassos: Math.min(base3 + l3.descent + T * 0.42 + tp, e.limitePassos),
    escalaIntro: Math.min(1.28, (e.modo === "retrato" ? 330 : e.largura - 140) / l1.largura),
    larguraPassos: Math.min(e.larguraTexto, tp * 20),
  };
}

// O ouro metálico do site (--ouro-degrade)
const PARADAS_OURO: [number, [number, number, number]][] = [
  [0, [224, 196, 143]],
  [0.42, [201, 165, 107]],
  [0.7, [232, 212, 166]],
  [1, [180, 143, 85]],
];

/** O degradê de ouro entre x0 e x1, com um brilho que corre (posição 0 a
 *  1; fora de -0,2 a 1,2 não aparece) */
export function ouro(ctx: CanvasRenderingContext2D, x0: number, x1: number, brilho: number) {
  // Medida inválida (um ponto projetado atrás da câmera dá infinito) fazia o
  // createLinearGradient lançar erro: o quadro caía e o Next acendia o aviso
  // vermelho de "Issues" no desenvolvimento (08/10/2026)
  if (!Number.isFinite(x0) || !Number.isFinite(x1)) {
    x0 = 0;
    x1 = 1;
  }
  if (x1 === x0) x1 = x0 + 1;
  const g = ctx.createLinearGradient(x0, 0, x1, 0);
  for (const [p, c] of PARADAS_OURO) g.addColorStop(p, `rgb(${c[0]}, ${c[1]}, ${c[2]})`);
  if (brilho > -0.2 && brilho < 1.2) {
    const b = limitar(brilho);
    g.addColorStop(limitar(b - 0.12), "rgba(224,196,143,1)");
    g.addColorStop(b, "#fbf0d2");
    g.addColorStop(limitar(b + 0.12), "rgba(201,165,107,1)");
  }
  return g;
}

// ---------------------------------------------------------------- a cena

export type SpriteTexto = { tela: HTMLCanvasElement; x0: number; y0: number; l: number; a: number };
export type SpritesDeTexto = { l1: SpriteTexto; l1Voo: SpriteTexto; l2: SpriteTexto; l3: SpriteTexto; l3Luz: SpriteTexto };

/** O que a cena empresta a uma coreografia de fora (ver fases.ts): o
 *  contexto, o enquadramento e os textos medidos (que mudam quando o
 *  banner muda de tamanho, por isso são funções), as imagens prontas e os
 *  desenhos comuns */
export type Palco = {
  ctx: CanvasRenderingContext2D;
  roteiro: Roteiro;
  potes: Sprites[];
  luzFundo: HTMLCanvasElement;
  luzOuro: HTMLCanvasElement;
  sombra: HTMLCanvasElement;
  enq: () => Enquadramento;
  textos: () => Textos;
  sprites: () => SpritesDeTexto | null;
  P: (x: number, y: number, z: number, cam: Camera) => Ponto;
  pintarSprite: (s: SpriteTexto) => void;
  faixaDeLuz: (
    mascara: CanvasImageSource,
    x: number,
    y: number,
    l: number,
    a: number,
    centro: number,
    largura: number,
    forca: number,
    limite?: number,
  ) => void;
  particulas: (t: number, cam: Camera, frente: boolean) => void;
};

/** Uma coreografia diferente da dobra, sobre o mesmo palco: a câmera e o
 *  desenho de cada quadro */
export type Coreografia = { camera: (t: number) => Camera; desenhar: (t: number, cam: Camera) => void };

export type Cena = {
  /** Desenha o quadro do instante t (0 a 7 s) no tamanho atual da tela. */
  desenhar: (t: number) => void;
  /** Ajusta o canvas ao tamanho do banner (em px CSS). */
  medirTela: (largura: number, altura: number) => void;
  /** Paga de antemão, aos pedaços, o que custa na primeira vez (fontes,
   *  compilação dos desenhos na GPU). Chamar depois de medirTela. */
  aquecer: (pausa: () => Promise<void>) => Promise<void>;
};

/** Monta a cena aos pedaços: entre um pedaço e outro, `pausa` devolve a
 *  vez ao navegador (um quadro), para a preparação não travar a rolagem.
 *  (Num pedaço só ela chegava a 260-340 ms com a CPU 2x mais lenta, achado
 *  num trace do Chrome em 08/10/2026.) */
export async function criarCena(
  canvas: HTMLCanvasElement,
  imagens: HTMLImageElement[],
  fontes: FontesDaCena,
  roteiro: Roteiro,
  coreografar: ((palco: Palco) => Coreografia) | undefined,
  pausa: () => Promise<void>,
): Promise<Cena> {
  const ctx = canvas.getContext("2d")!;
  // Um pote por pedaço: recortar, desfocar, refletir e mascarar cada foto
  const potes: Sprites[] = [];
  for (let i = 0; i < imagens.length; i++) {
    potes.push(prepararPote(imagens[i], roteiro.potes[i].altura));
    await pausa();
  }
  const particulas = gerarParticulas();
  const [pr, pg, pb] = roteiro.poeira;
  const bolinhas = [bolinha("rgba(217,189,138,A)"), bolinha(`rgba(${pr},${pg},${pb},A)`), bolinha("rgba(255,255,255,A)")];
  const luzFundo = luzPronta(...roteiro.luz);
  const luzOuro = luzPronta(201, 165, 107);
  const sombra = luzPronta(2, 9, 22, 0.75);
  // Uma tela mínima só para instanciar fontes no aquecimento
  const provador = novaTela(8, 8).getContext("2d")!;
  // E uma tela de GPU (de 256 para cima o Chrome acelera) para onde o
  // aquecimento copia cada quadro: a cópia obriga a GPU a desenhar o quadro
  // de verdade, e é nessa hora que ela compila o que cada tipo de desenho
  // precisa (sem a cópia o Chrome descarta o quadro apagado sem desenhar, e
  // a compilação ficava para o primeiro laço, em trancos)
  const selo = novaTela(256, 256).getContext("2d")!;

  let dpr = 1;
  let escala = 1;
  let ox = 0;
  let oy = 0;
  let larguraCss = 0;
  let enq: Enquadramento = enquadrar(360, 720, roteiro.formato).enq;
  let textos: Textos = prepararTextos(ctx, enq, fontes, roteiro);

  function medirTela(l: number, a: number) {
    if (!l || !a) return;
    const r = enquadrar(l, a, roteiro.formato);
    enq = r.enq;
    escala = r.k;
    ox = r.ox;
    oy = r.oy;
    // No desktop o banner é grande: 1,5 de densidade já fica nítido e
    // poupa quase metade dos pixels de uma tela 2x
    dpr = Math.min(window.devicePixelRatio || 1, enq.modo === "paisagem" ? 1.5 : 2);
    larguraCss = l;
    canvas.width = Math.round(l * dpr);
    canvas.height = Math.round(a * dpr);
    // Redimensionar zera o estado do contexto. Suavização alta: as imagens
    // prontas (potes e texto) são reduzidas a cada quadro, e na GPU isso
    // usa mipmaps, sem serrilhado
    ctx.imageSmoothingQuality = "high";
    textos = prepararTextos(ctx, enq, fontes, roteiro);
    prepararSpritesDeTexto();
    // Redimensionar limpa o canvas: redesenha já o último quadro, para o
    // banner nunca piscar vazio até o próximo quadro da animação
    desenhar(ultimoT);
  }

  // ---- o texto parado vira imagem
  let spritesTexto: SpritesDeTexto | null = null;

  /** Rasteriza uma linha uma vez, na densidade da tela (com folga para a
   *  câmera e o voo), para ser desenhada como imagem enquanto está parada:
   *  texto grande letra a letra a cada quadro é o que mais pesa no canvas */
  function rasterizar(linha: Linha, escalaMax: number, pintar: (c: CanvasRenderingContext2D) => void): SpriteTexto {
    const densidade = dpr * escala * escalaMax;
    const folga = linha.tamanho * 0.3;
    const x0 = -folga;
    const y0 = -linha.ascent - folga;
    const l = linha.largura + folga * 2;
    const a = linha.ascent + linha.descent + folga * 2;
    const tela = novaTela(l * densidade, a * densidade);
    const c = tela.getContext("2d")!;
    c.scale(tela.width / l, tela.height / a);
    c.translate(-x0, -y0);
    c.textBaseline = "alphabetic";
    pintar(c);
    return { tela, x0, y0, l, a };
  }

  function prepararSpritesDeTexto() {
    const { l1, l2, l3 } = textos;
    const letraALetra = (linha: Linha, cor: string) => (c: CanvasRenderingContext2D) => {
      c.font = fonteDe(linha);
      c.fillStyle = cor;
      for (let i = 0; i < linha.texto.length; i++) c.fillText(linha.texto[i], linha.xs[i], 0);
    };
    const contorno = fontes.contornoDestaque * l3.tamanho;
    const palavra = (estilo: (c: CanvasRenderingContext2D) => string | CanvasGradient) => (c: CanvasRenderingContext2D) => {
      c.font = fonteDe(l3);
      c.lineJoin = "round";
      const e = estilo(c);
      if (contorno > 0) {
        c.lineWidth = contorno;
        c.strokeStyle = e;
        c.strokeText(l3.texto, 0, 0);
      }
      c.fillStyle = e;
      c.fillText(l3.texto, 0, 0);
    };
    spritesTexto = {
      // Duas versões da linha grande: a do voo, maior (nasce ampliada), e a
      // de repouso, na escala final (sem reduzir, fica mais nítida)
      l1: rasterizar(l1, 1.06, letraALetra(l1, "#ffffff")),
      l1Voo: rasterizar(l1, textos.escalaIntro * 1.04, letraALetra(l1, "#ffffff")),
      l2: rasterizar(l2, 1.06, letraALetra(l2, "rgba(255, 255, 255, 0.88)")),
      l3: rasterizar(l3, 1.06, palavra((c) => ouro(c, 0, l3.largura, -1))),
      l3Luz: rasterizar(l3, 1.06, palavra(() => "#fff6e0")),
    };
  }

  const pintarSprite = (s: SpriteTexto) => ctx.drawImage(s.tela, s.x0, s.y0, s.l, s.a);

  /** Uma faixa vertical de luz sobre uma imagem: a versão clara dela (a
   *  máscara) recortada em faixas concêntricas, mais forte no centro. Faz
   *  o papel de um degradê sobre a imagem sem desenhar em tela de apoio a
   *  cada quadro. Centro e largura em unidades do plano atual. */
  function faixaDeLuz(
    mascara: CanvasImageSource,
    x: number,
    y: number,
    l: number,
    a: number,
    centro: number,
    largura: number,
    forca: number,
    limite = Infinity,
  ) {
    for (const c of [1, 0.62, 0.34, 0.14]) {
      const w = largura * c;
      const ini = centro - w / 2;
      const fim = Math.min(centro + w / 2, limite);
      if (fim <= ini) continue;
      ctx.save();
      ctx.beginPath();
      ctx.rect(ini, y, fim - ini, a);
      ctx.clip();
      ctx.globalAlpha = forca * 0.42;
      ctx.drawImage(mascara, x, y, l, a);
      ctx.restore();
    }
  }

  /** Paga de antemão o que custa na primeira vez: cada peso que o bloom
   *  usa (cada peso de fonte variável é uma instância nova), as fontes do
   *  rótulo e dos passos, os glifos nos tamanhos da cena e a compilação de
   *  cada tipo de desenho na GPU. Vai aos pedaços (dois pesos ou dois
   *  quadros por vez) e, no fim de cada pedaço, redesenha o quadro que
   *  estava na tela: nada do aquecimento chega a aparecer. Se o banner mudar
   *  de tamanho no meio, o aquecimento velho para e o novo recomeça. */
  let geracaoAquecimento = 0;
  async function aquecer(pausa: () => Promise<void>) {
    const geracao = ++geracaoAquecimento;
    const guardado = ultimoT;
    const l = textos.l1;
    const de = Math.min(fontes.pesoDisplayLeve, l.peso);
    const ate = Math.max(fontes.pesoDisplayLeve, l.peso);
    let n = 0;
    for (let p = de; p <= ate; p += PASSO_PESO) {
      provador.font = fonteDe(l, p);
      provador.fillText(l.texto, 0, 0);
      if (++n % 2 === 0) {
        await pausa();
        if (geracao !== geracaoAquecimento) return;
      }
    }
    n = 0;
    for (let t = 0.25; t < DURACAO; t += 0.25) {
      desenhar(t);
      selo.drawImage(canvas, 0, 0, 1, 1);
      if (++n % 2 === 0) {
        desenhar(guardado);
        await pausa();
        if (geracao !== geracaoAquecimento) return;
      }
    }
    desenhar(guardado);
  }

  const P = (x: number, y: number, z: number, cam: Camera) => projetar(enq, x, y, z, cam);

  /** A forma de ouro em cada instante: ponto, fio, cápsula, anel, ponto. */
  function formaDeOuro(t: number) {
    const anel = () => {
      const pts: P3[] = [];
      const r = 160 * enq.ep;
      for (let i = 0; i < N_PONTOS; i++) {
        const phi = (i / N_PONTOS) * TAU;
        // O ponto de baixo da forma de pé vai para a frente do anel: a
        // cápsula tomba para trás
        pts.push({ x: enq.potesX + r * Math.cos(phi), y: enq.chao, z: ORBITA_CENTRO - r * Math.sin(phi) });
      }
      return pts;
    };
    const pontoInicial = () => estadio(0, 18, 0, 2.6, 0);
    const p1 = saiExpo(trecho(t, 0.12, 0.75));
    const p2 = entraSaiCubica(trecho(t, 1.25, 1.75));
    const giro = entraSaiCubica(trecho(t, 1.7, 2.3)) * Math.PI;
    const angulo = mix(0, -0.6, p2) + giro;
    const fio = (textos.l1.largura * textos.escalaIntro) / 2 + 14;
    const meio = t < 1.25 ? mix(0, fio, p1) : mix(fio, 38 * enq.ep, p2);
    const raio = t < 1.25 ? mix(2.6, 1.3, p1) : mix(1.3, 21 * enq.ep, p2);
    const cx = mix(0, enq.capsula.x, p2);
    const cy = mix(18, enq.capsula.y, p2);
    const capsula = { angulo, x: cx, y: cy };

    if (t < 2.0) {
      return {
        pts: estadio(cx, cy, meio, raio, angulo),
        preenche: mix(1, 0.1, trecho(t, 1.25, 1.6)),
        contorno: trecho(t, 1.25, 1.6),
        metade: trecho(t, 1.45, 1.75) * (1 - trecho(t, 1.95, 2.2)),
        capsula,
      };
    }
    if (t < 2.55) {
      const p = entraSaiCubica(trecho(t, 2.0, 2.55));
      return {
        pts: misturarPontos(estadio(cx, cy, meio, raio, angulo), anel(), p),
        preenche: mix(0.1, 0, p),
        contorno: 1,
        metade: 1 - trecho(t, 1.95, 2.2),
        capsula,
      };
    }
    if (t < 6.45) return { pts: anel(), preenche: 0, contorno: 1, metade: 0, capsula: null };
    const p = entraSaiCubica(trecho(t, 6.45, DURACAO));
    return {
      pts: misturarPontos(anel(), pontoInicial(), p),
      preenche: trecho(t, 6.7, DURACAO),
      contorno: 1 - trecho(t, 6.75, DURACAO),
      metade: 0,
      capsula: null,
    };
  }

  // ---- luzes de fundo
  function desenharLuzes(t: number, cam: Camera) {
    const chegada = trecho(t, 2.2, 3.0) * (1 - trecho(t, 6.4, 6.9));
    const fecho = entraSaiSeno(trecho(t, 5.5, 6.2)) * (1 - trecho(t, 6.35, 6.8));
    // Luz atrás dos potes (azul na dobra, rosada na Saúde da Mulher)
    const c = P(enq.potesX, enq.chao - 135 * enq.ep, ORBITA_CENTRO, cam);
    const raio = 230 * enq.ep * c.s;
    ctx.globalAlpha = 0.28 * chegada + 0.1;
    ctx.drawImage(luzFundo, c.x - raio, c.y - raio, raio * 2, raio * 2);
    // Luz dourada no chão (o mesmo círculo, achatado)
    const ch = P(enq.potesX, enq.chao, ORBITA_CENTRO, cam);
    const rr = 210 * enq.ep * ch.s;
    ctx.globalAlpha = 0.34 * chegada + 0.22 * fecho;
    if (ctx.globalAlpha > 0.005) ctx.drawImage(luzOuro, ch.x - rr, ch.y - rr * 0.3, rr * 2, rr * 0.6);
    ctx.globalAlpha = 1;
  }

  // ---- poeira de luz (bokeh), com paralaxe pela câmera
  function desenharParticulas(t: number, cam: Camera, frente: boolean) {
    ctx.save();
    const meiaLargura = enq.largura / 2 + 40;
    for (const p of particulas) {
      if (frente !== p.z < 0) continue;
      const fase = (TAU * p.vel * t) / DURACAO + p.fase;
      const y = mix(-enq.cy * 1.3, (enq.altura - enq.cy) * 1.05, p.ny);
      const q = P(p.nx * meiaLargura, y + 12 * Math.sin(fase), p.z, cam);
      const r = Math.min(46, p.r * q.s * (frente ? 1.6 : 1));
      ctx.globalAlpha = p.alfa * (0.55 + 0.45 * Math.sin(fase * 2));
      ctx.drawImage(bolinhas[p.cor], q.x - r, q.y - r, r * 2, r * 2);
    }
    ctx.restore();
  }

  // ---- a forma de ouro
  function desenharForma(t: number, cam: Camera) {
    const f = formaDeOuro(t);
    const pts = f.pts.map((p) => P(p.x, p.y, p.z, cam));
    ctx.beginPath();
    pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
    ctx.closePath();
    let minX = Infinity, maxX = -Infinity;
    for (const p of pts) { if (p.x < minX) minX = p.x; if (p.x > maxX) maxX = p.x; }
    // Sem pontos válidos neste quadro, não há forma para desenhar
    if (!Number.isFinite(minX) || !Number.isFinite(maxX)) return;
    const dourado = ouro(ctx, minX - 4, maxX + 4, mix(-0.3, 1.3, trecho(t, 0.3, 1.2)));
    ctx.save();
    // O brilho em volta é um traço largo e transparente por baixo do traço
    // fino (o shadowBlur fazia o mesmo, mas refazendo um desfoque do
    // tamanho do anel a cada quadro)
    ctx.lineJoin = "round";
    ctx.strokeStyle = dourado;
    ctx.globalAlpha = 0.18 * Math.max(f.preenche, f.contorno);
    ctx.lineWidth = 7;
    ctx.stroke();
    if (f.preenche > 0.01) {
      ctx.globalAlpha = f.preenche;
      ctx.fillStyle = dourado;
      ctx.fill();
    }
    if (f.contorno > 0.01) {
      ctx.globalAlpha = f.contorno * 0.95;
      ctx.lineWidth = 1.6;
      ctx.stroke();
    }
    ctx.restore();
    // A cápsula ganha uma metade cheia de ouro, como uma cápsula de verdade
    if (f.metade > 0.01 && f.capsula) {
      ctx.save();
      ctx.clip();
      const c = P(f.capsula.x, f.capsula.y, 0, cam);
      ctx.translate(c.x, c.y);
      ctx.rotate(f.capsula.angulo);
      ctx.globalAlpha = f.metade * 0.9;
      ctx.fillStyle = ouro(ctx, -80, 0, -1);
      ctx.fillRect(-200, -200, 200, 400);
      ctx.restore();
    }
    // Marcas no anel, que giram com o carrossel
    const anel = trecho(t, 2.45, 2.9) * (1 - trecho(t, 6.35, 6.6));
    if (anel > 0.01) {
      const rot = anguloCarrossel(t);
      const r = 160 * enq.ep;
      ctx.save();
      ctx.fillStyle = "#e8d4a6";
      for (let i = 0; i < 36; i++) {
        const phi = rot + (i / 36) * TAU;
        const q = P(enq.potesX + r * Math.sin(phi), enq.chao, ORBITA_CENTRO - r * Math.cos(phi), cam);
        const frente = (Math.cos(phi) + 1) / 2;
        ctx.globalAlpha = anel * (0.25 + 0.6 * frente);
        ctx.beginPath();
        ctx.arc(q.x, q.y, (i % 3 === 0 ? 1.7 : 1) * q.s, 0, TAU);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  // ---- um pote num instante (posição projetada e tamanho)
  function geometriaPote(i: number, t: number, cam: Camera) {
    const e = estadoPote(enq, i, t);
    const q = P(e.x, e.y, e.z, cam);
    const sp = potes[i];
    const h = sp.altura * enq.ep * q.s;
    const l = h * sp.proporcao * (1 - 0.05 * Math.abs(Math.sin(e.angulo)) * (1 - trecho(t, 5.25, 5.8)));
    // Profundidade de campo: foco na frente do carrossel
    const desfoque = limitar((e.z - 50) / 320);
    return { e, q, h, l, desfoque };
  }

  function desenharPotes(t: number, cam: Camera) {
    const lista = potes
      .map((_, i) => ({ i, g: geometriaPote(i, t, cam) }))
      .filter((p) => p.g.e.alfa > 0.005)
      .sort((a, b) => b.g.e.z - a.g.e.z);

    // Sombras de contato e reflexos primeiro, por baixo de todos
    for (const { i, g } of lista) {
      const noChao = limitar(1 - Math.abs(g.e.y - enq.chao) / 50) * g.e.alfa * (1 - g.desfoque * 0.7);
      if (noChao < 0.02) continue;
      const sp = potes[i];
      ctx.save();
      ctx.globalAlpha = noChao;
      ctx.drawImage(sp.reflexo, g.q.x - g.l / 2, g.q.y, g.l, g.h * 0.42);
      ctx.drawImage(sombra, g.q.x - g.l * 0.55, g.q.y - g.l * 0.1, g.l * 1.1, g.l * 0.2);
      ctx.restore();
    }

    for (const { i, g } of lista) {
      const sp = potes[i];
      // Desfoque de movimento: rastro com amostras um pouco antes no tempo
      const antes = geometriaPote(i, Math.max(0, t - 0.02), cam);
      const deslocamento = Math.hypot(g.q.x - antes.q.x, g.q.y - antes.q.y) + Math.abs(g.h - antes.h);
      if (deslocamento > 6) {
        for (let k = 3; k >= 1; k--) {
          const r = geometriaPote(i, Math.max(0, t - k * 0.016), cam);
          ctx.globalAlpha = r.e.alfa * 0.18;
          ctx.drawImage(sp.desfocado, r.q.x - r.l * 0.58, r.q.y - r.h * 1.08, r.l * 1.16, r.h * 1.16);
        }
      }

      const x = g.q.x - g.l / 2;
      const y = g.q.y - g.h;
      if (g.desfoque > 0.01) {
        ctx.globalAlpha = g.e.alfa;
        ctx.drawImage(sp.desfocado, g.q.x - g.l * 0.58, g.q.y - g.h * 1.08, g.l * 1.16, g.h * 1.16);
      }
      const nitidez = g.e.alfa * (1 - g.desfoque);
      if (nitidez > 0.01) {
        // Luz que corre pelo rótulo: acompanha o giro no carrossel e passa
        // de ponta a ponta no fecho
        const varredura = trecho(t, 5.75, 6.3);
        const naVarredura = varredura > 0 && varredura < 1;
        const posLuz = naVarredura ? mix(-0.3, 1.3, saiCubica(varredura)) : 0.5 - 0.42 * Math.sin(g.e.angulo);
        const forcaLuz = (naVarredura ? 0.5 : 0.2 * (1 - trecho(t, 5.25, 5.6))) * nitidez;
        ctx.globalAlpha = nitidez;
        ctx.drawImage(sp.nitido, x, y, g.l, g.h);
        if (forcaLuz > 0.01) faixaDeLuz(sp.mascara, x, y, g.l, g.h, x + posLuz * g.l, g.l * 0.32, forcaLuz);
      }
    }
    ctx.globalAlpha = 1;
  }

  // ---- tipografia cinética
  /** Põe o contexto no plano de um texto no mundo (z = 0) */
  function noPlano(cam: Camera, x: number, y: number, s: number) {
    const q = P(x, y, 0, cameraDoTexto(cam));
    ctx.translate(q.x, q.y);
    ctx.scale(q.s * s, q.s * s);
  }

  // ---- a linha grande: sobe de trás do fio, voa para o lugar, cai atrás da base
  /** O estado de uma letra da linha grande no instante t: altura em
   *  relação à base, peso (bloom), alfa e os progressos de entrada (p) e
   *  saída (q). A entrada escalona da esquerda para a direita com a curva
   *  "ease high" do After Effects (as últimas quase juntas); a saída, da
   *  direita para a esquerda. */
  function letra1(i: number, t: number) {
    const l = textos.l1;
    const n = Math.max(1, l.texto.length - 1);
    const d = 0.42 * (i / n) ** 0.75;
    const p = trecho(t, 0.32 + d, 0.32 + d + 0.6);
    const ds = 0.16 * ((n - i) / n) ** 0.75;
    const q = trecho(t, 6.3 + ds, 6.3 + ds + 0.28);
    // Escondida: o topo da letra abaixo do fio (13 unidades sob a base)
    const escondido = l.ascent + 13 / textos.escalaIntro + 3;
    const dy = mix(escondido, 0, mola(p)) + entraCubica(q) * (l.ascent + l.descent + 10);
    const peso = q > 0 ? mix(l.peso, fontes.pesoDisplayLeve, saiCubica(q)) : mix(fontes.pesoDisplayLeve, l.peso, saiCubica(p));
    return { dy, peso, alfa: limitar(p * 4), p, q };
  }

  /** Desenha a linha grande no instante tt. Serve para o quadro e, com
   *  alfa baixo e sem rastro, para o rastro da linha inteira no voo. */
  function linha1Em(tt: number, cam: Camera, alfaMult: number, comRastro: boolean) {
    const l = textos.l1;
    const ei = textos.escalaIntro;
    const voo = entraSaiCubica(trecho(tt, 1.25, 1.85));
    const s = mix(ei, 1, voo);
    const x = mix((-l.largura * ei) / 2, enq.textoX + l.recuo, voo);
    const y = mix(5, textos.base1, voo);
    ctx.save();
    noPlano(cam, x, y, s);
    const entrando = tt < 1.35;
    const saindo = tt > 6.28;
    if (entrando || saindo) {
      // A máscara: na entrada é o fio de ouro (13 unidades sob a base, e
      // desce para soltar os descendentes quando o título vai voar); na
      // saída é a própria base, e as letras caem atrás dela
      const fundo = entrando ? mix(13 / ei, l.descent + 6, trecho(tt, 1.15, 1.35)) : l.descent + 4;
      ctx.beginPath();
      ctx.rect(-l.tamanho, -l.ascent * 1.6, l.largura + l.tamanho * 2, l.ascent * 1.6 + fundo);
      ctx.clip();
    }
    // Com todas as letras assentadas (do fim da subida ao começo da saída,
    // inclusive no voo) a linha é um corpo só: desenha a imagem pronta
    const assentada = tt >= 0.32 + 0.42 + 0.6 && tt < 6.3;
    if (assentada && spritesTexto) {
      ctx.globalAlpha = alfaMult;
      pintarSprite(tt < 1.9 ? spritesTexto.l1Voo : spritesTexto.l1);
      ctx.restore();
      return;
    }
    // Junta tudo que vai desenhar e agrupa por peso: o que custa é trocar
    // o ctx.font, não o fillText. (A ordem não altera a imagem: letra e
    // rastro são brancos sobre branco.)
    const itens: { ch: string; x: number; y: number; peso: number; alfa: number }[] = [];
    for (let i = 0; i < l.texto.length; i++) {
      const a = letra1(i, tt);
      if (a.p <= 0 || a.q >= 1) continue;
      if (comRastro) {
        // Rastro: a letra onde estava há 1, 2 e 3 quadros (desfoque de
        // movimento), só enquanto se move
        for (let k = 3; k >= 1; k--) {
          const b = letra1(i, tt - k * 0.016);
          if (b.p <= 0 || Math.abs(b.dy - a.dy) < 1.2) continue;
          itens.push({ ch: l.texto[i], x: l.xs[i], y: b.dy, peso: b.peso, alfa: b.alfa * alfaMult * [0, 0.14, 0.09, 0.05][k] });
        }
      }
      itens.push({ ch: l.texto[i], x: l.xs[i], y: a.dy, peso: a.peso, alfa: a.alfa * alfaMult });
    }
    itens.sort((a, b) => a.peso - b.peso);
    ctx.fillStyle = "#ffffff";
    let fonteAtual = "";
    for (const it of itens) {
      const f = fonteDe(l, it.peso);
      if (f !== fonteAtual) {
        ctx.font = f;
        fonteAtual = f;
      }
      ctx.globalAlpha = it.alfa;
      ctx.fillText(it.ch, it.x, it.y);
    }
    ctx.restore();
  }

  function desenharLinha1(t: number, cam: Camera) {
    // No voo, a linha inteira deixa rastro
    if (t > 1.25 && t < 1.9) {
      linha1Em(t - 0.032, cam, 0.05, false);
      linha1Em(t - 0.016, cam, 0.1, false);
    }
    linha1Em(t, cam, 1, true);
  }

  // ---- a ligação: chega da direita fechando o espaçamento, inclinada pela velocidade
  function letra2(i: number, t: number) {
    const l = textos.l2;
    const n = l.texto.length - 1;
    const p = trecho(t, 1.55 + i * 0.045, 1.55 + i * 0.045 + 0.5);
    const e = saiExpo(p);
    const q = trecho(t, 6.36 + (n - i) * 0.018, 6.36 + (n - i) * 0.018 + 0.26);
    const eq = entraCubica(q);
    const abre = l.tamanho * 0.38; // o espaçamento extra inicial, por letra
    const dx = mix(40 + abre * i, 0, e) + eq * (24 + abre * 0.6 * i);
    // Inclina no sentido do movimento (para a esquerda ao entrar, para a
    // direita ao sair) e endireita ao pousar
    const inclina = 0.14 * (1 - e) - 0.1 * eq;
    return { dx, inclina, alfa: limitar(p * 2.5) * (1 - limitar(q * 1.3)), p, q };
  }

  function desenharLinha2(t: number, cam: Camera) {
    const l = textos.l2;
    ctx.save();
    noPlano(cam, enq.textoX + l.recuo, textos.base2, 1);
    const assentada = t >= 1.55 + (l.texto.length - 1) * 0.045 + 0.5 && t < 6.36;
    if (assentada && spritesTexto) {
      pintarSprite(spritesTexto.l2);
      ctx.restore();
      return;
    }
    ctx.font = fonteDe(l);
    ctx.fillStyle = "rgba(255, 255, 255, 0.88)";
    for (let i = 0; i < l.texto.length; i++) {
      const a = letra2(i, t);
      if (a.p <= 0 || a.q >= 1) continue;
      for (let k = 2; k >= 1; k--) {
        const b = letra2(i, t - k * 0.016);
        if (b.p <= 0 || Math.abs(b.dx - a.dx) < 1) continue;
        ctx.save();
        ctx.globalAlpha = b.alfa * [0, 0.12, 0.06][k];
        ctx.transform(1, 0, b.inclina, 1, l.xs[i] + b.dx, 0);
        ctx.fillText(l.texto[i], 0, 0);
        ctx.restore();
      }
      ctx.save();
      ctx.globalAlpha = a.alfa;
      ctx.transform(1, 0, a.inclina, 1, l.xs[i] + a.dx, 0);
      ctx.fillText(l.texto[i], 0, 0);
      ctx.restore();
    }
    ctx.restore();
  }

  // ---- a palavra em ouro: escrita da esquerda para a direita, com borda macia e uma luz na ponta
  function desenharLinha3(t: number, cam: Camera) {
    const l = textos.l3;
    const entra = saiCubica(trecho(t, 2.35, 3.1));
    const sai = entraCubica(trecho(t, 6.3, 6.64));
    const pe = entra * (1 - sai);
    if (pe <= 0.001) return;
    const w = l.largura;
    const suave = w * 0.16; // a largura da borda macia
    const borda = pe * (w + suave);
    const inicio = borda - suave;
    // O brilho: preso à ponta enquanto escreve, segue para fora quando
    // termina e volta a passar no fecho, junto com a luz dos potes
    const brilho =
      t < 3.2 && entra < 1 ? (inicio + suave * 0.45) / w : t < 4 ? 1.07 + 0.3 * trecho(t, 3.1, 3.45) : mix(-0.3, 1.3, trecho(t, 5.7, 6.4));
    if (!spritesTexto) return;
    const ouroPronto = spritesTexto.l3;
    const versaoClara = spritesTexto.l3Luz;
    ctx.save();
    noPlano(cam, enq.textoX - l.tamanho * 0.03, textos.base3 + mix(12, 0, pe), mix(1.035, 1, pe));
    // A parte já escrita, até onde começa a borda macia (a palavra é uma
    // imagem pronta: o contorno que encorpa o itálico custava refazer a
    // cada quadro)
    if (inicio > -w * 0.02) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(ouroPronto.x0, ouroPronto.y0, Math.min(inicio, w + l.tamanho) - ouroPronto.x0, ouroPronto.a);
      ctx.clip();
      pintarSprite(ouroPronto);
      ctx.restore();
    }
    // A borda macia: seis faixas, cada uma mais transparente, até sumir
    // ao longo de "suave"
    if (inicio < w + 2) {
      const n = 6;
      for (let k = 0; k < n; k++) {
        const a0 = inicio + (suave * k) / n;
        ctx.save();
        ctx.beginPath();
        ctx.rect(Math.max(ouroPronto.x0, a0), ouroPronto.y0, suave / n + 0.6, ouroPronto.a);
        ctx.clip();
        ctx.globalAlpha = 1 - (k + 0.5) / n;
        pintarSprite(ouroPronto);
        ctx.restore();
      }
    }
    // O brilho que corre: a versão clara da palavra, numa faixa
    if (brilho > -0.2 && brilho < 1.2) {
      faixaDeLuz(versaoClara.tela, versaoClara.x0, versaoClara.y0, versaoClara.l, versaoClara.a, brilho * w, w * 0.24, 0.8, Math.min(borda, w + l.tamanho));
    }
    // A luz que conduz a escrita (e a desescrita)
    if (pe > 0 && pe < 1) {
      const lx = inicio + suave * 0.5;
      const ly = -l.ascent * 0.4;
      const r = l.tamanho * 0.55;
      const g2 = ctx.createRadialGradient(lx, ly, 0, lx, ly, r);
      g2.addColorStop(0, "rgba(255, 246, 220, 0.5)");
      g2.addColorStop(1, "rgba(255, 246, 220, 0)");
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = g2;
      ctx.fillRect(lx - r, ly - r, r * 2, r * 2);
    }
    ctx.restore();
  }

  // ---- o rótulo do topo (08/10/2026, pedido: "fontes mais modernas e
  // movimentos suaves"): a cápsula de vidro se desenha a partir do ponto de
  // ouro, que acende e respira; as palavras sobem de dentro da cápsula com
  // o espaçamento assentando; um fio de ouro dá uma volta na borda (o mesmo
  // gesto do botão "Enviar receita") e um brilho passa pelas letras. Tudo
  // em curvas longas, sem rebote; na saída as palavras sobem e a borda se
  // desfaz
  function desenharRotulo(t: number, cam: Camera) {
    const r = textos.rotulo;
    const tr = enq.tamanhoRotulo;
    const abre = saiQuinta(trecho(t, 1.95, 2.75));
    const fecha = entraSaiCubica(trecho(t, 6.15, 6.6));
    const presenca = abre * (1 - fecha);
    if (presenca <= 0.001) return;
    const { x0, x1, topo, base } = r.capsula;
    const h = base - topo;
    const raio = h / 2;
    const cy = (topo + base) / 2;
    const perimetro = 2 * (x1 - x0 - h) + Math.PI * h;

    ctx.save();
    noPlano(cam, enq.textoX, textos.baseRotulo, 1);
    // A cápsula cresce de leve a partir do ponto de ouro
    const escalaCapsula = mix(0.92, 1, abre) * mix(1, 0.96, fecha);
    ctx.translate(r.pontoX, cy);
    ctx.scale(escalaCapsula, escalaCapsula);
    ctx.translate(-r.pontoX, -cy);

    // O contorno começa no meio da ponta esquerda e corre no sentido do
    // relógio (por cima primeiro)
    const caminho = (recuo = 0) => {
      const a = x0 + recuo;
      const b = x1 - recuo;
      const rr = raio - recuo;
      ctx.beginPath();
      ctx.moveTo(a, cy);
      ctx.arc(a + rr, cy, rr, Math.PI, Math.PI * 1.5);
      ctx.lineTo(b - rr, cy - rr);
      ctx.arc(b - rr, cy, rr, Math.PI * 1.5, Math.PI * 0.5);
      ctx.lineTo(a + rr, cy + rr);
      ctx.arc(a + rr, cy, rr, Math.PI * 0.5, Math.PI);
      ctx.closePath();
    };

    // Vidro: um véu claro, mais forte no alto
    caminho();
    const vidro = ctx.createLinearGradient(0, topo, 0, base);
    vidro.addColorStop(0, `rgba(255, 255, 255, ${0.12 * presenca})`);
    vidro.addColorStop(1, `rgba(255, 255, 255, ${0.035 * presenca})`);
    ctx.fillStyle = vidro;
    ctx.fill();

    // A borda se desenha a partir do ponto e se desfaz na saída
    ctx.lineWidth = 1;
    ctx.setLineDash([perimetro * saiQuinta(trecho(t, 2.0, 2.9)) * (1 - fecha), perimetro * 2]);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.24)";
    ctx.stroke();

    // O fio de ouro: uma volta só, com a cauda esmaecendo (quatro traços
    // que terminam na mesma cabeça, mais claros onde se sobrepõem)
    const volta = trecho(t, 2.25, 3.35);
    if (volta > 0 && volta < 1) {
      const cabeca = entraSaiSeno(volta) * perimetro;
      const forca = Math.sin(Math.PI * volta);
      ctx.lineCap = "round";
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = `rgba(232, 212, 166, ${0.32 * forca})`;
      for (let j = 1; j <= 4; j++) {
        const comp = perimetro * 0.07 * j;
        ctx.setLineDash([comp, perimetro * 2]);
        ctx.lineDashOffset = comp - cabeca;
        ctx.stroke();
      }
    }
    ctx.setLineDash([]);
    ctx.lineDashOffset = 0;

    // O ponto de ouro: acende primeiro e respira (três vezes por laço,
    // então o fim emenda no começo)
    const acende = saiQuinta(trecho(t, 1.95, 2.45)) * (1 - entraCubica(trecho(t, 6.2, 6.55)));
    if (acende > 0.001) {
      const respira = 0.5 - 0.5 * Math.cos((TAU * 3 * t) / DURACAO);
      const halo = r.raioPonto * (2.4 + 1.6 * respira);
      const gh = ctx.createRadialGradient(r.pontoX, cy, 0, r.pontoX, cy, halo);
      gh.addColorStop(0, `rgba(232, 212, 166, ${(0.4 + 0.2 * respira) * acende})`);
      gh.addColorStop(1, "rgba(232, 212, 166, 0)");
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = gh;
      ctx.fillRect(r.pontoX - halo, cy - halo, halo * 2, halo * 2);
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#e0c48f";
      ctx.beginPath();
      ctx.arc(r.pontoX, cy, r.raioPonto * acende, 0, TAU);
      ctx.fill();
    }

    // As palavras, presas dentro da cápsula: sobem do fundo dela e saem
    // pelo alto
    caminho(1);
    ctx.clip();
    const passada =
      t < 4.5 ? mix(-0.25, 1.25, entraSaiSeno(trecho(t, 2.95, 3.75))) : mix(-0.25, 1.25, entraSaiSeno(trecho(t, 5.7, 6.2)));
    const branco = ctx.createLinearGradient(r.inicioTexto, 0, r.fimTexto, 0);
    branco.addColorStop(0, "rgba(255, 255, 255, 0.86)");
    branco.addColorStop(1, "rgba(255, 255, 255, 0.86)");
    if (passada > -0.2 && passada < 1.2) {
      const b = limitar(passada);
      branco.addColorStop(limitar(b - 0.14), "rgba(255, 255, 255, 0.86)");
      branco.addColorStop(b, "rgba(255, 246, 222, 1)");
      branco.addColorStop(limitar(b + 0.14), "rgba(255, 255, 255, 0.86)");
    }
    r.partes.forEach((parte, k) => {
      const ini = 2.15 + k * 0.1;
      const e = saiQuinta(trecho(t, ini, ini + 0.8));
      const atraso = (r.partes.length - 1 - k) * 0.05;
      const q = entraCubica(trecho(t, 6.12 + atraso, 6.46 + atraso));
      if (e <= 0 || q >= 1) return;
      const l = parte.linha;
      const dy = mix(tr * 1.7, 0, e) - tr * 1.5 * q;
      ctx.globalAlpha = Math.min(1, e * 1.6) * (1 - q);
      ctx.font = fonteDe(l);
      if (parte.ouro) {
        ctx.fillStyle = ouro(ctx, parte.x, parte.x + l.largura, -1);
        ctx.fillText(l.texto, parte.x, dy);
        return;
      }
      // As letras chegam um pouco abertas e o espaçamento assenta
      ctx.fillStyle = branco;
      const folga = tr * 0.12 * (1 - e);
      for (let i = 0; i < l.texto.length; i++) ctx.fillText(l.texto[i], parte.x + l.xs[i] + i * folga, dy);
    });
    ctx.restore();
  }

  // ---- os passos do pedido, rolando como um letreiro (cada linha pousa com mola e sai com rastro)
  function desenharPassos(t: number, cam: Camera) {
    const tp = enq.tamanhoPasso;
    const sai = entraCubica(trecho(t, 6.25, 6.5));
    ctx.save();
    noPlano(cam, enq.textoX, textos.basePassos, 1);
    ctx.beginPath();
    ctx.rect(-10, -tp * 1.5, textos.larguraPassos + 40, tp * 2);
    ctx.clip();
    const curso = tp * 1.4;
    const linha = (passo: Textos["passos"][number], dy: number, alfa: number) => {
      ctx.globalAlpha = alfa;
      let x: number;
      if (passo.numero.texto) {
        ctx.font = fonteDe(passo.numero);
        ctx.fillStyle = ouro(ctx, 0, passo.numero.largura, -1);
        ctx.fillText(passo.numero.texto, 0, dy);
        x = passo.numero.largura + tp * 0.6;
      } else {
        ctx.fillStyle = "#c9a56b";
        ctx.beginPath();
        ctx.arc(tp * 0.25, dy - tp * 0.34, tp * 0.19, 0, TAU);
        ctx.fill();
        x = tp;
      }
      ctx.font = fonteDe(passo.texto);
      ctx.fillStyle = "rgba(255, 255, 255, 0.86)";
      ctx.fillText(passo.texto.texto, x, dy);
    };
    textos.passos.forEach((passo, k) => {
      const ini = 3.0 + k * 0.62;
      const pe = trecho(t, ini, ini + 0.3);
      const ultimo = k === textos.passos.length - 1;
      const parte = ultimo ? 0 : entraCubica(trecho(t, ini + 0.5, ini + 0.72));
      if (pe <= 0 || parte >= 1) return;
      const dy = mix(curso, 0, mola(pe)) - curso * parte - 10 * (ultimo ? sai : 0);
      const alfa = limitar(pe * 3) * (1 - parte) * (ultimo ? 1 - sai : 1);
      // Rastro curto enquanto a linha se move
      if ((pe > 0 && pe < 0.6) || (parte > 0 && parte < 1)) {
        linha(passo, dy + 5, alfa * 0.08);
        linha(passo, dy + 2.5, alfa * 0.16);
      }
      linha(passo, dy, alfa);
    });
    ctx.restore();
    // Um fio fino de ouro que cresce sob o letreiro enquanto os passos rolam
    const fio = trecho(t, 3.0, 5.6) * (1 - sai);
    if (fio > 0) {
      const lf = textos.larguraPassos * 0.7;
      ctx.save();
      noPlano(cam, enq.textoX, textos.basePassos + tp * 0.9, 1);
      ctx.globalAlpha = 0.5 * (1 - sai);
      ctx.fillStyle = "rgba(255,255,255,0.18)";
      ctx.fillRect(0, 0, lf, 1);
      ctx.globalAlpha = 1 - sai;
      ctx.fillStyle = ouro(ctx, 0, lf, -1);
      ctx.fillRect(0, 0, lf * entraSaiSeno(fio), 1);
      ctx.restore();
    }
  }

  // Uma coreografia de fora (o banner da Saúde da Mulher) usa o mesmo palco
  const coreografia = coreografar?.({
    ctx,
    roteiro,
    potes,
    luzFundo,
    luzOuro,
    sombra,
    enq: () => enq,
    textos: () => textos,
    sprites: () => spritesTexto,
    P,
    pintarSprite,
    faixaDeLuz,
    particulas: desenharParticulas,
  });

  let ultimoT = 0;

  function desenhar(tBruto: number) {
    const t = ((tBruto % DURACAO) + DURACAO) % DURACAO;
    ultimoT = t;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!larguraCss) return;
    ctx.setTransform(dpr * escala, 0, 0, dpr * escala, dpr * ox, dpr * oy);
    const cam = coreografia ? coreografia.camera(t) : camera(t);
    ctx.translate(enq.cx, enq.cy);
    ctx.rotate(cam.giro);
    ctx.translate(-enq.cx, -enq.cy);
    ctx.textBaseline = "alphabetic";

    if (coreografia) {
      coreografia.desenhar(t, cam);
      return;
    }
    desenharLuzes(t, cam);
    desenharParticulas(t, cam, false);
    const formaNaFrente = t < 1.3;
    if (!formaNaFrente) desenharForma(t, cam);
    desenharPotes(t, cam);
    desenharParticulas(t, cam, true);
    desenharRotulo(t, cam);
    desenharLinha3(t, cam);
    desenharLinha1(t, cam);
    desenharLinha2(t, cam);
    desenharPassos(t, cam);
    if (formaNaFrente) desenharForma(t, cam);
  }

  return { desenhar, medirTela, aquecer };
}
