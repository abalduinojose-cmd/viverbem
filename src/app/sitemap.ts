// Mapa do site para o Google: as páginas fixas, as páginas legais, cada
// categoria e cada produto. O endereço vem de NEXT_PUBLIC_SITE_URL (ver
// PRODUCAO.md). 21/10/2026: entraram Como funciona, Avaliações e as três
// páginas legais, com a data de alteração e a frequência de mudança.
import type { MetadataRoute } from "next";
import { obterCatalogo } from "@/lib/catalogo";
import { URL_SITE } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { produtos, categorias } = await obterCatalogo();
  const agora = new Date();

  const fixas: MetadataRoute.Sitemap = [
    { url: `${URL_SITE}/`, priority: 1, changeFrequency: "weekly", lastModified: agora },
    { url: `${URL_SITE}/produtos`, priority: 0.9, changeFrequency: "weekly", lastModified: agora },
    { url: `${URL_SITE}/como-funciona`, priority: 0.7, changeFrequency: "monthly" },
    { url: `${URL_SITE}/sobre`, priority: 0.6, changeFrequency: "monthly" },
    { url: `${URL_SITE}/lojas`, priority: 0.7, changeFrequency: "monthly" },
    { url: `${URL_SITE}/avaliacoes`, priority: 0.6, changeFrequency: "weekly" },
    { url: `${URL_SITE}/contato`, priority: 0.6, changeFrequency: "monthly" },
    { url: `${URL_SITE}/privacidade`, priority: 0.3, changeFrequency: "yearly" },
    { url: `${URL_SITE}/termos`, priority: 0.3, changeFrequency: "yearly" },
    { url: `${URL_SITE}/reembolso`, priority: 0.3, changeFrequency: "yearly" },
  ];

  const paginasCategorias: MetadataRoute.Sitemap = categorias
    .filter((c) => produtos.some((p) => p.categoriaId === c.id))
    .map((c) => ({ url: `${URL_SITE}/produtos/${c.slug}`, priority: 0.8, changeFrequency: "weekly", lastModified: agora }));

  const paginasProdutos: MetadataRoute.Sitemap = produtos.map((p) => ({
    url: `${URL_SITE}/produto/${p.slug}`,
    priority: 0.8,
    changeFrequency: "monthly",
  }));

  return [...fixas, ...paginasCategorias, ...paginasProdutos];
}
