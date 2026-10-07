// PATCH  /api/admin/produtos/:id — atualiza um produto.
//        Edição parcial (chaves da listagem): só os campos enviados, entre
//        ativo, novidade, destaque, aprovado, mostrarPreco e precoCentavos.
//        Edição completa (formulário): o produto inteiro, com a galeria.
//        Permissão: qualquer usuário logado; "aprovado" (publicar o que o
//        colaborador cadastrou) é SOMENTE do gestor.
// DELETE /api/admin/produtos/:id — apaga o produto de vez (e as fotos).
//        Permissão: SOMENTE gestor (colaborador não apaga).
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { exigirAdminApi, exigirSessaoApi } from "@/lib/sessao";
import { validarCorpoProduto } from "@/lib/validarProduto";
import { registrarLog } from "@/lib/log";
import { formatarPreco } from "@/lib/preco";
import { PAPEL_ADMIN, VENDA_INDUSTRIALIZADO } from "@/lib/tipos";

type Contexto = { params: Promise<{ id: string }> };

const CAMPOS_PARCIAIS = ["ativo", "novidade", "destaque", "aprovado", "mostrarPreco", "precoCentavos"];

export async function PATCH(req: Request, contexto: Contexto) {
  const sessao = await exigirSessaoApi();
  if (!sessao) {
    return NextResponse.json({ erro: "Não autorizado." }, { status: 401 });
  }

  const { id } = await contexto.params;
  const corpo = await req.json().catch(() => ({}));
  const anterior = await db.produto.findUnique({
    where: { id: Number(id) },
    include: { fotos: { select: { id: true } } },
  });
  if (!anterior) {
    return NextResponse.json({ erro: "Produto não encontrado." }, { status: 404 });
  }

  // ---------- Edição parcial ----------
  // Manda só o campo que mudou, para não apagar o resto sem querer
  const chaves = Object.keys(corpo);
  const parcial = chaves.length > 0 && chaves.every((c) => CAMPOS_PARCIAIS.includes(c));

  if (parcial) {
    const industrializado = anterior.venda === VENDA_INDUSTRIALIZADO;
    const dados: Record<string, boolean | number> = {};

    for (const c of chaves) {
      if (c === "aprovado") {
        if (sessao.papel !== PAPEL_ADMIN) {
          return NextResponse.json({ erro: "Só o gestor publica produtos." }, { status: 403 });
        }
        dados.aprovado = corpo.aprovado === true;
      } else if (c === "novidade" || c === "destaque") {
        // Vitrine promocional não existe para manipulado
        if (!industrializado && corpo[c] === true) {
          return NextResponse.json(
            { erro: "Manipulado não pode ter selo de novidade ou destaque." },
            { status: 400 }
          );
        }
        dados[c] = corpo[c] === true;
      } else if (c === "mostrarPreco") {
        // Preço exposto só para industrializado com registro (RDC 67/2007)
        if (!industrializado && corpo.mostrarPreco === true) {
          return NextResponse.json(
            { erro: "Manipulado não pode ter preço no site (RDC 67/2007)." },
            { status: 400 }
          );
        }
        dados.mostrarPreco = corpo.mostrarPreco === true;
      } else if (c === "precoCentavos") {
        const preco = Number(corpo.precoCentavos);
        if (!Number.isInteger(preco) || preco < 0 || (industrializado && preco === 0)) {
          return NextResponse.json({ erro: "Preço inválido." }, { status: 400 });
        }
        dados.precoCentavos = preco;
      } else {
        dados[c] = corpo[c] === true;
      }
    }

    const produto = await db.produto.update({ where: { id: Number(id) }, data: dados });
    const mudancas = chaves
      .map((c) =>
        c === "precoCentavos"
          ? `preço ${formatarPreco(anterior.precoCentavos)} -> ${formatarPreco(produto.precoCentavos)}`
          : c === "aprovado"
            ? produto.aprovado
              ? "publicado"
              : "voltou para aprovação"
            : c === "mostrarPreco"
              ? produto.mostrarPreco
                ? "preço ligado no site"
                : "preço desligado no site"
              : c === "ativo"
                ? produto.ativo
                  ? "de volta ao site"
                  : "escondido do site"
                : `${c}=${dados[c] ? "sim" : "não"}`
      )
      .join(", ");
    await registrarLog(sessao.nome ?? "?", "alterou produto", `"${produto.nome}": ${mudancas}`);
    return NextResponse.json(produto);
  }

  // ---------- Edição completa (formulário) ----------
  const resultado = validarCorpoProduto(corpo);
  if ("erro" in resultado) {
    return NextResponse.json({ erro: resultado.erro }, { status: 400 });
  }

  // "aprovado" não vem do formulário: editar não publica nem despublica.
  // A galeria é regravada inteira, na ordem que veio.
  const produto = await db.produto.update({
    where: { id: Number(id) },
    data: {
      ...resultado.dados,
      fotos: {
        deleteMany: {},
        create: resultado.fotos.map((url, ordem) => ({ url, ordem })),
      },
    },
  });

  // Log com destaque para o que é mais sensível: preço, tipo de venda e fotos
  const detalhes: string[] = [];
  if (anterior.precoCentavos !== produto.precoCentavos) {
    detalhes.push(`preço ${formatarPreco(anterior.precoCentavos)} -> ${formatarPreco(produto.precoCentavos)}`);
  }
  if (anterior.venda !== produto.venda) {
    detalhes.push(`tipo de venda ${anterior.venda.toLowerCase()} -> ${produto.venda.toLowerCase()}`);
  }
  if (anterior.mostrarPreco !== produto.mostrarPreco) {
    detalhes.push(produto.mostrarPreco ? "preço ligado no site" : "preço desligado no site");
  }
  const fotosAntes = anterior.fotos.length || (anterior.fotoUrl ? 1 : 0);
  if (fotosAntes !== resultado.fotos.length || corpo.fotosMudaram === true) {
    detalhes.push(`${resultado.fotos.length} foto(s)`);
  }
  await registrarLog(
    sessao.nome ?? "?",
    "editou produto",
    `"${produto.nome}"${detalhes.length ? `: ${detalhes.join(", ")}` : ""}`
  );

  return NextResponse.json(produto);
}

export async function DELETE(_req: Request, contexto: Contexto) {
  const sessao = await exigirAdminApi();
  if (!sessao) {
    return NextResponse.json(
      { erro: "Apenas o gestor pode apagar produtos." },
      { status: 403 }
    );
  }

  const { id } = await contexto.params;
  const produto = await db.produto.delete({ where: { id: Number(id) } });
  await registrarLog(sessao.nome ?? "?", "apagou produto", `"${produto.nome}"`);
  return NextResponse.json({ ok: true });
}
