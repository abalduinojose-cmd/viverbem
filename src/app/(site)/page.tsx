// HOME no modelo de loja (referência biovittare.com.br, pedida pelo
// usuário em 06/10/2026), com o conteúdo da Viver Bem:
//   banner > vantagens > categorias em círculos > vitrines de produtos
//   (mais procurados e cada área com fotos, com um banner na faixa) >
//   como funciona > catálogo em grade > reels > avaliações > banner da
//   história (só no celular) > (rodapé com "fale com a gente")
//
// Em 23/09 a vitrine promocional tinha saído pela RDC 67/2007 (item 5.14).
// Em 05/10/2026 o cliente pediu de volta o "mais procurados", com os
// produtos que têm foto, sem preço e com carrinho, ciente do risco.
// Novidades e combos continuam fora.
//
// Desde 07/10/2026 cada seção tem a sua chave no painel (Home e arte da
// dobra), e a faixa de cada área tem a chave "Vitrine na home" em
// Categorias. A dobra e as vantagens ficam sempre.
//
// 08/10/2026: a grade "Explore o catálogo" entre o Como funciona e os
// reels, e o banner da história depois das avaliações, só no celular.
//
// As fotos das áreas (public/fotos/categorias/<slug>.jpg) e dos banners
// (public/fotos/banners/<nome>.jpg) são opcionais: sem o arquivo, a
// categoria mostra o pote de um produto dela e o banner fica no degradê.
import fs from "fs";
import path from "path";
import { obterCatalogo, obterAvaliacoes } from "@/lib/catalogo";
import { obterSecoesHome } from "@/lib/configuracao";
import { CategoriaDTO, ProdutoDTO, ehIndustrializado } from "@/lib/tipos";
import { Abertura } from "@/components/site/Abertura";
import { obterArtesHero } from "@/lib/hero";
import { Beneficios } from "@/components/site/Beneficios";
import { Folha } from "@/components/site/Folha";
import { ComoFunciona } from "@/components/site/ComoFunciona";
import { CategoriasRedondas, ImagemCategoria } from "@/components/site/CategoriasRedondas";
import { VitrineCategoria, BannerVitrine } from "@/components/site/VitrineCategoria";
import { CatalogoHome } from "@/components/site/CatalogoHome";
import { ReelsInstagram } from "@/components/site/ReelsInstagram";
import { CarrosselAvaliacoes } from "@/components/site/CarrosselAvaliacoes";
import { BannerHistoria } from "@/components/site/BannerHistoria";
import { BannerSaudeMulher } from "@/components/site/BannerSaudeMulher";

export const dynamic = "force-dynamic";

// Foto de verdade é a que não é um dos desenhos neutros (.svg)
const temFoto = (fotoUrl: string | null) => Boolean(fotoUrl && !fotoUrl.toLowerCase().endsWith(".svg"));

// Quantas fotos reais uma área precisa ter para ganhar vitrine própria
const MINIMO_PARA_VITRINE = 3;

// Quantos produtos a grade "Explore o catálogo" mostra (2 fileiras no computador)
const LIMITE_CATALOGO_HOME = 8;

/** Caminho público da imagem, se o arquivo existir em public/ */
function imagemSeExistir(caminho: string): string | null {
  return fs.existsSync(path.join(process.cwd(), "public", caminho)) ? caminho : null;
}

// Fotos que já temos, para os círculos das áreas sem foto própria, só
// onde o frasco combina com o nome da área (pedido do usuário em
// 06/10/2026). A foto da área em public/fotos/categorias/<slug>.jpg,
// quando existir, tem prioridade sobre tudo isto.
// Cabelos & Unhas e Homeopatia & Florais ainda não têm produto com foto: a
// pedido (08/10/2026, "coloque fotos de produtos também, pra ficar
// apresentável, mas isso vai mudar depois") entram, PROVISÓRIOS, o frasco
// de loção do ZincBlock e o conta-gotas do Firm Defense, até chegar a foto
// da área (o rótulo deles mal se lê no círculo).
const FOTO_REPRESENTATIVA: Record<string, string> = {
  "vitaminas-suplementos": "/uploads/omega3.png",
  "saude-da-mulher": "/uploads/citorepair.png",
  "saude-do-homem": "/uploads/vitaflex.png",
  "cabelos-unhas": "/uploads/zincblock-fps.png",
  "homeopatia-florais": "/uploads/firm-defense-serum.png",
};

