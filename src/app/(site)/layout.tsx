// Layout do SITE público: header fixo, rodapé e o pedido (receita e
// carrinho, sem preço) disponível em todas as páginas, fechando pelo
// WhatsApp. O painel administrativo (/admin) tem layout próprio.
import { CarrinhoGlobal } from "@/components/site/CarrinhoGlobal";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { RolagemSuave } from "@/components/site/RolagemSuave";
import { obterCategorias } from "@/lib/catalogo";

export default async function LayoutSite({ children }: { children: React.ReactNode }) {
  // O menu "Categorias" lista as categorias do banco
  const categorias = await obterCategorias();

  return (
    <CarrinhoGlobal>
      {/* Para quem navega pelo teclado: pula o cabeçalho inteiro */}
      <a href="#conteudo" className="pular-conteudo">
        Pular para o conteúdo
      </a>
      <Header categorias={categorias} />
      <div id="conteudo" tabIndex={-1} className="flex-1 flex flex-col outline-none">
        {children}
      </div>
      <Footer />
      {/* A roda do mouse desliza em vez de saltar (Windows sem animações) */}
      <RolagemSuave />
    </CarrinhoGlobal>
  );
}
