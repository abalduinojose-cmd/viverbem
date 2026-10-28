// Política de privacidade (LGPD), 21/10/2026. O site guarda pouco: nome,
// WhatsApp e o resumo do pedido de quem finaliza pelo site; a foto da
// receita vai pelo WhatsApp e nunca passa pelo site. Texto para a
// farmácia conferir com o responsável e, se quiser, o jurídico.
//
// Revisão de 28/10/2026 (adendo 116): o texto prometia mais do que o site
// cumpre. Entraram a lista de contatos do painel (Leads, que a equipe de
// atendimento também vê e onde a equipe registra contatos vindos do
// WhatsApp, do Instagram e das lojas), os registros técnicos da
// hospedagem, o "Você viu recentemente" guardado no navegador e a receita
// como dado de saúde que a farmácia recebe pelo WhatsApp (art. 11 da LGPD).
// "O acesso aos pedidos é restrito à gerência" deixou de valer para os
// contatos e foi corrigido.
import type { Metadata } from "next";
import Link from "next/link";
import { PaginaLegal } from "@/components/site/PaginaLegal";
import { CNPJ_FARMACIA, UNIDADES, WHATSAPP_LOJA } from "@/lib/tipos";

export const metadata: Metadata = {
  title: "Política de privacidade · Manipulação Viver Bem",
  description: "Quais dados o site da Manipulação Viver Bem guarda, para quê, por quanto tempo, e como pedir acesso, correção ou exclusão (LGPD).",
  alternates: { canonical: "/privacidade" },
};

const ATUALIZADO_EM = "28 de outubro de 2026";