// Texto do banner de cada área: descreve o que se prepara, nunca um efeito.
// A parte entre *asteriscos* sai em itálico ouro (a segunda voz).
const BANNERS_POR_SLUG: Record<string, Omit<BannerVitrine, "imagem">> = {
  "dermatologia-estetica": {
    titulo: "Cuidado com a pele, *do jeito que foi prescrito.*",
    texto: "Cremes, séruns e loções preparados a partir da receita.",
  },
  "vitaminas-suplementos": {
    titulo: "Vitaminas e suplementos *na sua dose.*",
    texto: "Cápsulas, pós e gomas conforme a prescrição.",
  },
  "cabelos-unhas": {
    titulo: "Cabelos e unhas, *com fórmula própria.*",
    texto: "Loções, shampoos e cápsulas conforme a receita.",
  },
  "saude-da-mulher": { titulo: "Saúde da mulher, *em fórmula individual.*" },
  "saude-do-homem": { titulo: "Saúde do homem, *em fórmula individual.*" },
  "homeopatia-florais": { titulo: "Homeopatia e florais, *preparados aqui.*" },
};

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

/** Os produtos da grade do catálogo: um de cada área por vez (os com foto
 *  primeiro, depois os destaques), até o limite, para a grade mostrar
 *  todas as áreas e não repetir só o que já está nas faixas. */
function escolherParaCatalogo(categorias: CategoriaDTO[], produtos: ProdutoDTO[], limite: number): ProdutoDTO[] {
  const porArea = categorias.map((c) =>
    produtos
      .filter((p) => p.categoriaId === c.id)
      .sort(
        (a, b) =>
          Number(temFoto(b.fotoUrl)) - Number(temFoto(a.fotoUrl)) || Number(b.destaque) - Number(a.destaque)
      )
  );
  const escolhidos: ProdutoDTO[] = [];
  for (let rodada = 0; escolhidos.length < limite; rodada++) {
    let pegou = false;
    for (const lista of porArea) {
      const p = lista[rodada];
      if (p && escolhidos.length < limite) {
        escolhidos.push(p);
        pegou = true;
      }
    }
    if (!pegou) break;
  }
  return escolhidos;
}

