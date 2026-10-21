// O bloco de dados estruturados (JSON-LD) que o Google lê. Componente de
// servidor: vira um <script type="application/ld+json"> no HTML, sem nada
// no navegador. O "<" é escapado para o JSON nunca fechar a tag por engano.
export function DadosEstruturados({ dados }: { dados: unknown }) {
  const json = JSON.stringify(dados).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
