// Cabeçalho padrão das seções: selo espaçado em caixa alta, título na
// serif da marca e, se houver, o atalho "Ver tudo" à direita.
import Link from "next/link";

export function SecaoTitulo({
  selo,
  titulo,
  descricao,
  verTudo,
  corSelo = "royal",
}: {
  selo: string;
  /** Texto ou trecho com <span className="italic"> para o itálico do site */
  titulo: React.ReactNode;
  descricao?: string;
  verTudo?: string;
  corSelo?: "royal" | "escarlate";
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
      <div>
        {/* Fio + selo, o mesmo gesto da vitrine escura */}
        <p
          className={`selo-secao flex items-center gap-3 ${
            corSelo === "escarlate" ? "text-escarlate" : "text-royal"
          }`}
        >
          <span
            aria-hidden="true"
            className={`h-px w-9 ${corSelo === "escarlate" ? "bg-escarlate/40" : "bg-royal/40"}`}
          />
          {selo}
        </p>
        {/* Salto de tamanho grande contra o selo de 0,72rem, e peso 800
            da Bricolage contra o 400 do texto: é o contraste que tira a
            cara de modelo pronto, no lugar de 600 contra 400 */}
        <h2 className="font-display text-[2.35rem] md:text-[3.25rem] font-extrabold leading-[1.04] tracking-[-0.035em] text-grafite mt-3">
          {titulo}
        </h2>
        {descricao && <p className="text-grafite-medio text-lg mt-3.5 max-w-xl">{descricao}</p>}
      </div>
      {/* Pílula com chip de seta, o mesmo gesto da vitrine dos mais
          procurados. Era um link "Ver tudo →" solto, que é o atalho
          padrão de qualquer loja virtual. */}
      {verTudo && (
        <Link
          href={verTudo}
          className="group shrink-0 self-start md:self-auto inline-flex items-center gap-3 rounded-full border border-linha py-2 pl-5 pr-2 font-semibold text-grafite transition-colors hover:border-royal/40"
        >
          Ver tudo
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-royal-claro text-royal transition duration-300 group-hover:bg-royal group-hover:text-white">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </Link>
      )}
    </div>
  );
}
