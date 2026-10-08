"use client";
// A linha do tempo da página A Viver Bem (08/10/2026), em dois modos:
//
// - Computador (lg, quando a faixa cabe na altura que sobra abaixo do
//   cabeçalho): a seção prende no alto com position: sticky (a rolagem
//   continua nativa) e os marcos andam para o lado enquanto a pessoa rola
//   para baixo, como uma galeria. O marco que passa pela linha de leitura
//   acende e os outros esmaecem; embaixo, a régua com os anos enche em
//   ouro e marca o ano ativo, na posição exata em que cada marco chega à
//   linha de leitura. O 2006 (a farmácia de manipulação) leva a foto do
//   laboratório.
// - Celular, tablet e telas baixas: lista vertical com o trilho de ouro
//   que desce junto com a rolagem; cada marco acende quando a linha chega
//   nele.
//
// O modo é decidido no navegador. O servidor entrega o vertical, que é
// também o que aparece sem JavaScript, com tudo aceso.
import { useEffect, useRef } from "react";
import { asset } from "@/lib/asset";
import { registrarCena, limitar } from "./motor";

export type Marco = { ano: string; titulo: string; texto: string };
export type FotoMarco = { ano: string; src: string; alt: string; largura: number; altura: number };

// Onde a linha de leitura do modo horizontal começa, em fração da largura
// do conteúdo. Ela anda para a direita durante a galeria e termina no
// centro do último marco: assim cada ano chega à linha num ponto próprio
// da régua (com a linha parada, os dois últimos nunca chegavam e os anos
// se amontoavam no fim) e a galeria termina com o 2017 aceso.
const LINHA_LEITURA = 0.28;

