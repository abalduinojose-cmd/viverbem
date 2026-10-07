// POST /api/admin/produtos — cria um produto (com a galeria de fotos).
// Permissão: qualquer usuário logado (gestor ou colaborador).
//
// Produto criado pelo COLABORADOR nasce aguardando aprovação: só aparece
// no site depois que o gestor publicar. É quem revisa a peça antes de
// ela entrar no ar (farmácia de manipulação responde pelo que publica).
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { exigirSessaoApi } from "@/lib/sessao";
import { validarCorpoProduto } from "@/lib/validarProduto";
import { registrarLog } from "@/lib/log";
import { formatarPreco } from "@/lib/preco";
import { gerarSlugProdutoUnico } from "@/lib/slug";
import { PAPEL_ADMIN, VENDA_INDUSTRIALIZADO } from "@/lib/tipos";

export async function POST(req: Request) {
  const sessao = await exigirSessaoApi();
  if (!sessao) {
    return NextResponse.json({ erro: "Não autorizado." }, { status: 401 });
  }

  const corpo = await req.json().catch(() => ({}));
  const resultado = validarCorpoProduto(corpo);
  if ("erro" in resultado) {
    return NextResponse.json({ erro: resultado.erro }, { status: 400 });
  }

  // O slug (endereço do produto no site) é gerado UMA vez, no cadastro,
  // e não muda depois: os links postados no Instagram continuam válidos.
  const slug = await gerarSlugProdutoUnico(resultado.dados.nome);
  const aprovado = sessao.papel === PAPEL_ADMIN;
  const produto = await db.produto.create({
    data: {
      ...resultado.dados,
      slug,
      aprovado,
      fotos: { create: resultado.fotos.map((url, ordem) => ({ url, ordem })) },
    },
  });

  const preco =
    produto.venda === VENDA_INDUSTRIALIZADO ? ` (${formatarPreco(produto.precoCentavos)})` : " (manipulado)";
  await registrarLog(
    sessao.nome ?? "?",
    "criou produto",
    `"${produto.nome}"${preco}, ${resultado.fotos.length} foto(s)${aprovado ? "" : ", aguardando aprovação"}`
  );
  return NextResponse.json(produto, { status: 201 });
}
