// PATCH /api/admin/site — liga e desliga as seções da home, e a ordem delas.
// Corpo: { secoesHome: { categorias: true, reels: false, ... } } (só as
// chaves enviadas mudam; as outras ficam como estão) e/ou
//        { secoesOrdem: ["categorias", "comoFunciona", ...] } (14/10/2026:
// a ordem da página; chaves que faltarem entram no fim).
//        { secoesExtras: [{ id, categoriaId, formato, titulo, ativa }, ...] }
// (26/10/2026: a lista INTEIRA das seções extras, linhas de produtos por
// área criadas no painel; mandar a lista sem uma delas é removê-la).
// Permissão: qualquer usuário logado (gestor ou colaborador).
import { NextResponse } from "next/server";
import { exigirSessaoApi } from "@/lib/sessao";
import { CHAVE_ORDEM, CHAVE_SECOES, gravarConfiguracao, lerConfiguracao } from "@/lib/configuracao";
import { CHAVE_EXTRAS, SECOES_HOME, normalizarExtras, normalizarOrdem, normalizarSecoes } from "@/lib/secoes";
import { registrarLog } from "@/lib/log";

export async function PATCH(req: Request) {
  const sessao = await exigirSessaoApi();
  if (!sessao) {
    return NextResponse.json({ erro: "Não autorizado." }, { status: 401 });
  }

  const corpo = await req.json().catch(() => ({}));
  const enviado = corpo.secoesHome;
  const ordemEnviada = corpo.secoesOrdem;
  const extrasEnviadas = corpo.secoesExtras;
  const temSecoes = enviado && typeof enviado === "object";
  const temOrdem = Array.isArray(ordemEnviada);
  const temExtras = Array.isArray(extrasEnviadas);
  if (!temSecoes && !temOrdem && !temExtras) {
    return NextResponse.json({ erro: "Nada para alterar." }, { status: 400 });
  }

  const atual = normalizarSecoes(await lerConfiguracao<unknown>(CHAVE_SECOES, null));
  const mudancas: string[] = [];
  if (temSecoes) {
    for (const s of SECOES_HOME) {
      const valor = (enviado as Record<string, unknown>)[s.chave];
      if (typeof valor === "boolean" && valor !== atual[s.chave]) {
        atual[s.chave] = valor;
        mudancas.push(`${s.titulo} ${valor ? "ligada" : "desligada"}`);
      }
    }
    if (mudancas.length > 0) await gravarConfiguracao(CHAVE_SECOES, atual);
  }

  // As seções extras: a lista inteira substitui a guardada
  let extras = normalizarExtras(await lerConfiguracao<unknown>(CHAVE_EXTRAS, null));
  if (temExtras) {
    const novas = normalizarExtras(extrasEnviadas);
    if (JSON.stringify(novas) !== JSON.stringify(extras)) {
      const antes = new Set(extras.map((e) => e.id));
      const depois = new Set(novas.map((e) => e.id));
      const criadas = novas.filter((e) => !antes.has(e.id)).length;
      const removidas = extras.filter((e) => !depois.has(e.id)).length;
      extras = novas;
      await gravarConfiguracao(CHAVE_EXTRAS, extras);
      mudancas.push(
        criadas > 0 ? `${criadas} seção(ões) extra(s) criada(s)` : removidas > 0 ? `${removidas} seção(ões) extra(s) removida(s)` : "seções extras"
      );
    }
  }

  let ordem = normalizarOrdem(await lerConfiguracao<unknown>(CHAVE_ORDEM, null), extras);
  if (temOrdem || temExtras) {
    const nova = normalizarOrdem(temOrdem ? ordemEnviada : ordem, extras);
    if (nova.join(",") !== ordem.join(",")) {
      ordem = nova;
      await gravarConfiguracao(CHAVE_ORDEM, ordem);
      if (temOrdem) mudancas.push("ordem das seções");
    }
  }

  if (mudancas.length > 0) await registrarLog(sessao.nome ?? "?", "alterou a home", mudancas.join(", "));
  return NextResponse.json({ secoesHome: atual, secoesOrdem: ordem, secoesExtras: extras });
}
