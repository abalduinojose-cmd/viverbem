// HOME no modelo de loja (referência biovittare.com.br, pedida pelo
// usuário em 06/10/2026), com o conteúdo da Viver Bem:
//   banner > vantagens > categorias em círculos > vitrines de produtos
//   (mais procurados e cada área com fotos, com um banner ao lado) >
//   como funciona > reels > avaliações > (rodapé com "fale com a gente")
//
// Em 23/09 a vitrine promocional tinha saído pela RDC 67/2007 (item 5.14).
// Em 05/10/2026 o cliente pediu de volta o "mais procurados", com os
// produtos que têm foto, sem preço e com carrinho, ciente do risco.
// Novidades e combos continuam fora.
//
// As fotos das áreas (public/fotos/categorias/<slug>.jpg) e dos banners
// (public/fotos/banners/<nome>.jpg) são opcionais: sem o arquivo, a
// categoria mostra o pote de um produto dela e o banner fica no degradê,
// com a inicial da área como marca d'água.
import fs from "fs";
import path from "path";
import { obterCatalogo, obterAvaliacoes } from "@/lib/catalogo";
import { CategoriaDTO, ProdutoDTO, ehIndustrializado } from "@/lib/tipos";
import { Abertura } from "@/components/site/Abertura";
import { Beneficios } from "@/components/site/Beneficios";
import { Folha } from "@/components/site/Folha";
import { ComoFunciona } from "@/components/site/ComoFunciona";
import { CategoriasRedondas, ImagemCategoria } from "@/components/site/CategoriasRedondas";
import { VitrineCategoria, BannerVitrine } from "@/components/site/VitrineCategoria";
import { ReelsInstagram } from "@/components/site/ReelsInstagram";
import { CarrosselAvaliacoes } from "@/components/site/CarrosselAvaliacoes";

export const dynamic = "force-dynamic";

// Foto de verdade é a que não é um dos desenhos neutros (.svg)
const temFoto = (fotoUrl: string | null) => Boolean(fotoUrl && !fotoUrl.toLowerCase().endsWith(".svg"));

// Quantas fotos reais uma área precisa ter para ganhar vitrine própria
const MINIMO_PARA_VITRINE = 3;

// Pílula do banner de cada vitrine
const contar = (n: number) => `${n} ${n === 1 ? "produto" : "produtos"}`;

/** Caminho público da imagem, se o arquivo existir em public/ */
function imagemSeExistir(caminho: string): string | null {
  return fs.existsSync(path.join(process.cwd(), "public", caminho)) ? caminho : null;
}

// Fotos que já temos, para os círculos das áreas sem foto própria, só
// onde o frasco combina com o nome da área (pedido do usuário em
// 06/10/2026). Cabelos & Unhas e Homeopatia & Florais ficam com a inicial
// até chegar foto. A foto da área em public/fotos/categorias/<slug>.jpg,
// quando existir, tem prioridade sobre tudo isto.
const FOTO_REPRESENTATIVA: Record<string, string> = {
  "vitaminas-suplementos": "/uploads/omega3.png",
  "saude-da-mulher": "/uploads/citorepair.png",
  "saude-do-homem": "/uploads/vitaflex.png",
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

export default async function Home() {
  const [{ categorias, produtos }, avaliacoes] = await Promise.all([
    obterCatalogo(),
    obterAvaliacoes(),
  ]);

  const comFoto = produtos.filter((p) => temFoto(p.fotoUrl));

  // Industrializados com registro, numa vitrine própria (sem preço, como
  // todo o site desde 05/10/2026). Os marcados como destaque vêm primeiro.
  const prontaEntrega = produtos
    .filter(ehIndustrializado)
    .sort((a, b) => Number(b.destaque) - Number(a.destaque));

  // Só as categorias que têm algo no site
  const categoriasComItens = categorias.filter((c) => produtos.some((p) => p.categoriaId === c.id));

  // Quantos produtos cada área tem (círculos e banners)
  const contagens: Record<number, number> = {};
  for (const c of categoriasComItens) contagens[c.id] = produtos.filter((p) => p.categoriaId === c.id).length;

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

  // Vitrines por área: só as que têm fotos reais suficientes
  const vitrines: { categoria: CategoriaDTO; produtos: ProdutoDTO[]; banner: BannerVitrine }[] = [];
  for (const c of categoriasComItens) {
    const lista = comFoto.filter((p) => p.categoriaId === c.id);
    if (lista.length < MINIMO_PARA_VITRINE) continue;
    const texto = BANNERS_POR_SLUG[c.slug] ?? { titulo: c.nome };
    vitrines.push({
      categoria: c,
      produtos: lista,
      banner: {
        ...texto,
        imagem: imagemSeExistir(`/fotos/banners/${c.slug}.jpg`),
        inicial: c.nome.charAt(0),
        pilula: contar(contagens[c.id] ?? 0),
      },
    });
  }

  const bannerMaisProcurados: BannerVitrine = {
    titulo: "Cada fórmula sai *com o seu nome no rótulo.*",
    texto: "Preparada depois do pedido, conforme a receita.",
    imagem: imagemSeExistir("/fotos/banners/mais-procurados.jpg"),
    inicial: "M",
    pilula: contar(comFoto.length),
  };

  return (
    <main className="flex-1">
      {/* 1 ─ Banner de abertura e 2 ─ vantagens */}
      <Abertura />
      <Beneficios />

      <div className="folhas">
        {/* 3 ─ Categorias em círculos + 4 ─ vitrines de produtos */}
        <Folha>
          <CategoriasRedondas categorias={categoriasComItens} imagens={imagensCategorias} contagens={contagens} />

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

          {vitrines.map((v) => (
            <VitrineCategoria
              key={v.categoria.id}
              id={`titulo-vitrine-${v.categoria.slug}`}
              titulo={<TituloComItalico nome={v.categoria.nome} />}
              href={`/produtos/${v.categoria.slug}`}
              produtos={v.produtos}
              banner={v.banner}
            />
          ))}

          {/* Pronta entrega: só aparece quando houver industrializado */}
          {prontaEntrega.length > 0 && (
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

        {/* 5 ─ Como funciona: a trilha única do pedido, em 4 passos */}
        <Folha tema="gelo">
          <ComoFunciona />
          <div className="secao-fecho" aria-hidden="true" />
        </Folha>

        {/* 6 ─ Por dentro da Viver Bem (reels) */}
        <Folha>
          <ReelsInstagram />
          <div className="secao-fecho" aria-hidden="true" />
        </Folha>

        {/* 7 ─ Avaliações do Google */}
        {avaliacoes.length > 0 && (
          <Folha tema="gelo">
            <CarrosselAvaliacoes avaliacoes={avaliacoes} />
            <div className="secao-fecho" aria-hidden="true" />
          </Folha>
        )}
      </div>
    </main>
  );
}
