// Termos de uso do site, 21/10/2026. O ponto central: o site não vende
// nada sozinho; o pedido feito aqui é um pré-pedido, confirmado pelo
// farmacêutico no WhatsApp, e manipulado só sai com receita válida
// (RDC 67/2007). Texto para a farmácia conferir com o responsável.
import type { Metadata } from "next";
import Link from "next/link";
import { PaginaLegal } from "@/components/site/PaginaLegal";
import { CNPJ_FARMACIA, UNIDADES, WHATSAPP_LOJA } from "@/lib/tipos";

export const metadata: Metadata = {
  title: "Termos de uso · Manipulação Viver Bem",
  description: "As regras de uso do site da Manipulação Viver Bem: como funciona o pedido pelo WhatsApp, a exigência de receita para manipulados, preços, prazos e responsabilidades.",
  alternates: { canonical: "/termos" },
};

const ATUALIZADO_EM = "21 de outubro de 2026";

export default function PaginaTermos() {
  return (
    <PaginaLegal
      rotulo="termos"
      titulo="Termos de"
      tituloItalico="uso"
      resumo="As regras para usar este site e fazer pedidos. Ao navegar e finalizar um pedido, você concorda com o que está aqui. Em português simples, para não restar dúvida."
      atualizadoEm={ATUALIZADO_EM}
      secoes={[
        {
          id: "quem",
          titulo: "Quem está por trás do site",
          conteudo: (
            <>
              <p>
                Este site pertence à Manipulação Viver Bem, farmácia de manipulação e homeopatia com CNPJ {CNPJ_FARMACIA} e {UNIDADES.length} lojas em Petrópolis, RJ: {UNIDADES.map((u) => u.bairro).join(", ")}. O atendimento pelo WhatsApp é o {WHATSAPP_LOJA}.
              </p>
            </>
          ),
        },
        {
          id: "o-que-o-site-faz",
          titulo: "O que o site faz e o que não faz",
          conteudo: (
            <>
              <p>
                O site apresenta a farmácia, as linhas de produtos e o caminho do pedido. Ele não conclui vendas nem recebe pagamentos: ao finalizar, o site abre uma conversa no WhatsApp com o resumo do que você escolheu. É um pré-pedido.
              </p>
              <p>
                A venda só acontece depois que o farmacêutico confere o pedido, confirma a disponibilidade, informa o valor e o prazo, e você aceita. O pagamento é combinado nessa conversa e feito na loja, na entrega ou por meio acertado com a equipe.
              </p>
            </>
          ),
        },
        {
          id: "receita",
          titulo: "Receita e produtos manipulados",
          conteudo: (
            <>
              <p>
                Fórmulas manipuladas são preparadas uma a uma, para a pessoa indicada na receita, conforme a legislação sanitária (RDC 67/2007 da Anvisa). Por isso elas só são preparadas com receita válida, de profissional habilitado, apresentada na loja ou pela foto no WhatsApp. A receita original pode ser pedida na retirada ou na entrega.
              </p>
              <p>
                O farmacêutico pode recusar o preparo quando a receita estiver incompleta, vencida ou ilegível, quando a prescrição exigir ajuste, ou quando a lei não permitir. Nesses casos a equipe avisa pelo WhatsApp.
              </p>
              <p>
                Os textos das linhas de produtos descrevem o que é preparado, não prometem resultado. Nada no site substitui a consulta com o seu médico, dentista, nutricionista ou outro prescritor.
              </p>
            </>
          ),
        },
        {
          id: "precos",
          titulo: "Preços, prazos e entrega",
          conteudo: (
            <>
              <ul>
                <li>Quando um produto mostra preço no site, ele vale como referência e é confirmado pelo farmacêutico no atendimento. O valor de uma fórmula manipulada depende da receita e é informado pelo WhatsApp.</li>
                <li>Os prazos de preparo são informados no atendimento e podem variar conforme a fórmula e os insumos.</li>
                <li>A retirada nas lojas não tem custo. A entrega em Petrópolis e Região tem taxa e prazo combinados pelo WhatsApp antes da confirmação.</li>
                <li>Erros evidentes de digitação em preços ou descrições podem ser corrigidos antes da confirmação do pedido.</li>
              </ul>
            </>
          ),
        },
        {
          id: "trocas",
          titulo: "Trocas, devoluções e reembolso",
          conteudo: (
            <>
              <p>
                As regras estão na <Link href="/reembolso">política de trocas e reembolso</Link>, que faz parte destes termos. Em resumo: produto industrializado com defeito é trocado conforme o Código de Defesa do Consumidor; fórmula manipulada é feita sob medida e não pode ser devolvida por desistência, mas qualquer problema de preparo é resolvido sem custo.
              </p>
            </>
          ),
        },
        {
          id: "uso",
          titulo: "Uso do site",
          conteudo: (
            <>
              <p>Ao usar o site, você se compromete a informar dados verdadeiros no pedido, a não enviar receitas de terceiros sem autorização e a não usar o site para fins ilícitos, automatizados ou que o sobrecarreguem.</p>
              <p>Os textos, as fotos, a marca e o desenho do site pertencem à Manipulação Viver Bem ou a quem os licenciou. Podem ser compartilhados com o link do site, mas não copiados para outros sites ou materiais sem autorização.</p>
              <p>Links para serviços de terceiros (Google Maps, Instagram, WhatsApp) levam a páginas com regras próprias, pelas quais não respondemos.</p>
            </>
          ),
        },
        {
          id: "dados",
          titulo: "Os seus dados",
          conteudo: (
            <>
              <p>
                O que o site guarda e como você pode pedir acesso, correção ou exclusão está na <Link href="/privacidade">política de privacidade</Link>. Ela faz parte destes termos.
              </p>
            </>
          ),
        },
        {
          id: "responsabilidade",
          titulo: "Responsabilidade e disponibilidade",
          conteudo: (
            <>
              <p>
                Trabalhamos para manter o site no ar e correto, mas ele pode ficar indisponível por manutenção ou falhas fora do nosso controle. Nesses momentos o pedido pode ser feito diretamente pelo WhatsApp ou nas lojas. A responsabilidade da farmácia pelos produtos segue o Código de Defesa do Consumidor e a legislação sanitária.
              </p>
            </>
          ),
        },
        {
          id: "foro",
          titulo: "Mudanças e foro",
          conteudo: (
            <>
              <p>
                Estes termos podem ser atualizados; a versão em vigor é a publicada aqui, com a data no alto da página. Para qualquer questão fica eleito o foro da comarca de Petrópolis, RJ, sem prejuízo do direito do consumidor de recorrer ao foro do seu domicílio.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
