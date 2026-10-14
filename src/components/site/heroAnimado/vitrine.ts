// A coreografia "vitrine", do banner da Saúde da Mulher (14/10/2026). Pedido:
// "não gostei da animação, mude toda ela tanto para mobile quanto para
// desktop, quero os produtos sem destaque e um pouco maiores e aproveite
// mais o espaço das telas... quero a animação em JavaScript em alta
// qualidade".
//
// Saíram a lua de ouro, o pote da vez na frente com a luz rosada atrás e os
// outros desfocados ao longe (a coreografia "fases"). Agora os quatro
// produtos ficam juntos, lado a lado, todos nítidos e do mesmo jeito, sobre
// um espelho d'água com um fio de ouro, ocupando toda a área livre do
// cartão: no celular a faixa inteira abaixo do título, no computador tudo à
// direita dele.
//
//   entrada (só na primeira volta; tempo da coreografia, 0 a 7)
//     0,05 a 0,6  o fio de ouro do chão se desenha do centro para as pontas
//     0,18 a 1,1  os potes sobem de trás do fio, um a um, da esquerda para a
//                 direita, com rastro de movimento; cada um abre um anel na
//                 água ao atravessar a linha; a câmera chega perto devagar
//   o laço (todas as voltas, emenda sem corte)
//     - cada pote flutua no seu ritmo, numa onda que corre pela fila
//     - a cada troca do letreiro, uma ola passa pela fila: um pote depois do
//       outro sobe um pouco, gira de leve e recebe uma faixa de luz no
//       rótulo (uma vez da esquerda, outra da direita), e um brilho corre no
//       fio de ouro junto; a onda passa por todos, nenhum fica em destaque
//     - a câmera respira (deriva de lado e vaivém de profundidade) e a
//       poeira de luz anda em paralaxe
//
// O letreiro e as olas contam o tempo corrido desde o começo (voltas x 7 +
// t): cinco itens de 1,4 s fecham uma volta, e uma ola que começa no fim de
// uma volta termina na seguinte sem tranco. O roteiro estica a volta para
// ~12 s (cada item do letreiro fica ~2,4 s).
//
// Alta qualidade: cada pote é preparado uma vez no tamanho exato em que
// aparece (createImageBitmap com reamostragem "high"), então o desenho de
// cada quadro é quase 1 para 1, nítido e barato; e a escala dos potes tem
// teto pela resolução das fotos (até 1,3x de ampliação), para não amolecer.
import type { Camera, Coreografia, Imagem, Palco } from "./cena";
import { DURACAO, FOCAL, TAU, entraSaiCubica, entraSaiSeno, limitar, mix, saiCubica, saiQuinta, trecho } from "./cena";

/** Onde termina o título em HTML por cima do cartão (px CSS, medidos pelo
 *  TituloCinetico): a vitrine ocupa o que sobra. Zero = ainda não medido */
export const areaDoTexto = { direita: 0, base: 0 };

/** Quando o letreiro aparece na primeira volta (tempo da coreografia) */
export const LETREIRO_INICIO = 1.45;
/** Quanto dura cada item do letreiro: cinco itens fecham uma volta */
const VEZ = DURACAO / 5;

/** Em que item o letreiro está, no tempo corrido T (voltas x 7 + t): parado
 *  em cada inteiro e passando ao seguinte no último quarto da vez. Cresce
 *  sem parar; o letreiro em HTML usa o resto por 5 */
export function passoDoLetreiro(T: number) {
  if (T < LETREIRO_INICIO) return 0;
  const s = (T - LETREIRO_INICIO) / VEZ;
  const k = Math.floor(s);
  return k + entraSaiCubica(trecho(s - k, 0.75, 1));
}

/** Instante da volta em que o letreiro volta ao primeiro item: a luz passa
 *  de novo pelo "mulher" do título */
export const BRILHO_DO_TITULO = (LETREIRO_INICIO + VEZ * 4.75) % DURACAO;