export function LinhaDoTempo({ marcos, foto }: { marcos: Marco[]; foto?: FotoMarco }) {
  const raiz = useRef<HTMLDivElement>(null);
  const pista = useRef<HTMLDivElement>(null);
  const palco = useRef<HTMLDivElement>(null);
  const conteudo = useRef<HTMLDivElement>(null);
  const lista = useRef<HTMLDivElement>(null);
  const trilhoOuro = useRef<HTMLSpanElement>(null);
  const reguaOuro = useRef<HTMLSpanElement>(null);
  const anos = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const r = raiz.current;
    const pi = pista.current;
    const pa = palco.current;
    const co = conteudo.current;
    const li = lista.current;
    const ouro = trilhoOuro.current;
    const regua = reguaOuro.current;
    const listaAnos = anos.current;
    if (!r || !pi || !pa || !co || !li || !ouro || !regua || !listaAnos) return;

    const itens = Array.from(li.querySelectorAll<HTMLElement>("[data-marco]"));
    const rotulos = Array.from(listaAnos.querySelectorAll<HTMLElement>("li"));
    const largo = window.matchMedia("(min-width: 1024px)");
    let desligar: (() => void) | null = null;

    const acender = (i: number, aceso: boolean) => itens[i].toggleAttribute("data-aceso", aceso);

    const montar = () => {
      desligar?.();
      desligar = null;
      // Limpa o que o modo anterior escreveu
      pi.style.height = "";
      li.style.transform = "";
      ouro.style.transform = "";
      regua.style.transform = "";
      itens.forEach((it) => {
        it.style.opacity = "";
        it.removeAttribute("data-aceso");
      });

      // O horizontal precisa de tela larga e de a faixa caber abaixo do cabeçalho
      let horizontal = false;
      if (largo.matches) {
        r.dataset.modo = "horizontal";
        const topoPreso = parseFloat(getComputedStyle(pa).top) || 0;
        horizontal = co.offsetHeight + 24 <= window.innerHeight - topoPreso;
      }
      r.dataset.modo = horizontal ? "horizontal" : "vertical";
      r.dataset.js = "";

      if (horizontal) {
        const topoPreso = parseFloat(getComputedStyle(pa).top) || 0;
        const larguraConteudo = co.clientWidth;
        const distancia = Math.max(0, li.scrollWidth - larguraConteudo);
        // A pista tem a altura do palco mais o caminho lateral: 1px de rolagem = 1px de galeria
        pi.style.height = `calc(100svh - var(--altura-cabecalho) + ${Math.round(distancia)}px)`;
        const centros = itens.map((it) => it.offsetLeft + it.offsetWidth / 2);
        const linhaInicio = larguraConteudo * LINHA_LEITURA;
        const linhaFim = Math.max(linhaInicio, centros[centros.length - 1] - distancia);
        const percurso = distancia + (linhaFim - linhaInicio);
        // Em que ponto da galeria cada marco chega à linha de leitura: é onde fica o ano na régua
        const chegadas = centros.map((c) => (percurso > 0 ? limitar((c - linhaInicio) / percurso) : 0));
        rotulos.forEach((rotulo, i) => {
          rotulo.style.left = `${(chegadas[i] * 100).toFixed(2)}%`;
          rotulo.style.transform = i === 0 && chegadas[i] === 0 ? "none" : chegadas[i] >= 1 ? "translateX(-100%)" : "translateX(-50%)";
        });
        let ativoAnterior = -1;
        desligar = registrarCena(pi, {
          suavidade: 0.12,
          medir: (c) => (distancia > 0 ? limitar((topoPreso - c.topo) / distancia) : 0),
          aplicar: (p) => {
            const x = -distancia * p;
            const linha = linhaInicio + (linhaFim - linhaInicio) * p;
            li.style.transform = `translate3d(${x.toFixed(1)}px, 0, 0)`;
            regua.style.transform = `scaleX(${p.toFixed(4)})`;
            let ativo = 0;
            let menor = Number.POSITIVE_INFINITY;
            for (let i = 0; i < itens.length; i++) {
              const d = Math.abs(centros[i] + x - linha);
              if (d < menor) {
                menor = d;
                ativo = i;
              }
              const afastamento = Math.min(1, d / (larguraConteudo * 0.8));
              itens[i].style.opacity = String(Math.round((1 - 0.6 * afastamento) * 100) / 100);
            }
            if (ativo !== ativoAnterior) {
              ativoAnterior = ativo;
              rotulos.forEach((rotulo, i) => rotulo.toggleAttribute("data-ativo", i === ativo));
              itens.forEach((_, i) => acender(i, i <= ativo));
            }
          },
        });
      } else {
        // Vertical: o trilho desce até a linha de leitura (62% da altura da tela)
        const alturaLista = li.offsetHeight;
        const topos = itens.map((it) => it.offsetTop);
        desligar = registrarCena(li, {
          suavidade: 0.16,
          medir: (c) => limitar((c.janela * 0.62 - c.topo) / c.altura),
          aplicar: (p) => {
            ouro.style.transform = `scaleY(${p.toFixed(4)})`;
            const frente = p * alturaLista;
            for (let i = 0; i < itens.length; i++) acender(i, frente >= topos[i] + 24);
          },
        });
      }
    };

    let pedido = 0;
    const aoMudar = () => {
      cancelAnimationFrame(pedido);
      pedido = requestAnimationFrame(montar);
    };
    montar();
    window.addEventListener("resize", aoMudar);
    largo.addEventListener("change", aoMudar);
    // As fontes mudam a largura dos marcos: mede de novo quando chegarem
    document.fonts?.ready.then(aoMudar);
    return () => {
      cancelAnimationFrame(pedido);
      desligar?.();
      window.removeEventListener("resize", aoMudar);
      largo.removeEventListener("change", aoMudar);
    };
  }, []);

  return (
    <div ref={raiz} data-modo="vertical" className="linha-tempo">
      <div ref={pista} className="lt-pista">
        <div ref={palco} className="lt-palco">
          <div className="max-w-6xl mx-auto w-full px-5 md:px-8">
            <div ref={conteudo} className="lt-conteudo">
              <div ref={lista} className="lt-lista">
                <span aria-hidden="true" className="lt-trilho" />
                <span ref={trilhoOuro} aria-hidden="true" className="lt-trilho-ouro" />
                <ol className="lt-marcos">
                  {marcos.map((m) => {
                    const fotoDoMarco = foto && foto.ano === m.ano ? foto : null;
                    return (
                      <li key={m.ano} data-marco="" data-com-foto={fotoDoMarco ? "" : undefined} className="lt-marco">
                        <span aria-hidden="true" className="lt-ponto" />
                        <div className="lt-texto">
                          <span aria-hidden="true" className="lt-ano numero-tinta">
                            {m.ano}
                          </span>
                          <h3 className="lt-titulo">
                            <span className="sr-only">{m.ano}: </span>
                            {m.titulo}
                          </h3>
                          <p className="lt-paragrafo">{m.texto}</p>
                        </div>
                        {fotoDoMarco && (
                          <figure className="lt-foto">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={asset(fotoDoMarco.src)}
                              alt={fotoDoMarco.alt}
                              width={fotoDoMarco.largura}
                              height={fotoDoMarco.altura}
                              loading="lazy"
                              decoding="async"
                              className="h-full w-full object-cover"
                            />
                          </figure>
                        )}
                      </li>
                    );
                  })}
                </ol>
              </div>

              {/* A régua dos anos (só no modo horizontal): enche em ouro e marca o ano ativo */}
              <div aria-hidden="true" className="lt-regua">
                <span className="lt-regua-base">
                  <span ref={reguaOuro} className="lt-regua-ouro" />
                </span>
                <ol ref={anos} className="lt-regua-anos">
                  {marcos.map((m, i) => (
                    <li key={m.ano} data-ativo={i === 0 ? "" : undefined}>
                      {m.ano}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