export default function PaginaPrivacidade() {
  const centro = UNIDADES[0];
  return (
    <PaginaLegal
      rotulo="privacidade"
      titulo="Política de"
      tituloItalico="privacidade"
      resumo="O que este site guarda sobre você, para quê, por quanto tempo e o que você pode pedir. Escrito para ser lido, conforme a Lei Geral de Proteção de Dados (Lei 13.709/2018)."
      atualizadoEm={ATUALIZADO_EM}
      essencial={[
        "O site guarda nome, WhatsApp e o resumo do pedido de quem finaliza um pedido. Navegar e montar o carrinho não gera cadastro.",
        "A foto da receita não passa pelo site: vai direto na conversa do WhatsApp, onde só a equipe da farmácia a vê, para conferir e preparar.",
        "Os dados servem para a equipe responder e preparar o pedido. Não vendemos nem repassamos para anúncios.",
        "Cookies de medição só com o seu aceite, e você pode mudar a escolha a qualquer hora pelo rodapé.",
        "Você pode pedir acesso, correção ou exclusão dos seus dados pelo WhatsApp ou em uma das lojas.",
      ]}
      secoes={[
        {
          id: "quem-somos",
          titulo: "Quem cuida dos seus dados",
          conteudo: (
            <>
              <p>
                A controladora dos dados é a Manipulação Viver Bem, CNPJ {CNPJ_FARMACIA}, com loja em {centro.endereco}, {centro.bairro}, Petrópolis, RJ.
              </p>
              <p>
                Para qualquer assunto sobre os seus dados, fale com a equipe pelo WhatsApp {WHATSAPP_LOJA} ou em uma das lojas. O farmacêutico responsável e a gerência respondem em horário de loja.
              </p>
            </>
          ),
        },
        {
          id: "o-que-guardamos",
          titulo: "O que o site guarda",
          conteudo: (
            <>
              <p>O site só cria um cadastro quando você finaliza um pedido. Nesse momento ficam registrados:</p>
              <ul>
                <li>o seu nome e o seu WhatsApp, para a equipe responder;</li>
                <li>a forma de receber (retirada em uma das lojas ou entrega) e, na entrega, o bairro ou endereço informado;</li>
                <li>os produtos escolhidos, as quantidades e o código do pedido;</li>
                <li>a marcação de que você vai enviar uma receita pelo WhatsApp.</li>
              </ul>
              <p>
                Com o pedido, o seu nome, o seu WhatsApp e o que você procura entram também na lista de contatos da farmácia, para a equipe acompanhar o atendimento. Nessa lista a equipe pode registrar, da mesma forma, contatos recebidos pelo WhatsApp, pelo Instagram ou nas lojas.
              </p>
              <p>
                A foto da receita não passa pelo site: você a envia direto na conversa do WhatsApp, e é lá que o farmacêutico a confere. O site não guarda receitas, laudos nem diagnósticos. A receita é um dado de saúde: a farmácia a usa só para conferir, preparar e registrar o que a legislação sanitária exige, e ela não vai para a lista de contatos.
              </p>
              <p>
                Navegar pelo site, buscar produtos e montar o carrinho não gera cadastro. O carrinho e a lista &quot;Você viu recentemente&quot; ficam só no seu navegador. Como em qualquer site, os servidores da hospedagem registram dados técnicos de acesso (como o endereço IP e a página pedida) por pouco tempo, para segurança e para corrigir falhas.
              </p>
            </>
          ),
        },
        {
          id: "para-que",
          titulo: "Para que usamos",
          conteudo: (
            <>
              <ul>
                <li>atender o seu pedido: conferir a receita, informar valor e prazo, preparar e entregar;</li>
                <li>responder dúvidas e avisar o andamento do pedido pelo WhatsApp;</li>
                <li>manter o histórico de pedidos da farmácia, como a legislação sanitária e fiscal pede;</li>
                <li>entender, em números gerais e sem identificar ninguém, como o site é usado.</li>
              </ul>
              <p>
                A base legal é a execução do contrato que você pede ao finalizar (art. 7º, V, da LGPD), o cumprimento de obrigações legais da farmácia (art. 7º, II) e, para as estatísticas e a lista de contatos, o nosso interesse legítimo em atender bem e melhorar o site (art. 7º, IX). A receita, por ser dado de saúde, é tratada para cumprir a legislação sanitária e para a tutela da sua saúde pelo farmacêutico (art. 11, II, alíneas a e f).
              </p>
              <p>Não vendemos, não alugamos e não cedemos os seus dados para ninguém usar em marketing. Se um dia quisermos mandar promoções, pediremos antes o seu consentimento, e você poderá recusar.</p>
            </>
          ),
        },
        {
          id: "com-quem",
          titulo: "Com quem os dados passam",
          conteudo: (
            <>
              <ul>
                <li>
                  <strong>WhatsApp (Meta):</strong> ao finalizar, o site abre uma conversa no WhatsApp com o resumo do pedido. A partir dali valem as regras de privacidade do WhatsApp.
                </li>
                <li>
                  <strong>Hospedagem:</strong> o site e o seu banco de dados ficam em servidores de empresas de hospedagem, que só armazenam os dados para a farmácia e não os usam para nada.
                </li>
                <li>
                  <strong>Google Analytics:</strong> só se você aceitar os cookies de medição. Mede visitas de forma agregada, com o endereço IP encurtado, sem o seu nome nem o seu WhatsApp.
                </li>
              </ul>
              <p>Autoridades públicas podem receber dados quando a lei obrigar, por exemplo numa fiscalização sanitária.</p>
            </>
          ),
        },
        {
          id: "cookies",
          titulo: "Cookies",
          conteudo: (
            <>
              <p>Cookies são pequenos registros que o navegador guarda. Este site usa dois tipos:</p>
              <ul>
                <li>
                  <strong>Necessários:</strong> a sua escolha sobre cookies (para não perguntar de novo) e, só para a equipe da farmácia, o cookie da sessão do painel administrativo. Não dependem de aceite, porque sem eles o site não funciona.
                </li>
                <li>
                  <strong>Medição:</strong> os do Google Analytics, que só entram se você aceitar no aviso de cookies. Servem para contar visitas e ver quais páginas são mais usadas.
                </li>
              </ul>
              <p>Não usamos cookies de anúncios nem de redes sociais. Você pode mudar a escolha a qualquer momento pelo link Cookies no rodapé, ou apagar os cookies nas configurações do navegador.</p>
            </>
          ),
        },
        {
          id: "por-quanto-tempo",
          titulo: "Por quanto tempo",
          conteudo: (
            <>
              <p>
                O registro do pedido fica guardado enquanto for necessário para atender você e pelo prazo que a legislação sanitária e fiscal exige para os registros da farmácia, em geral cinco anos. Depois disso é apagado ou deixa de identificar você.
              </p>
              <p>Os contatos da lista de atendimento são apagados quando deixam de ser úteis para atender você, ou antes, se você pedir. Os registros técnicos da hospedagem são descartados em poucos dias.</p>
              <p>As estatísticas do Google Analytics, quando aceitas, são mantidas por até 14 meses e não identificam pessoas.</p>
            </>
          ),
        },
        {
          id: "seus-direitos",
          titulo: "Os seus direitos",
          conteudo: (
            <>
              <p>A LGPD garante a você, a qualquer momento e sem custo:</p>
              <ul>
                <li>saber se temos dados seus e quais são;</li>
                <li>corrigir dados incompletos ou errados;</li>
                <li>pedir a exclusão do que não precisarmos mais guardar por obrigação legal;</li>
                <li>saber com quem os dados foram compartilhados;</li>
                <li>revogar um consentimento que tenha dado, como o dos cookies de medição.</li>
              </ul>
              <p>
                É só pedir pelo WhatsApp {WHATSAPP_LOJA}, informando o nome e o número usados no pedido. Respondemos em até 15 dias. Se não ficar satisfeito, você pode recorrer à Autoridade Nacional de Proteção de Dados (ANPD).
              </p>
            </>
          ),
        },
        {
          id: "seguranca",
          titulo: "Como protegemos",
          conteudo: (
            <>
              <p>
                O site usa conexão criptografada (HTTPS). O painel da farmácia exige senha, bloqueia tentativas repetidas e registra o que cada pessoa da equipe altera. As senhas da equipe são guardadas de forma embaralhada, sem como recuperá-las. Os pedidos completos só a gerência vê; a lista de contatos também é vista pela equipe de atendimento, que pode registrar e atualizar contatos, mas não apagar.
              </p>
            </>
          ),
        },
        {
          id: "mudancas",
          titulo: "Mudanças nesta política",
          conteudo: (
            <>
              <p>
                Se esta política mudar, a nova versão entra aqui com a data atualizada no alto da página. Mudanças que afetem o uso dos seus dados serão avisadas no site. Veja também os <Link href="/termos">termos de uso</Link> e a <Link href="/reembolso">política de trocas e reembolso</Link>.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
