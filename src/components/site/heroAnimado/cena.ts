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
//              peso florescendo de leve a pesado, as letras um pouco
//              abertas que se fecham ao pousar, um rastro de movimento e,
//              no instante do pouso, uma luz dourada que varre a palavra
//              (22/10/2026, tipografia cinética)
//   1,25 a 2,1 o título voa para o lugar; "em saúde" (menor e leve) sobe
//              de uma fresta palavra a palavra, "saúde" (a âncora) andando
//              mais e por mais tempo (22/10/2026; antes chegava da direita
//              inclinada); o fio vira uma cápsula que gira
//   2,0 a 3,1  a cápsula tomba e vira o anel no chão; os quatro potes
//              chegam do fundo com desfoque de movimento; "personalizada"
//              nasce letra a letra de uma névoa dourada, cada letra subindo
//              de leve e o espaçamento fechando, com uma luz na ponta e o
//              brilho varrendo a palavra quando a última assenta
//              (22/10/2026; antes era uma cortina da esquerda para a
//              direita com borda macia, "não gosto dela do jeito que está")
//   3,0 a 5,6  o carrossel 3D anda em QUATRO PASSOS, um a cada passo do
//              letreiro (mesmo quadro): a cada passo gira 90° numa curva
//              devagar-rápido-devagar e traz um pote novo para a frente,
//              a luz passa pelo rótulo dele e a câmera avança um pouco;
//              entre um passo e outro, para (profundidade de campo,
//              reflexo). O letreiro mostra os 4 passos do pedido com os
//              traços que os contam. (21/10/2026, doutrina de movimento:
//              o movimento executa o letreiro, em vez de girar sem parar;
//              desde 10/10 este trecho corre devagar, pelo ritmo do roteiro)
//   5,3 a 6,4  fecho: os dois potes da dobra vêm para a frente, os outros
//              dois somem no fundo, um brilho passa pelos rótulos
//   6,25 a 7,0 em espelho: as letras grandes caem atrás da própria base
//              afinando o peso, "em saúde" cai atrás da base,
//              "personalizada" afunda na névoa da última letra para a
//              primeira; tudo se recolhe para o ponto
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
// O letreiro dos passos: quando começa, quanto dura cada passo e o atraso
// entre uma letra e a seguinte (tempo da coreografia)
const PASSOS_INICIO = 3.05;
const PASSOS_VEZ = 0.62;
const PASSOS_ESCALONA = 0.004;
/** Quando começa o passo k do letreiro e, com ele, o giro do carrossel e
 *  o avanço da câmera (21/10/2026) */
const inicioDoPasso = (k: number) => PASSOS_INICIO + k * PASSOS_VEZ;
/** Quanto dura o giro do carrossel em cada passo (tempo da coreografia; a
 *  0,28 da velocidade dá ~1,1 s de giro e ~1,1 s parado) */
const PASSO_GIRO = 0.3;
/** A curva "nudge" (devagar, rápido, devagar): 10/65/25 da distância em
 *  20/18/62 do tempo; a cauda longa é o que mata o tranco de parar */
const nudge = (p: number) =>
  p <= 0 ? 0 : p >= 1 ? 1 : p < 0.2 ? 0.1 * entraCubica(p / 0.2) : p < 0.38 ? 0.1 + (0.65 * (p - 0.2)) / 0.18 : 0.75 + 0.25 * saiQuarta((p - 0.38) / 0.62);
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
/** Mola amortecida partindo do repouso (ζ ≈ 0,85): passa 0,8% do alvo e
 *  assenta, "sentido, não visto" (21/10/2026, doutrina de movimento; antes
 *  passava 6%, que lia como rebote). Normalizada para fechar em 1. */
const MOLA_K = 7;
const MOLA_W = 4.6;
const molaBruta = (p: number) => 1 - Math.exp(-MOLA_K * p) * (Math.cos(MOLA_W * p) + (MOLA_K / MOLA_W) * Math.sin(MOLA_W * p));
const MOLA_1 = molaBruta(1);
export const mola = (p: number) => (p >= 1 ? 1 : p <= 0 ? 0 : molaBruta(p) + p * (1 - MOLA_1));

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
    // A câmera avança um passo a cada passo do letreiro, junto com o giro
    // do carrossel (câmera com intenção, não deriva), e mais um no fecho
    let passos = 0;
    for (let k = 0; k < 4; k++) passos += entraSaiSeno(trecho(t, inicioDoPasso(k), inicioDoPasso(k) + PASSO_GIRO + 0.1));
    z = 8 * entraSaiSeno(trecho(t, 2.4, 3.0)) + 5.5 * passos + 10 * entraSaiSeno(trecho(t, 5.2, 6.2));
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
    // 12/10/2026: o banner do celular ficou 10% mais baixo (648 em vez de 720)
    // SEM encolher a cena: a cápsula sobe 10 (44 do alto), o centro sobe 30
    // e o chão dos potes fica 183 acima da base (era 195): o que apertou foi
    // o vão entre o letreiro dos passos e os potes
    retrato: { altura: 648, cy: 300, chao: 165, ep: 1, capsulaY: 120, rotuloTela: 44, tamanhoMax: 48, tamanhoRotulo: 11, tamanhoPasso: 16, limitePassos: 465 - 44 - 300 },
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
    // 12/10/2026 ("quero que preencha mais um pouco e enquadre, bem de
    // leve"): nos celulares largos o teto de altura do banner deixava uma
    // margem nas laterais; a dobra pode crescer até 4% além do que a altura
    // permite, cortando um pouco no alto (a cápsula começa a 24 do topo,
    // então só um quarto do corte vai para cima) e o resto na base, sob os
    // botões. No celular estreito o palco já ocupa a largura toda e nada
    // muda. O cartão da Saúde da Mulher segue justo.
    const folga = formato === "dobra" ? 1.04 : 1;
    const k = Math.min(l / largura, (a / altura) * folga);
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
    // O palco encosta na base, onde estão os botões; quando passa da caixa
    // (a folga acima), um quarto do corte vai para o alto e o resto para a base
    const sobra = a - altura * k;
    return { enq, k, ox: (l - largura * k) / 2, oy: sobra >= 0 ? sobra : sobra * 0.25 };
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

