// Cabeçalho padrão das seções: rótulo em caixa alta, título no tamanho
// único das seções (com a palavra-chave em ouro via <span className="italic">),
// frase de apoio e, se houver, o atalho à direita como botão secundário.
// Dentro de uma folha escura (.em-noite) as cores viram sozinhas.
import Link from "next/link";

export function SecaoTitulo({
  selo,
  titulo,
  descricao,
  verTudo,
  rotuloVerTudo = "Ver tudo",
  id,
}: {
  selo: string;
  /** Texto ou trecho com <span className="italic"> para o ouro */
  titulo: React.ReactNode;
  descricao?: string;
  verTudo?: string;
  rotuloVerTudo?: string;
  /** id do h2, para aria-labelledby da seção */
  id?: string;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 md:gap-8">
      <div className="max-w-2xl">
        <p className="rotulo">{selo}</p>
        <h2 id={id} className="titulo-secao vao-rotulo">
          {titulo}
        </h2>
        {descricao && <p className="texto-apoio mt-4 max-w-xl">{descricao}</p>}
      </div>
      {verTudo && (
        <Link href={verTudo} className="botao botao-secundario shrink-0 self-start md:self-auto">
          {rotuloVerTudo}
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      )}
    </div>
  );
}