/** Começo da ola k (tempo corrido): logo que o letreiro começa a trocar */
const inicioOla = (k: number) => LETREIRO_INICIO + VEZ * (k + 0.8);
/** Atraso de um pote para o seguinte na ola, e quanto ela dura em cada um */
const OLA_ATRASO = 0.075;
const OLA_DURA = 0.5;

/** Profundidade de cada pote (só para a ordem de desenho e um pouco de
 *  paralaxe; o tamanho na tela já desconta a profundidade) */
const PROFUNDIDADE = [0, 26, -12, 18];
/** O flutuar de cada um: voltas inteiras por volta (o laço emenda) e fase */
const BOIA = [
  { f: 1, fase: 0.2 },
  { f: 2, fase: 1.4 },
  { f: 1, fase: 2.9 },
  { f: 2, fase: 4.1 },
];
/** Quanto a foto pode ser ampliada antes de amolecer */
const AMPLIACAO_MAX = 1.3;

type Vaga = {
  /** No mundo, na profundidade z (projeta de volta na vaga da tela) */
  x: number;
  chao: number;
  altura: number;
  z: number;
  /** Escala da projeção em repouso (para converter medidas da tela) */
  s0: number;
};

type Arranjo = {
  vagas: Vaga[];
  /** Na tela do palco, em repouso */
  chaoTela: number;
  esquerda: number;
  direita: number;
  alturaMax: number;
  escala: number;
};

