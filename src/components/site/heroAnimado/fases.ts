// A coreografia "fases", do banner da Saúde da Mulher (08/10/2026). A
// identidade é a da dobra (o azul-noite, o ouro, as três vozes da
// tipografia, a cápsula do rótulo, os potes com reflexo e sombra, a poeira
// de luz); o formato do movimento é outro, a pedido: "as transições estão
// iguais à primeira, mude o formato mas mantenha a identidade visual". O
// movimento dos potes foi refeito no mesmo dia ("não gostei do efeito nos
// produtos, melhore os movimentos"): a fila parada com foco que passava
// saiu; entrou a apresentação de um por vez, flutuando.
//
// "Em cada fase" vira a lua: no lugar do ponto que vira fio, cápsula e
// anel, uma lua de ouro que cresce e mingua; no lugar do carrossel, os
// potes flutuam ao longe em volta dela e vêm um de cada vez para a frente.
//
//   0,0 a 1,9  a lua cresce de nova a cheia; a cápsula do rótulo se abre a
//              partir do ponto de ouro; "Saúde" vira letra a letra, como
//              placas; "em cada fase da" entra palavra por palavra, ganhando
//              foco; "mulher" se acende do centro para as pontas
//   1,5 a 2,4  os quatro potes aparecem ao longe, flutuando em volta da lua,
//              fora de foco
//   2,35 a 5,2 um de cada vez, cada pote desliza para a frente da lua,
//              girando de leve e entrando em foco, recebe uma luz que corre
//              pelo rótulo e volta para longe enquanto o próximo vem; o
//              letreiro acompanha, um passo por pote
//   5,2 a 6,1  os quatro pousam juntos no horizonte, que se desenha embaixo
//              deles, em arco diante da lua cheia
//   6,2 a 7,0  os potes sobem e se afastam até sumir, a lua mingua, as
//              letras tombam; a câmera volta ao começo e o laço emenda
import type { Camera, Coreografia, Palco } from "./cena";
import {
  DURACAO,
  FOCAL,
  ORBITA_CENTRO,
  TAU,
  entraCubica,
  entraSaiCubica,
  entraSaiSeno,
  fonteDe,
  limitar,
  mix,
  mola,
  ouro,
  saiCubica,
  saiQuinta,
  trecho,
} from "./cena";

/** Profundidade da lua: longe, então quase não se mexe com a câmera */
const Z_LUA = 500;

/** Quando cada pote começa a vir para a frente (um a cada 0,72 s) */
const VEZ = (i: number) => 2.35 + i * 0.72;

/** O passo do letreiro: 0 no primeiro pote, 3 no último, parando em cada
 *  um enquanto ele está na frente (a curva zera a velocidade nos inteiros) */
function foco(t: number) {
  const v = 3 * trecho(t, VEZ(0) + 0.62, VEZ(3) + 0.62);
  const k = Math.min(2, Math.floor(v));
  return k + entraSaiCubica(v - k);
}

/** Quanto o pote i está na frente da lua: vem em 0,5 s, fica 0,25 s e volta
 *  em 0,5 s, cruzando com o próximo que vem (o último não volta: segue
 *  direto para o pouso) */
function naFrente(i: number, t: number) {
  const s = VEZ(i);
  const vem = entraSaiCubica(trecho(t, s, s + 0.5));
  const volta = i === 3 ? 0 : entraSaiCubica(trecho(t, s + 0.75, s + 1.25));
  return vem * (1 - volta);
}

/** O pouso de todos juntos no fecho */
const pouso = (t: number) => entraSaiCubica(trecho(t, 5.2, 6.05));

// Onde cada pote flutua ao longe, em volta da lua (x e altura acima do
// chão em unidades vezes a escala dos potes; z é a profundidade)
const LONGE = [
  { x: -128, sobe: 34, z: 540 },
  { x: 134, sobe: 14, z: 610 },
  { x: -46, sobe: 66, z: 760 },
  { x: 60, sobe: 4, z: 690 },
];
/** Diante da lua, onde cada um se apresenta (flutuando um pouco) */
const FRENTE = { x: 0, sobe: 12, z: -30 };
/** O pouso, em arco: os dois primeiros na frente, os outros atrás, nas
 *  pontas (o Composto fica atrás) */
