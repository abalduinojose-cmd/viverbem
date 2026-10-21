// SEO (21/10/2026): o endereço público do site, os dados estruturados que
// o Google lê (a farmácia com as três lojas, o site com a busca, o
// produto e o caminho de migalhas) e a imagem padrão de compartilhamento.
//
// O endereço vem de NEXT_PUBLIC_SITE_URL (na prévia do GitHub Pages o
// next.config já põe o endereço da prévia). Sem a variável, fica
// localhost: os links de compartilhamento e o mapa do site só ficam
// certos depois que ela for definida no deploy (ver PRODUCAO.md).
import {
  ANOS_TRADICAO,
  AVALIACOES_GOOGLE_NOTA,
  AVALIACOES_GOOGLE_TOTAL,
  CNPJ_FARMACIA,
  INSTAGRAM_URL,
  PERFIL_GOOGLE_URL,
  UNIDADES,
  WHATSAPP_LOJA,
  precoVisivel,
} from "./tipos";
import type { ProdutoDTO } from "./tipos";

export const URL_SITE = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
export const NOME_SITE = "Manipulação Viver Bem";
export const IMAGEM_PADRAO = "/og.png";

/** Endereço absoluto de um caminho do site */
export const urlDe = (caminho: string) => `${URL_SITE}${caminho.startsWith("/") ? caminho : `/${caminho}`}`;

// As coordenadas de cada loja (as mesmas do mapa das lojas)
const COORDENADAS: Record<string, [number, number]> = {
  Centro: [-22.5092, -43.1772],
  "Corrêas": [-22.4454, -43.1354],
  Posse: [-22.2521, -43.0737],
};

// Horário de todas as lojas (o mesmo de HorarioAtendimento)
const HORARIOS_ABERTOS = [
  { dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "19:00" },
  { dayOfWeek: ["Saturday"], opens: "09:00", closes: "13:00" },
];

const telefoneE164 = (t: string) => `+55${t.replace(/\D/g, "")}`;

/** A farmácia (organização) com as três lojas e o site, num grafo só.
 *  Vai em todas as páginas do site. */
export function dadosDaFarmacia() {
  const organizacaoId = `${URL_SITE}/#organizacao`;
  const lojas = UNIDADES.map((u, i) => {
    const [lat, lng] = COORDENADAS[u.bairro] ?? [];
    return {
      "@type": "Pharmacy",
      "@id": `${URL_SITE}/lojas#${u.bairro.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")}`,
      name: `${NOME_SITE} ${u.bairro}`,
      image: urlDe(IMAGEM_PADRAO),
      url: urlDe("/lojas"),
      telephone: telefoneE164(u.telefone ?? WHATSAPP_LOJA),
      parentOrganization: { "@id": organizacaoId },
      address: {
        "@type": "PostalAddress",
        streetAddress: u.endereco,
        addressLocality: "Petrópolis",
        addressRegion: "RJ",
        addressCountry: "BR",
      },
      ...(lat ? { geo: { "@type": "GeoCoordinates", latitude: lat, longitude: lng } } : {}),
      openingHoursSpecification: HORARIOS_ABERTOS.map((h) => ({ "@type": "OpeningHoursSpecification", ...h })),
      priceRange: "$$",
      // A nota e o total vêm do perfil do Google da loja do Centro; a
      // página /avaliacoes mostra as avaliações
      ...(i === 0 ? { aggregateRating: { "@type": "AggregateRating", ratingValue: AVALIACOES_GOOGLE_NOTA, reviewCount: AVALIACOES_GOOGLE_TOTAL, bestRating: 5 } } : {}),
    };
  });

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizacaoId,
        name: NOME_SITE,
        legalName: "Manipulação Viver Bem",
        taxID: CNPJ_FARMACIA,
        url: URL_SITE,
        logo: urlDe("/logo.png"),
        image: urlDe(IMAGEM_PADRAO),
        description: `Farmácia de manipulação e homeopatia em Petrópolis há ${ANOS_TRADICAO} anos, com ${UNIDADES.length} lojas e pedido pela receita no WhatsApp.`,
        telephone: telefoneE164(WHATSAPP_LOJA),
        sameAs: [INSTAGRAM_URL, PERFIL_GOOGLE_URL],
        areaServed: { "@type": "City", name: "Petrópolis" },
      },
      {
        "@type": "WebSite",
        "@id": `${URL_SITE}/#site`,
        url: URL_SITE,
        name: NOME_SITE,
        inLanguage: "pt-BR",
        publisher: { "@id": organizacaoId },
        potentialAction: {
          "@type": "SearchAction",
          target: { "@type": "EntryPoint", urlTemplate: `${URL_SITE}/produtos?busca={termo}` },
          "query-input": "required name=termo",
        },
      },
      ...lojas,
    ],
  };
}

/** O caminho de migalhas de uma página (Início > Produtos > Categoria) */
export function dadosDeMigalhas(itens: { nome: string; caminho: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ nome: "Início", caminho: "/" }, ...itens].map((i, k) => ({
      "@type": "ListItem",
      position: k + 1,
      name: i.nome,
      item: urlDe(i.caminho),
    })),
  };
}

/** Um produto do catálogo. O preço só entra quando ele está no site; o
 *  manipulado vai sem oferta (é preparado pela receita, não é venda de
 *  prateleira). */
export function dadosDoProduto(p: ProdutoDTO) {
  const preco = precoVisivel(p);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.nome,
    description: p.descricao,
    url: urlDe(`/produto/${p.slug}`),
    ...(p.fotoUrl ? { image: urlDe(p.fotoUrl) } : {}),
    ...(p.categoriaNome ? { category: p.categoriaNome } : {}),
    brand: { "@type": "Brand", name: NOME_SITE },
    ...(preco
      ? {
          offers: {
            "@type": "Offer",
            price: (preco / 100).toFixed(2),
            priceCurrency: "BRL",
            availability: p.ativo ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            url: urlDe(`/produto/${p.slug}`),
            seller: { "@id": `${URL_SITE}/#organizacao` },
          },
        }
      : {}),
  };
}
