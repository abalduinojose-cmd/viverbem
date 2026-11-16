"use client";
// Rolagem suave da roda do mouse, no site inteiro (08/10/2026, pedido:
// "melhore os movimentos de scroll e tire os travamentos").
//
// O porquê: com as animações do Windows desligadas (a máquina do usuário),
// o Chrome também desliga a rolagem animada da roda. Cada clique salta uns
// 100px de uma vez, e tudo o que anda com a rolagem (as folhas da home, a
// galeria da página A Viver Bem, as revelações) anda aos saltos: parece
// que o site "trava".
//
// Como: cada clique soma ao alvo e a página desliza até ele com a rolagem
// suave do próprio navegador (scrollTo com behavior "smooth"), que anda na
// thread do compositor, sem ocupar o JavaScript a cada quadro. Se o
// navegador não animar (alguns desligam também a rolagem programática), o
// primeiro clique percebe e passa a deslizar por conta própria, um valor
// perseguindo o outro a cada quadro. A primeira versão fazia sempre isso e
// o trace do Chrome mostrou um quadro de 1,8 s com a página pesada: por
// isso o caminho do navegador vem primeiro.
//
// Só a roda do mouse. Ficam nativos: toque, trackpad (passos pequenos),
// teclado, barra de rolagem, âncoras, rolagem lateral (Shift ou faixas),
// o zoom (Ctrl) e qualquer caixa que role por dentro (gaveta, menu). Com a
// página travada (gaveta do carrinho aberta) também não mexe.
import { useEffect } from "react";

// Modo próprio: quanto a página persegue o alvo por quadro de 60 Hz (~0,4 s por clique)
const SUAVIDADE = 0.12;
// Passos menores que isso são de trackpad ou mouse de alta resolução: nativos
const PASSO_MINIMO = 40;

/** Alguma caixa entre o alvo e a página rola por dentro nessa direção? */
function rolaPorDentro(alvo: EventTarget | null, sentido: number): boolean {
  let el = alvo instanceof Element ? alvo : null;
  while (el && el !== document.body && el !== document.documentElement) {
    if (el instanceof HTMLElement && el.dataset.rolagemNativa !== undefined) return true;
    if (el.scrollHeight > el.clientHeight + 1) {
      const oy = getComputedStyle(el).overflowY;
      if (oy === "auto" || oy === "scroll") {
        const podeDescer = el.scrollTop + el.clientHeight < el.scrollHeight - 1;
        const podeSubir = el.scrollTop > 0;
        if (sentido > 0 ? podeDescer : podeSubir) return true;
      }
    }
    el = el.parentElement;
  }
  return false;
}

export function RolagemSuave() {
  useEffect(() => {
    // Celular e tablet: o dedo já tem a inércia nativa
    if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) return;

    // "testando" até o primeiro clique mostrar se o navegador anima o scrollTo
    // suave; a resposta fica guardada na sessão (as próximas páginas já sabem)
    let modo: "testando" | "navegador" | "proprio" = "testando";
    try {
      const guardado = sessionStorage.getItem("rolagem-suave-modo");
      if (guardado === "navegador" || guardado === "proprio") modo = guardado;
    } catch {
      // armazenamento bloqueado: testa de novo
    }
    const decidir = (m: "navegador" | "proprio") => {
      modo = m;
      try {
        sessionStorage.setItem("rolagem-suave-modo", m);
      } catch {
        // sem armazenamento, sem problema
      }
    };
    let alvo = window.scrollY;
    let atual = window.scrollY;
    let animando = false;
    let pedido = 0;
    let ultimoQuadro = 0;
    let escrito = -1;
    let fimNavegador = 0;

    const maximo = () => document.documentElement.scrollHeight - window.innerHeight;

    const pararProprio = () => {
      if (pedido) cancelAnimationFrame(pedido);
      pedido = 0;
      ultimoQuadro = 0;
    };

    // Modo próprio: a página persegue o alvo a cada quadro
    const passo = (agora: number) => {
      const dt = ultimoQuadro ? Math.min(64, agora - ultimoQuadro) : 16.67;
      ultimoQuadro = agora;
      const fator = 1 - Math.pow(1 - SUAVIDADE, dt / 16.67);
      atual += (alvo - atual) * fator;
      if (Math.abs(alvo - atual) < 0.5) atual = alvo;
      window.scrollTo({ top: atual, behavior: "instant" });
      escrito = window.scrollY;
      // O motor de efeitos (página A Viver Bem) atualiza neste mesmo quadro
      window.dispatchEvent(new Event("rolagemsuave"));
      if (atual !== alvo) pedido = requestAnimationFrame(passo);
      else pararProprio();
    };

    // Modo do navegador: um scrollTo suave até o alvo; cada clique novo redireciona
    const deslizarNavegador = () => {
      animando = true;
      window.clearTimeout(fimNavegador);
      fimNavegador = window.setTimeout(() => (animando = false), 700);
      window.scrollTo({ top: alvo, behavior: "smooth" });
    };

    const aoRodar = (e: WheelEvent) => {
      if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.shiftKey) return;
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      // Página travada por uma gaveta ou menu
      if (document.body.style.overflow === "hidden" || getComputedStyle(document.documentElement).overflowY === "hidden") return;
      const dy = e.deltaY * (e.deltaMode === 1 ? 40 : e.deltaMode === 2 ? window.innerHeight : 1);
      if (dy === 0 || rolaPorDentro(e.target, dy)) return;
      if (Math.abs(dy) < PASSO_MINIMO) {
        // Trackpad: rolagem nativa; larga a animação e acompanha
        pararProprio();
        animando = false;
        return;
      }
      e.preventDefault();
      const emCurso = modo === "proprio" ? pedido !== 0 : animando;
      if (!emCurso) atual = alvo = window.scrollY;
      alvo = Math.max(0, Math.min(maximo(), alvo + dy));

      if (modo === "proprio") {
        if (!pedido) pedido = requestAnimationFrame(passo);
        return;
      }
      deslizarNavegador();
      if (modo === "testando") {
        // Dois quadros depois: se a página já chegou ao alvo, o navegador não animou
        const de = atual;
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            if (modo !== "testando") return;
            const andou = Math.abs(window.scrollY - de);
            const falta = Math.abs(alvo - window.scrollY);
            decidir(andou > 1 && falta < 1 && Math.abs(alvo - de) > PASSO_MINIMO ? "proprio" : "navegador");
          })
        );
      }
    };

    const aoRolar = () => {
      if (modo === "proprio") {
        // Rolagem que não veio daqui (teclado, barra, âncora): segue ela
        if (pedido && Math.abs(window.scrollY - escrito) > 2) pararProprio();
        if (!pedido) atual = alvo = window.scrollY;
      } else if (!animando) {
        atual = alvo = window.scrollY;
      }
    };

    // Teclado e cliques na barra de rolagem interrompem o deslize do navegador
    const aoInterromper = () => {
      animando = false;
      pararProprio();
    };

    window.addEventListener("wheel", aoRodar, { passive: false });
    window.addEventListener("scroll", aoRolar, { passive: true });
    window.addEventListener("keydown", aoInterromper);
    window.addEventListener("pointerdown", aoInterromper);
    return () => {
      pararProprio();
      window.clearTimeout(fimNavegador);
      window.removeEventListener("wheel", aoRodar);
      window.removeEventListener("scroll", aoRolar);
      window.removeEventListener("keydown", aoInterromper);
      window.removeEventListener("pointerdown", aoInterromper);
    };
  }, []);

  return null;
}