const POUSO = [
  { x: -52, z: -12 },
  { x: 54, z: -6 },
  { x: -134, z: 118 },
  { x: 136, z: 128 },
];

export function criarFases(palco: Palco): Coreografia {
  const { ctx } = palco;

  /** O centro dos potes no plano z = 0, no mesmo lugar da tela que o
   *  carrossel da dobra */
  const centro = () => {
    const e = palco.enq();
    return (e.potesX * FOCAL) / (FOCAL + ORBITA_CENTRO);
  };

  function camera(t: number): Camera {
    const e = palco.enq();
    // Uma deriva lenta, de câmera na mão (voltas inteiras em 7 s), um
    // empurrão leve na apresentação e um recuo no pouso; sem giro (a dobra
    // gira, esta flutua)
    const onda = (TAU * t) / DURACAO;
    const x = 9 * e.ep * Math.sin(onda);
    const y = -4 * e.ep * Math.sin(onda * 2 + 0.6);
    let z = 22 * entraSaiSeno(trecho(t, 0.3, 3.0));
    z = mix(z, -30, entraSaiCubica(trecho(t, 5.2, 6.05)));
    z = mix(z, 0, entraSaiCubica(trecho(t, 6.25, DURACAO)));
    return { x, y, z, giro: 0 };
  }

  /** O texto quase não acompanha a câmera: só um respiro do recuo */
  const noPlano = (cam: Camera, x: number, y: number, s: number) => {
    const q = palco.P(x, y, 0, { x: 0, y: 0, z: cam.z * 0.3, giro: 0 });
    ctx.translate(q.x, q.y);
    ctx.scale(q.s * s, q.s * s);
  };

  // ---------------------------------------------------------------- potes

  function estadoPote(i: number, t: number) {
    const e = palco.enq();
    const ep = e.ep;
    const c = centro();
    // Cada um flutua no seu ritmo (frequências inteiras: o laço emenda)
    const onda = (TAU * t) / DURACAO;
    const boia = Math.sin(onda * (2 + (i % 2)) + i * 1.9) * 7 * ep;
    const deriva = Math.sin(onda + i * 2.4) * 10 * ep;
    const w = naFrente(i, t);
    const p = pouso(t);
    const longe = LONGE[i];
    let x = mix(c + longe.x * ep + deriva, c + FRENTE.x * ep, w);
    let sobe = mix(longe.sobe * ep + boia, FRENTE.sobe * ep + boia * 0.35, w);
    let z = mix(longe.z, FRENTE.z, w);
    x = mix(x, c + POUSO[i].x * ep, p);
    sobe = mix(sobe, 0, p);
    z = mix(z, POUSO[i].z, p);
    // Saída: sobem e se afastam até sumir, da direita para a esquerda
    const ini = 6.22 + (3 - i) * 0.05;
    const vai = entraSaiCubica(trecho(t, ini, ini + 0.55));
    z += 520 * vai;
    sobe += 70 * ep * vai;
    const aparece = saiQuinta(trecho(t, 1.5 + i * 0.12, 2.3 + i * 0.12));
    return {
      x,
      sobe,
      z,
      alfa: aparece * (1 - vai),
      // Giro aparente: a largura encolhe no meio de cada deslizamento, como
      // um pote que gira um pouco enquanto anda
      giro: 1 - 0.13 * limitar(Math.sin(Math.PI * w) + 0.7 * Math.sin(Math.PI * p)),
      desfoque: limitar((z - 70) / 430) * 0.92,
      naFrente: w * (1 - p),
      chegou: trecho(t, VEZ(i) + 0.38, VEZ(i) + 0.85),
    };
  }

  function desenharPotes(t: number, cam: Camera) {
    const e = palco.enq();
    const lista = palco.potes
      .map((sp, i) => ({ sp, i, s: estadoPote(i, t) }))
      .filter((o) => o.s.alfa > 0.004)
      .sort((a, b) => b.s.z - a.s.z);

    for (const { sp, i, s } of lista) {
      const chao = palco.P(s.x, e.chao, s.z, cam);
      const pe = palco.P(s.x, e.chao - s.sobe, s.z, cam);
      const h = sp.altura * e.ep * pe.s;
      const l = h * sp.proporcao * s.giro;

      // Luz rosada atrás de quem está na frente
      if (s.naFrente > 0.01) {
        const r = h * 1.2;
        ctx.globalAlpha = 0.5 * s.naFrente * s.alfa;
        ctx.drawImage(palco.luzFundo, pe.x - r, pe.y - h * 0.55 - r, r * 2, r * 2);
      }
      // Sombra e reflexo só perto do chão: quem flutua alto quase não
      // reflete, e o reflexo desce junto com a altura
      const perto = limitar(1 - s.sobe / (18 * e.ep)) * s.alfa * (1 - s.desfoque * 0.7);
      if (perto > 0.02) {
        ctx.globalAlpha = perto;
        ctx.drawImage(palco.sombra, chao.x - l * 0.55, chao.y - l * 0.1, l * 1.1, l * 0.2);
        ctx.globalAlpha = perto * 0.9;
        ctx.drawImage(sp.reflexo, pe.x - l / 2, chao.y + (chao.y - pe.y), l, h * 0.42);
      }
      // Rastro enquanto desliza: duas posições de antes, desfocadas
      const antes = estadoPote(i, t - 0.03);
      const pa = palco.P(antes.x, e.chao - antes.sobe, antes.z, cam);
      if (Math.hypot(pa.x - pe.x, pa.y - pe.y) > 5) {
        for (const [dt, a] of [
          [0.045, 0.1],
          [0.022, 0.16],
        ] as const) {
          const r = estadoPote(i, t - dt);
          const q = palco.P(r.x, e.chao - r.sobe, r.z, cam);
          const hh = sp.altura * e.ep * q.s;
          const ll = hh * sp.proporcao * r.giro;
          ctx.globalAlpha = a * r.alfa;
          ctx.drawImage(sp.desfocado, q.x - ll * 0.58, q.y - hh * 1.08, ll * 1.16, hh * 1.16);
        }
      }

      const x = pe.x - l / 2;
      const y = pe.y - h;
      // Os de longe ficam um pouco mais apagados: o da frente é o assunto
      if (s.desfoque > 0.01) {
        ctx.globalAlpha = s.alfa * mix(1, 0.72, s.desfoque);
        ctx.drawImage(sp.desfocado, pe.x - l * 0.58, pe.y - h * 1.08, l * 1.16, h * 1.16);
      }
      const nitidez = s.alfa * (1 - s.desfoque);
      if (nitidez > 0.01) {
        ctx.globalAlpha = nitidez;
        ctx.drawImage(sp.nitido, x, y, l, h);
        // A luz que corre pelo rótulo quando o pote chega na frente, e de
        // novo no pouso (da direita para a esquerda; na dobra é o contrário)
        const varre = s.chegou > 0 && s.chegou < 1 && s.naFrente > 0.6 ? s.chegou : trecho(t, 5.8, 6.3);
        if (varre > 0 && varre < 1) {
          palco.faixaDeLuz(sp.mascara, x, y, l, h, x + mix(1.3, -0.3, saiCubica(varre)) * l, l * 0.32, 0.5 * nitidez);
        }
      }
    }
    ctx.globalAlpha = 1;
  }

  // ---------------------------------------------------------------- a lua e o horizonte

  function desenharLua(t: number, cam: Camera) {
    const e = palco.enq();
    const visivel = trecho(t, 0.05, 0.5) * (1 - trecho(t, 6.6, 6.98));
    if (visivel <= 0.001) return;
    const cresce = entraSaiSeno(trecho(t, 0.2, 1.9));
    const mingua = entraSaiSeno(trecho(t, 6.2, 6.95));
    // 0 = nova, 1 = cheia. Crescente com a luz à direita; minguante com a
    // luz à esquerda, como no céu
    const fase = mingua > 0 ? 1 - mingua : cresce;
    const xLua = (e.potesX * (FOCAL + Z_LUA)) / (FOCAL + ORBITA_CENTRO);
    const c = palco.P(xLua, e.chao - 50 * e.ep, Z_LUA, cam);
    const R = 175 * e.ep * c.s;
    // A lua cheia respira e brilha mais no fecho
    const respiro = 0.5 - 0.5 * Math.cos((TAU * 2 * t) / DURACAO);
    const fecho = entraSaiSeno(trecho(t, 5.5, 6.1)) * (1 - trecho(t, 6.2, 6.6));

    // A atmosfera: luz rosada e um halo de ouro
    ctx.globalAlpha = visivel * (0.22 + 0.1 * fase);
    ctx.drawImage(palco.luzFundo, c.x - R * 2.3, c.y - R * 2.3, R * 4.6, R * 4.6);
    ctx.globalAlpha = visivel * fase * (0.14 + 0.06 * respiro + 0.16 * fecho);
    ctx.drawImage(palco.luzOuro, c.x - R * 1.7, c.y - R * 1.7, R * 3.4, R * 3.4);

    ctx.save();
    ctx.translate(c.x, c.y);
    if (mingua > 0) ctx.scale(-1, 1);

    // A parte iluminada: o semicírculo da direita mais a meia elipse do
    // terminador (que vai de um lado ao outro conforme a fase)
    if (fase > 0.003) {
      const rx = Math.max(0.01, R * Math.abs(Math.cos(Math.PI * fase)));
      ctx.beginPath();
      ctx.moveTo(0, -R);
      ctx.arc(0, 0, R, -Math.PI / 2, Math.PI / 2, false);
      ctx.ellipse(0, 0, rx, R, 0, Math.PI / 2, -Math.PI / 2, fase < 0.5);
      ctx.closePath();
      ctx.save();
      ctx.clip();
      ctx.globalAlpha = visivel * (0.42 + 0.12 * fecho);
      ctx.drawImage(palco.luzOuro, -R * 1.15, -R * 1.15, R * 2.3, R * 2.3);
      ctx.restore();
      // O limbo iluminado, em ouro
      ctx.lineCap = "round";
      ctx.strokeStyle = ouro(ctx, -R, R, -1);
      ctx.globalAlpha = visivel * 0.16;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(0, 0, R, -Math.PI / 2, Math.PI / 2, false);
      ctx.stroke();
      ctx.globalAlpha = visivel * 0.9;
      ctx.lineWidth = 1.6;
      ctx.stroke();
    }
    // O contorno inteiro, fino: a lua nova já se vê como um aro
    ctx.globalAlpha = visivel * 0.32;
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgb(222, 196, 140)";
    ctx.beginPath();
    ctx.arc(0, 0, R, 0, TAU);
    ctx.stroke();
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  function desenharHorizonte(t: number, cam: Camera) {
    const e = palco.enq();
    // Se desenha do centro para fora quando os potes pousam
    const abre = saiQuinta(trecho(t, 5.15, 5.75)) * (1 - entraSaiCubica(trecho(t, 6.45, 6.9)));
    if (abre <= 0.001) return;
    const c = centro();
    const W = 235 * e.ep * abre;
    const a = palco.P(c - W, e.chao, 0, cam);
    const b = palco.P(c + W, e.chao, 0, cam);
    // Luz dourada rente ao chão
    ctx.globalAlpha = 0.3 * abre;
    ctx.drawImage(palco.luzOuro, a.x, a.y - 18, b.x - a.x, 36);
    const g = ctx.createLinearGradient(a.x, 0, b.x, 0);
    g.addColorStop(0, "rgba(214, 186, 125, 0)");
    g.addColorStop(0.5, "rgba(230, 204, 146, 0.9)");
    g.addColorStop(1, "rgba(214, 186, 125, 0)");
    ctx.globalAlpha = 1;
    ctx.fillStyle = g;
    ctx.fillRect(a.x, a.y - 0.6, b.x - a.x, 1.2);
  }

  // ---------------------------------------------------------------- tipografia

  /** O rótulo: o ponto de ouro acende, a cápsula se abre dele para a
   *  direita e as palavras entram deslizando de dentro dela; na saída,
   *  deslizam para fora e a cápsula se fecha de volta no ponto */
  function desenharRotulo(t: number, cam: Camera) {
    const tx = palco.textos();
    const r = tx.rotulo;
    const e = palco.enq();
    const tr = e.tamanhoRotulo;
    const ponto = saiQuinta(trecho(t, 0.12, 0.5)) * (1 - entraCubica(trecho(t, 6.42, 6.62)));
    const abre = saiQuinta(trecho(t, 0.3, 1.1)) * (1 - entraSaiCubica(trecho(t, 6.08, 6.48)));
    if (ponto <= 0.001 && abre <= 0.001) return;
    const { x0, x1, topo, base } = r.capsula;
    const h = base - topo;
    const raio = h / 2;
    const cy = (topo + base) / 2;
    const fim = mix(x0 + h, x1, abre);

    ctx.save();
    noPlano(cam, e.textoX, tx.baseRotulo, 1);
    const caminho = (recuo = 0) => {
      const a = x0 + recuo;
      const b = fim - recuo;
      const rr = raio - recuo;
      ctx.beginPath();
      ctx.moveTo(a + rr, cy - rr);
      ctx.lineTo(b - rr, cy - rr);
      ctx.arc(b - rr, cy, rr, -Math.PI / 2, Math.PI / 2);
      ctx.lineTo(a + rr, cy + rr);
      ctx.arc(a + rr, cy, rr, Math.PI / 2, (Math.PI * 3) / 2);
      ctx.closePath();
    };
    if (abre > 0.001) {
      caminho();
      const vidro = ctx.createLinearGradient(0, topo, 0, base);
      vidro.addColorStop(0, `rgba(255, 255, 255, ${0.12 * abre})`);
      vidro.addColorStop(1, `rgba(255, 255, 255, ${0.035 * abre})`);
      ctx.fillStyle = vidro;
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.24 * abre})`;
      ctx.stroke();

      ctx.save();
      caminho(1);
      ctx.clip();
      r.partes.forEach((parte, k) => {
        const ini = 0.5 + k * 0.09;
        const entra = saiQuinta(trecho(t, ini, ini + 0.75));
        const sai = entraCubica(trecho(t, 6.02 + k * 0.04, 6.32 + k * 0.04));
        if (entra <= 0 || sai >= 1) return;
        const l = parte.linha;
        ctx.globalAlpha = entra * (1 - sai);
        ctx.font = fonteDe(l);
        ctx.fillStyle = parte.ouro ? ouro(ctx, parte.x, parte.x + l.largura, -1) : "rgba(255, 255, 255, 0.86)";
        ctx.fillText(l.texto, parte.x + mix(-tr * 1.4, 0, entra) + tr * 1.4 * sai, 0);
      });
      ctx.restore();
    }
    // O ponto de ouro, que respira (três vezes por laço)
    if (ponto > 0.001) {
      const respira = 0.5 - 0.5 * Math.cos((TAU * 3 * t) / DURACAO);
      const halo = r.raioPonto * (2.4 + 1.6 * respira);
      ctx.globalAlpha = (0.4 + 0.2 * respira) * ponto;
      ctx.drawImage(palco.luzOuro, r.pontoX - halo, cy - halo, halo * 2, halo * 2);
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#e1c68f";
      ctx.beginPath();
      ctx.arc(r.pontoX, cy, r.raioPonto * ponto, 0, TAU);
      ctx.fill();
    }
    ctx.restore();
  }

  /** A linha grande: cada letra vira como uma placa (de deitada a de pé,
   *  em torno do meio da letra), da esquerda para a direita; na saída,
   *  tombam para trás, da direita para a esquerda */
  function desenharLinha1(t: number, cam: Camera) {
    const tx = palco.textos();
    const l = tx.l1;
    const e = palco.enq();
    const n = l.texto.length;
    const entraLetra = (i: number) => trecho(t, 0.55 + i * 0.07, 0.55 + i * 0.07 + 0.65);
    const saiLetra = (i: number) => trecho(t, 6.2 + (n - 1 - i) * 0.05, 6.2 + (n - 1 - i) * 0.05 + 0.32);
    if (entraLetra(0) <= 0 || saiLetra(0) >= 1) return;
    ctx.save();
    noPlano(cam, e.textoX + l.recuo, tx.base1, 1);
    const prontas = palco.sprites();
    if (entraLetra(n - 1) >= 1 && saiLetra(n - 1) <= 0 && prontas) {
      palco.pintarSprite(prontas.l1);
      ctx.restore();
      return;
    }
    ctx.font = fonteDe(l);
    ctx.fillStyle = "#ffffff";
    const meio = -l.ascent * 0.4;
    for (let i = 0; i < n; i++) {
      const p = entraLetra(i);
      const q = saiLetra(i);
      if (p <= 0 || q >= 1) continue;
      const angulo = mix(Math.PI / 2, 0, mola(p)) + (Math.PI / 2) * entraCubica(q);
      const sy = Math.cos(angulo);
      if (Math.abs(sy) < 0.02) continue;
      ctx.save();
      ctx.globalAlpha = limitar(p * 2.2) * (1 - limitar(q * 1.2)) * (0.45 + 0.55 * Math.abs(sy));
      ctx.translate(l.xs[i], meio);
      ctx.scale(1, sy);
      ctx.translate(0, -meio);
      ctx.fillText(l.texto[i], 0, 0);
      ctx.restore();
    }
    ctx.restore();
  }

  /** A ligação: palavra por palavra, cada uma chega desfocada (cópias
   *  abertas que se juntam) e ganha foco; na saída, perde o foco e some */
  function desenharLinha2(t: number, cam: Camera) {
    const tx = palco.textos();
    const l = tx.l2;
    const e = palco.enq();
    const palavras: { ini: number; fim: number }[] = [];
    let comeco = 0;
    for (let i = 0; i <= l.texto.length; i++) {
      if (i === l.texto.length || l.texto[i] === " ") {
        if (i > comeco) palavras.push({ ini: comeco, fim: i });
        comeco = i + 1;
      }
    }
    const entraPalavra = (k: number) => saiQuinta(trecho(t, 1.05 + k * 0.13, 1.65 + k * 0.13));
    const saiPalavra = (k: number) => entraCubica(trecho(t, 6.26 + k * 0.04, 6.56 + k * 0.04));
    const ultima = palavras.length - 1;
    if (entraPalavra(0) <= 0 || saiPalavra(ultima) >= 1) return;
    ctx.save();
    noPlano(cam, e.textoX + l.recuo, tx.base2, 1);
    const prontas = palco.sprites();
    if (entraPalavra(ultima) >= 1 && saiPalavra(0) <= 0 && prontas) {
      palco.pintarSprite(prontas.l2);
      ctx.restore();
      return;
    }
    ctx.font = fonteDe(l);
    ctx.fillStyle = "rgba(255, 255, 255, 0.88)";
    palavras.forEach((w, k) => {
      const p = entraPalavra(k);
      const q = saiPalavra(k);
      if (p <= 0 || q >= 1) return;
      const alfa = p * (1 - q);
      const abertura = (1 - p + q) * l.tamanho * 0.22;
      const dx = mix(12, 0, p) - 10 * q;
      for (const [desvio, peso] of [
        [-abertura, 0.3],
        [abertura, 0.3],
        [0, 1],
      ] as const) {
        if (desvio !== 0 && abertura < 0.3) continue;
        ctx.globalAlpha = alfa * peso;
        for (let i = w.ini; i < w.fim; i++) ctx.fillText(l.texto[i], l.xs[i] + dx + desvio, 0);
      }
    });
    ctx.restore();
  }

  /** A palavra em ouro: acende do centro para as pontas, numa elipse de
   *  borda macia, com uma luz no meio; na saída, apaga para o centro */
  function desenharLinha3(t: number, cam: Camera) {
    const tx = palco.textos();
    const l = tx.l3;
    const e = palco.enq();
    const prontas = palco.sprites();
    if (!prontas) return;
    const abre = saiQuinta(trecho(t, 1.45, 2.45));
    const fecha = entraCubica(trecho(t, 6.3, 6.68));
    const r = abre * (1 - fecha);
    if (r <= 0.001) return;
    const w = l.largura;
    const cx = w / 2;
    const cy = -l.ascent * 0.42;
    const raio = w * 0.66 * r;
    ctx.save();
    noPlano(cam, e.textoX - l.tamanho * 0.03, tx.base3, 1);
    // A borda macia: elipses de fora para dentro, a de dentro opaca
    for (const [k, alfa] of [
      [1, 0.3],
      [0.9, 0.5],
      [0.8, 0.75],
      [0.7, 1],
    ] as const) {
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(cx, cy, raio * k, raio * k * 0.48, 0, 0, TAU);
      ctx.clip();
      ctx.globalAlpha = alfa;
      palco.pintarSprite(prontas.l3);
      ctx.restore();
    }
    // A luz no meio enquanto acende (e enquanto apaga)
    const acesa = Math.sin(Math.PI * limitar(abre)) * (1 - fecha) + Math.sin(Math.PI * fecha) * 0.6;
    if (acesa > 0.01) {
      const g = l.tamanho * 1.6;
      ctx.globalAlpha = 0.55 * acesa;
      ctx.drawImage(palco.luzOuro, cx - g, cy - g * 0.6, g * 2, g * 1.2);
    }
    // O brilho que corre: agora da direita para a esquerda
    const corre = t < 4.5 ? trecho(t, 2.85, 3.55) : trecho(t, 5.6, 6.15);
    if (corre > 0 && corre < 1) {
      const v = prontas.l3Luz;
      palco.faixaDeLuz(v.tela, v.x0, v.y0, v.l, v.a, mix(1.25, -0.25, entraSaiSeno(corre)) * w, w * 0.24, 0.8);
    }
    ctx.restore();
  }

  /** O letreiro anda de lado com o foco: o passo do pote em foco no meio,
   *  o seguinte esperando à direita; o último entra quando a câmera recua */
  function desenharPassos(t: number, cam: Camera) {
    const tx = palco.textos();
    const e = palco.enq();
    const tp = e.tamanhoPasso;
    const entra = entraSaiSeno(trecho(t, 2.5, 2.95));
    const sai = entraCubica(trecho(t, 6.2, 6.5));
    if (entra <= 0 || sai >= 1) return;
    const u = t < 5.3 ? foco(t) : 3 + entraSaiCubica(trecho(t, 5.3, 5.85));
    const passo = tp * 6.5;
    ctx.save();
    noPlano(cam, e.textoX, tx.basePassos, 1);
    ctx.beginPath();
    ctx.rect(-10, -tp * 1.5, tx.larguraPassos + 40, tp * 2);
    ctx.clip();
    const linha = (k: number, dx: number, alfa: number) => {
      const p = tx.passos[k];
      ctx.globalAlpha = alfa;
      let x = dx;
      if (p.numero.texto) {
        ctx.font = fonteDe(p.numero);
        ctx.fillStyle = ouro(ctx, dx, dx + p.numero.largura, -1);
        ctx.fillText(p.numero.texto, dx, 0);
        x = dx + p.numero.largura + tp * 0.6;
      } else {
        ctx.fillStyle = "#c0a060";
        ctx.beginPath();
        ctx.arc(dx + tp * 0.25, -tp * 0.34, tp * 0.19, 0, TAU);
        ctx.fill();
        x = dx + tp;
      }
      ctx.font = fonteDe(p.texto);
      ctx.fillStyle = "rgba(255, 255, 255, 0.86)";
      ctx.fillText(p.texto.texto, x, 0);
    };
    for (let k = 0; k < tx.passos.length; k++) {
      const d = k - u;
      const alfa = limitar(1 - Math.abs(d) * 1.7) * entra * (1 - sai);
      if (alfa <= 0.003) continue;
      const dx = d * passo;
      // Rastro curto enquanto desliza
      const andando = Math.abs(d - Math.round(d)) > 0.04;
      if (andando) {
        linha(k, dx + tp * 0.5, alfa * 0.12);
        linha(k, dx + tp * 0.25, alfa * 0.2);
      }
      linha(k, dx, alfa);
    }
    ctx.restore();
    // O fio de ouro embaixo enche conforme o foco anda (quatro paradas)
    const lf = tx.larguraPassos * 0.7;
    ctx.save();
    noPlano(cam, e.textoX, tx.basePassos + tp * 0.9, 1);
    ctx.globalAlpha = 0.5 * entra * (1 - sai);
    ctx.fillStyle = "rgba(255, 255, 255, 0.18)";
    ctx.fillRect(0, 0, lf, 1);
    ctx.globalAlpha = entra * (1 - sai);
    ctx.fillStyle = ouro(ctx, 0, lf, -1);
    ctx.fillRect(0, 0, (lf * Math.min(u + 1, 4)) / 4, 1);
    ctx.restore();
  }

  function desenhar(t: number, cam: Camera) {
    palco.particulas(t, cam, false);
    desenharLua(t, cam);
    desenharHorizonte(t, cam);
    desenharPotes(t, cam);
    palco.particulas(t, cam, true);
    desenharRotulo(t, cam);
    desenharLinha3(t, cam);
    desenharLinha1(t, cam);
    desenharLinha2(t, cam);
    desenharPassos(t, cam);
  }

  return { camera, desenhar };
}
