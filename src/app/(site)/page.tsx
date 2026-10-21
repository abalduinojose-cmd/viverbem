// A página inicial.
//
// Modelo de loja (06/10/2026): a abertura em azul-noite, as vantagens, as
// categorias em círculos, as faixas de produtos (mais procurados, por
// área, pronta entrega), o Como funciona, a Saúde da Mulher, os reels, as
// avaliações e, no celular, o banner da história. Cada seção é uma folha
// que desliza por cima da anterior (ver Folha).
//
// 14/10/2026 ("a pessoa pode controlar qual vem primeiro", "mudar as fotos
// e ícones dali", "alterar os banners por fotos, vídeos ou GIFs"): a ordem
// das seções, a foto de cada linha dos círculos e os banners vêm do
// painel (Configuracao), com os padrões de antes quando não há nada:
//   - as seções entram na ordem gravada; as de produtos (categorias, mais
//     procurados, faixas por área e pronta entrega) que ficarem em sequência
//     dividem uma folha só, como sempre foi;
//   - os círculos usam a foto enviada pelo painel, senão a conta de antes
//     (lib/linhas.ts);
//   - a dobra, a Saúde da Mulher, o banner de cada faixa e o da história
//     usam a mídia enviada pelo painel (lib/banners.ts), senão o padrão.
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { obterCatalogo, obterAvaliacoes } from "@/lib/catalogo";
import { obterBanners, obterLinhasFotos, obterSecoesHome, obterSecoesOrdem } from "@/lib/configuracao";
import { chaveBannerVitrine } from "@/lib/banners";
import { imagemSeExistir, imagensDasLinhas, temFoto } from "@/lib/linhas";
import { CategoriaDTO, ProdutoDTO, ehIndustrializado } from "@/lib/tipos";
import type { ChaveSecao } from "@/lib/secoes";
import { Abertura } from "@/components/site/Abertura";
import { obterArtesHero } from "@/lib/hero";
import { Beneficios } from "@/components/site/Beneficios";
import { Folha } from "@/components/site/Folha";
import { ComoFunciona } from "@/components/site/ComoFunciona";
import { CategoriasRedondas } from "@/components/site/CategoriasRedondas";
import { VitrineCategoria, BannerVitrine } from "@/components/site/VitrineCategoria";
import { ReelsInstagram } from "@/components/site/ReelsInstagram";
import { CarrosselAvaliacoes } from "@/components/site/CarrosselAvaliacoes";
import { BannerHistoria } from "@/components/site/BannerHistoria";
import { SecaoSaudeMulher } from "@/components/site/BannerSaudeMulher";
import { ROTEIROS } from "@/components/site/heroAnimado/roteiros";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { alternates: { canonical: "/" } };

// Quantas fotos reais uma área precisa ter para ganhar vitrine própria
const MINIMO_PARA_VITRINE = 3;

// Texto do banner de cada área: descreve o que se prepara, nunca um efeito.
// A parte entre *asteriscos* sai em itálico ouro (a segunda voz).
const BANNERS_POR_SLUG: Record<string, Omit<BannerVitrine, "imagem" | "midia">> = {
  "dermatologia-estetica": {
    titulo: "Cuidados com a pele, *conforme a prescrição.*",
    texto: "Cremes, séruns e loções preparados a partir da receita.",
  },
  "vitaminas-suplementos": {
    titulo: "Vitaminas e suplementos *na dose prescrita.*",
    texto: "Cápsulas, pós e gomas conforme a receita.",
  },
  "cabelos-unhas": {
    titulo: "Cabelos e unhas, *com fórmula individual.*",
    texto: "Loções, shampoos e cápsulas conforme a receita.",
  },
  "saude-da-mulher": { titulo: "Saúde da mulher, *em fórmula individual.*" },
  "saude-do-homem": { titulo: "Saúde do homem, *em fórmula individual.*" },
  "homeopatia-florais": { titulo: "Homeopatia e florais, *preparados aqui.*" },
};

// As seções de produtos dividem uma folha quando vêm em sequência
const GRUPO_PRODUTOS = new Set<ChaveSecao>(["categorias", "maisProcurados", "vitrinesAreas", "prontaEntrega"]);
// As folhas em gelo (as outras são em papel)
const TEMA_GELO = new Set<ChaveSecao>(["comoFunciona", "avaliacoes"]);

// O nome da área inteiro na sans; só o "&" em itálico ouro (dividir o nome
// ao meio ficava estranho, pedido de 06/10)
function TituloComItalico({ nome }: { nome: string }) {
  const e = nome.indexOf(" & ");
  if (e > 0) {
    return (
      <>
        {nome.slice(0, e)} <span className="italic">&amp;</span> {nome.slice(e + 3)}
      </>
    );
  }
  return <>{nome}</>;
}

