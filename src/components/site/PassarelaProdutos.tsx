// A PASSARELA (26/10/2026): a segunda linha de produtos da home, logo
// abaixo da faixa de Dermatologia & Estética, "de outra forma, com outros
// movimentos, mantendo o nosso padrão". A faixa de cima arrasta com a mão;
// esta anda sozinha: duas fileiras de potes que deslizam devagar em
// sentidos opostos, como uma esteira de vitrine, e param quando o mouse
// pousa (ou o dedo toca). Cada pote é um ladrilho de gelo com a luz de
// ouro embaixo e o nome; o cartão inteiro é o link do produto, com o
// "adicionar" em contorno no canto da foto (o mesmo das faixas estreitas).
//
// Segunda volta ("gostei mas pode melhorar"): os potes alternam a altura
// (um mais alto, um mais baixo, como numa esteira de verdade), cada
// fileira repousa numa PRATELEIRA (um fio com a luz de ouro embaixo), e as
// duas fileiras ENTRAM de lados opostos quando a seção aparece na rolagem
// (view timeline), a de cima vindo da direita e a de baixo da esquerda.
//
// Movimento (doutrina): deslocamento linear e contínuo, sem balanço ocioso
// por item. Com movimento reduzido a esteira continua, só que mais devagar
// (o Windows do usuário está sem animações; parar de vez deixaria a seção
// morta). A esteira é CSS puro: a fileira vem duas vezes e a animação anda
// metade.
import Link from "next/link";
import type { ReactNode } from "react";
import { ProdutoDTO } from "@/lib/tipos";
import { FotoProduto } from "./FotoProduto";
import { BotaoAdicionar } from "./BotaoAdicionar";
import { SetaDireita } from "./icones";

const MINIMO_POR_FILEIRA = 8;

/** Repete a lista até a fileira ter itens bastantes para a esteira não
 *  mostrar vão em telas largas */
function encher(lista: ProdutoDTO[]): ProdutoDTO[] {
  if (lista.length === 0) return lista;
  const saida: ProdutoDTO[] = [];
  while (saida.length < MINIMO_POR_FILEIRA) saida.push(...lista);
  // Quantidade par: o ritmo alto/baixo fecha o laço sem salto na emenda
  if (saida.length % 2 === 1) saida.push(lista[0]);
  return saida;
}

function Pote({ produto, repetido }: { produto: ProdutoDTO; repetido: boolean }) {
  return (
    <li className="passarela-pote w-40 shrink-0 md:w-48" aria-hidden={repetido || undefined}>
      <article className="group relative rounded-[1.5rem] p-1.5 transition duration-300 hover:-translate-y-1">
        <span className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[1.25rem] bg-gelo/60 p-5 transition-shadow duration-300 group-hover:shadow-[0_22px_40px_-30px_rgba(16,42,74,0.45)]">
          <span aria-hidden="true" className="absolute inset-x-[18%] bottom-1 h-6 bg-[radial-gradient(50%_70%_at_50%_100%,rgba(201,165,107,0.32),transparent_70%)]" />
          <FotoProduto
            fotoUrl={produto.fotoUrl}
            nome={produto.nome}
            className="relative max-h-full max-w-full !object-contain drop-shadow-[0_8px_10px_rgba(16,42,74,0.24)] transition-transform duration-500 group-hover:scale-[1.05]"
          />
          {/* O "adicionar" só na primeira cópia (a segunda é decorativa) */}
          {!repetido && <BotaoAdicionar produto={produto} compacto suave className="absolute right-2 top-2 z-[1]" />}
        </span>
        <Link
          href={`/produto/${produto.slug}`}
          tabIndex={repetido ? -1 : undefined}
          className="mt-2.5 block px-1 text-center text-[0.88rem] font-medium leading-snug text-navy line-clamp-2 transition-colors group-hover:text-tinta after:absolute after:inset-0 after:rounded-[1.5rem]"
        >
          {produto.nome}
        </Link>
      </article>
    </li>
  );
}

function Fileira({ itens, sentido, duracao }: { itens: ProdutoDTO[]; sentido: "esquerda" | "direita"; duracao: number }) {
  const cheia = encher(itens);
  return (
    <div className={`passarela-fileira ${sentido === "direita" ? "passarela-fileira-direita" : ""}`}>
      <div className="overflow-hidden pt-2 pb-5">
        <ul className={`passarela-trilho flex w-max items-end gap-3 md:gap-4 ${sentido === "direita" ? "passarela-direita" : ""}`} style={{ animationDuration: `${duracao}s` }}>
          {cheia.map((p, i) => (
            <Pote key={`a-${p.id}-${i}`} produto={p} repetido={false} />
          ))}
          {/* A segunda cópia fecha o laço */}
          {cheia.map((p, i) => (
            <Pote key={`b-${p.id}-${i}`} produto={p} repetido />
          ))}
        </ul>
      </div>
      {/* A prateleira: um fio com a luz de ouro embaixo */}
      <span aria-hidden="true" className="passarela-prateleira" />
    </div>
  );
}

export function PassarelaProdutos({
  id,
  rotulo,
  titulo,
  href,
  produtos,
}: {
  id: string;
  rotulo: string;
  titulo: ReactNode;
  href: string;
  produtos: ProdutoDTO[];
}) {
  if (produtos.length === 0) return null;
  // Alterna os produtos nas duas fileiras; com poucos, as duas levam todos
  const cima = produtos.length >= 6 ? produtos.filter((_, i) => i % 2 === 0) : produtos;
  const baixo = produtos.length >= 6 ? produtos.filter((_, i) => i % 2 === 1) : [...produtos].reverse();

  return (
    <section aria-labelledby={id} className="secao-vitrine">
      <div className="revelar max-w-7xl mx-auto px-5 md:px-8 flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
        <div>
          <p className="rotulo-pilula">{rotulo}</p>
          <h2 id={id} className="titulo-secao vao-rotulo">
            {titulo}
          </h2>
        </div>
        <Link href={href} className="botao-link !min-h-11 !text-sm">
          ver tudo
          <SetaDireita tamanho={14} />
        </Link>
      </div>

      {/* A esteira sangra até as bordas da tela, com as pontas esmaecidas */}
      <div className="passarela mt-6 md:mt-8 flex flex-col gap-2 md:gap-3">
        <Fileira itens={cima} sentido="esquerda" duracao={70} />
        <Fileira itens={baixo} sentido="direita" duracao={84} />
      </div>
    </section>
  );
}
