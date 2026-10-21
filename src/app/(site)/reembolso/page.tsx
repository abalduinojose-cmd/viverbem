// Política de trocas e reembolso, 21/10/2026. Segue o Código de Defesa do
// Consumidor (arts. 18, 26 e 49) e a regra sanitária de que medicamento
// não volta ao estoque: industrializado lacrado tem os 7 dias de
// arrependimento da compra a distância; manipulado é feito sob medida e
// não tem devolução por desistência, mas erro de preparo é refeito ou
// devolvido sem custo. Texto para a farmácia conferir com o responsável.
import type { Metadata } from "next";
import Link from "next/link";
import { PaginaLegal } from "@/components/site/PaginaLegal";
import { WHATSAPP_LOJA } from "@/lib/tipos";

export const metadata: Metadata = {
  title: "Trocas e reembolso · Manipulação Viver Bem",
  description: "Como funcionam trocas, devoluções e reembolso na Manipulação Viver Bem: produtos industrializados, fórmulas manipuladas, prazos e como pedir.",
  alternates: { canonical: "/reembolso" },
};

const ATUALIZADO_EM = "21 de outubro de 2026";

export default function PaginaReembolso() {
  return (
    <PaginaLegal
      rotulo="trocas e reembolso"
      titulo="Trocas e"
      tituloItalico="reembolso"
      resumo="O que pode ser trocado ou devolvido, em quanto tempo e como pedir. Produto industrializado e fórmula manipulada seguem regras diferentes, e explicamos cada uma."
      atualizadoEm={ATUALIZADO_EM}
      secoes={[
        {
          id: "resumo",
          titulo: "Em resumo",
          conteudo: (
            <>
              <ul>
                <li>
                  <strong>Produto industrializado com defeito:</strong> troca ou devolução do valor, em até 30 dias da compra (Código de Defesa do Consumidor, arts. 18 e 26).
                </li>
                <li>
                  <strong>Produto industrializado comprado a distância, sem defeito:</strong> você pode desistir em até 7 dias do recebimento, com o produto lacrado (art. 49 do CDC).
                </li>
                <li>
                  <strong>Fórmula manipulada:</strong> é preparada sob medida para a sua receita e, por regra sanitária, não pode voltar ao estoque nem ser vendida a outra pessoa. Por isso não há devolução por desistência. Qualquer problema de preparo é resolvido sem custo.
                </li>
              </ul>
            </>
          ),
        },
        {
          id: "industrializados",
          titulo: "Produtos industrializados",
          conteudo: (
            <>
              <p>
                São os produtos com registro na Anvisa, vendidos lacrados. Se chegar com defeito, avaria, violação do lacre ou fora da validade, avise em até 30 dias a partir da compra. Você escolhe entre a troca por outro igual, a troca por outro produto com acerto de diferença, ou a devolução do valor pago.
              </p>
              <p>
                Quando a compra for combinada a distância (pelo WhatsApp, com entrega), vale também o direito de arrependimento: até 7 dias depois de receber, sem precisar dizer o motivo, desde que o produto esteja lacrado, sem sinais de uso e com a embalagem íntegra. O valor pago, incluindo a taxa de entrega, é devolvido.
              </p>
              <p>Compras feitas na loja, com o produto conferido na hora, não têm o prazo de arrependimento; a troca por defeito continua valendo.</p>
            </>
          ),
        },
        {
          id: "manipulados",
          titulo: "Fórmulas manipuladas",
          conteudo: (
            <>
              <p>
                Cada fórmula é preparada depois do pedido, na dose e na forma que a sua receita indica, com o seu nome no rótulo. Ela não serve para outra pessoa, e a legislação sanitária não permite que um medicamento entregue volte ao estoque. Por isso a fórmula manipulada não pode ser devolvida nem trocada por desistência, mudança de ideia ou erro no pedido feito pelo cliente.
              </p>
              <p>
                O que a farmácia resolve sem custo, sempre: erro no preparo, diferença em relação à receita, problema de aspecto, cheiro ou consistência fora do esperado, rótulo errado ou embalagem com defeito. Nesses casos a fórmula é refeita ou o valor é devolvido, como você preferir, depois da análise do farmacêutico responsável.
              </p>
              <p>
                Antes de preparar, o farmacêutico confirma com você pelo WhatsApp o que vai ser feito, o valor e o prazo. Esse é o momento de corrigir qualquer coisa, sem custo nenhum. Depois da confirmação o preparo começa, e a desistência não gera reembolso.
              </p>
              <p>Reações ao tratamento devem ser comunicadas ao prescritor e à farmácia. Elas não caracterizam defeito do produto, mas a equipe orienta e, quando couber, registra a notificação sanitária.</p>
            </>
          ),
        },
        {
          id: "como-pedir",
          titulo: "Como pedir uma troca ou devolução",
          conteudo: (
            <>
              <ol>
                <li>
                  Chame no WhatsApp {WHATSAPP_LOJA} com o código do pedido (ou a data da compra), uma foto do produto e do rótulo, e o que aconteceu.
                </li>
                <li>A equipe responde em horário de loja e, se precisar, pede para levar o produto a uma das lojas ou combina a coleta na entrega seguinte.</li>
                <li>O farmacêutico responsável analisa em até 5 dias úteis e informa a solução: troca, novo preparo ou devolução do valor.</li>
              </ol>
              <p>Guarde a embalagem e o rótulo até a análise terminar. Produto sem rótulo ou com conteúdo trocado de embalagem não pode ser analisado.</p>
            </>
          ),
        },
        {
          id: "prazo-do-reembolso",
          titulo: "Como e quando o valor volta",
          conteudo: (
            <>
              <p>
                A devolução é feita pelo mesmo meio do pagamento. Pagamento em dinheiro ou Pix volta por Pix em até 5 dias úteis depois da aprovação. Pagamento em cartão é estornado junto à operadora, que pode levar até duas faturas para mostrar o crédito. A taxa de entrega é devolvida quando a causa for da farmácia ou no arrependimento previsto em lei.
              </p>
            </>
          ),
        },
        {
          id: "duvidas",
          titulo: "Dúvidas e outras regras",
          conteudo: (
            <>
              <p>
                Esta política faz parte dos <Link href="/termos">termos de uso</Link> e segue o Código de Defesa do Consumidor e as normas da Anvisa. Nada aqui reduz um direito que a lei garante a você. Em caso de dúvida, fale com a equipe antes de confirmar o pedido.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