/** Uma imagem pronta para o drawImage: a tela de apoio ou, congelada, o
 *  ImageBitmap dela */
export type Imagem = HTMLCanvasElement | ImageBitmap;

export type Sprites = {
  nitido: Imagem;
  desfocado: Imagem;
  reflexo: Imagem;
  /** A silhueta clara, para a faixa de luz que corre pelo rótulo */
  mascara: Imagem;
  proporcao: number; // largura / altura
  altura: number;
};

function novaTela(l: number, a: number) {
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(l));
  c.height = Math.max(1, Math.round(a));
  return c;
}

/** Congela uma tela de apoio numa imagem imutável (ImageBitmap), que o
 *  navegador guarda como textura na GPU: cada drawImage dela vira só um
 *  desenho. Tela pequena (abaixo de 256 px) é de CPU, e desenhá-la na tela
 *  acelerada mandava os pixels para a GPU de novo a cada quadro: as luzes
 *  e a poeira (30 bolinhas por quadro) custavam mais da metade do quadro,
 *  medido em 11/10/2026 ("o vídeo da hero dá uma travadinha": p50 de 13,6
 *  para 5,8 ms sem elas). Sem createImageBitmap (Safari antigo), fica a
 *  própria tela. */
async function congelar(tela: Imagem): Promise<Imagem> {
  if (!(tela instanceof HTMLCanvasElement) || typeof createImageBitmap !== "function") return tela;
  try {
    return await createImageBitmap(tela);
  } catch {
    return tela;
  }
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
  dctx.fillStyle = "rgba(13, 35, 64, 0.38)";
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
/** O ângulo do carrossel (21/10/2026): os potes chegam assentando num
 *  giro de 60° e, depois, o carrossel anda em QUATRO passos de 90°, um a
 *  cada passo do letreiro (no mesmo quadro), trazendo um pote novo para a
 *  frente; entre um passo e outro, para. Fecha em 0° (uma volta inteira):
 *  o pote 0 na frente e o 1 à direita, para o fecho trazer os dois. */
const anguloCarrossel = (t: number) => {
  let graus = -360 - 60 * (1 - entraSaiSeno(trecho(t, 2.1, 3.0)));
  for (let k = 0; k < 4; k++) graus += 90 * nudge(trecho(t, inicioDoPasso(k), inicioDoPasso(k) + PASSO_GIRO));
  return graus * RAD;
};

const ORDEM_CHEGADA = [1, 0, 3, 2];
/** Quando o pote i começa a chegar */
const chegadaDoPote = (i: number) => 2.1 + ORDEM_CHEGADA[i] * 0.11;

type EstadoPote = { x: number; y: number; z: number; alfa: number; angulo: number };

function estadoPote(e: Enquadramento, i: number, t: number): EstadoPote {
  const a = anguloCarrossel(t) + i * (Math.PI / 2);
  const rx = e.potesX + 104 * e.ep * Math.sin(a);
  const rz = ORBITA_CENTRO - 125 * e.ep * Math.cos(a);

  // Chegada do fundo, de cima, com uma curva de saída exponencial
  const tChegada = chegadaDoPote(i);
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
      texto: medirLinha(ctx, t, f.apoio, "", 400, tp, 0.01),
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
    g.addColorStop(limitar(b - 0.12), "rgba(214,188,130,1)");
    g.addColorStop(b, "#fbf0d2");
    g.addColorStop(limitar(b + 0.12), "rgba(196,164,100,1)");
  }
  return g;
}

// ---------------------------------------------------------------- a cena

export type SpriteTexto = { tela: Imagem; x0: number; y0: number; l: number; a: number };
export type SpritesDeTexto = { l1: SpriteTexto; l1Voo: SpriteTexto; l1Luz: SpriteTexto; l2: SpriteTexto; l3: SpriteTexto; l3Nevoa: SpriteTexto; l3Luz: SpriteTexto };

