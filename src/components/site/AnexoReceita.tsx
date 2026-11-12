"use client";
// O anexo da receita no carrinho (12/11/2026, "no carrinho, a opção de
// anexar a receita; quando a pessoa anexa e envia para o WhatsApp, a foto
// já cai lá junto com a mensagem; não obrigatório"; e, no mesmo dia, "a
// foto não precisa ficar salva no banco de dados").
//
// A foto (ou o PDF) fica só no aparelho da pessoa: não sobe para o
// servidor nem vai para o banco. O link do WhatsApp (wa.me) só carrega
// texto, então a foto segue por um destes caminhos, no envio:
//   - celular: a tela de compartilhar do próprio aparelho, com a foto e a
//     mensagem do pedido juntas (Web Share com arquivo); a pessoa escolhe
//     o WhatsApp e a conversa da Viver Bem;
//   - computador: a conversa abre com a mensagem e a imagem vai copiada
//     para colar com Ctrl+V (PDF não copia: anexa pelo clipe).
// Anexar é opcional: sem anexo, tudo segue como antes.
import { useEffect, useId, useMemo, useRef, useState } from "react";

/** Até 15 MB: maior que isso o WhatsApp também recusa ou demora demais */
const LIMITE_BYTES = 15 * 1024 * 1024;

/** O aparelho sabe compartilhar este arquivo (o celular, em geral)? */
export function podeCompartilharArquivo(arquivo: File | null): boolean {
  if (!arquivo || typeof navigator === "undefined" || typeof navigator.canShare !== "function") return false;
  try {
    return navigator.canShare({ files: [arquivo] });
  } catch {
    return false;
  }
}

/** Copia a imagem para a área de transferência (o computador cola com
 *  Ctrl+V na conversa). PDF não copia. Precisa ser chamada no clique. */
export async function copiarImagem(arquivo: File): Promise<boolean> {
  if (!arquivo.type.startsWith("image/") || typeof ClipboardItem === "undefined" || !navigator.clipboard?.write) return false;
  // O Chrome só aceita PNG na área de transferência: converte no canvas. A
  // promessa entra direto no ClipboardItem para a cópia valer como gesto.
  const png = (async () => {
    const bitmap = await createImageBitmap(arquivo);
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0);
    bitmap.close();
    return await new Promise<Blob>((ok, falha) => canvas.toBlob((b) => (b ? ok(b) : falha(new Error("png"))), "image/png"));
  })();
  try {
    await navigator.clipboard.write([new ClipboardItem({ "image/png": png })]);
    return true;
  } catch {
    return false;
  }
}

function IconeClipe() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m15.5 7.5-6.4 6.4a1.8 1.8 0 0 0 2.6 2.6l6.4-6.4a3.6 3.6 0 0 0-5.1-5.1l-6.4 6.4a5.4 5.4 0 0 0 7.6 7.6l5.3-5.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function AnexoReceita({ arquivo, aoMudar }: { arquivo: File | null; aoMudar: (arquivo: File | null) => void }) {
  const idCampo = useId();
  const campo = useRef<HTMLInputElement>(null);
  const [erro, setErro] = useState("");

  // A miniatura da foto (PDF mostra o ícone), liberada ao trocar ou tirar
  const previa = useMemo(() => (arquivo && arquivo.type.startsWith("image/") ? URL.createObjectURL(arquivo) : null), [arquivo]);
  useEffect(() => {
    return () => {
      if (previa) URL.revokeObjectURL(previa);
    };
  }, [previa]);

  function escolher(lista: FileList | null) {
    const novo = lista?.[0];
    if (campo.current) campo.current.value = "";
    if (!novo) return;
    const tipoOk = novo.type.startsWith("image/") || novo.type === "application/pdf";
    if (!tipoOk) {
      setErro("Envie uma foto ou um PDF da receita.");
      return;
    }
    if (novo.size > LIMITE_BYTES) {
      setErro("O arquivo passa de 15 MB. Tire outra foto ou mande pela conversa do WhatsApp.");
      return;
    }
    setErro("");
    aoMudar(novo);
  }

  // O tamanho, para a linha do anexo ("1,2 MB")
  const tamanho = arquivo
    ? arquivo.size >= 1024 * 1024
      ? `${(arquivo.size / (1024 * 1024)).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} MB`
      : `${Math.max(1, Math.round(arquivo.size / 1024))} KB`
    : "";

  // 12/11/2026, "deixe mais moderno": o anexo mora dentro do cartão da
  // receita. Vazio, é uma linha tracejada de toque largo, com o clipe num
  // círculo e "opcional" numa pílula; anexado, um cartãozinho branco com a
  // miniatura, o nome, o tamanho e um visto, e as ações Trocar e tirar.
  return (
    <div>
      <input
        ref={campo}
        id={idCampo}
        type="file"
        accept="image/*,application/pdf"
        className="sr-only"
        onChange={(e) => escolher(e.target.files)}
      />
      {arquivo ? (
        <div className="flex items-center gap-2.5 rounded-2xl bg-white p-2 pr-1 ring-1 ring-inset ring-tinta/15 shadow-[0_10px_24px_-20px_rgba(13,35,64,0.6)] animar-surgir">
          {/* A miniatura com o visto verde no canto */}
          <span className="relative shrink-0">
            <span className="flex size-12 items-center justify-center overflow-hidden rounded-xl bg-gelo text-tinta">
              {previa ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previa} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="text-[0.62rem] font-bold tracking-[0.08em]">PDF</span>
              )}
            </span>
            <span aria-hidden="true" className="absolute -bottom-1 -right-1 flex size-[1.1rem] items-center justify-center rounded-full bg-[#1DA851] text-white ring-2 ring-white">
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
                <path d="m5 12.5 4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate whitespace-nowrap text-[0.86rem] font-semibold text-navy">Receita anexada</span>
            <span className="mt-0.5 block truncate text-[0.74rem] text-cinza">
              {arquivo.name} · {tamanho}
            </span>
          </span>
          <label htmlFor={idCampo} className="shrink-0 cursor-pointer rounded-full px-2 py-1.5 text-[0.76rem] font-semibold text-tinta transition-colors hover:bg-gelo">
            Trocar
          </label>
          <button
            type="button"
            onClick={() => {
              setErro("");
              aoMudar(null);
            }}
            aria-label="Tirar o anexo da receita"
            className="flex size-9 shrink-0 items-center justify-center rounded-full text-cinza transition-colors hover:bg-gelo hover:text-navy"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      ) : (
        <label
          htmlFor={idCampo}
          className="group/anexo flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-tinta/35 bg-white/80 p-2 pr-3 transition-colors hover:border-tinta hover:bg-white"
        >
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gelo text-tinta transition-colors duration-300 group-hover/anexo:bg-tinta group-hover/anexo:text-white">
            <IconeClipe />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[0.88rem] font-semibold text-navy">Anexar foto ou PDF</span>
            <span className="block text-[0.74rem] leading-snug text-cinza">Vai junto com o pedido no WhatsApp</span>
          </span>
          <span className="shrink-0 rounded-full bg-gelo px-2 py-0.5 text-[0.64rem] font-semibold uppercase tracking-[0.1em] text-cinza">opcional</span>
        </label>
      )}
      {erro && (
        <p role="alert" className="mt-2 text-[0.78rem] text-carimbo">
          {erro}
        </p>
      )}
    </div>
  );
}
