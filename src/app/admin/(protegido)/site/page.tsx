// Home e arte da dobra: a ordem e as chaves das seções da página inicial,
// as fotos das linhas dos círculos e todos os banners do site (foto, GIF ou
// vídeo). Gestor e colaborador entram; só o gestor reordena as linhas.
import { obterSessao } from "@/lib/sessao";
import { obterCatalogo } from "@/lib/catalogo";
import {
  obterArtesHeroConfiguradas,
  obterBanners,
  obterLinhasFotos,
  obterSecoesExtras,
  obterSecoesHome,
  obterSecoesOrdem,
} from "@/lib/configuracao";
import { BANNERS_FIXOS, definicaoBannerVitrine, type Banners } from "@/lib/banners";
import { imagensDasLinhas } from "@/lib/linhas";
import { PAPEL_OPERADOR } from "@/lib/tipos";
import { ConfiguracaoSite } from "@/components/admin/ConfiguracaoSite";

export const dynamic = "force-dynamic";

export default async function PaginaSite() {
  const [sessao, secoes, ordem, extras, banners, linhasFotos, legado, { categorias, produtos }] = await Promise.all([
    obterSessao(),
    obterSecoesHome(),
    obterSecoesOrdem(),
    obterSecoesExtras(),
    obterBanners(),
    obterLinhasFotos(),
    obterArtesHeroConfiguradas(),
    obterCatalogo(),
  ]);

  // As artes da dobra enviadas antes dos banners aparecem na dobra como
  // imagem (tirar por aqui também apaga a chave antiga)
  const comLegado: Banners = { ...banners };
  legado.forEach((c, i) => {
    const chave = `dobra-${i + 1}`;
    const b = comLegado[chave] ?? { desktop: null, celular: null };
    if (!b.desktop && c.desktop) b.desktop = { url: c.desktop, tipo: "imagem" };
    if (!b.celular && c.celular) b.celular = { url: c.celular, tipo: "imagem" };
    if (b.desktop || b.celular) comLegado[chave] = b;
  });

  const imagens = imagensDasLinhas(categorias, produtos, linhasFotos);
  const linhas = categorias.map((c) => ({ id: c.id, nome: c.nome, slug: c.slug, imagem: imagens[c.id] ?? null }));
  const definicoes = [...BANNERS_FIXOS, ...categorias.map(definicaoBannerVitrine)];

  return (
    <ConfiguracaoSite
      secoes={secoes}
      ordem={ordem}
      extras={extras}
      areas={categorias.map((c) => ({ id: c.id, nome: c.nome }))}
      banners={comLegado}
      definicoes={definicoes}
      linhas={linhas}
      papel={sessao.papel ?? PAPEL_OPERADOR}
    />
  );
}
