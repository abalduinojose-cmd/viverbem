// POST /api/admin/upload — recebe uma foto de produto (multipart/form-data,
// campo "arquivo") e devolve { url } para guardar no cadastro. O
// formulário chama uma vez por foto da galeria (até 5 por produto).
//
// O destino da imagem (disco local ou nuvem) é decidido em
// src/lib/armazenamento.ts conforme o ambiente.
import { NextResponse } from "next/server";
import { exigirSessaoApi } from "@/lib/sessao";
import { salvarImagem } from "@/lib/armazenamento";
import { otimizarImagem } from "@/lib/otimizarImagem";
import { validarMidia } from "@/lib/imagens";

export async function POST(req: Request) {
  if (!(await exigirSessaoApi())) {
    return NextResponse.json({ erro: "Não autorizado." }, { status: 401 });
  }

  const formulario = await req.formData();
  const arquivo = formulario.get("arquivo");
  // Foto ou vídeo (MP4/WEBM até 40 MB) da galeria do produto
  const conferido = validarMidia(arquivo, true);
  if ("erro" in conferido) {
    return NextResponse.json({ erro: conferido.erro }, { status: 400 });
  }

  // Foto vira WebP (menor); vídeo e GIF seguem como vieram
  const pronto = conferido.tipo === "imagem" ? await otimizarImagem(arquivo as File, conferido.extensao) : { arquivo: arquivo as File, extensao: conferido.extensao };
  const url = await salvarImagem(pronto.arquivo, pronto.extensao);
  return NextResponse.json({ url, tipo: conferido.tipo }, { status: 201 });
}
