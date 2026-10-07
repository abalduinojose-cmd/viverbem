// Home e arte da dobra: quais seções da página inicial aparecem e as até
// duas artes que abrem o site. Gestor e colaborador entram.
import { obterArtesHeroConfiguradas, obterSecoesHome } from "@/lib/configuracao";
import { ConfiguracaoSite } from "@/components/admin/ConfiguracaoSite";

export const dynamic = "force-dynamic";

export default async function PaginaSite() {
  const [secoes, artes] = await Promise.all([obterSecoesHome(), obterArtesHeroConfiguradas()]);
  return <ConfiguracaoSite secoes={secoes} artes={artes} />;
}
