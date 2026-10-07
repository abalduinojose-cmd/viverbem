// Home e arte da dobra: quais seções da página inicial aparecem e a arte
// que abre o site. Gestor e colaborador entram.
import { obterArteHeroConfigurada, obterSecoesHome } from "@/lib/configuracao";
import { ConfiguracaoSite } from "@/components/admin/ConfiguracaoSite";

export const dynamic = "force-dynamic";

export default async function PaginaSite() {
  const [secoes, arte] = await Promise.all([obterSecoesHome(), obterArteHeroConfigurada()]);
  return <ConfiguracaoSite secoes={secoes} arte={arte} />;
}