export default async function Home() {
  const [{ categorias, produtos }, avaliacoes, artes, secoes, ordem, banners, linhasFotos] = await Promise.all([
    obterCatalogo(),
    obterAvaliacoes(),
    obterArtesHero(),
    obterSecoesHome(),
    obterSecoesOrdem(),
    obterBanners(),
    obterLinhasFotos(),
  ]);

  const comFoto = produtos.filter((p) => temFoto(p.fotoUrl));

  // Industrializados com registro, numa vitrine própria (sem preço, salvo
  // os que o painel liberou). Os marcados como destaque vêm primeiro.
  const prontaEntrega = produtos.filter(ehIndustrializado).sort((a, b) => Number(b.destaque) - Number(a.destaque));

  // Só as categorias que têm algo no site
  const categoriasComItens = categorias.filter((c) => produtos.some((p) => p.categoriaId === c.id));

  // Imagem de cada área para os círculos
  const imagensCategorias = imagensDasLinhas(categoriasComItens, comFoto, linhasFotos);

  // Vitrines por área: só as que têm fotos reais suficientes e a chave
  // "Vitrine na home" ligada no painel
  const vitrines: { categoria: CategoriaDTO; produtos: ProdutoDTO[]; banner: BannerVitrine }[] = [];
  for (const c of categoriasComItens) {
    if (!c.vitrineHome) continue;
    const lista = comFoto.filter((p) => p.categoriaId === c.id);
    if (lista.length < MINIMO_PARA_VITRINE) continue;
    const texto = BANNERS_POR_SLUG[c.slug] ?? { titulo: c.nome };
    vitrines.push({
      categoria: c,
      produtos: lista,
      banner: {
        ...texto,
        imagem: imagemSeExistir(`/fotos/banners/${c.slug}.jpg`),
        midia: banners[chaveBannerVitrine(c.slug)]?.desktop ?? null,
      },
    });
  }

  const bannerMaisProcurados: BannerVitrine = {
    titulo: "Cada fórmula sai *com o seu nome no rótulo.*",
    texto: "Preparada depois do pedido, conforme a receita.",
    imagem: imagemSeExistir("/fotos/banners/mais-procurados.jpg"),
    midia: banners["mais-procurados"]?.desktop ?? null,
  };

  // A linha da Saúde da Mulher: os potes da animação que estão no catálogo
  // e os produtos da categoria, os com foto na frente
  const potesDaMulher = new Set<string>(ROTEIROS.mulher.potes.map((p) => p.src));
  const idMulher = categorias.find((c) => c.slug === "saude-da-mulher")?.id;
  const linhaMulher = produtos
    .filter((p) => (p.fotoUrl && potesDaMulher.has(p.fotoUrl)) || p.categoriaId === idMulher)
    .sort((a, b) => Number(temFoto(b.fotoUrl)) - Number(temFoto(a.fotoUrl)));

  // O que cada seção desenha (null = desligada ou sem conteúdo)
  const bloco = (chave: ChaveSecao): ReactNode | null => {
    if (!secoes[chave]) return null;
    switch (chave) {
      case "categorias":
        return <CategoriasRedondas key={chave} categorias={categoriasComItens} imagens={imagensCategorias} />;
      case "maisProcurados":
        return (
          <VitrineCategoria
            key={chave}
            id="titulo-mais-procurados"
            titulo={
              <>
                Mais <span className="italic">procurados</span>
              </>
            }
            href="/produtos"
            produtos={comFoto}
            banner={bannerMaisProcurados}
          />
        );
      case "vitrinesAreas":
        // Nas áreas o banner abre a faixa, um pouco menor (08/10/2026)
        return vitrines.length === 0
          ? null
          : vitrines.map((v) => (
              <VitrineCategoria
                key={v.categoria.id}
                id={`titulo-vitrine-${v.categoria.slug}`}
                titulo={<TituloComItalico nome={v.categoria.nome} />}
                href={`/produtos/${v.categoria.slug}`}
                produtos={v.produtos}
                banner={v.banner}
              />
            ));
      case "prontaEntrega":
        // Só aparece quando houver industrializado
        return prontaEntrega.length === 0 ? null : (
          <VitrineCategoria
            key={chave}
            id="titulo-pronta-entrega"
            titulo={
              <>
                Pronta <span className="italic">entrega</span>
              </>
            }
            href="/produtos"
            produtos={prontaEntrega}
          />
        );
      case "comoFunciona":
        return <ComoFunciona key={chave} />;
      case "bannerMulher":
        return <SecaoSaudeMulher key={chave} produtos={linhaMulher} midia={banners["saude-mulher"] ?? null} />;
      case "reels":
        return <ReelsInstagram key={chave} />;
      case "avaliacoes":
        return avaliacoes.length === 0 ? null : <CarrosselAvaliacoes key={chave} avaliacoes={avaliacoes} />;
      case "bannerHistoria":
        return <BannerHistoria key={chave} midia={banners["historia"]?.desktop ?? null} />;
      default:
        return null;
    }
  };

  // As folhas, na ordem do painel: seções de produtos em sequência dividem
  // uma folha; as outras têm a própria
  const folhas: { chave: ChaveSecao; grupo: boolean; conteudo: ReactNode[] }[] = [];
  for (const chave of ordem) {
    const c = bloco(chave);
    if (c === null) continue;
    const doGrupo = GRUPO_PRODUTOS.has(chave);
    const ultima = folhas[folhas.length - 1];
    if (doGrupo && ultima?.grupo) ultima.conteudo.push(c);
    else folhas.push({ chave, grupo: doGrupo, conteudo: [c] });
  }

  return (
    <main className="flex-1">
      {/* 1 ─ Banner de abertura e 2 ─ vantagens (sempre) */}
      <Abertura artes={artes} />
      <Beneficios />

      <div className="folhas">
        {folhas.map((f) => (
          <Folha key={f.chave} tema={TEMA_GELO.has(f.chave) ? "gelo" : "papel"} className={f.chave === "bannerHistoria" ? "md:hidden" : ""}>
            {f.conteudo}
            <div className="secao-fecho" aria-hidden="true" />
          </Folha>
        ))}
      </div>
    </main>
  );
}
