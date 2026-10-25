// A moldura das páginas legais (privacidade, termos, trocas e reembolso),
// 21/10/2026: abertura com o rótulo, o título em duas vozes e a data da
// última versão; o texto em seções numeradas, com um sumário no computador
// que acompanha a rolagem; e o convite para falar com a equipe no fim.
// Texto em português simples, sem travessões. Sistema "Branco, azul e ouro".
//
// 25/10/2026 ("as políticas têm muita informação, quero só o principal"):
// o ESSENCIAL vem em cima, em poucas frases, e o texto completo fica
// DOBRADO por seção (details/summary), fechado por padrão. Nada saiu: cada
// seção abre num toque, e o sumário abre a seção que a pessoa escolher.
import Link from "next/link";
import type { ReactNode } from "react";
import { WHATSAPP_NUMERO } from "@/lib/tipos";
import { AbrirSecaoLegal } from "./AbrirSecaoLegal";

export interface SecaoLegal {
  id: string;
  titulo: string;
  conteudo: ReactNode;
}

export function PaginaLegal({
  rotulo,
  titulo,
  tituloItalico,
  resumo,
  atualizadoEm,
  essencial,
  secoes,
}: {
  rotulo: string;
  titulo: string;
  /** A segunda voz do título, em itálico ouro */
  tituloItalico: string;
  resumo: string;
  atualizadoEm: string;
  /** O essencial, em três a cinco frases (25/10/2026) */
  essencial: string[];
  secoes: SecaoLegal[];
}) {
  return (
    <main className="flex-1">
      <section className="halo-marca px-5 md:px-8 pt-8 md:pt-12 pb-6">
        <div className="max-w-7xl mx-auto">
          <p className="rotulo-pilula">{rotulo}</p>
          <h1 className="titulo-secao vao-rotulo max-w-[20ch]">
            {titulo} <span className="italic">{tituloItalico}</span>
          </h1>
          <p className="texto-apoio mt-4 max-w-[62ch]">{resumo}</p>
          <p className="mt-4 text-sm text-cinza">
            Última atualização: <span className="text-navy font-medium">{atualizadoEm}</span>
          </p>
        </div>
      </section>

      <section className="px-5 md:px-8 pb-16 md:pb-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* O sumário, preso ao rolar no computador */}
          <nav aria-label="Seções desta página" className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-[calc(var(--altura-cabecalho)+1.5rem)] lg:self-start">
            <p className="text-[0.6875rem] font-semibold tracking-[0.16em] uppercase text-cinza mb-3">Nesta página</p>
            <ol className="flex flex-col gap-1 border-l border-fio">
              {secoes.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="group flex items-baseline gap-2.5 -ml-px border-l-2 border-transparent pl-4 py-1.5 text-sm text-cinza transition-colors hover:border-ouro hover:text-navy">
                    <span className="tabular-nums text-[0.75rem] text-grafite-claro group-hover:text-ouro-escuro">{String(i + 1).padStart(2, "0")}</span>
                    {s.titulo}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* O texto */}
          <div className="lg:col-span-8 xl:col-span-8 xl:col-start-5">
            {/* O essencial */}
            <section aria-labelledby="essencial-titulo" className="rounded-[2rem] bg-navy em-noite text-white px-6 py-7 md:px-10 md:py-9 shadow-[0_24px_50px_-36px_rgba(13,35,64,0.7)]">
              <h2 id="essencial-titulo" className="text-[0.6875rem] font-semibold tracking-[0.16em] uppercase text-ouro-claro">O essencial</h2>
              <ul className="mt-4 flex flex-col gap-3">
                {essencial.map((frase) => (
                  <li key={frase} className="flex items-start gap-3 text-[0.98rem] leading-relaxed text-white/90">
                    <span aria-hidden="true" className="mt-[0.55rem] size-1.5 shrink-0 rounded-full bg-ouro" />
                    {frase}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm text-white/60">O texto completo está logo abaixo, por seção. Toque num título para abrir.</p>
            </section>

            {/* O texto completo, dobrado por seção */}
            <div className="mt-5 bg-white rounded-[2rem] ring-1 ring-fio/80 shadow-[0_24px_50px_-40px_rgba(16,42,74,0.45)] px-4 py-3 md:px-8 md:py-5 flex flex-col divide-y divide-fio">
              {secoes.map((s, i) => (
                <details key={s.id} id={s.id} className="group scroll-mt-[calc(var(--altura-cabecalho)+1.5rem)]">
                  <summary className="flex cursor-pointer list-none items-center gap-3 py-4 md:py-5 [&::-webkit-details-marker]:hidden">
                    <span className="numero-tinta text-[1rem] md:text-[1.1rem] shrink-0">{String(i + 1).padStart(2, "0")}</span>
                    <h2 id={`${s.id}-titulo`} className="flex-1 text-[1.05rem] md:text-[1.2rem] font-semibold tracking-[-0.02em] text-navy">
                      {s.titulo}
                    </h2>
                    <span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gelo text-navy transition-transform duration-300 group-open:rotate-180">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </summary>
                  <div className="pb-6 pl-8 md:pl-10 texto-legal text-[0.98rem] leading-[1.75] text-grafite flex flex-col gap-3">{s.conteudo}</div>
                </details>
              ))}
            </div>
            <AbrirSecaoLegal />

            {/* Falar com a equipe */}
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-[1.5rem] bg-gelo/70 ring-1 ring-fio/80 px-6 py-5">
              <p className="text-sm text-navy leading-relaxed">
                Ficou alguma dúvida sobre este texto? A equipe responde pelo WhatsApp em horário de loja.
              </p>
              <div className="flex flex-wrap gap-2 shrink-0">
                <a href={`https://wa.me/${WHATSAPP_NUMERO}`} target="_blank" rel="noopener noreferrer" className="botao botao-primario !min-h-11 !px-5 text-sm">
                  Falar no WhatsApp
                </a>
                <Link href="/contato" className="botao botao-secundario !min-h-11 !px-5 text-sm">
                  Contato
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
