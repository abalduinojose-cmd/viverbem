// "Compre por área": as categorias em círculos com foto (modelo de loja,
// referência biovittare.com.br). A foto de cada área fica em
// public/fotos/categorias/<slug>.jpg; sem ela, entra o pote de um produto
// da categoria sobre o gelo e, sem pote, um círculo em azul-noite com a
// inicial em ouro.
// Sem o respiro de seção em cima: fica colada nas vantagens (pedido do
// usuário em 06/10/2026, "tire a parte em branco").
// 08/10/2026 ("diminua o tamanho em 10%"): o título sai a 90% do tamanho
// de título de seção e a grade dos círculos ocupa 90% da largura.
// 14/10/2026: os potes respiram e um brilho passa por eles (PoteVivo).
// 05/11/2026 ("um pouco menor, arrastando para o lado, 4 destaques na tela
// no celular"): no celular a grade de 3 colunas em duas linhas virou uma
// faixa só, que arrasta para o lado: cabem quatro círculos e aparece a
// ponta do quinto, para mostrar que há mais. O título também encolheu no
// celular (de 1/15,2 para 1/17,5 da largura). No computador nada mudou.
// 13/11/2026 ("melhore a seção"): os círculos ganharam um fundo com luz no centro (branco para
// o gelo), um aro de ouro fino com um aro branco por dentro e uma sombra
// mais suave; no toque e no mouse o aro acende em ouro e o nome vai para o
// azul. A contagem de produtos embaixo do nome foi testada e saiu em
// 14/11/2026 ("não quero 12 produtos, 4 produtos; só o nome das linhas").
import Link from "next/link";
import { asset } from "@/lib/asset";
import { CategoriaDTO } from "@/lib/tipos";
import { PoteVivo } from "./PoteVivo";

export type ImagemCategoria = { tipo: "foto" | "produto"; src: string };

export function CategoriasRedondas({
  categorias,
  imagens = {},
}: {
  categorias: CategoriaDTO[];
  imagens?: Record<number, ImagemCategoria>;
}) {
  if (categorias.length === 0) return null;

  return (
    <section aria-labelledby="titulo-categorias" className="pt-0.5 md:pt-1 max-w-7xl mx-auto px-5 md:px-8">
      <div className="revelar text-center">
        {/* Numa linha só em qualquer tela (11/10/2026, "diminua a letra e
            coloque na mesma linha"): o título mede 14,4 em de largura
            (medido no navegador), então a letra fica no que couber na caixa
            (100vw menos o recuo e a barra de rolagem), com folga, e no
            computador em 82% do título de seção */}
        <h2
          id="titulo-categorias"
          className="titulo-secao whitespace-nowrap text-[min(1.75rem,calc((100vw_-_3.5rem)/17.5))] md:text-[min(calc(var(--tam-titulo)*0.82),calc((100vw_-_3.5rem)/15.2))]"
        >
          Conheça nossas <span className="italic">linhas de produtos</span>
        </h2>
      </div>

      {/* No celular a faixa inteira entra de uma vez (.revelar): dentro de
          uma faixa que rola, a cascata dos filhos não tem como medir a tela.
          No computador vale a cascata (.escalonado) e este bloco fica parado. */}
      <div className="revelar md:![animation:none] vao-titulo">
      <ul className="escalonado flex gap-3 overflow-x-auto rolagem-sem-barra snap-x snap-mandatory -mx-5 px-5 scroll-px-5 pt-1 pb-3 md:mx-auto md:w-[90%] md:grid md:grid-cols-6 md:gap-6 md:overflow-visible md:px-0 md:pt-0 md:pb-0">
        {categorias.map((c, i) => {
          const img = imagens[c.id];
          return (
            // Celular: três por tela e boa parte do quarto (12/11/2026,
            // "aumente levemente"; eram quatro e a ponta do quinto)
            <li key={c.id} className="w-[calc((100vw_-_2.5rem_-_2.25rem)/3.7)] shrink-0 snap-start md:w-auto">
              <Link href={`/produtos/${c.slug}`} className="group flex flex-col items-center gap-2 md:gap-3 text-center">
                <span className="relative block w-full aspect-square rounded-full overflow-hidden ring-1 ring-ouro/35 shadow-[inset_0_0_0_4px_rgba(255,255,255,0.9),0_16px_28px_-22px_rgba(16,42,74,0.4)] transition duration-300 group-hover:ring-2 group-hover:ring-ouro/70 group-hover:-translate-y-1">
                  {img?.tipo === "foto" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={asset(img.src)}
                      alt=""
                      width={400}
                      height={400}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : img?.tipo === "produto" ? (
                    // p-[9.7%]: os potes 12% maiores (14/10/2026; era p-[14%],
                    // 72% do círculo, agora 80,6%)
                    <span className="flex w-full h-full items-center justify-center bg-[radial-gradient(circle_at_50%_40%,#ffffff_0%,#f3f6fa_58%,#e6edf6_100%)] p-[9.7%]">
                      <PoteVivo indice={i} src={asset(img.src)}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={asset(img.src)}
                          alt=""
                          width={400}
                          height={400}
                          loading="lazy"
                          decoding="async"
                          className="max-w-full max-h-full object-contain drop-shadow-[0_6px_8px_rgba(16,42,74,0.28)] transition-transform duration-500 group-hover:-translate-y-1"
                        />
                      </PoteVivo>
                    </span>
                  ) : (
                    <span className="banner-noite flex w-full h-full items-center justify-center text-ouro-claro text-[3.5rem] font-[family-name:var(--font-destaque)] italic">
                      {c.nome.charAt(0)}
                    </span>
                  )}
                </span>
                <span className="leading-tight">
                  <span className="block font-semibold text-navy text-[0.8rem] md:text-base transition-colors group-hover:text-tinta">
                    {c.nome}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      </div>
    </section>
  );
}
