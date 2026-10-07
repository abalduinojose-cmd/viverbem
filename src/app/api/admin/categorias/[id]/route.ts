// PATCH  /api/admin/categorias/:id — renomeia a categoria e/ou liga e
//         desliga "no site" (visivel) e "vitrine na home" (vitrineHome).
//         Permissão: qualquer usuário logado (gestor ou colaborador).
// DELETE /api/admin/categorias/:id — apaga a categoria
//         (os produtos dela NÃO são apagados — ficam "sem categoria").
//         Permissão: SOMENTE gestor.
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { exigirAdminApi, exigirSessaoApi } from "@/lib/sessao";
import { gerarSlug } from "@/lib/slug";
import { registrarLog } from "@/lib/log";

type Contexto = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, contexto: Contexto) {
  const sessao = await exigirSessaoApi();
  if (!sessao) {
    return NextResponse.json({ erro: "Não autorizado." }, { status: 401 });
  }

  const { id } = await contexto.params;
  const corpo = await req.json().catch(() => ({}));

  const anterior = await db.categoria.findUnique({ where: { id: Number(id) } });
  if (!anterior) {
    return NextResponse.json({ erro: "Categoria não encontrada." }, { status: 404 });
  }

  const dados: { nome?: string; slug?: string; visivel?: boolean; vitrineHome?: boolean } = {};
  const mudancas: string[] = [];

  if (corpo.nome !== undefined) {
    const nome = String(corpo.nome ?? "").trim().slice(0, 60);
    if (!nome) {
      return NextResponse.json({ erro: "Informe o nome da categoria." }, { status: 400 });
    }
    const slug = gerarSlug(nome);
    const outra = await db.categoria.findUnique({ where: { slug } });
    if (outra && outra.id !== anterior.id) {
      return NextResponse.json({ erro: "Já existe uma categoria com esse nome." }, { status: 409 });
    }
    dados.nome = nome;
    dados.slug = slug;
    if (nome !== anterior.nome) mudancas.push(`"${anterior.nome}" -> "${nome}"`);
  }
  if (typeof corpo.visivel === "boolean") {
    dados.visivel = corpo.visivel;
    mudancas.push(corpo.visivel ? "de volta ao site" : "tirada do site");
  }
  if (typeof corpo.vitrineHome === "boolean") {
    dados.vitrineHome = corpo.vitrineHome;
    mudancas.push(corpo.vitrineHome ? "vitrine na home ligada" : "vitrine na home desligada");
  }
  if (Object.keys(dados).length === 0) {
    return NextResponse.json({ erro: "Nada para alterar." }, { status: 400 });
  }

  const categoria = await db.categoria.update({ where: { id: Number(id) }, data: dados });
  await registrarLog(
    sessao.nome ?? "?",
    "alterou categoria",
    `"${categoria.nome}": ${mudancas.join(", ") || "sem mudanças"}`
  );
  return NextResponse.json(categoria);
}

export async function DELETE(_req: Request, contexto: Contexto) {
  const sessao = await exigirAdminApi();
  if (!sessao) {
    return NextResponse.json(
      { erro: "Apenas o gestor pode apagar categorias." },
      { status: 403 }
    );
  }

  const { id } = await contexto.params;
  const categoria = await db.categoria.delete({ where: { id: Number(id) } });
  await registrarLog(sessao.nome ?? "?", "apagou categoria", `"${categoria.nome}"`);
  return NextResponse.json({ ok: true });
}
