// O painel na VITRINE ESTÁTICA (GitHub Pages), só para a cliente ver e
// navegar (10/10/2026, pedido: "o painel adm vai ser só para a cliente
// visualizar, depois vamos para a parte do servidor e banco de dados").
//
// O Pages não tem servidor, banco nem cookie de sessão. Então, com DEMO=1:
//   - a sessão é fixa no servidor (gestor) e, no navegador, quem manda é o
//     que a pessoa escolheu na tela de login (localStorage; ver
//     components/admin/ModoDemo.tsx), que esconde o que o colaborador não vê;
//   - os dados vêm do retrato em dados-demo.json (gerado por
//     scripts/gerar-demo.js): o catálogo inteiro, as categorias, os
//     usuários e o log são os reais; os PEDIDOS são fictícios, gerados no
//     build, porque dado de cliente de verdade não pode ir para um site
//     público;
//   - toda gravação (fetch em /api/) é interceptada no navegador e vira um
//     aviso "nada é gravado".
// Fora do DEMO nada disto é usado: o painel de verdade continua igual.
import { PAPEL_ADMIN, type CategoriaDTO, type ProdutoDTO } from "./tipos";
import { lerRetratoDemo } from "./catalogo";

export const EH_DEMO = process.env.DEMO === "1";

/** Um pedido fictício, no formato da tabela Cliente (datas em ISO). */
export interface PedidoDemo {
  id: number;
  nome: string;
  whatsapp: string;
  pagamento: string;
  entrega: string;
  local: string;
  receita: boolean;
  codigo: string;
  totalCentavos: number;
  itens: string;
  criadoEm: string;
}

export interface UsuarioDemo {
  id: number;
  nome: string;
  email: string;
  papel: string;
  ativo: boolean;
  ultimoAcesso: string | null;
  criadoEm: string;
}

export interface LogDemo {
  id: number;
  usuario: string;
  acao: string;
  detalhe: string;
  criadoEm: string;
}

export interface AdminDemo {
  /** O catálogo INTEIRO, inclusive o que está escondido ou aguardando publicação */
  produtos: ProdutoDTO[];
  categorias: (CategoriaDTO & { totalProdutos: number })[];
  usuarios: UsuarioDemo[];
  log: LogDemo[];
  pedidos: PedidoDemo[];
}

/** A sessão fixa usada para gerar as páginas do painel no build (gestor). */
export const SESSAO_DEMO = { usuarioId: 1, nome: "Administrador", papel: PAPEL_ADMIN };

const VAZIO: AdminDemo = { produtos: [], categorias: [], usuarios: [], log: [], pedidos: [] };

export async function lerAdminDemo(): Promise<AdminDemo> {
  const retrato = await lerRetratoDemo();
  return retrato.admin ?? VAZIO;
}
