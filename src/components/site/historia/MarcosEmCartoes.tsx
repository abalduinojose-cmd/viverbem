// Os marcos da história em cartões, lado a lado (21/10/2026, "modernize a
// página nossa história"): no computador a galeria presa que andava de
// lado saiu (tomava umas duas telas de rolagem e deixava os marcos do
// fim apagados e fora da vista) e entrou uma fileira de quatro cartões,
// ligados por um fio de ouro com um ponto em cada ano, que entram
// escalonados ao rolar. O 2006 leva a foto do laboratório. Até o tablet a
// lista vertical com o trilho de ouro (LinhaDoTempo) continua.
import { asset } from "@/lib/asset";
import type { FotoMarco, Marco } from "./LinhaDoTempo";

export function MarcosEmCartoes({ marcos, foto }: { marcos: Marco[]; foto?: FotoMarco }) {
  return (
    <div className="relative">
      {/* O fio que liga os anos, atrás dos pontos */}
      <span aria-hidden="true" className="absolute left-[2.75rem] right-[2.75rem] top-[0.4rem] h-px bg-gradient-to-r from-ouro/70 via-ouro/40 to-fio" />
      <ol className="escalonado grid grid-cols-4 gap-5">
        {marcos.map((m, i) => {
          const fotoDoMarco = foto && foto.ano === m.ano ? foto : null;
          const ultimo = i === marcos.length - 1;
          return (
            <li key={m.ano} className="relative pt-7">
              {/* O ponto do ano no fio */}
              <span
                aria-hidden="true"
                className={`absolute left-6 top-0 size-[0.85rem] rounded-full ring-4 ring-white ${
                  ultimo ? "bg-navy shadow-[0_0_0_4px_rgba(13,35,64,0.12)]" : "bg-[image:var(--ouro-degrade)] shadow-[0_0_0_4px_rgba(201,165,107,0.18)]"
                }`}
              />
              <article
                className={`flex h-full flex-col overflow-hidden rounded-[1.5rem] ring-1 ring-inset transition duration-300 hover:-translate-y-1 ${
                  ultimo
                    ? "banner-noite em-noite text-white ring-white/10 shadow-[0_30px_60px_-36px_rgba(13,35,64,0.7)]"
                    : "bg-white text-navy ring-fio shadow-[0_24px_50px_-42px_rgba(16,42,74,0.45)] hover:ring-ouro/45"
                }`}
              >
                {ultimo && <span aria-hidden="true" className="malha-banner" />}
                <div className="relative flex flex-1 flex-col p-6">
                  <span className={`numero-tinta text-[3rem] xl:text-[3.4rem] ${ultimo ? "" : ""}`}>{m.ano}</span>
                  <h3 className={`mt-3 text-[1.15rem] font-semibold leading-snug tracking-[-0.02em] ${ultimo ? "text-white" : "text-navy"}`}>
                    <span className="sr-only">{m.ano}: </span>
                    {m.titulo}
                  </h3>
                  <p className={`mt-2 text-[0.93rem] leading-relaxed ${ultimo ? "text-white/75" : "text-grafite"}`}>{m.texto}</p>
                </div>
                {fotoDoMarco && (
                  <figure className="relative mt-auto h-40 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={asset(fotoDoMarco.src)}
                      alt={fotoDoMarco.alt}
                      width={fotoDoMarco.largura}
                      height={fotoDoMarco.altura}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover object-[50%_30%]"
                    />
                  </figure>
                )}
              </article>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
