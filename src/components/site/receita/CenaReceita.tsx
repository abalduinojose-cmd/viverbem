"use client";
// A cena 3D do cartão "Enviar a foto da receita" (10/10/2026). Terceira
// versão no mesmo dia: a primeira era uma folha que se escrevia ("tá muito
// simples"); a segunda virou um pequeno filme do pedido, com câmera e
// profundidade ("ficou bom! mas pode melhorar, faça como o melhor editor de
// After Effects do mundo"). Esta é a mesma história com o acabamento de um
// compositor de After Effects:
//
//   - objetos com volume: o celular tem espessura (camadas em Z), o papel
//     tem um reflexo de luz que corre quando ele gira;
//   - desfoque de movimento nas entradas rápidas e na foto que voa;
//   - câmera com intenção: orbita, avança no momento da foto, treme no
//     clique do obturador, recua e termina numa pose de frente;
//   - luz: clarão com lens flare anamórfico (o risco horizontal e os
//     fantasmas), brilho de ouro e onda de choque no "conferida";
//   - foco que muda de plano: a receita desfoca enquanto a conversa fala;
//   - corte por elemento: a foto sai do visor da câmera e voa até o balão
//     do WhatsApp, e a conversa se abre em círculo a partir do obturador;
//   - tipografia cinética ao fundo: "FOTO" e depois "CONFERIDA", gigantes,
//     em contorno de ouro, com o espaçamento fechando, longe em Z.
//
//   0,0 a 1,7  a receita entra girando e se escreve; o celular chega girando
//   1,6 a 2,4  a câmera avança; na tela, a mira fecha e a receita entra em foco
//   2,3 a 2,8  obturador, clarão e flare, a câmera treme
//   2,6 a 3,5  a foto voa do visor para o balão; a conversa se abre em círculo
//   3,5 a 7,0  vistos azuis, "digitando...", "Receita conferida" (onda e
//              faíscas de ouro), "Já te mando o valor."; a receita desfoca
//   7,0 a 8,5  luz no vidro, pose final de frente, a receita volta ao foco
//   8,6 a 10   tudo se afasta no fundo e o laço recomeça
//
// DOM e SVG movidos por transform e opacity num laço de requestAnimationFrame
// que só roda com o cartão à vista; cada quadro é função do tempo, então o
// laço emenda sem salto. Só decoração (aria-hidden); o texto do cartão está
// em HTML.
import { useEffect, useRef } from "react";
import { TAU, entraCubica, entraSaiSeno, limitar, mix, saiCubica, saiQuinta, trecho } from "../heroAnimado/cena";

/** O laço, em segundos */
const CICLO = 10;
/** O palco, em px lógicos (escala para caber no espaço do cartão) */
const LARGURA = 320;
const ALTURA = 300;

// A paleta: o azul do site e o ouro novo (10/10/2026)
const NAVY = "#0d2340";
const TINTA = "#1c69b5";
const OURO = "#c9a56b";
const OURO_CLARO = "#e0c48f";

/** Saída com um passo além do alvo (a mola de quem pousa) */
const saiVolta = (p: number) => {
  const c1 = 1.4;
  const c3 = c1 + 1;
  return 1 + c3 * (p - 1) ** 3 + c1 * (p - 1) ** 2;
};
/** Um pulso: sobe e desce dentro do trecho (0 fora dele) */
const pulso = (t: number, a: number, b: number) => Math.sin(Math.PI * trecho(t, a, b));

// A poeira de luz: posição no palco, profundidade, tamanho, cor e fase
const POEIRA = Array.from({ length: 18 }, (_, i) => {
  const r = (n: number) => {
    const x = Math.sin(i * 127.1 + n * 311.7) * 43758.5453;
    return x - Math.floor(x);
  };
  return {
    x: mix(-20, LARGURA + 20, r(1)),
    y: mix(-10, ALTURA + 10, r(2)),
    z: mix(-280, 160, r(3)),
    tamanho: mix(3, 12, r(4)),
    cor: r(5) < 0.55 ? "rgba(224, 196, 143, 0.9)" : r(5) < 0.8 ? "rgba(150, 196, 240, 0.8)" : "rgba(255, 255, 255, 0.85)",
    fase: r(6) * TAU,
    voltas: 1 + Math.floor(r(7) * 2),
  };
});

const FAISCAS = 12;
const TEXTO_1 = "Receita conferida";
const TEXTO_2 = "Já te mando o valor.";

// ---------------------------------------------------------------- estados