export default async function Home() {
  const [{ categorias, produtos }, avaliacoes, artes, secoes] = await Promise.all([
    obterCatalogo(),
    obterAvaliacoes(),
    obterArtesHero(),
    obterSecoesHome(),
  ]);

  const comFoto = produtos.filter((p) => temFoto(p.fotoUrl));

  // Industrializados com registro, numa vitrine própria (sem preço, salvo
  // os que o painel liberou). Os marcados como destaque vêm primeiro.
  const prontaEntrega = produtos
    .filter(ehIndustrializado)
    .sort((a, b) => Number(b.destaque) - Number(a.destaque));

  // Só as categorias que têm algo no site
  const categoriasComItens = categorias.filter((c) => produtos.some((p) => p.categoriaId === c.id));

  // Imagem de cada área para os círculos: a foto da área, senão o pote
  // de um produto dela
  const imagensCategorias: Record<number, ImagemCategoria> = {};
  for (const c of categoriasComItens) {
    const foto = imagemSeExistir(`/fotos/categorias/${c.slug}.jpg`);
    const produto = comFoto.find((p) => p.categoriaId === c.id);
    const representativa = FOTO_REPRESENTATIVA[c.slug];
    if (foto) imagensCategorias[c.id] = { tipo: "foto", src: foto };
    else if (representativa) imagensCategorias[c.id] = { tipo: "produto", src: representativa };
    else if (produto?.fotoUrl) imagensCategorias[c.id] = { tipo: "produto", src: produto.fotoUrl };
  }

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
      },
    });
  }

  const bannerMaisProcurados: BannerVitrine = {
    titulo: "Cada fórmula sai *com o seu nome no rótulo.*",
    texto: "Preparada depois do pedido, conforme a receita.",
    imagem: imagemSeExistir("/fotos/banners/mais-procurados.jpg"),
  };

  const produtosCatalogo = escolherParaCatalogo(categoriasComItens, produtos, LIMITE_CATALOGO_HOME);

  // A primeira folha só existe se alguma das suas seções estiver ligada
  const mostraFolhaProdutos =
    secoes.categorias ||
    secoes.maisProcurados ||
    (secoes.vitrinesAreas && vitrines.length > 0) ||
    (secoes.prontaEntrega && prontaEntrega.length > 0);

  return (
    <main className="flex-1">
      {/* 1 ─ Banner de abertura e 2 ─ vantagens (sempre) */}
      <Abertura artes={artes} />
      <Beneficios />

      <div className="folhas">
        {/* 3 ─ Categorias em círculos + 4 ─ vitrines de produtos */}
        {mostraFolhaProdutos && (
          <Folha>
            {secoes.categorias && <CategoriasRedondas categorias={categoriasComItens} imagens={imagensCategorias} />}

            {secoes.maisProcurados && (
              <VitrineCategoria
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
            )}

            {/* Nas áreas o banner abre a faixa, um pouco menor (08/10/2026) */}
            {secoes.vitrinesAreas &&
              vitrines.map((v) => (
                <VitrineCategoria
                  key={v.categoria.id}
                  id={`titulo-vitrine-${v.categoria.slug}`}
                  titulo={<TituloComItalico nome={v.categoria.nome} />}
                  href={`/produtos/${v.categoria.slug}`}
                  produtos={v.produtos}
                  banner={v.banner}
                  bannerPrimeiro
                />
              ))}

            {/* Pronta entrega: só aparece quando houver industrializado */}
            {secoes.prontaEntrega && prontaEntrega.length > 0 && (
              <VitrineCategoria
                id="titulo-pronta-entrega"
                titulo={
                  <>
                    Pronta <span className="italic">entrega</span>
                  </>
                }
                href="/produtos"
                produtos={prontaEntrega}
              />
            )}
            <div className="secao-fecho" aria-hidden="true" />
          </Folha>
        )}

        {/* 5 ─ Como funciona: a trilha única do pedido, em 4 passos */}
        {secoes.comoFunciona && (
          <Folha tema="gelo">
            <ComoFunciona />
            <div className="secao-fecho" aria-hidden="true" />
          </Folha>
        )}

        {/* 6 ─ Explore o catálogo: um produto de cada área, em grade */}
        {secoes.catalogo && produtosCatalogo.length > 0 && (
          <Folha>
            <CatalogoHome
              produtos={produtosCatalogo}
              totalProdutos={produtos.length}
              totalAreas={categoriasComItens.length}
            />
            <div className="secao-fecho" aria-hidden="true" />
          </Folha>
        )}

        {/* 7 ─ Por dentro da Viver Bem (reels) */}
        {secoes.reels && (
          <Folha>
            <ReelsInstagram />
            <div className="secao-fecho" aria-hidden="true" />
          </Folha>
        )}

        {/* 8 ─ Avaliações do Google */}
        {secoes.avaliacoes && avaliacoes.length > 0 && (
          <Folha tema="gelo">
            <CarrosselAvaliacoes avaliacoes={avaliacoes} />
            <div className="secao-fecho" aria-hidden="true" />
          </Folha>
        )}

        {/* 9 ─ Banner da Saúde da Mulher: a animação da dobra com os potes da linha */}
        {secoes.bannerMulher && (
          <Folha>
            <BannerSaudeMulher />
            <div className="secao-fecho" aria-hidden="true" />
          </Folha>
        )}

        {/* 10 ─ Banner da história, só no celular (o "Fale com a gente" vem no rodapé) */}
        {secoes.bannerHistoria && (
          <Folha className="md:hidden">
            <BannerHistoria />
            <div className="secao-fecho" aria-hidden="true" />
          </Folha>
        )}
      </div>
    </main>
  );
}