/** O que a cena empresta a uma coreografia de fora (ver vitrine.ts): o
 *  contexto, o enquadramento e os textos medidos (que mudam quando o
 *  banner muda de tamanho, por isso são funções), as imagens prontas e os
 *  desenhos comuns */
export type Palco = {
  ctx: CanvasRenderingContext2D;
  roteiro: Roteiro;
  potes: Sprites[];
  luzFundo: Imagem;
  luzOuro: Imagem;
  sombra: Imagem;
  /** Desenha uma luz ou a poeira no filtro barato (ver desenharLuz) */
  luz: (img: Imagem, x: number, y: number, l: number, a: number) => void;
  /** Desenha um pote no filtro que o tamanho pede (ver desenharPote) */
  pote: (img: Imagem, x: number, y: number, l: number, a: number, suave?: boolean) => void;
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
    suave?: boolean,
  ) => void;
  particulas: (t: number, cam: Camera, frente: boolean) => void;
  /** Quantos px CSS vale uma unidade do palco (para medir o HTML por cima) */
  escala: () => number;
  /** Quantos pixels do canvas vale uma unidade do palco (escala x densidade
   *  da tela), para preparar imagens no tamanho exato em que vão aparecer */
  densidade: () => number;
};

/** Uma coreografia diferente da dobra, sobre o mesmo palco: a câmera e o
 *  desenho de cada quadro */
export type Coreografia = {
  camera: (t: number, laco: number) => Camera;
  /** laco: quantas voltas inteiras já passaram (0 na primeira), para a
   *  coreografia fazer a entrada só uma vez */
  desenhar: (t: number, cam: Camera, laco: number) => void;
};