/** A receita: entra girando do fundo e sai para o fundo no fim */
function estadoPapel(t: number) {
  const pe = saiCubica(trecho(t, 0.05, 1.0));
  const sai = entraCubica(trecho(t, 8.6, 9.5));
  const pose = entraSaiSeno(trecho(t, 7.3, 8.4)) * (1 - sai);
  const boia = 3 * Math.sin((2 * TAU * t) / CICLO);
  return {
    x: mix(-80, 0, pe) - 6 * pose,
    y: mix(80, 0, pe) + boia - 28 * sai,
    z: mix(-260, 0, pe) - 220 * sai + 10 * pose,
    rx: mix(64, 0, pe),
    rz: mix(-30, -8, pe) + 2 * pose,
    alfa: limitar(pe * 3) * (1 - sai),
    boia,
  };
}

/** O celular: chega girando em Y com a mola de quem pousa */
function estadoCelular(t: number) {
  const pc = saiVolta(trecho(t, 0.6, 1.65));
  const vai = entraCubica(trecho(t, 8.55, 9.45));
  const pose = entraSaiSeno(trecho(t, 7.3, 8.4)) * (1 - vai);
  const boia = -4 * Math.sin((2 * TAU * t) / CICLO + 1.2);
  const recuo = pulso(t, 2.38, 2.62);
  return {
    x: mix(160, 0, pc) + 80 * vai - 4 * pose,
    y: mix(56, 0, pc) + boia - 16 * vai,
    z: mix(-180, 60, pc) - 10 * recuo - 240 * vai + 8 * pose,
    ry: mix(80, -12, pc) + 50 * vai + 6 * pose,
    rz: mix(14, 4, pc) - 2 * pose,
    alfa: limitar(trecho(t, 0.6, 0.85)) * (1 - vai),
    boia,
  };
}

/** A câmera: orbita, avança na foto, recua e termina numa pose de frente */
function estadoCamera(t: number) {
  const w = TAU / CICLO;
  const avanca = entraSaiSeno(trecho(t, 1.6, 2.3)) * (1 - entraSaiSeno(trecho(t, 2.95, 3.7)));
  const pose = entraSaiSeno(trecho(t, 7.3, 8.4)) * (1 - entraSaiSeno(trecho(t, 8.7, 9.8)));
  // O tremor do obturador: forte no clique, morre em 0,3 s
  const q = trecho(t, 2.4, 2.72);
  const amp = q > 0 && q < 1 ? 2.6 * (1 - q) ** 2 : 0;
  return {
    ry: -17 + 6 * Math.sin(w * t) + 9 * pose - 3 * avanca,
    rx: 8 + 2.5 * Math.sin(2 * w * t + 1) - 3 * pose,
    z: 46 * avanca + 14 * pose,
    tremX: amp * Math.sin(t * 95),
    tremY: amp * Math.cos(t * 83),
  };
}

/** A foto que voa do visor (centro 60,96; 68x88) até o balão (centro 73,74;
 *  a receita do balão mede 36x46) */
function estadoFoto(t: number) {
  const p = trecho(t, 2.6, 3.15);
  const e = saiQuinta(p);
  const arco = Math.sin(Math.PI * p) * -18;
  return {
    x: mix(60, 73, e),
    y: mix(96, 74, e) + arco,
    escala: mix(1, 36 / 68, e),
    giro: mix(-6, -4, e) + 10 * Math.sin(Math.PI * p),
    alfa: p > 0 && t < 3.22 ? 1 : 0,
    p,
  };
}

// ---------------------------------------------------------------- peças

/** Uma miniatura da receita (no visor, na foto que voa e no balão) */
function ReceitaMini({ className = "" }: { className?: string }) {
  return (
    <span className={`block rounded-[3px] bg-[#f6f1e6] ${className}`}>
      <svg viewBox="0 0 120 156" className="block w-full h-full">
        <text x="12" y="28" fontSize="22" fill={NAVY} fontFamily="var(--font-destaque), Georgia, serif" fontStyle="italic">
          ℞
        </text>
        <rect x="42" y="14" width="50" height="7" rx="3.5" fill={OURO} />
        {[92, 84, 70, 54].map((w, i) => (
          <rect key={w} x="14" y={48 + i * 14} width={w} height="4" rx="2" fill="#c9cfd8" />
        ))}
        <path d="M64 130 c6 -12 14 -13 12 -2 c-2 9 -9 8 -6 -1 c3 -9 12 -10 15 -3 c3 6 7 5 12 -4" fill="none" stroke={TINTA} strokeWidth="2" strokeLinecap="round" />
      </svg>
    </span>
  );
}

function Vistos() {
  return (
    <svg data-c="vistos" viewBox="0 0 16 10" className="inline-block w-3 h-2" fill="none" stroke="#8696a0" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 5.5 3.6 8 8.5 2" />
      <path d="M6.2 7.4 6.8 8 11.8 2" />
    </svg>
  );
}

/** Uma palavra do fundo, em contorno de ouro, na faixa livre do alto (fora
 *  da câmera: com o giro da cena ela acabava escondida atrás do celular) */
