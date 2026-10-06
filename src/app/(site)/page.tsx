// HOME, na sequência da Formularis com o conteúdo da Viver Bem:
//   carrossel > pilares > como funciona > cada pessoa tem sua fórmula >
//   mais procurados > categorias > pronta entrega (só industrializado) >
//   entrega e retirada > reels > avaliações > (rodapé com "fale com a gente")
//
// Em 23/09 a vitrine promocional (mais procurados, novidades, combos)
// tinha saído pela RDC 67/2007 (item 5.14). Em 05/10/2026 o cliente pediu
// de volta o "mais procurados", com os produtos que têm foto, sem preço e
// com carrinho, ciente do risco. Novidades e combos continuam fora.
// O vídeo do carrossel é opcional: basta salvar public/hero.mp4.
import fs from "fs";
import path from "path";
import { obterCatalogo, obterAvaliacoes } from "@/lib/catalogo";
import { ehIndustrializado } from "@/lib/tipos";
import { HeroCarrossel } from "@/components/site/HeroCarrossel";
import { MarqueeMarca } from "@/components/site/MarqueeMarca";
import { ComoFunciona } from "@/components/site/ComoFunciona";
import { EnviarReceita } from "@/components/site/EnviarReceita";
import { SecaoCategorias } from "@/components/site/SecaoCategorias";
import { SecaoTitulo } from "@/components/site/SecaoTitulo";
import { FaixaProdutos } from "@/components/site/FaixaProdutos";
import { SecaoQueridinhos } from "@/components/site/SecaoQueridinhos";
import { SecaoDelivery } from "@/components/site/SecaoDelivery";
import { ReelsInstagram } from "@/components/site/ReelsInstagram";
import { CarrosselAvaliacoes } from "@/components/site/CarrosselAvaliacoes";
import { Revelar } from "@/components/site/Revelar";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [{ categorias, produtos }, avaliacoes] = await Promise.all([
    obterCatalogo(),
    obterAvaliacoes(),
  ]);

  // Industrializados com registro, numa faixa própria (sem preço, como
  // todo o site desde 05/10/2026).
  // Os marcados como destaque no painel vêm primeiro.
  const prontaEntrega = produtos
    .filter(ehIndustrializado)
    .sort((a, b) => Number(b.destaque) - Number(a.destaque));

  // "Mais procurados" (de volta a pedido do cliente em 05/10/2026): todos
  // os produtos que já têm foto de verdade. Os desenhos neutros são .svg,
  // então foto enviada pelo painel entra aqui sozinha.
  const maisProcurados = produtos.filter(
    (p) => p.fotoUrl && !p.fotoUrl.toLowerCase().endsWith(".svg")
  );

  // Só as categorias que têm algo no site, com quantos produtos cada uma tem
  const categoriasComItens = categorias.filter((c) =>
    produtos.some((p) => p.categoriaId === c.id)
  );
  const totaisPorCategoria = Object.fromEntries(
    categoriasComItens.map((c) => [c.id, produtos.filter((p) => p.categoriaId === c.id).length])
  );

  // O vídeo do carrossel só entra se o arquivo existir em public/hero.mp4
  const temVideo = fs.existsSync(path.join(process.cwd(), "public", "hero.mp4"));

  return (
    <main className="flex-1">
      {/* 1 ─ Carrossel */}
      <HeroCarrossel temVideo={temVideo} />

      {/* 2 ─ Pilares: os números da casa */}
      <MarqueeMarca />

      {/* 3 ─ Como funciona, em 4 passos */}
      <Revelar>
        <ComoFunciona />
      </Revelar>

      {/* 4 ─ Cada pessoa tem sua fórmula */}
      <Revelar>
        <EnviarReceita />
      </Revelar>

      {/* 5 ─ Mais procurados: vitrine na noite, com os produtos com foto */}
      <SecaoQueridinhos produtos={maisProcurados} />

      {/* 6 ─ Categorias */}
      <Revelar>
        <SecaoCategorias categorias={categoriasComItens} totais={totaisPorCategoria} />
      </Revelar>

      {/* 7 ─ Pronta entrega: só aparece quando houver industrializado */}
      {prontaEntrega.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-8 pt-20">
          <Revelar>
            <SecaoTitulo
              selo="com registro na Anvisa"
              titulo="Pronta entrega"
              descricao="Produtos industrializados, para pedir direto pelo site."
              verTudo="/produtos"
            />
            <FaixaProdutos produtos={prontaEntrega} />
          </Revelar>
        </section>
      )}

      {/* 8 ─ Entrega e retirada */}
      <Revelar>
        <SecaoDelivery />
      </Revelar>

      {/* 9 ─ Por dentro da Viver Bem (reels) */}
      <Revelar>
        <ReelsInstagram />
      </Revelar>

      {/* 10 ─ Avaliações do Google */}
      {avaliacoes.length > 0 && (
        <Revelar>
          <CarrosselAvaliacoes avaliacoes={avaliacoes} />
        </Revelar>
      )}

      {/* 11 ─ "Fale com a gente" abre o rodapé, logo abaixo */}
      <div className="pb-20" aria-hidden="true" />
    </main>
  );
}
