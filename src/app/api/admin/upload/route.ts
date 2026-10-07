// POST /api/admin/upload — recebe uma foto de produto (multipart/form-data,
// campo "arquivo") e devolve { url } para guardar no cadastro. O
// formulário chama uma vez por foto da galeria (até 5 por produto).
//
// O destino da imagem (disco local ou nuvem) é decidido em
// src/lib/armazenamento.ts conforme o ambiente.
import { NextResponse } from "next/server";
import { exigirSessaoApi } from "@/lib/sessao";
import { salvarImagem } from "@/lib/armazenamento";
import { validarImagem } from "@/lib/imagens";

export async function POST(req: Request) {
  if (!(await exigirSessaoApi())) {
    return NextResponse.json({ erro: "Não autorizado." }, { status: 401 });
  }

  const formulario = await req.formData();
  const arquivo = formulario.get("arquivo");
  const conferido = validarImagem(arquivo);
  if ("erro" in conferido) {
    return NextResponse.json({ erro: conferido.erro }, { status: 400 });
  }

  const url = await salvarImagem(arquivo as File, conferido.extensao);
  return NextResponse.json({ url }, { status: 201 });
}