export type Cena = {
  /** Desenha o quadro do instante t no tamanho atual da tela. t corre de 0
   *  a 7 s em cada volta; passar de 7 conta as voltas (7 a 14 é a segunda) */
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
    const s = prepararPote(imagens[i], roteiro.potes[i].altura);
    await pausa();
    // Congeladas em ImageBitmap (ver congelar): a textura já fica na GPU
    potes.push({
      ...s,
      nitido: await congelar(s.nitido),
      desfocado: await congelar(s.desfocado),
      reflexo: await congelar(s.reflexo),
      mascara: await congelar(s.mascara),
    });
  }
  const particulas = gerarParticulas();
  const [pr, pg, pb] = roteiro.poeira;
  // As telas pequenas (luzes e bolinhas) eram o que mais pesava por quadro
  // desenhadas como tela (ver congelar): congeladas, viram um desenho cada
  const bolinhas = await Promise.all(
    [bolinha("rgba(214,186,125,A)"), bolinha(`rgba(${pr},${pg},${pb},A)`), bolinha("rgba(255,255,255,A)")].map(congelar),
  );
  const luzFundo = await congelar(luzPronta(...roteiro.luz));
  const luzOuro = await congelar(luzPronta(205, 170, 105));
  const sombra = await congelar(luzPronta(2, 9, 22, 0.75));
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
    // Aparelho fraco (até 4 núcleos ou até 4 GB): no máximo 1,5x, cerca de
    // 40% menos pixels por quadro, quase igual a olho nu (15/10/2026)
    const nav = navigator as Navigator & { deviceMemory?: number };
    const fraco = (nav.hardwareConcurrency || 8) <= 4 || (nav.deviceMemory || 8) <= 4;
    dpr = Math.min(window.devicePixelRatio || 1, enq.modo === "paisagem" || fraco ? 1.5 : 2);
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
    const sprite: SpriteTexto = { tela, x0, y0, l, a };
    // A tela já serve; a imagem congelada a substitui assim que fica pronta
    void congelar(tela).then((imagem) => {
      sprite.tela = imagem;
    });
    return sprite;
  }

  /** A versão em névoa de uma linha pronta (desfoque por redução e
   *  ampliação, que roda em qualquer navegador), na mesma caixa: a folga
   *  da rasterização já dá espaço para o borrão. Feita a partir da tela,
   *  antes de ela virar ImageBitmap. */
  function desfocarSprite(sp: SpriteTexto, fator = 7): SpriteTexto {
    const fonte = sp.tela as HTMLCanvasElement;
    const pequena = novaTela(fonte.width / fator, fonte.height / fator);
    const pc = pequena.getContext("2d")!;
    pc.imageSmoothingQuality = "high";
    pc.drawImage(fonte, 0, 0, pequena.width, pequena.height);
    const tela = novaTela(fonte.width, fonte.height);
    const c = tela.getContext("2d")!;
    c.imageSmoothingQuality = "high";
    c.drawImage(pequena, 0, 0, tela.width, tela.height);
    const sprite: SpriteTexto = { tela, x0: sp.x0, y0: sp.y0, l: sp.l, a: sp.a };
    void congelar(tela).then((imagem) => {
      sprite.tela = imagem;
    });
    return sprite;
  }

  function prepararSpritesDeTexto() {
    // Solta as texturas do jogo anterior (o banner mudou de tamanho)
    if (spritesTexto && typeof ImageBitmap !== "undefined") {
      for (const s of Object.values(spritesTexto)) if (s.tela instanceof ImageBitmap) s.tela.close();
    }
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
    const ouroPronto = rasterizar(l3, 1.06, palavra((c) => ouro(c, 0, l3.largura, -1)));
    spritesTexto = {
      // Duas versões da linha grande: a do voo, maior (nasce ampliada), e a
      // de repouso, na escala final (sem reduzir, fica mais nítida)
      l1: rasterizar(l1, 1.06, letraALetra(l1, "#ffffff")),
      l1Voo: rasterizar(l1, textos.escalaIntro * 1.04, letraALetra(l1, "#ffffff")),
      // A versão quente, para a luz que varre a palavra no pouso
      l1Luz: rasterizar(l1, textos.escalaIntro * 1.04, letraALetra(l1, "#ffe2a8")),
      l2: rasterizar(l2, 1.06, letraALetra(l2, "rgba(255, 255, 255, 0.88)")),
      l3: ouroPronto,
      // A névoa dourada de onde as letras nascem (e para onde voltam)
      l3Nevoa: desfocarSprite(ouroPronto),
      l3Luz: rasterizar(l3, 1.06, palavra(() => "#fff6e0")),
    };
  }

  const pintarSprite = (s: SpriteTexto) => ctx.drawImage(s.tela, s.x0, s.y0, s.l, s.a);

  /** Desenha uma luz (degradê radial pronto) ou uma bolinha da poeira no
   *  filtro bilinear: ampliar essas imagens com o filtro bicúbico ("high",
   *  o padrão da tela) custava METADE do quadro onde o canvas não tem GPU
   *  (medido em 11/10/2026, "o vídeo da hero dá uma travadinha": carrossel
   *  de 13,9 para 6,6 ms por quadro, fecho de 11,9 para 6,6), e num degradê
   *  suave o olho não vê diferença. Os potes e os textos seguem em "high". */
  function desenharLuz(img: Imagem, x: number, y: number, l: number, a: number) {
    ctx.imageSmoothingQuality = "low";
    ctx.drawImage(img, x, y, l, a);
    ctx.imageSmoothingQuality = "high";
  }

  /** Desenha um pote no filtro que o tamanho pede: até 3x de redução o
   *  bilinear ("low") basta e custa metade do bicúbico (medido em
   *  11/10/2026: carrossel de 14,0 para 7,7 ms por quadro, fecho de 12,8
   *  para 6,6); menor que isso, "high" (mipmaps), para não tremer ao longe
   *  (um pote tão longe já sai misturado com a versão desfocada, então o
   *  limite pode ser folgado). O desfocado e o reflexo, já suaves, vão
   *  sempre no barato (`suave`). */
  const REDUCAO_BILINEAR = 0.34;
  function desenharPote(img: Imagem, x: number, y: number, l: number, a: number, suave = false) {
    ctx.imageSmoothingQuality = suave || (a * escala * dpr) / img.height >= REDUCAO_BILINEAR ? "low" : "high";
    ctx.drawImage(img, x, y, l, a);
    ctx.imageSmoothingQuality = "high";
  }

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
    suave = false,
  ) {
    // Sobre um pote perto, o bilinear basta (ver desenharPote)
    if (suave) ctx.imageSmoothingQuality = "low";
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
    ctx.imageSmoothingQuality = "high";
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
    desenharLuz(luzFundo, c.x - raio, c.y - raio, raio * 2, raio * 2);
    // Luz dourada no chão (o mesmo círculo, achatado)
    const ch = P(enq.potesX, enq.chao, ORBITA_CENTRO, cam);
    const rr = 210 * enq.ep * ch.s;
    ctx.globalAlpha = 0.34 * chegada + 0.22 * fecho;
    if (ctx.globalAlpha > 0.005) desenharLuz(luzOuro, ch.x - rr, ch.y - rr * 0.3, rr * 2, rr * 0.6);
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
      desenharLuz(bolinhas[p.cor], q.x - r, q.y - r, r * 2, r * 2);
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
      ctx.fillStyle = "#e3cb93";
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

    // O anel de luz que se abre no chão quando cada pote pousa (21/10/2026:
    // o impacto acende no quadro do pouso, como na vitrine da Saúde da Mulher)
    for (const { i, g } of lista) {
      const pr = trecho(t, chegadaDoPote(i) + 0.5, chegadaDoPote(i) + 0.95);
      if (pr <= 0 || pr >= 1) continue;
      const chao = P(g.e.x, enq.chao, g.e.z, cam);
      const rx = g.l * mix(0.45, 1.5, saiCubica(pr));
      ctx.globalAlpha = 0.7 * (1 - pr) ** 1.5 * g.e.alfa;
      ctx.strokeStyle = "rgb(232, 206, 150)";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.ellipse(chao.x, chao.y, rx, rx * 0.16, 0, 0, TAU);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Sombras de contato e reflexos primeiro, por baixo de todos
    for (const { i, g } of lista) {
      const noChao = limitar(1 - Math.abs(g.e.y - enq.chao) / 50) * g.e.alfa * (1 - g.desfoque * 0.7);
      if (noChao < 0.02) continue;
      const sp = potes[i];
      ctx.save();
      ctx.globalAlpha = noChao;
      desenharPote(sp.reflexo, g.q.x - g.l / 2, g.q.y, g.l, g.h * 0.42, true);
      desenharLuz(sombra, g.q.x - g.l * 0.55, g.q.y - g.l * 0.1, g.l * 1.1, g.l * 0.2);
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
          desenharPote(sp.desfocado, r.q.x - r.l * 0.58, r.q.y - r.h * 1.08, r.l * 1.16, r.h * 1.16, true);
        }
      }

      const x = g.q.x - g.l / 2;
      const y = g.q.y - g.h;
      if (g.desfoque > 0.01) {
        ctx.globalAlpha = g.e.alfa;
        desenharPote(sp.desfocado, g.q.x - g.l * 0.58, g.q.y - g.h * 1.08, g.l * 1.16, g.h * 1.16, true);
      }
      const nitidez = g.e.alfa * (1 - g.desfoque);
      if (nitidez > 0.01) {
        // Luz que corre pelo rótulo: acompanha o giro no carrossel e passa
        // de ponta a ponta no fecho
        // No fecho a luz passa de ponta a ponta em todos; em cada passo,
        // passa pelo pote que acabou de chegar à frente (21/10/2026); no
        // resto acompanha o giro
        const varredura = trecho(t, 5.75, 6.3);
        let naVarredura = varredura > 0 && varredura < 1;
        let fase = varredura;
        if (!naVarredura && Math.cos(g.e.angulo) > 0.92) {
          for (let k = 0; k < 4 && !naVarredura; k++) {
            const q = trecho(t, inicioDoPasso(k) + PASSO_GIRO - 0.06, inicioDoPasso(k) + PASSO_GIRO + 0.24);
            if (q > 0 && q < 1) {
              naVarredura = true;
              fase = q;
            }
          }
        }
        const posLuz = naVarredura ? mix(-0.3, 1.3, saiCubica(fase)) : 0.5 - 0.42 * Math.sin(g.e.angulo);
        const forcaLuz = (naVarredura ? 0.5 : 0.2 * (1 - trecho(t, 5.25, 5.6))) * nitidez;
        ctx.globalAlpha = nitidez;
        desenharPote(sp.nitido, x, y, g.l, g.h);
        if (forcaLuz > 0.01) {
          const perto = (g.h * escala * dpr) / sp.nitido.height >= REDUCAO_BILINEAR;
          faixaDeLuz(sp.mascara, x, y, g.l, g.h, x + posLuz * g.l, g.l * 0.32, forcaLuz, Infinity, perto);
        }
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
    // As letras chegam um pouco abertas (a partir do centro) e o
    // espaçamento fecha ao pousar, como um "tracking" do After Effects
    const dx = (1 - saiCubica(p)) * l.tamanho * 0.07 * (i - n / 2);
    // Chegada com opacidade binária (21/10/2026): a letra já nasce atrás do
    // fio, a máscara faz o recorte; um fade por cima brigava com o estalo
    return { dy, dx, peso, alfa: p > 0 ? 1 : 0, p, q };
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
    // A luz dourada que varre a palavra no instante em que as últimas
    // letras pousam (22/10/2026): a versão quente da linha, numa faixa que
    // corre da esquerda para a direita, por cima do branco
    const luzDoPouso = () => {
      const b = trecho(tt, 1.0, 1.4);
      if (b <= 0 || b >= 1 || !spritesTexto || !comRastro) return;
      const v = spritesTexto.l1Luz;
      faixaDeLuz(v.tela, v.x0, v.y0, v.l, v.a, mix(-0.25, 1.25, saiCubica(b)) * l.largura, l.largura * 0.22, 0.85);
    };
    // Com todas as letras assentadas (do fim da subida ao começo da saída,
    // inclusive no voo) a linha é um corpo só: desenha a imagem pronta
    const assentada = tt >= 0.32 + 0.42 + 0.6 && tt < 6.3;
    if (assentada && spritesTexto) {
      ctx.globalAlpha = alfaMult;
      pintarSprite(tt < 1.9 ? spritesTexto.l1Voo : spritesTexto.l1);
      luzDoPouso();
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
          itens.push({ ch: l.texto[i], x: l.xs[i] + b.dx, y: b.dy, peso: b.peso, alfa: b.alfa * alfaMult * [0, 0.14, 0.09, 0.05][k] });
        }
      }
      itens.push({ ch: l.texto[i], x: l.xs[i] + a.dx, y: a.dy, peso: a.peso, alfa: a.alfa * alfaMult });
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
    luzDoPouso();
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

  // ---- a ligação: palavra a palavra, cada uma sobe de trás da própria base
  // (22/10/2026, tipografia cinética pela doutrina: chegada em cascata de
  // baixo, uma direção, opacidade binária, a âncora anda mais e por mais
  // tempo; antes deslizava pela direita inclinada pela velocidade). Na
  // saída, as palavras caem atrás da base, da última para a primeira.
  /** As palavras da ligação (índices das letras), medidas uma vez por texto */
  let palavrasL2: { ini: number; fim: number }[] = [];
  let textoL2 = "";
  function palavrasDaLigacao() {
    const l = textos.l2;
    if (l.texto !== textoL2) {
      textoL2 = l.texto;
      palavrasL2 = [];
      let comeco = 0;
      for (let i = 0; i <= l.texto.length; i++) {
        if (i === l.texto.length || l.texto[i] === " ") {
          if (i > comeco) palavrasL2.push({ ini: comeco, fim: i });
          comeco = i + 1;
        }
      }
    }
    return palavrasL2;
  }
  /** Quando a palavra k começa a subir: vãos que encolhem (x0,84) */
  const inicioPalavra2 = (k: number) => 1.58 + (0.14 * (1 - 0.84 ** k)) / 0.16;
  /** O estado da palavra k da ligação no instante t: altura em relação à
   *  base (positivo = escondida abaixo) e os progressos de entrada e saída */
  function palavra2(k: number, n: number, t: number) {
    const l = textos.l2;
    const caminho = l.ascent + l.descent + 6;
    // A última palavra é a âncora: anda mais tempo
    const dura = k === n - 1 ? 0.46 : 0.36;
    const p = trecho(t, inicioPalavra2(k), inicioPalavra2(k) + dura);
    const atrasoSaida = (n - 1 - k) * 0.05;
    const q = trecho(t, 6.36 + atrasoSaida, 6.36 + atrasoSaida + 0.26);
    return { dy: (1 - saiQuinta(p)) * caminho + entraCubica(q) * caminho, p, q };
  }

  function desenharLinha2(t: number, cam: Camera) {
    const l = textos.l2;
    const palavras = palavrasDaLigacao();
    const n = palavras.length;
    if (n === 0) return;
    ctx.save();
    noPlano(cam, enq.textoX + l.recuo, textos.base2, 1);
    const assentada = t >= inicioPalavra2(n - 1) + 0.46 && t < 6.36;
    if (assentada && spritesTexto) {
      pintarSprite(spritesTexto.l2);
      ctx.restore();
      return;
    }
    // A fresta: nada aparece abaixo da base (com folga para as descendentes)
    ctx.beginPath();
    ctx.rect(-l.tamanho, -l.ascent * 1.6, l.largura + l.tamanho * 2, l.ascent * 1.6 + l.descent + 3);
    ctx.clip();
    ctx.font = fonteDe(l);
    ctx.fillStyle = "rgba(255, 255, 255, 0.88)";
    palavras.forEach((w, k) => {
      const a = palavra2(k, n, t);
      if (a.p <= 0 || a.q >= 1) return;
      // Rastro curto enquanto sobe rápido
      for (const [dt, alfa] of [
        [0.032, 0.07],
        [0.016, 0.14],
      ] as const) {
        const b = palavra2(k, n, t - dt);
        if (b.p <= 0 || Math.abs(b.dy - a.dy) < 1.5) continue;
        ctx.globalAlpha = alfa;
        for (let i = w.ini; i < w.fim; i++) ctx.fillText(l.texto[i], l.xs[i], b.dy);
      }
      ctx.globalAlpha = 1;
      for (let i = w.ini; i < w.fim; i++) ctx.fillText(l.texto[i], l.xs[i], a.dy);
    });
    ctx.restore();
  }

  // ---- a palavra em ouro: as letras nascem uma a uma de uma névoa dourada
  // (22/10/2026, "não gosto dela do jeito que está": antes era uma cortina
  // da esquerda para a direita com borda macia). Cada letra sobe de leve
  // (0,22 em), o espaçamento fecha a partir do centro, a névoa se dissolve
  // na letra nítida; os vãos entre as letras encolhem (x0,86); uma luz
  // acompanha a ponta da escrita; quando a última assenta, o brilho varre a
  // palavra. Na saída, da última para a primeira, afundam na névoa.
  /** Quando a letra i começa a nascer e quanto dura (tempo da coreografia) */
  const inicioLetra3 = (i: number) => 2.35 + (0.04 * (1 - 0.86 ** i)) / 0.14;
  const DURA_LETRA3 = 0.5;
  function desenharLinha3(t: number, cam: Camera) {
    const l = textos.l3;
    const n = l.texto.length;
    if (n === 0 || !spritesTexto) return;
    const fimEntrada = inicioLetra3(n - 1) + DURA_LETRA3;
    const fimSaida = 6.3 + (n - 1) * 0.012 + 0.3;
    if (t < 2.35 || t >= fimSaida) return;
    const w = l.largura;
    const ouroPronto = spritesTexto.l3;
    const nevoa = spritesTexto.l3Nevoa;
    const versaoClara = spritesTexto.l3Luz;
    ctx.save();
    noPlano(cam, enq.textoX - l.tamanho * 0.03, textos.base3, 1);

    if (t >= fimEntrada && t < 6.3) {
      // Assentada: a palavra é uma imagem pronta, com o brilho que corre
      // logo depois do pouso e de novo no fecho, junto com a luz dos potes
      pintarSprite(ouroPronto);
      const brilho = t < 4 ? mix(-0.3, 1.3, trecho(t, fimEntrada, fimEntrada + 0.45)) : mix(-0.3, 1.3, trecho(t, 5.7, 6.4));
      if (brilho > -0.2 && brilho < 1.2) {
        faixaDeLuz(versaoClara.tela, versaoClara.x0, versaoClara.y0, versaoClara.l, versaoClara.a, brilho * w, w * 0.24, 0.8);
      }
      ctx.restore();
      return;
    }

    // Letra a letra: o estilo do ouro (degradê ao longo da palavra inteira
    // e o contorno fino que encorpa o itálico), como na imagem pronta
    const entrando = t < fimEntrada;
    ctx.font = fonteDe(l);
    ctx.lineJoin = "round";
    const estilo = ouro(ctx, 0, w, -1);
    const contorno = fontes.contornoDestaque * l.tamanho;
    // As fronteiras entre letras, para recortar a névoa de cada uma: o meio
    // entre uma origem e a seguinte (a névoa é macia, o corte não aparece)
    const fronteira = (i: number) => (i <= 0 ? nevoa.x0 : i >= n ? nevoa.x0 + nevoa.l : (l.xs[i - 1] + l.xs[i]) / 2 + l.tamanho * 0.12);
    let frente = -1;
    for (let i = 0; i < n; i++) {
      let p: number;
      let dy: number;
      let dx: number;
      let alfaNitida: number;
      let alfaNevoa: number;
      if (entrando) {
        p = trecho(t, inicioLetra3(i), inicioLetra3(i) + DURA_LETRA3);
        if (p <= 0) break;
        if (p < 1) frente = i;
        const e = saiQuinta(p);
        dy = (1 - e) * l.tamanho * 0.22;
        dx = (1 - e) * l.tamanho * 0.06 * (i - n / 2);
        alfaNitida = limitar((p - 0.22) / 0.45);
        alfaNevoa = limitar(1 - p / 0.78);
      } else {
        const atraso = (n - 1 - i) * 0.012;
        const q = trecho(t, 6.3 + atraso, 6.3 + atraso + 0.3);
        if (q >= 1) continue;
        dy = entraCubica(q) * l.tamanho * 0.3;
        dx = 0;
        alfaNitida = 1 - limitar(q / 0.7);
        alfaNevoa = Math.sin(Math.PI * q) * 0.8;
      }
      if (alfaNevoa > 0.01) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(fronteira(i), nevoa.y0, fronteira(i + 1) - fronteira(i), nevoa.a);
        ctx.clip();
        ctx.translate(dx, dy);
        ctx.globalAlpha = alfaNevoa;
        pintarSprite(nevoa);
        ctx.restore();
      }
      if (alfaNitida > 0.01) {
        ctx.save();
        ctx.translate(dx, dy);
        ctx.globalAlpha = alfaNitida;
        if (contorno > 0) {
          ctx.lineWidth = contorno;
          ctx.strokeStyle = estilo;
          ctx.strokeText(l.texto[i], l.xs[i], 0);
        }
        ctx.fillStyle = estilo;
        ctx.fillText(l.texto[i], l.xs[i], 0);
        ctx.restore();
      }
    }
    // A luz que acompanha a ponta da escrita
    if (entrando && frente >= 0) {
      const lx = l.xs[frente] + l.tamanho * 0.28;
      const ly = -l.ascent * 0.4;
      const r = l.tamanho * 0.55;
      const g2 = ctx.createRadialGradient(lx, ly, 0, lx, ly, r);
      g2.addColorStop(0, "rgba(255, 246, 220, 0.45)");
      g2.addColorStop(1, "rgba(255, 246, 220, 0)");
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = 1 - trecho(t, fimEntrada - 0.18, fimEntrada);
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
      ctx.strokeStyle = `rgba(232, 204, 146, ${0.32 * forca})`;
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
      gh.addColorStop(0, `rgba(232, 204, 146, ${(0.4 + 0.2 * respira) * acende})`);
      gh.addColorStop(1, "rgba(232, 204, 146, 0)");
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = gh;
      ctx.fillRect(r.pontoX - halo, cy - halo, halo * 2, halo * 2);
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#e1c68f";
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

  // ---- os passos do pedido (10/10/2026, "tá muito rápido, modernize e
  // deixe mais leve e devagar"): cada linha sobe de uma fresta letra a
  // letra, com o espaçamento assentando, fica parada para ser lida e sai
  // subindo e se apagando, sem mola nem rastro. Embaixo, quatro traços
  // contam os passos, como nos stories: o da vez se enche de ouro. A calma
  // vem do ritmo do roteiro (este trecho corre a ~1/4 da velocidade); aqui
  // os tempos são da coreografia de 7 s
  function desenharPassos(t: number, cam: Camera) {
    const tp = enq.tamanhoPasso;
    const sai = entraCubica(trecho(t, 6.25, 6.5));
    const n = textos.passos.length;
    ctx.save();
    noPlano(cam, enq.textoX, textos.basePassos, 1);
    // A fresta: a borda de baixo fica logo abaixo das descendentes
    ctx.beginPath();
    ctx.rect(-10, -tp * 1.7, textos.larguraPassos + 40, tp * 2.05);
    ctx.clip();
    const subida = tp * 1.15;
    /** Uma linha, letra a letra: g0 é o índice da primeira letra na linha
     *  inteira (número + texto), para o escalonamento seguir de uma parte
     *  para a outra */
    const letras = (l: Linha, x0: number, g0: number, entra: number, saiDe: number, estilo: string | CanvasGradient) => {
      ctx.font = fonteDe(l);
      ctx.fillStyle = estilo;
      for (let i = 0; i < l.texto.length; i++) {
        const g = g0 + i;
        const pe = saiQuinta(trecho(t, entra + g * PASSOS_ESCALONA, entra + g * PASSOS_ESCALONA + 0.17));
        const q = entraCubica(trecho(t, saiDe + g * 0.0025, saiDe + g * 0.0025 + 0.1));
        if (pe <= 0 || q >= 1) continue;
        ctx.globalAlpha = Math.min(1, pe * 1.4) * (1 - q) * (1 - sai);
        const dy = mix(subida, 0, pe) - tp * 0.75 * q - 8 * sai;
        ctx.fillText(l.texto[i], x0 + l.xs[i] + tp * 0.035 * g * (1 - pe), dy);
      }
    };
    textos.passos.forEach((passo, k) => {
      const ini = PASSOS_INICIO + k * PASSOS_VEZ;
      const ultimo = k === n - 1;
      // O último fica até a saída de tudo
      const saiDe = ultimo ? 99 : ini + PASSOS_VEZ - 0.12;
      if (t < ini || t > saiDe + 0.2) return;
      let x: number;
      let g0 = 0;
      if (passo.numero.texto) {
        letras(passo.numero, 0, 0, ini, saiDe, ouro(ctx, 0, passo.numero.largura, -1));
        x = passo.numero.largura + tp * 0.6;
        g0 = passo.numero.texto.length + 1;
      } else {
        const pe = saiCubica(trecho(t, ini, ini + 0.14));
        ctx.globalAlpha = pe * (1 - sai);
        ctx.fillStyle = "#c9a56b";
        ctx.beginPath();
        ctx.arc(tp * 0.25, -tp * 0.34 + mix(subida * 0.6, 0, pe), tp * 0.17, 0, TAU);
        ctx.fill();
        x = tp;
        g0 = 1;
      }
      letras(passo.texto, x, g0, ini, saiDe, "rgba(255, 255, 255, 0.9)");
    });
    ctx.restore();

    // Os traços que contam os passos (o ponto final não tem traço)
    const contados = textos.passos.filter((p) => p.numero.texto).length;
    const surge = saiCubica(trecho(t, PASSOS_INICIO - 0.05, PASSOS_INICIO + 0.15));
    const alfa = surge * (1 - sai);
    if (alfa <= 0 || contados === 0) return;
    const lf = Math.min(textos.larguraPassos * 0.62, tp * 13);
    const vao = tp * 0.4;
    const lt = (lf - vao * (contados - 1)) / contados;
    ctx.save();
    noPlano(cam, enq.textoX, textos.basePassos + tp * 0.95, 1);
    for (let k = 0; k < contados; k++) {
      const x = k * (lt + vao);
      ctx.globalAlpha = alfa;
      ctx.fillStyle = "rgba(255, 255, 255, 0.16)";
      ctx.fillRect(x, 0, lt * surge, 1.5);
      const ini = PASSOS_INICIO + k * PASSOS_VEZ;
      const cheio = trecho(t, ini, ini + PASSOS_VEZ);
      if (cheio <= 0) continue;
      ctx.fillStyle = ouro(ctx, x, x + lt, -1);
      ctx.fillRect(x, 0, lt * cheio, 1.5);
    }
    ctx.restore();
  }

  // Uma coreografia de fora (o banner da Saúde da Mulher) usa o mesmo palco
  const coreografia = coreografar?.({
    ctx,
    roteiro,
    potes,
    luzFundo,
    luzOuro,
    sombra,
    luz: desenharLuz,
    pote: desenharPote,
    enq: () => enq,
    textos: () => textos,
    sprites: () => spritesTexto,
    P,
    pintarSprite,
    faixaDeLuz,
    particulas: desenharParticulas,
    escala: () => escala,
    densidade: () => dpr * escala,
  });

  let ultimoT = 0;

  function desenhar(tBruto: number) {
    const t = ((tBruto % DURACAO) + DURACAO) % DURACAO;
    const laco = Math.max(0, Math.floor(tBruto / DURACAO));
    // Guarda com as voltas: redesenhar depois de um redimensionamento não
    // pode voltar à entrada da primeira volta
    ultimoT = tBruto;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!larguraCss) return;
    ctx.setTransform(dpr * escala, 0, 0, dpr * escala, dpr * ox, dpr * oy);
    const cam = coreografia ? coreografia.camera(t, laco) : camera(t);
    ctx.translate(enq.cx, enq.cy);
    ctx.rotate(cam.giro);
    ctx.translate(-enq.cx, -enq.cy);
    ctx.textBaseline = "alphabetic";

    if (coreografia) {
      coreografia.desenhar(t, cam, laco);
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