export function criarVitrine(palco: Palco): Coreografia {
  const { ctx } = palco;
  const n = palco.potes.length;

  // ---------------------------------------------------------------- o arranjo

  let chave = "";
  let arranjo: Arranjo | null = null;

  /** As vagas dos potes na área livre do cartão. Refeito só quando o
   *  tamanho do banner ou do título muda */
  function arranjar(): Arranjo {
    const e = palco.enq();
    const k = palco.escala() || 1;
    const dens = palco.densidade() || 1;
    const nova = `${e.modo}|${e.largura.toFixed(1)}|${e.altura}|${k.toFixed(4)}|${dens.toFixed(3)}|${areaDoTexto.direita}|${areaDoTexto.base}`;
    if (arranjo && nova === chave) return arranjo;
    chave = nova;

    const alturas = palco.potes.map((p) => p.altura);
    const larguras = palco.potes.map((p) => p.altura * p.proporcao);
    const somaLarguras = larguras.reduce((a, b) => a + b, 0);
    const alturaMax = Math.max(...alturas);
    // A área livre, no palco. No celular: a faixa entre o letreiro e o
    // convite da base, de borda a borda. No computador: à direita do
    // título, do alto até acima do fio da base
    let x0: number, x1: number, topo: number, chaoTela: number, vaoMin: number, vaoMax: number;
    if (e.modo === "retrato") {
      x0 = 10;
      x1 = e.largura - 10;
      topo = ((areaDoTexto.base || 252) + 26) / k;
      // O convite da base fica à esquerda, sob o reflexo
      chaoTela = e.altura - 52 / k;
      vaoMin = -16; // no celular estreito eles podem se encostar
      vaoMax = 24;
    } else {
      // Folga de 80 px entre o título e o primeiro pote (era 56: com a
      // câmera respirando o pote chegava a encostar no texto)
      x0 = ((areaDoTexto.direita || e.largura * k * 0.3) + 80) / k;
      x1 = e.largura - 52 / k;
      // Respiro no alto do tamanho do da cápsula do título (~64 px)
      topo = 64 / k;
      chaoTela = e.altura - 74 / k;
      // No tablet o título toma metade do cartão: os potes se encostam um
      // pouco em vez de encolher
      vaoMin = -14;
      vaoMax = 72;
    }
    const livre = Math.max(40, x1 - x0);
    // A escala: o que couber na altura e na largura, até o teto de nitidez
    // das fotos (o pote recortado mede ~280-330 px de altura)
    const tetoNitidez = Math.min(...palco.potes.map((p) => (AMPLIACAO_MAX * p.nitido.height) / (p.altura * dens)));
    const escala = Math.max(0.35, Math.min((chaoTela - topo) / alturaMax, (livre - vaoMin * (n - 1)) / somaLarguras, tetoNitidez));
    const vao = Math.max(vaoMin, Math.min(vaoMax, (livre - escala * somaLarguras) / (n - 1)));
    const fileira = escala * somaLarguras + vao * (n - 1);
    let x = x0 + (livre - fileira) / 2;
    const vagas: Vaga[] = larguras.map((l, i) => {
      const w = l * escala;
      const centro = x + w / 2;
      x += w + vao;
      const z = PROFUNDIDADE[i % PROFUNDIDADE.length];
      const s0 = FOCAL / (FOCAL + z);
      return { x: (centro - e.cx) / s0, chao: (chaoTela - e.cy) / s0, altura: (alturas[i] * escala) / s0, z, s0 };
    });
    arranjo = { vagas, chaoTela, esquerda: x0 + (livre - fileira) / 2, direita: x0 + (livre + fileira) / 2, alturaMax: alturaMax * escala, escala };
    prepararNitidos(alturas.map((a) => a * escala * dens));
    return arranjo;
  }

  // ---------------------------------------------------------------- os potes no tamanho exato

  const prontos: (Imagem | null)[] = new Array(n).fill(null);
  let medidaPronta = "";
  let geracao = 0;

  /** Reamostra cada foto uma vez, com filtro de alta qualidade, no tamanho
   *  em pixels em que ela vai aparecer: no quadro, o desenho fica quase 1
   *  para 1 (nítido no filtro barato). Até ficar pronto, desenha a original */
  function prepararNitidos(alturasPx: number[]) {
    const medida = alturasPx.map((a) => Math.round(a)).join(",");
    if (medida === medidaPronta || typeof createImageBitmap !== "function") return;
    medidaPronta = medida;
    const minha = ++geracao;
    palco.potes.forEach((p, i) => {
      const a = Math.max(8, Math.round(alturasPx[i]));
      const l = Math.max(4, Math.round((a * p.nitido.width) / p.nitido.height));
      createImageBitmap(p.nitido, { resizeWidth: l, resizeHeight: a, resizeQuality: "high" })
        .then((b) => {
          if (minha !== geracao) {
            b.close();
            return;
          }
          const velho = prontos[i];
          prontos[i] = b;
          if (velho instanceof ImageBitmap) velho.close();
        })
        .catch(() => {
          // Sem reamostragem (navegador antigo): fica a foto original
        });
    });
  }

  // ---------------------------------------------------------------- o tempo

  /** A ola que está passando pelo pote i no tempo corrido T, se houver:
   *  progresso (0 a 1) e sentido (1 da esquerda, -1 da direita) */
  function ola(i: number, T: number) {
    const k = Math.floor((T - inicioOla(0)) / VEZ);
    for (const j of [k, k - 1]) {
      if (j < 0) continue;
      const sentido = j % 2 === 0 ? 1 : -1;
      const ordem = sentido > 0 ? i : n - 1 - i;
      const ini = inicioOla(j) + ordem * OLA_ATRASO;
      const p = trecho(T, ini, ini + OLA_DURA);
      if (p > 0 && p < 1) return { p, sentido };
    }
    return null;
  }

  /** Quanto o pote i já subiu na entrada (0 escondido sob o fio, 1 no lugar) */
  const subida = (i: number, t: number, laco: number) => (laco > 0 ? 1 : saiQuinta(trecho(t, 0.18 + i * 0.09, 0.8 + i * 0.09)));

  function camera(t: number, laco: number): Camera {
    const onda = (TAU * t) / DURACAO;
    let z = 9 * Math.sin(onda + 0.9);
    // Na primeira volta a câmera chega de mais longe, devagar
    if (laco === 0) z = mix(-48, z, entraSaiSeno(trecho(t, 0, 1.6)));
    return { x: 6 * Math.sin(onda), y: -2.5 * Math.sin(onda * 2 + 0.6), z, giro: 0 };
  }

  // ---------------------------------------------------------------- o desenho

  function desenharAmbiente(t: number, laco: number, cam: Camera, a: Arranjo) {
    const surge = laco > 0 ? 1 : saiCubica(trecho(t, 0, 0.8));
    const respiro = 0.5 - 0.5 * Math.cos((TAU * 2 * t) / DURACAO);
    const e = palco.enq();
    const meio = (a.esquerda + a.direita) / 2;
    const largura = a.direita - a.esquerda;
    const c = palco.P(meio - e.cx, a.chaoTela - a.alturaMax * 0.5 - e.cy, 120, cam);
    // A luz rosada, larga, atrás da fila inteira (não de um pote só)
    const r = Math.max(largura * 0.62, a.alturaMax * 1.1) * c.s;
    ctx.globalAlpha = surge * (0.17 + 0.05 * respiro);
    palco.luz(palco.luzFundo, c.x - r, c.y - r, r * 2, r * 2);
    // A luz de ouro rente ao espelho
    const ch = palco.P(meio - e.cx, a.chaoTela - e.cy, 0, cam);
    const rl = largura * 0.62 * ch.s;
    ctx.globalAlpha = surge * (0.2 + 0.05 * respiro);
    palco.luz(palco.luzOuro, ch.x - rl, ch.y - rl * 0.13, rl * 2, rl * 0.26);
    ctx.globalAlpha = 1;
  }

  /** O fio de ouro do espelho, com o brilho que corre junto da ola */
  function desenharFio(t: number, T: number, laco: number, cam: Camera, a: Arranjo) {
    const e = palco.enq();
    const abre = laco > 0 ? 1 : saiQuinta(trecho(t, 0.05, 0.6));
    if (abre <= 0.001) return;
    const meio = (a.esquerda + a.direita) / 2;
    const meia = ((a.direita - a.esquerda) / 2 + a.alturaMax * 0.22) * abre;
    const pa = palco.P(meio - meia - e.cx, a.chaoTela - e.cy, 0, cam);
    const pb = palco.P(meio + meia - e.cx, a.chaoTela - e.cy, 0, cam);
    const g = ctx.createLinearGradient(pa.x, 0, pb.x, 0);
    g.addColorStop(0, "rgba(214, 186, 125, 0)");
    g.addColorStop(0.5, "rgba(230, 204, 146, 0.75)");
    g.addColorStop(1, "rgba(214, 186, 125, 0)");
    ctx.fillStyle = g;
    ctx.fillRect(pa.x, pa.y - 0.6, pb.x - pa.x, 1.2);
    // O brilho que acompanha a ola pelo fio
    const k = Math.floor((T - inicioOla(0)) / VEZ);
    for (const j of [k, k - 1]) {
      if (j < 0) continue;
      const q = trecho(T, inicioOla(j), inicioOla(j) + OLA_ATRASO * (n - 1) + OLA_DURA);
      if (q <= 0 || q >= 1) continue;
      const ida = j % 2 === 0 ? q : 1 - q;
      const x = mix(pa.x + (pb.x - pa.x) * 0.12, pb.x - (pb.x - pa.x) * 0.12, entraSaiSeno(ida));
      const rr = (a.alturaMax * 0.5 + 20) * pa.s;
      ctx.globalAlpha = 0.55 * Math.sin(Math.PI * q);
      palco.luz(palco.luzOuro, x - rr, pa.y - rr * 0.16, rr * 2, rr * 0.32);
      ctx.globalAlpha = 1;
    }
  }

  function desenharPotes(t: number, T: number, laco: number, cam: Camera, a: Arranjo) {
    const onda = (TAU * t) / DURACAO;
    const ordem = a.vagas.map((v, i) => ({ v, i })).sort((p, q) => q.v.z - p.v.z);
    for (const { v, i } of ordem) {
      const sp = palco.potes[i];
      const sobe = subida(i, t, laco);
      if (sobe <= 0) continue;
      const o = ola(i, T);
      const b = o ? Math.sin(Math.PI * o.p) ** 2 : 0;
      // Altura acima do espelho: o flutuar e a ola (em unidades do palco,
      // convertidas para o mundo pela profundidade)
      const boia = BOIA[i % BOIA.length];
      const flutua = (3.2 * Math.sin(onda * boia.f + boia.fase) + 3.2 + 11 * b) * a.escala;
      const chao = palco.P(v.x, v.chao, v.z, cam);
      const pe = palco.P(v.x, v.chao - flutua / v.s0, v.z, cam);
      const h = v.altura * pe.s;
      // Giro aparente na ola: a largura encolhe um pouco e volta
      const l = h * sp.proporcao * (1 - 0.06 * Math.sin(Math.PI * (o ? o.p : 0)));
      // Na entrada o pote sobe de trás do fio (escondido o que está abaixo)
      const afunda = (1 - sobe) * h * 1.06;
      const x = pe.x - l / 2;
      const y = pe.y - h + afunda;
      const ergueu = sobe * sobe;

      // Sombra de contato e reflexo, que se afastam quando ele sobe
      const solto = limitar(flutua / (16 * a.escala));
      ctx.globalAlpha = 0.5 * (1 - solto * 0.6) * ergueu;
      palco.luz(palco.sombra, chao.x - l * 0.62, chao.y - l * 0.08, l * 1.24, l * 0.16);
      ctx.globalAlpha = 0.85 * ergueu;
      palco.pote(sp.reflexo, x, chao.y + (chao.y - pe.y), l, h * 0.42, true);

      const imagem = prontos[i] ?? sp.nitido;
      if (sobe < 1) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(x - l, chao.y - h * 3, l * 3, h * 3);
        ctx.clip();
        // Rastro de movimento enquanto sobe rápido
        const antes = subida(i, t - 0.03, laco);
        const v = (sobe - antes) * h * 1.06;
        if (v > 2) {
          ctx.globalAlpha = 0.16;
          palco.pote(imagem, x, y + v * 0.8, l, h, true);
          ctx.globalAlpha = 0.08;
          palco.pote(imagem, x, y + v * 1.6, l, h, true);
        }
        ctx.globalAlpha = 1;
        palco.pote(imagem, x, y, l, h);
        ctx.restore();
        // O anel que se abre na água quando ele atravessa o fio
        const pr = trecho(sobe, 0.05, 1) * (sobe < 0.995 ? 1 : 0);
        if (pr > 0 && pr < 1) {
          const rx = l * mix(0.4, 1.5, saiCubica(pr));
          ctx.globalAlpha = 0.5 * (1 - pr) ** 1.6;
          ctx.strokeStyle = "rgb(224, 196, 143)";
          ctx.lineWidth = 1.1;
          ctx.beginPath();
          ctx.ellipse(chao.x, chao.y, rx, rx * 0.14, 0, 0, TAU);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      } else {
        ctx.globalAlpha = 1;
        palco.pote(imagem, x, y, l, h);
      }

      // A faixa de luz da ola correndo pelo rótulo
      if (o) {
        const centro = o.sentido > 0 ? mix(-0.35, 1.35, o.p) : mix(1.35, -0.35, o.p);
        palco.faixaDeLuz(sp.mascara, x, y, l, h, x + centro * l, l * 0.34, 0.55 * Math.sin(Math.PI * o.p), Infinity, true);
      }
    }
    ctx.globalAlpha = 1;
  }

  function desenhar(t: number, cam: Camera, laco: number) {
    const a = arranjar();
    const T = laco * DURACAO + t;
    palco.particulas(t, cam, false);
    desenharAmbiente(t, laco, cam, a);
    desenharFio(t, T, laco, cam, a);
    desenharPotes(t, T, laco, cam, a);
    palco.particulas(t, cam, true);
  }

  return { camera, desenhar };
}
