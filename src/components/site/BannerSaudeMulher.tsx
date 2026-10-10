// Seção Saúde da Mulher (08/10/2026). Primeiro era só o banner animado
// depois das avaliações ("uma animação no mesmo estilo, com os medicamentos
// em anexo, voltada para a saúde da mulher"); no mesmo dia ela tomou o
// lugar da grade "Explore o catálogo", entre o "Como funciona" e os vídeos
// ("isso não tá bom, pode ser uma seção saúde da mulher, e modernize").
//
// Agora é uma seção inteira: o cabeçalho com o rótulo, o título em duas
// vozes, o apoio e "ver a linha"; a animação em canvas (roteiro "mulher" em
// heroAnimado/roteiros.ts) no cartão azul-noite, inteiro clicável; e
// embaixo a faixa com os produtos da linha (os potes da animação que estão
// no catálogo e os produtos da categoria). Os textos falam só de tipos de
// produto e do atendimento, nunca de efeito (RDC 67/2007).
import Link from "next/link";
import { ProdutoDTO } from "@/lib/tipos";
import { CenaAnimada } from "./heroAnimado/HeroAnimado";
import { FaixaProdutos } from "./FaixaProdutos";
import { BotaoVerMais } from "./BotaoVerMais";
import { SetaDireita } from "./icones";

const LINK_LINHA = "/produtos/saude-da-mulher";

export function SecaoSaudeMulher({ produtos }: { produtos: ProdutoDTO[] }) {
  return (
    <section
      id="saude-da-mulher"
      aria-labelledby="titulo-saude-mulher"
      className="secao max-w-7xl mx-auto px-5 md:px-8 scroll-mt-[calc(var(--altura-cabecalho)+1rem)]"
    >
      {/* Cabeçalho: título à esquerda, apoio e "ver a linha" à direita */}
      <div className="revelar grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-4 lg:items-end">
        <div className="lg:col-span-7">
          <p className="rotulo-pilula">saúde da mulher</p>
          <h2 id="titulo-saude-mulher" className="titulo-secao vao-rotulo">
            Cuidado <span className="italic">em cada fase</span>
          </h2>
        </div>
        <div className="lg:col-span-5 flex flex-col items-start lg:items-end gap-4 lg:pb-1.5">
          <p className="texto-apoio max-w-md lg:text-right">
            Proteção solar, pele e maquiagem, dermocosméticos e fórmulas com receita, sempre
            com orientação farmacêutica.
          </p>
          <BotaoVerMais href={LINK_LINHA}>ver a linha</BotaoVerMais>
        </div>
      </div>

      {/* A animação, no cartão azul-noite inteiro clicável */}
      <Link
        href={LINK_LINHA}
        className="revelar vao-titulo group banner-noite em-noite relative block overflow-hidden rounded-[1.75rem] md:rounded-[2.25rem] ring-1 ring-inset ring-white/10 text-white shadow-[0_30px_60px_-36px_rgba(54,52,107,0.6)] h-[min(calc((100vw-2.5rem)*1.444),34rem)] md:h-[24rem] lg:h-[26rem] xl:h-[28rem]"
      >
        <CenaAnimada roteiro="mulher" />
        <span className="sr-only">Saúde em cada fase da mulher. Beleza e autoestima.</span>
        {/* Véu na base: o convite lê sobre o reflexo dos potes */}
        <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-navy/85 to-transparent" />
        <span className="absolute inset-x-0 bottom-0 z-[1] px-5 pb-5 md:px-12 md:pb-8">
          <span className="inline-flex items-center gap-2 text-[0.95rem] md:text-[1.05rem] font-medium text-white/90 transition-colors group-hover:text-white">
            Ver a linha Saúde da Mulher
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              <SetaDireita tamanho={16} />
            </span>
          </span>
        </span>
      </Link>

      {/* Os produtos da linha */}
      {produtos.length > 0 && (
        <div className="revelar mt-5 md:mt-6">
          <FaixaProdutos produtos={produtos} className="cascata" />
        </div>
      )}
    </section>
  );
}
