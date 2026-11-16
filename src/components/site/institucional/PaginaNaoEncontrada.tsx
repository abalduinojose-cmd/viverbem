// A página 404 da Viver Bem (15/11/2026, "páginas de erro 404
// customizada"). Duas portas de entrada, o mesmo conteúdo:
//   - app/not-found.tsx: endereço que não existe no site (e o 404.html da
//     prévia estática). Fica fora do layout do site, então mostra a
//     logo no alto (comMarca);
//   - app/(site)/not-found.tsx: produto ou linha que saiu do catálogo
//     (notFound() nas páginas), já dentro do cabeçalho e do rodapé.
// No sistema "Branco, azul e ouro": o 404 grande em ouro, o título em duas
// vozes, a saída principal (início) e as outras (produtos, lojas, WhatsApp).
import Link from "next/link";
import { asset } from "@/lib/asset";
import { WHATSAPP_NUMERO } from "@/lib/tipos";

const ATALHOS = [
  { href: "/produtos", rotulo: "Produtos" },
  { href: "/como-funciona", rotulo: "Como funciona" },
  { href: "/lojas", rotulo: "Lojas" },
  { href: "/sobre", rotulo: "A Viver Bem" },
];

export function PaginaNaoEncontrada({ comMarca = false }: { comMarca?: boolean }) {
  return (
    <main className="halo-marca flex flex-1 flex-col">
      {comMarca && (
        <div className="mx-auto w-full max-w-6xl px-5 pt-6 md:px-8 md:pt-8">
          <Link href="/" aria-label="Manipulação Viver Bem, página inicial" className="inline-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset("/logo.svg")} alt="Manipulação Viver Bem" width={906} height={380} className="h-12 w-auto md:h-14" />
          </Link>
        </div>
      )}

      <section aria-labelledby="titulo-404" className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-5 py-16 text-center md:py-24">
        <p aria-hidden="true" className="numero-tinta text-[clamp(6rem,4rem+10vw,11rem)] leading-[0.85]">
          404
        </p>
        <p className="rotulo-pilula mt-6">página não encontrada</p>
        <h1 id="titulo-404" className="titulo-secao vao-rotulo text-balance">
          Esta página <span className="italic">não está aqui</span>
        </h1>
        <p className="texto-apoio mt-4 max-w-md">
          O endereço pode ter mudado ou o produto saiu do catálogo. A farmácia continua aqui: siga por um destes caminhos.
        </p>

        <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
          <Link href="/" className="botao botao-principal w-full sm:w-auto">
            Voltar ao início
          </Link>
          <a
            href={`https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent("Olá! Vim pelo site da Viver Bem e não achei uma página.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="botao botao-secundario w-full sm:w-auto"
          >
            Falar no WhatsApp
          </a>
        </div>

        <nav aria-label="Outros caminhos" className="mt-8 flex flex-wrap justify-center gap-2">
          {ATALHOS.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="inline-flex h-10 items-center rounded-full bg-white px-4 text-sm font-semibold text-navy ring-1 ring-inset ring-fio transition-colors hover:ring-ouro/60"
            >
              {a.rotulo}
            </Link>
          ))}
        </nav>
      </section>
    </main>
  );
}