function PalavraFundo({ nome, texto, tamanho }: { nome: string; texto: string; tamanho: number }) {
  return (
    <span
      data-c={nome}
      className="absolute left-[3%] top-[5%] whitespace-nowrap font-bold uppercase leading-none opacity-0"
      style={{
        fontSize: tamanho,
        color: "transparent",
        WebkitTextStroke: "1.4px rgba(224, 196, 143, 0.55)",
        letterSpacing: "0.2em",
      }}
    >
      {texto}
    </span>
  );
}

export function CenaReceita({ className = "" }: { className?: string }) {
  const raiz = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const caixa = raiz.current;
    if (!caixa) return;
    // Os elementos da cena, marcados com data-c (um nome; listas repetem o
    // nome, na ordem do documento)
    const E: Record<string, HTMLElement | undefined> = {};
    const L: Record<string, HTMLElement[]> = {};
    caixa.querySelectorAll<HTMLElement>("[data-c]").forEach((n) => {
      const nome = n.getAttribute("data-c") ?? "";
      (L[nome] ??= []).push(n);
      E[nome] ??= n;
    });
    const s = (el: Element | undefined, transform?: string, opacity?: number) => {
      if (!el) return;
      const st = (el as HTMLElement).style;
      if (transform !== undefined) st.transform = transform;
      if (opacity !== undefined) st.opacity = String(Math.max(0, Math.min(1, opacity)));
    };
    /** Opacidade e desfoque de um objeto em 3D: com opacidade abaixo de 1
     *  ou com filtro o navegador achata as camadas (some a espessura), então
     *  os dois só ficam ligados enquanto precisam */
    const em3D = (el: HTMLElement | undefined, alfa: number, desfoque: number, extra = "") => {
      if (!el) return;
      el.style.opacity = alfa >= 0.999 ? "" : String(Math.max(0, alfa));
      const f = `${desfoque > 0.05 ? `blur(${desfoque.toFixed(2)}px)` : ""} ${extra}`.trim();
      el.style.filter = f;
    };
    let ultimo1 = -1;
    let ultimo2 = -1;
    let vistoAzul: boolean | null = null;

    function quadro(t: number) {
      const w = TAU / CICLO;
      const surge = trecho(t, 0, 0.5);
      const some = 1 - trecho(t, 9.0, 9.7);

      // ---- A câmera
      const cam = estadoCamera(t);
      s(E.contentor, `translate(${cam.tremX}px, ${cam.tremY}px)`);
      s(E.rig, `translateZ(${cam.z}px) rotateY(${cam.ry}deg) rotateX(${cam.rx}deg)`);
      s(E.raios, `translateZ(-320px) rotate(${(t / CICLO) * 90}deg)`, 0.55 * surge * some + 0.0001);
      (L.poeira ?? []).forEach((el, i) => {
        const p = POEIRA[i];
        const f = p.voltas * w * t + p.fase;
        s(el, `translate3d(${p.x + 7 * Math.sin(f)}px, ${p.y + 9 * Math.cos(f * 0.5 + p.fase)}px, ${p.z}px)`, (0.35 + 0.35 * Math.sin(f * 2)) * Math.max(surge, 0.4));
      });

      // ---- Tipografia do fundo: "FOTO" e depois "CONFERIDA"
      const palavra = (el: HTMLElement | undefined, a: number, b: number, sai: number, fim: number) => {
        if (!el) return;
        const entra = saiQuinta(trecho(t, a, b));
        const vai = entraCubica(trecho(t, sai, fim));
        // Só um pouco de paralaxe com a câmera, para parecer estar lá atrás
        const dx = -0.7 * (cam.ry + 17) + 0.4 * cam.tremX;
        s(el, `translate3d(${dx}px, ${mix(16, 0, entra) - 12 * vai}px, 0)`, entra * (1 - vai));
        el.style.letterSpacing = `${mix(0.7, 0.16, entra) + 0.12 * vai}em`;
      };
      palavra(E.palavraFoto, 1.3, 2.2, 3.05, 3.5);
      palavra(E.palavraConferida, 4.95, 5.9, 7.55, 8.1);

      // ---- A receita
      const pp = estadoPapel(t);
      const antes = estadoPapel(Math.max(0, t - 0.03));
      const velPapel = Math.hypot(pp.x - antes.x, pp.y - antes.y, (pp.z - antes.z) * 0.4);
      s(E.papel, `translate3d(${pp.x}px, ${pp.y}px, ${pp.z}px) rotateX(${pp.rx}deg) rotateZ(${pp.rz}deg)`);
      // Desfoque de movimento na entrada, foco que muda de plano durante a
      // conversa e o clarão da foto batendo no papel
      const foco = mix(0, 1.6, entraSaiSeno(trecho(t, 3.6, 4.2))) * (1 - entraSaiSeno(trecho(t, 7.2, 7.8)));
      const clarao = pulso(t, 2.38, 2.7);
      if (E.papel) {
        E.papel.style.opacity = String(pp.alfa);
        const blur = Math.min(4, velPapel * 0.16) + foco;
        E.papel.style.filter = `${blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : ""} ${clarao > 0.01 ? `brightness(${(1 + 0.6 * clarao).toFixed(2)})` : ""}`.trim();
      }
      s(E.sombraPapel, `translateY(${-pp.boia * 0.5}px) scale(${1 - pp.boia * 0.02})`, 0.55 * pp.alfa);
      // O reflexo de luz que corre pelo papel quando ele gira (na entrada e na pose)
      const varre = trecho(t, 0.35, 1.15) > 0 && t < 1.2 ? trecho(t, 0.35, 1.15) : trecho(t, 7.5, 8.2);
      s(E.brilhoPapel, `translateX(${mix(-120, 120, entraSaiSeno(varre))}%)`, varre > 0 && varre < 1 ? 1 : 0);
      (L.linhas ?? []).forEach((linha, i) => {
        linha.style.strokeDashoffset = String(100 - 100 * saiCubica(trecho(t, 0.55 + i * 0.12, 0.85 + i * 0.12)));
      });
      if (E.assinatura) E.assinatura.style.strokeDashoffset = String(100 - 100 * saiCubica(trecho(t, 1.15, 1.6)));

      // ---- O celular
      const pc = estadoCelular(t);
      const ac = estadoCelular(Math.max(0, t - 0.03));
      const velCel = Math.hypot(pc.x - ac.x, pc.y - ac.y, (pc.z - ac.z) * 0.4) + Math.abs(pc.ry - ac.ry) * 0.6;
      s(E.celular, `translate3d(${pc.x}px, ${pc.y}px, ${pc.z}px) rotateY(${pc.ry}deg) rotateZ(${pc.rz}deg)`);
      em3D(E.celular, pc.alfa, Math.min(4.5, velCel * 0.14));
      s(E.sombraCelular, `translateY(${-pc.boia * 0.5}px) scale(${1 + pc.boia * 0.015})`, 0.5 * limitar(trecho(t, 0.7, 1.4)) * (1 - entraCubica(trecho(t, 8.55, 9.45))));

      // Na tela, a câmera: a mira fecha, a receita entra em foco, o obturador aperta
      const focoCam = saiCubica(trecho(t, 1.6, 2.2));
      s(E.mira, `scale(${mix(1.45, 1, focoCam)})`, focoCam * (1 - trecho(t, 2.55, 2.75)));
      if (E.visor) {
        const bv = mix(3.5, 0, trecho(t, 1.75, 2.25));
        E.visor.style.filter = bv > 0.05 ? `blur(${bv.toFixed(2)}px)` : "";
        // A receita sai do visor quando vira foto
        E.visor.style.opacity = t > 2.6 && t < 9.9 ? "0" : "1";
      }
      s(E.obturador, `scale(${1 - 0.22 * pulso(t, 2.32, 2.5)})`);
      s(E.flashTela, undefined, 0.95 * pulso(t, 2.4, 2.72));
      s(E.camera, undefined, 1 - trecho(t, 3.0, 3.1));
      // A conversa se abre em círculo a partir do obturador
      const abre = saiQuinta(trecho(t, 2.62, 3.1));
      if (E.chat) {
        E.chat.style.clipPath = abre >= 1 ? "" : `circle(${(abre * 300).toFixed(1)}px at 60px 211px)`;
        E.chat.style.visibility = abre > 0 ? "visible" : "hidden";
      }

      // A foto voa do visor até o balão
      const f = estadoFoto(t);
      const fa = estadoFoto(Math.max(0, t - 0.025));
      if (E.fotoVoa) {
        E.fotoVoa.style.transform = `translate(${f.x - 34}px, ${f.y - 44}px) rotate(${f.giro}deg) scale(${f.escala})`;
        E.fotoVoa.style.opacity = String(f.alfa);
        const v = Math.hypot(f.x - fa.x, f.y - fa.y);
        E.fotoVoa.style.filter = v > 0.3 ? `blur(${Math.min(2.5, v * 0.5).toFixed(2)}px)` : "";
      }

      // A conversa
      s(E.balaoFoto, `scale(${0.82 + 0.18 * saiVolta(trecho(t, 3.1, 3.45))})`, trecho(t, 3.1, 3.2));
      const azul = t > 3.9;
      if (azul !== vistoAzul && E.vistos) {
        vistoAzul = azul;
        E.vistos.style.stroke = azul ? "#53bdeb" : "#8696a0";
      }
      const digitando = trecho(t, 4.05, 4.25) * (1 - trecho(t, 4.9, 5.05));
      s(E.digitando, `scale(${0.8 + 0.2 * digitando})`, digitando);
      (L.pontos ?? []).forEach((p, i) => s(p, `translateY(${-3 * Math.max(0, Math.sin(t * 9 - i * 0.9))}px)`));
      s(E.resposta1, `scale(${0.6 + 0.4 * saiVolta(trecho(t, 5.0, 5.38))})`, trecho(t, 5.0, 5.18));
      const n1 = Math.round(TEXTO_1.length * trecho(t, 5.12, 5.7));
      if (n1 !== ultimo1 && E.texto1) {
        ultimo1 = n1;
        E.texto1.textContent = TEXTO_1.slice(0, n1);
      }
      s(E.visto1, `scale(${saiVolta(trecho(t, 5.68, 5.95))})`);
      s(E.resposta2, `scale(${0.6 + 0.4 * saiVolta(trecho(t, 6.15, 6.5))})`, trecho(t, 6.15, 6.33));
      const n2 = Math.round(TEXTO_2.length * trecho(t, 6.25, 6.95));
      if (n2 !== ultimo2 && E.texto2) {
        ultimo2 = n2;
        E.texto2.textContent = TEXTO_2.slice(0, n2);
      }

      // O "conferida": onda de choque, brilho e faíscas de ouro
      const q = trecho(t, 5.72, 6.35);
      (L.faiscas ?? []).forEach((el, i) => {
        const ang = (i / FAISCAS) * 360 + 8;
        const dist = mix(6, 34, saiQuinta(q));
        const esc = q < 0.25 ? q / 0.25 : 1 - (q - 0.25) / 0.75;
        s(el, `rotate(${ang}deg) translateX(${dist}px) scaleX(${Math.max(0.001, esc)})`, q > 0 && q < 1 ? 1 : 0);
      });
      const qo = trecho(t, 5.7, 6.3);
      s(E.onda, `scale(${mix(0.4, 4.2, saiQuinta(qo))})`, qo > 0 && qo < 1 ? 0.9 * (1 - qo) : 0);
      s(E.brilhoOuro, `scale(${mix(0.6, 1.3, saiCubica(trecho(t, 5.7, 6.0)))})`, 0.8 * pulso(t, 5.65, 6.6));

      // A luz que corre pelo vidro do celular (na chegada e depois)
      const vidro = t < 2 ? trecho(t, 1.0, 1.6) : trecho(t, 7.0, 7.7);
      s(E.reflexo, `translateX(${mix(-160, 260, entraSaiSeno(vidro))}%) skewX(-20deg)`);

      // O clarão no palco e o lens flare
      s(E.flash, undefined, 0.4 * clarao);
      const fl = trecho(t, 2.38, 2.9);
      const forca = fl > 0 && fl < 1 ? (fl < 0.12 ? fl / 0.12 : (1 - (fl - 0.12) / 0.88) ** 1.6) : 0;
      s(E.flareRisco, `translate(-50%, -50%) scaleX(${mix(0.4, 1.6, saiCubica(fl))})`, forca);
      s(E.flareNucleo, `translate(-50%, -50%) scale(${mix(0.6, 1.4, saiCubica(fl))})`, forca);
      (L.flareFantasma ?? []).forEach((el, i) => {
        const d = (i + 1) * 26 * (0.7 + 0.3 * saiCubica(fl));
        s(el, `translate(calc(-50% - ${d}px), calc(-50% + ${d * 0.72}px))`, forca * (0.5 - i * 0.12));
      });
    }

    // ---- O laço: só com o cartão à vista e a aba aberta
    let quadroId = 0;
    let rodando = false;
    let visivel = false;
    let inicio = performance.now();
    let pausadoEm = inicio;
    let tAtual = 0;
    const passo = (agora: number) => {
      tAtual = ((((agora - inicio) / 1000) % CICLO) + CICLO) % CICLO;
      quadro(tAtual);
      quadroId = requestAnimationFrame(passo);
    };
    const reavaliar = () => {
      const tocar = visivel && !document.hidden;
      if (tocar && !rodando) {
        rodando = true;
        inicio += performance.now() - pausadoEm;
        quadroId = requestAnimationFrame(passo);
      } else if (!tocar && rodando) {
        rodando = false;
        pausadoEm = performance.now();
        cancelAnimationFrame(quadroId);
      }
    };
    quadro(0);
    const observador = new IntersectionObserver(([e]) => {
      visivel = e.isIntersecting;
      reavaliar();
    });
    observador.observe(caixa);
    document.addEventListener("visibilitychange", reavaliar);

    // O palco escala para caber no espaço que o cartão dá (8% de folga: o
    // celular gira e não pode encostar na borda do cartão)
    const ajustar = () => {
      const b = caixa.getBoundingClientRect();
      const k = Math.min(b.width / LARGURA, b.height / ALTURA) * 0.92;
      s(E.palco, `scale(${k > 0 ? k : 1})`);
    };
    ajustar();
    const medida = new ResizeObserver(ajustar);
    medida.observe(caixa);

    // Gancho de conferência, só no desenvolvimento: congela num instante
    if (process.env.NODE_ENV !== "production") {
      (window as unknown as { receitaQuadro?: (t: number) => void }).receitaQuadro = (t: number) => {
        visivel = false;
        reavaliar();
        quadro(t);
      };
      (window as unknown as { receitaTempo?: () => number }).receitaTempo = () => tAtual;
    }

    return () => {
      cancelAnimationFrame(quadroId);
      observador.disconnect();
      medida.disconnect();
      document.removeEventListener("visibilitychange", reavaliar);
    };
  }, []);

  return (
    <span ref={raiz} aria-hidden="true" className={`pointer-events-none absolute ${className}`}>
      <span
        data-c="palco"
        className="absolute left-1/2 top-1/2"
        style={{ width: LARGURA, height: ALTURA, marginLeft: -LARGURA / 2, marginTop: -ALTURA / 2 }}
      >
        <span data-c="contentor" className="absolute inset-0" style={{ perspective: "900px", perspectiveOrigin: "50% 42%" }}>
          {/* A tipografia do fundo */}
          <PalavraFundo nome="palavraFoto" texto="foto" tamanho={46} />
          <PalavraFundo nome="palavraConferida" texto="conferida" tamanho={18} />
          <span data-c="rig" className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
            {/* Raios de luz girando, bem no fundo */}
            <span
              data-c="raios"
              className="absolute left-1/2 top-1/2 w-[560px] h-[560px] -ml-[280px] -mt-[280px] rounded-full opacity-0"
              style={{
                background: "repeating-conic-gradient(from 0deg, rgba(224,196,143,0.16) 0deg 6deg, transparent 6deg 22deg)",
                WebkitMaskImage: "radial-gradient(circle, #000 0%, transparent 62%)",
                maskImage: "radial-gradient(circle, #000 0%, transparent 62%)",
              }}
            />
            {/* Poeira de luz em várias profundidades */}
            {POEIRA.map((p, i) => (
              <span
                key={i}
                data-c="poeira"
                className="absolute left-0 top-0 rounded-full"
                style={{ width: p.tamanho, height: p.tamanho, background: `radial-gradient(circle, ${p.cor}, transparent 70%)`, opacity: 0 }}
              />
            ))}

            {/* A receita */}
            <span
              data-c="sombraPapel"
              className="absolute left-[18px] top-[244px] w-[124px] h-[22px] rounded-[50%] bg-[radial-gradient(closest-side,rgba(2,9,22,0.55),transparent)] opacity-0"
            />
            <span
              data-c="papel"
              className="absolute left-[22px] top-[86px] w-[120px] h-[156px] overflow-hidden rounded-[10px] bg-[#f6f1e6] shadow-[0_30px_40px_-24px_rgba(2,9,22,0.85)] opacity-0"
            >
              <svg viewBox="0 0 120 156" className="absolute inset-0 w-full h-full" fill="none">
                <text x="12" y="30" fontSize="24" fill={NAVY} fontFamily="var(--font-destaque), Georgia, serif" fontStyle="italic">
                  ℞
                </text>
                <rect x="42" y="15" width="50" height="7" rx="3.5" fill={OURO} />
                <rect x="42" y="26" width="30" height="4" rx="2" fill="#dfe3e9" />
                {[92, 84, 70, 54].map((w, i) => (
                  <path
                    key={w}
                    data-c="linhas"
                    d={`M16 ${52 + i * 15} H${14 + w}`}
                    pathLength={100}
                    strokeDasharray="100 100"
                    strokeDashoffset="100"
                    stroke="#c9cfd8"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                  />
                ))}
                <path
                  data-c="assinatura"
                  d="M60 132 c7 -14 16 -15 14 -2 c-2 10 -10 9 -7 -1 c3 -10 13 -12 17 -3 c3 7 8 6 13 -5"
                  pathLength={100}
                  strokeDasharray="100 100"
                  strokeDashoffset="100"
                  stroke={TINTA}
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                <circle cx="26" cy="132" r="11" stroke={OURO} strokeWidth="1.4" strokeDasharray="3 2" />
              </svg>
              {/* O reflexo de luz no papel */}
              <span
                data-c="brilhoPapel"
                className="absolute inset-0 opacity-0"
                style={{ background: "linear-gradient(115deg, transparent 35%, rgba(255,255,255,0.75) 50%, transparent 65%)" }}
              />
            </span>

            {/* O celular, com espessura: costas, borda e frente em Z */}
            <span
              data-c="sombraCelular"
              className="absolute left-[150px] top-[268px] w-[150px] h-[24px] rounded-[50%] bg-[radial-gradient(closest-side,rgba(2,9,22,0.6),transparent)] opacity-0"
            />
            <span
              data-c="celular"
              className="absolute left-[164px] top-[14px] w-[134px] h-[262px]"
              style={{ transformStyle: "preserve-3d", opacity: 0 }}
            >
              <span className="absolute inset-0 rounded-[26px] bg-[#03070d]" style={{ transform: "translateZ(-9px)" }} />
              <span className="absolute inset-0 rounded-[26px] bg-[linear-gradient(90deg,#2a3546,#0a1220_30%,#0a1220_70%,#2a3546)]" style={{ transform: "translateZ(-4.5px)" }} />
              <span className="absolute inset-0 rounded-[26px] bg-[#0a1220] p-[6px] ring-1 ring-white/20 shadow-[0_40px_50px_-28px_rgba(2,9,22,0.95)]">
                <span className="relative block w-full h-full overflow-hidden rounded-[20px] bg-[#0b141a]">
                  {/* A câmera */}
                  <span data-c="camera" className="absolute inset-0 bg-[#121212]">
                    <span className="absolute top-3 inset-x-0 text-center text-[7px] tracking-[0.2em] font-semibold text-[#f7c948]">FOTO</span>
                    <span data-c="visor" className="absolute left-1/2 top-[52px] -ml-[34px] w-[68px] h-[88px] -rotate-6">
                      <ReceitaMini className="w-full h-full" />
                    </span>
                    <svg data-c="mira" viewBox="0 0 100 120" className="absolute left-1/2 top-[40px] -ml-[50px] w-[100px] h-[120px] opacity-0" fill="none">
                      {["M4 22 V8 a4 4 0 0 1 4 -4 H22", "M78 4 H92 a4 4 0 0 1 4 4 V22", "M96 98 V112 a4 4 0 0 1 -4 4 H78", "M22 116 H8 a4 4 0 0 1 -4 -4 V98"].map((d) => (
                        <path key={d} d={d} stroke={OURO_CLARO} strokeWidth="2.4" strokeLinecap="round" />
                      ))}
                    </svg>
                    <span className="absolute bottom-[18px] left-1/2 -ml-[17px] w-[34px] h-[34px] rounded-full ring-2 ring-white/80 grid place-items-center">
                      <span data-c="obturador" className="block w-[26px] h-[26px] rounded-full bg-white" />
                    </span>
                  </span>

                  {/* A conversa do WhatsApp (abre em círculo a partir do obturador) */}
                  <span data-c="chat" className="absolute inset-0 bg-[#0b141a]" style={{ visibility: "hidden" }}>
                    <span className="absolute inset-x-0 top-0 h-[34px] bg-[#202c33] flex items-center gap-1.5 px-2 pt-1.5">
                      <span className="w-[18px] h-[18px] rounded-full bg-[image:var(--ouro-degrade)] grid place-items-center text-[6.5px] font-bold text-[#0d2340]">VB</span>
                      <span className="leading-none">
                        <span className="block text-[8px] font-semibold text-white">Viver Bem</span>
                        <span className="block text-[6px] text-[#25d366] mt-[2px]">online</span>
                      </span>
                    </span>
                    {/* A foto enviada */}
                    <span
                      data-c="balaoFoto"
                      className="absolute right-[7px] top-[44px] w-[80px] rounded-[9px] rounded-tr-[3px] bg-[#005c4b] p-[3px] opacity-0"
                      style={{ transformOrigin: "100% 0%" }}
                    >
                      <span className="relative block h-[54px] overflow-hidden rounded-[6px] bg-[#0b141a]">
                        <ReceitaMini className="absolute left-1/2 top-1/2 -ml-[18px] -mt-[23px] w-[36px] h-[46px] -rotate-[4deg]" />
                      </span>
                      <span className="flex items-center justify-end gap-1 px-1 pt-[3px] pb-[1px] text-[6px] text-white/60">
                        10:42 <Vistos />
                      </span>
                    </span>
                    {/* Digitando... */}
                    <span
                      data-c="digitando"
                      className="absolute left-[7px] top-[128px] h-[18px] px-2 rounded-[9px] rounded-tl-[3px] bg-[#202c33] flex items-center gap-[3px] opacity-0"
                      style={{ transformOrigin: "0% 0%" }}
                    >
                      {[0, 1, 2].map((i) => (
                        <span key={i} data-c="pontos" className="block w-[4px] h-[4px] rounded-full bg-white/60" />
                      ))}
                    </span>
                    {/* As respostas */}
                    <span
                      data-c="resposta1"
                      className="absolute left-[7px] top-[128px] max-w-[98px] min-h-[20px] rounded-[9px] rounded-tl-[3px] bg-[#202c33] px-2 py-[5px] text-[8px] leading-[1.25] text-white opacity-0 flex items-center gap-1"
                      style={{ transformOrigin: "0% 0%" }}
                    >
                      <span data-c="texto1" />
                      <span
                        data-c="visto1"
                        className="inline-grid place-items-center w-[11px] h-[11px] rounded-full bg-[image:var(--ouro-degrade)] shrink-0"
                        style={{ transform: "scale(0)" }}
                      >
                        <svg viewBox="0 0 12 12" className="w-[8px] h-[8px]" fill="none" stroke={NAVY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 6.3 5 8.6 9.5 3.5" />
                        </svg>
                      </span>
                    </span>
                    <span
                      data-c="resposta2"
                      className="absolute left-[7px] top-[156px] max-w-[104px] rounded-[9px] bg-[#202c33] px-2 py-[5px] text-[8px] leading-[1.25] text-white opacity-0"
                      style={{ transformOrigin: "0% 0%" }}
                    >
                      <span data-c="texto2" />
                    </span>
                  </span>

                  {/* A foto que voa do visor para o balão (por cima da conversa) */}
                  <span
                    data-c="fotoVoa"
                    className="absolute left-0 top-0 w-[68px] h-[88px] shadow-[0_10px_18px_-8px_rgba(0,0,0,0.8)] opacity-0"
                    style={{ transformOrigin: "50% 50%" }}
                  >
                    <ReceitaMini className="w-full h-full" />
                  </span>

                  {/* O clarão da foto na tela */}
                  <span data-c="flashTela" className="absolute inset-0 bg-white opacity-0" />
                  {/* A luz que corre pelo vidro */}
                  <span
                    data-c="reflexo"
                    className="absolute inset-y-0 left-0 w-1/2 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)]"
                    style={{ transform: "translateX(-160%) skewX(-20deg)" }}
                  />
                  {/* O entalhe */}
                  <span className="absolute top-[5px] left-1/2 -ml-[17px] w-[34px] h-[8px] rounded-full bg-black" />
                </span>
              </span>
            </span>

            {/* O "conferida": brilho, onda de choque e faíscas, à frente do balão */}
            <span className="absolute left-[262px] top-[160px]" style={{ transform: "translateZ(80px)" }}>
              <span
                data-c="brilhoOuro"
                className="absolute -left-[40px] -top-[40px] w-[80px] h-[80px] rounded-full bg-[radial-gradient(circle,rgba(224,196,143,0.55),transparent_65%)] opacity-0"
              />
              <span data-c="onda" className="absolute -left-[8px] -top-[8px] w-[16px] h-[16px] rounded-full border-[1.5px] border-[#e0c48f] opacity-0" />
              {Array.from({ length: FAISCAS }, (_, i) => (
                <span
                  key={i}
                  data-c="faiscas"
                  className="absolute left-0 top-0 w-[10px] h-[2px] -mt-[1px] rounded-full bg-[image:var(--ouro-degrade)] opacity-0"
                  style={{ transformOrigin: "0% 50%" }}
                />
              ))}
            </span>
          </span>
        </span>

        {/* O clarão no palco */}
        <span
          data-c="flash"
          className="absolute -inset-[20%] bg-[radial-gradient(circle_at_70%_25%,rgba(255,250,235,0.9),transparent_60%)] opacity-0"
        />
        {/* O lens flare do clarão: o risco anamórfico, o núcleo e os fantasmas */}
        <span className="absolute left-[232px] top-[44px]" style={{ mixBlendMode: "screen" }}>
          <span
            data-c="flareRisco"
            className="absolute left-0 top-0 w-[340px] h-[3px] rounded-full opacity-0"
            style={{ background: "linear-gradient(90deg, transparent, rgba(150,200,255,0.55) 30%, #fffaf0 50%, rgba(150,200,255,0.55) 70%, transparent)" }}
          />
          <span
            data-c="flareNucleo"
            className="absolute left-0 top-0 w-[70px] h-[70px] rounded-full opacity-0"
            style={{ background: "radial-gradient(circle, rgba(255,250,235,0.95), rgba(224,196,143,0.35) 35%, transparent 70%)" }}
          />
          {[22, 12, 30].map((d, i) => (
            <span
              key={i}
              data-c="flareFantasma"
              className="absolute left-0 top-0 rounded-full opacity-0"
              style={{
                width: d,
                height: d,
                background: i === 1 ? "rgba(150,200,255,0.35)" : "radial-gradient(circle, transparent 45%, rgba(224,196,143,0.4) 70%, transparent)",
              }}
            />
          ))}
        </span>
      </span>
    </span>
  );
}
