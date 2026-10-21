// Layout do SITE público: header fixo, rodapé e o pedido (receita e
// carrinho, sem preço) disponível em todas as páginas, fechando pelo
// WhatsApp. O painel administrativo (/admin) tem layout próprio.
import { CarrinhoGlobal } from "@/components/site/CarrinhoGlobal";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { RolagemSuave } from "@/components/site/RolagemSuave";
import { obterCatalogo } from "@/lib/catalogo";
import { montarIndiceBusca } from "@/lib/indiceBusca";
import { dadosDaFarmacia } from "@/lib/seo";
import { DadosEstruturados } from "@/components/site/DadosEstruturados";
import { ConsentimentoCookies } from "@/components/site/ConsentimentoCookies";
import { Analytics } from "@/components/site/Analytics";

export default async function LayoutSite({ children }: { children: React.ReactNode }) {
  // O menu "Categorias" lista as categorias do banco; a busca ao vivo do
  // cabeçalho leva um índice enxuto dos produtos (nome, área, foto, texto)
  const { categorias, produtos } = await obterCatalogo();
  const indice = montarIndiceBusca(produtos);

  return (
    <CarrinhoGlobal>
      {/* Para quem navega pelo teclado: pula o cabeçalho inteiro */}
      <a href="#conteudo" className="pular-conteudo">
        Pular para o conteúdo
      </a>
      <Header categorias={categorias} indice={indice} />
      <div id="conteudo" tabIndex={-1} className="flex-1 flex flex-col outline-none">
        {children}
      </div>
      <Footer />
      {/* A roda do mouse desliza em vez de saltar (Windows sem animações) */}
      <RolagemSuave />
      {/* SEO e privacidade (21/10/2026): a farmácia com as três lojas para o
          Google, o aviso de cookies e o Google Analytics (só com aceite e só
          com o ID configurado) */}
      <DadosEstruturados dados={dadosDaFarmacia()} />
      <ConsentimentoCookies />
      <Analytics />
    </CarrinhoGlobal>
  );
}
