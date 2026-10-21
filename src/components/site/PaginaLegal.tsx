// A moldura das páginas legais (privacidade, termos, trocas e reembolso),
// 21/10/2026: abertura com o rótulo, o título em duas vozes e a data da
// última versão; o texto em seções numeradas, com um sumário no computador
// que acompanha a rolagem; e o convite para falar com a equipe no fim.
// Texto em português simples, sem travessões. Sistema "Branco, azul e ouro".
import Link from "next/link";
import type { ReactNode } from "react";
import { WHATSAPP_NUMERO } from "@/lib/tipos";

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
  secoes,
}: {
  rotulo: string;
  titulo: string;
  /** A segunda voz do título, em itálico ouro */
  tituloItalico: string;
  resumo: string;
  atualizadoEm: string;
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
            <div className="bg-white rounded-[2rem] ring-1 ring-fio/80 shadow-[0_24px_50px_-40px_rgba(16,42,74,0.45)] px-6 py-8 md:px-12 md:py-12 flex flex-col gap-10">
              {secoes.map((s, i) => (
                <section key={s.id} id={s.id} aria-labelledby={`${s.id}-titulo`} className="scroll-mt-[calc(var(--altura-cabecalho)+1.5rem)]">
                  <h2 id={`${s.id}-titulo`} className="flex items-baseline gap-3 text-[1.25rem] md:text-[1.4rem] font-semibold tracking-[-0.025em] text-navy">
                    <span className="numero-tinta text-[1.1rem] md:text-[1.25rem] shrink-0">{String(i + 1).padStart(2, "0")}</span>
                    {s.titulo}
                  </h2>
                  <div className="mt-4 texto-legal text-[0.98rem] leading-[1.75] text-grafite flex flex-col gap-3">{s.conteudo}</div>
                </section>
              ))}
            </div>

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
