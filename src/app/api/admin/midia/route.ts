// As mídias do site enviadas pelo painel (14/10/2026): os banners (foto,
// GIF ou vídeo, do computador e do celular) e a foto de cada linha dos
// círculos "Conheça nossas linhas de produtos".
//   POST   /api/admin/midia  multipart: "arquivo" + "alvo"
//          alvo: banner:<chave>:<desktop|celular>   (chaves em lib/banners.ts;
//                                                   "vitrine-<slug>" por área)
//                linha:<slug da categoria>          (só imagem)
//          -> grava o arquivo e guarda a URL na Configuracao; devolve { url, tipo }
//   DELETE /api/admin/midia  JSON: { alvo }  -> tira aquela mídia
// Permissão: qualquer usuário logado (o colaborador cuida das fotos).
//
// A dobra (banner:dobra-1 e dobra-2) substitui as chaves antigas
// heroDesktop/heroCelular: ao gravar ou tirar por aqui, a antiga é apagada
// para não voltar por baixo.
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { exigirSessaoApi } from "@/lib/sessao";
import { salvarImagem } from "@/lib/armazenamento";
import { otimizarImagem } from "@/lib/otimizarImagem";
import { validarMidia } from "@/lib/imagens";
import {
  CHAVE_BANNERS,
  CHAVE_LINHAS,
  apagarConfiguracao,
  chavesDaArte,
  gravarConfiguracao,
  lerConfiguracao,
} from "@/lib/configuracao";
import { chaveBannerValida, definicaoDoBanner, normalizarBanners, type Banners } from "@/lib/banners";
import { registrarLog } from "@/lib/log";

type Alvo = { tipo: "banner"; chave: string; tela: "desktop" | "celular"; nome: string; video: boolean } | { tipo: "linha"; slug: string; nome: string };

async function lerAlvo(valor: unknown): Promise<Alvo | { erro: string }> {
  if (typeof valor !== "string") return { erro: "Diga qual mídia é esta (alvo)." };
  const categorias = await db.categoria.findMany({ select: { nome: true, slug: true } });
  const linha = valor.match(/^linha:([a-z0-9-]+)$/);
  if (linha) {
    const c = categorias.find((x) => x.slug === linha[1]);
    if (!c) return { erro: "Categoria não encontrada." };
    return { tipo: "linha", slug: c.slug, nome: `foto da linha ${c.nome}` };
  }
  const banner = valor.match(/^banner:([a-z0-9-]+):(desktop|celular)$/);
  if (banner) {
    const chave = banner[1];
    const tela = banner[2] as "desktop" | "celular";
    if (!chaveBannerValida(chave, categorias.map((c) => c.slug))) return { erro: "Banner desconhecido." };
    const def = definicaoDoBanner(chave, categorias);
    if (!def) return { erro: "Banner desconhecido." };
    if (tela === "celular" && !def.celular) return { erro: "Este banner não tem versão de celular." };
    return { tipo: "banner", chave, tela, nome: `${def.titulo}, ${tela === "desktop" ? "computador" : "celular"}`, video: def.video };
  }
  return { erro: "Alvo inválido." };
}

/** Na dobra, a chave antiga (heroDesktop...) sai para não voltar por baixo */
async function apagarLegadoDaDobra(chave: string, tela: "desktop" | "celular") {
  const m = chave.match(/^dobra-(\d)$/);
  if (!m) return;
  const chaves = chavesDaArte(Number(m[1]) - 1);
  await apagarConfiguracao(tela === "desktop" ? chaves.desktop : chaves.celular);
}

export async function POST(req: Request) {
  const sessao = await exigirSessaoApi();
  if (!sessao) return NextResponse.json({ erro: "Não autorizado." }, { status: 401 });

  const formulario = await req.formData();
  const alvo = await lerAlvo(formulario.get("alvo"));
  if ("erro" in alvo) return NextResponse.json({ erro: alvo.erro }, { status: 400 });

  const arquivo = formulario.get("arquivo");
  const conferido = validarMidia(arquivo, alvo.tipo === "banner" && alvo.video);
  if ("erro" in conferido) return NextResponse.json({ erro: conferido.erro }, { status: 400 });

  // Foto vira WebP (menor); vídeo e GIF seguem como vieram
  const pronto = conferido.tipo === "imagem" ? await otimizarImagem(arquivo as File, conferido.extensao) : { arquivo: arquivo as File, extensao: conferido.extensao };
  const url = await salvarImagem(pronto.arquivo, pronto.extensao);

  if (alvo.tipo === "linha") {
    const fotos = (await lerConfiguracao<Record<string, string>>(CHAVE_LINHAS, {})) ?? {};
    fotos[alvo.slug] = url;
    await gravarConfiguracao(CHAVE_LINHAS, fotos);
  } else {
    const banners: Banners = normalizarBanners(await lerConfiguracao<unknown>(CHAVE_BANNERS, null));
    const atual = banners[alvo.chave] ?? { desktop: null, celular: null };
    atual[alvo.tela] = { url, tipo: conferido.tipo };
    banners[alvo.chave] = atual;
    await gravarConfiguracao(CHAVE_BANNERS, banners);
    await apagarLegadoDaDobra(alvo.chave, alvo.tela);
  }
  await registrarLog(sessao.nome ?? "?", "trocou a mídia do site", alvo.nome);
  return NextResponse.json({ url, tipo: conferido.tipo }, { status: 201 });
}

export async function DELETE(req: Request) {
  const sessao = await exigirSessaoApi();
  if (!sessao) return NextResponse.json({ erro: "Não autorizado." }, { status: 401 });

  const corpo = await req.json().catch(() => ({}));
  const alvo = await lerAlvo(corpo.alvo);
  if ("erro" in alvo) return NextResponse.json({ erro: alvo.erro }, { status: 400 });

  if (alvo.tipo === "linha") {
    const fotos = (await lerConfiguracao<Record<string, string>>(CHAVE_LINHAS, {})) ?? {};
    delete fotos[alvo.slug];
    await gravarConfiguracao(CHAVE_LINHAS, fotos);
  } else {
    const banners = normalizarBanners(await lerConfiguracao<unknown>(CHAVE_BANNERS, null));
    const atual = banners[alvo.chave];
    if (atual) {
      atual[alvo.tela] = null;
      if (!atual.desktop && !atual.celular) delete banners[alvo.chave];
      else banners[alvo.chave] = atual;
      await gravarConfiguracao(CHAVE_BANNERS, banners);
    }
    await apagarLegadoDaDobra(alvo.chave, alvo.tela);
  }
  await registrarLog(sessao.nome ?? "?", "tirou a mídia do site", alvo.nome);
  return NextResponse.json({ ok: true });
}
