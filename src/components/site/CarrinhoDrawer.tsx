"use client";
// Gaveta "Seu pedido", em duas etapas:
//   1) "pedido" -> a receita ("vou enviar uma receita") e os produtos
//                  que a pessoa pôs no carrinho
//   2) "dados"  -> nome, WhatsApp e como receber
// No final tudo vira uma mensagem pronta no WhatsApp da loja, com o
// código do pedido. A foto da receita a pessoa anexa na própria conversa:
// ela nunca passa pelo site.
//
// Sem preço e sem forma de pagamento (pedido do cliente em 05/10/2026):
// o farmacêutico confere o pedido e combina valor e pagamento na conversa.

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useCarrinho } from "@/lib/carrinho";
import { linkWhatsAppPedido, gerarCodigoPedido } from "@/lib/whatsapp";
import { UNIDADES, ENTREGA_RETIRADA, ENTREGA_DELIVERY } from "@/lib/tipos";
import { IconeMoto } from "./IconeMoto";
import { FotoProduto } from "./FotoProduto";
import { IconeReceita } from "./BotaoEnviarReceita";

type Etapa = "pedido" | "dados";

const ETAPAS: { chave: Etapa; rotulo: string }[] = [
  { chave: "pedido", rotulo: "Seu pedido" },
  { chave: "dados", rotulo: "Seus dados" },
];

export function IconeCarrinho({ tamanho = 24 }: { tamanho?: number }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.8h7.9a2 2 0 0 0 2-1.6L21 8H6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="20.5" r="1.5" fill="currentColor" />
      <circle cx="17" cy="20.5" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function CarrinhoDrawer() {
  const {
    itens,
    totalItens,
    mudarQuantidade,
    remover,
    limpar,
    receita,
    setReceita,
    produtoVisto,
    setProdutoVisto,
    aberto,
    abrirPedido,
    fecharPedido,
  } = useCarrinho();

  const [etapa, setEtapa] = useState<Etapa>("pedido");
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [entrega, setEntrega] = useState("");
  const [unidade, setUnidade] = useState("");
  const [endereco, setEndereco] = useState("");
  const [observacao, setObservacao] = useState("");
  const [codigo, setCodigo] = useState("");
  const [enviado, setEnviado] = useState(false);
  // Guardado no envio, porque limpar() zera a receita logo em seguida
  const [enviouReceita, setEnviouReceita] = useState(false);

  // Fechar sempre volta para a primeira etapa, então a próxima abertura
  // começa do início. Os dados digitados ficam, para não redigitar.
  const fechar = useCallback(() => {
    setEtapa("pedido");
    setEnviado(false);
    fecharPedido();
  }, [fecharPedido]);

  // Esc fecha
  useEffect(() => {
    if (!aberto) return;
    const aoTeclar = (e: KeyboardEvent) => e.key === "Escape" && fechar();
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [aberto, fechar]);

  // O "Enviar receita" flutuante só aparece depois de rolar: na primeira
  // tela a página já tem o mesmo botão, e os dois juntos se repetem
  const [rolou, setRolou] = useState(false);
  useEffect(() => {
    const aoRolar = () => setRolou(window.scrollY > 400);
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  const temProdutos = itens.length > 0;
  const temAlgo = receita || temProdutos;

  // Retirada: precisa da loja. Entrega: precisa do endereço.
  const ehRetirada = entrega === ENTREGA_RETIRADA;
  const local = ehRetirada ? unidade : endereco.trim();
  const entregaResolvida = entrega.length > 0 && local.length > 0;

  const digitosWhats = whatsapp.replace(/\D/g, "");
  const podeEnviar =
    temAlgo && nome.trim().length > 0 && digitosWhats.length >= 10 && entregaResolvida;

  // Trocar de modo zera a escolha do outro, para não enviar os dois
  function escolherEntrega(modo: string) {
    setEntrega(modo);
    if (modo === ENTREGA_RETIRADA) setEndereco("");
    else setUnidade("");
  }

  function irParaDados() {
    setCodigo(gerarCodigoPedido());
    setEtapa("dados");
  }

  // Registra o pedido na base do painel e abre o WhatsApp, sem travar o
  // envio caso o registro falhe. Na vitrine estática (GitHub Pages) não
  // há servidor para registrar: o pedido vai direto para o WhatsApp.
  function enviarPedido() {
    if (!podeEnviar) return;

    if (process.env.NEXT_PUBLIC_DEMO !== "1") fetch("/api/pedidos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: nome.trim(),
        whatsapp: whatsapp.trim(),
        entrega,
        local,
        codigo,
        receita,
        itens: itens.map((i) => ({
          nome: i.nome,
          dosagem: i.dosagem,
          quantidade: i.quantidade,
        })),
      }),
    }).catch(() => {
      /* o pedido segue para o WhatsApp mesmo sem o registro */
    });

    const url = linkWhatsAppPedido(itens, {
      nome: nome.trim(),
      whatsapp: whatsapp.trim(),
      entrega,
      local,
      observacao,
      codigo,
      receita,
      produtoVisto,
    });
    window.open(url, "_blank", "noopener,noreferrer");
    setEnviouReceita(receita);
    setEnviado(true);
    limpar();
  }

  const classeCampo =
    "bg-white border border-fio rounded-2xl px-4 py-3.5 text-base text-grafite placeholder:text-grafite-claro/70 focus:outline-none focus:border-tinta focus:ring-4 focus:ring-tinta/10 transition-shadow";
  const classeRotuloCampo = "font-semibold text-navy text-sm";

  return (
    <>
      {/* Botão flutuante. Com produto no carrinho, mostra quantos itens
          em qualquer tela. Sem produto, vira o "Enviar receita" do celular
          (no computador ele fica na home, na página do produto e na gaveta). */}
      {temProdutos ? (
        <button
          type="button"
          onClick={() => abrirPedido()}
          aria-label={`Ver carrinho, ${totalItens} ${totalItens === 1 ? "item" : "itens"}`}
          className="bg-tinta hover:bg-tinta-escura fixed bottom-6 right-6 z-40 text-white rounded-full h-14 pl-5 pr-6 flex items-center gap-3 shadow-[0_18px_40px_-16px_rgba(28,105,181,0.65)] active:scale-95 transition"
        >
          <span className="relative">
            <IconeCarrinho />
            <span className="absolute -top-2.5 -right-2.5 bg-white text-tinta text-[0.7rem] font-bold rounded-full min-w-5 h-5 px-1 flex items-center justify-center shadow-sm">
              {totalItens}
            </span>
          </span>
          <span className="font-semibold">Ver carrinho</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => abrirPedido({ receita: true })}
          tabIndex={rolou ? 0 : -1}
          aria-hidden={!rolou}
          className={`md:hidden bg-tinta fixed bottom-5 right-5 z-40 text-white rounded-full h-14 pl-5 pr-6 flex items-center gap-2.5 shadow-[0_18px_40px_-16px_rgba(28,105,181,0.65)] active:scale-95 transition duration-300 ${
            rolou ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
          }`}
        >
          <IconeReceita tamanho={22} />
          <span className="font-semibold">Enviar receita</span>
        </button>
      )}

      {/* Gaveta lateral */}
      {aberto && (
        <div
          className="fixed inset-0 z-50 bg-navy/50 backdrop-blur-[2px] flex justify-end md:p-3"
          onClick={fechar}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-pedido"
            className="bg-white w-full max-w-md h-full flex flex-col animar-surgir shadow-[0_30px_80px_-20px_rgba(13,35,64,0.5)] md:rounded-[1.75rem] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ---------- Cabeçalho ---------- */}
            <div className="border-b border-fio text-grafite px-6 pt-5 pb-4 shrink-0">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  {etapa === "dados" && !enviado && (
                    <button
                      type="button"
                      onClick={() => setEtapa("pedido")}
                      aria-label="Voltar"
                      className="shrink-0 w-10 h-10 -ml-2 rounded-full text-cinza hover:text-grafite hover:bg-gelo flex items-center justify-center transition-colors"
                    >
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M19 12H5m0 0 6-6m-6 6 6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  )}
                  <h2 id="titulo-pedido" className="text-[1.35rem] font-semibold tracking-[-0.03em] text-navy truncate">
                    {enviado ? "Tudo certo" : etapa === "pedido" ? "Seu pedido" : "Seus dados"}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={fechar}
                  aria-label="Fechar"
                  className="shrink-0 bg-gelo hover:bg-fio text-grafite rounded-full w-10 h-10 flex items-center justify-center active:scale-90 transition"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              {/* Passos do pedido, em pílulas */}
              {!enviado && temAlgo && (
                <ol className="flex items-center gap-2 mt-4">
                  {ETAPAS.map((e, i) => {
                    const atual = e.chave === etapa;
                    const passou = e.chave === "pedido" && etapa === "dados";
                    return (
                      <li
                        key={e.chave}
                        aria-current={atual ? "step" : undefined}
                        className={`inline-flex items-center gap-2 h-8 pl-1.5 pr-3 rounded-full text-[0.78rem] font-medium transition-colors ${
                          atual ? "bg-navy text-white" : passou ? "bg-gelo text-tinta" : "bg-gelo/60 text-cinza"
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded-full text-[0.68rem] font-semibold flex items-center justify-center ${
                            atual ? "bg-white text-navy" : passou ? "bg-tinta text-white" : "bg-white text-cinza"
                          }`}
                        >
                          {passou ? "✓" : i + 1}
                        </span>
                        {e.rotulo}
                      </li>
                    );
                  })}
                </ol>
              )}

              {/* Resumo: aparece com produto no carrinho */}
              {!enviado && temProdutos && (
                <p className="mt-4 text-cinza text-sm">
                  {receita ? "Receita + " : ""}
                  {totalItens} {totalItens === 1 ? "produto" : "produtos"}
                  {etapa === "dados" && codigo ? ` · ${codigo}` : ""}
                  {" · "}o valor vem pelo WhatsApp
                </p>
              )}
            </div>

            {/* ---------- Confirmação de envio ---------- */}
            {enviado ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-8 gap-4">
                <div className="w-20 h-20 rounded-full bg-gelo text-tinta flex items-center justify-center">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold tracking-[-0.03em] text-navy">Pedido enviado</h3>
                <p className="text-cinza leading-relaxed">
                  Abrimos o WhatsApp com o seu pedido <b className="text-grafite">{codigo}</b>.{" "}
                  {enviouReceita
                    ? "Agora é só anexar a foto da receita na conversa. O farmacêutico confere e passa o valor."
                    : "Envie a mensagem: o farmacêutico confere o pedido e passa o valor, o prazo e a forma de pagamento."}
                </p>
                <button
                  type="button"
                  onClick={fechar}
                  className="botao botao-secundario mt-2"
                >
                  Concluir
                </button>
              </div>
            ) : etapa === "pedido" ? (
              /* ---------- Etapa 1: o pedido ---------- */
              <>
                <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-3">
                  {/* A receita: o pedido do manipulado */}
                  <button
                    type="button"
                    role="switch"
                    aria-checked={receita}
                    onClick={() => setReceita(!receita)}
                    className={`text-left rounded-[1.25rem] border p-4 flex items-start gap-3.5 transition ${
                      receita
                        ? "bg-gelo/60 border-tinta"
                        : "bg-white border-fio hover:border-tinta/40"
                    }`}
                  >
                    <span
                      className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                        receita ? "bg-tinta text-white" : "bg-gelo text-tinta"
                      }`}
                    >
                      <IconeReceita tamanho={22} />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block font-semibold text-navy">Vou enviar uma receita</span>
                      <span className="block text-sm text-cinza leading-snug mt-1">
                        Você anexa a foto da receita na conversa do WhatsApp. O farmacêutico
                        confere e passa o valor.
                      </span>
                    </span>
                    {/* Chave visual do switch */}
                    <span
                      aria-hidden="true"
                      className={`shrink-0 mt-1 w-11 h-6 rounded-full p-0.5 transition-colors ${
                        receita ? "bg-tinta" : "bg-fio"
                      }`}
                    >
                      <span
                        className={`block w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                          receita ? "translate-x-5" : ""
                        }`}
                      />
                    </span>
                  </button>

                  {/* De qual manipulado a pessoa veio */}
                  {receita && produtoVisto && (
                    <div className="flex items-center gap-2 bg-gelo/60 border border-fio rounded-2xl pl-4 pr-1.5 py-1.5">
                      <span className="flex-1 min-w-0 text-sm text-cinza truncate">
                        Você viu: <b className="text-navy font-semibold">{produtoVisto}</b>
                      </span>
                      <button
                        type="button"
                        onClick={() => setProdutoVisto(null)}
                        aria-label="Tirar do pedido"
                        className="shrink-0 w-9 h-9 rounded-full text-grafite-claro hover:text-navy hover:bg-white flex items-center justify-center transition-colors"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                        </svg>
                      </button>
                    </div>
                  )}

                  {/* Produtos do carrinho */}
                  {temProdutos && (
                    <p className="rotulo !text-cinza mt-3 px-1">Produtos</p>
                  )}
                  {itens.map((item, i) => (
                    <div
                      key={`${item.produtoId}-${item.dosagem ?? ""}`}
                      className="animar-surgir bg-white border border-fio rounded-[1.25rem] p-3 flex gap-3.5"
                      style={{ animationDelay: `${Math.min(i, 6) * 60}ms` }}
                    >
                      <div className="shrink-0 w-[4.5rem] rounded-xl bg-gelo/70 overflow-hidden flex items-center justify-center p-1.5 self-stretch">
                        <FotoProduto
                          fotoUrl={item.fotoUrl ?? null}
                          nome={item.nome}
                          className="max-w-full max-h-full !object-contain"
                        />
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="font-medium text-navy leading-snug line-clamp-2">
                              {item.nome}
                            </p>
                            {item.dosagem && (
                              <span className="inline-block mt-1 bg-gelo text-tinta text-[0.7rem] font-semibold px-2.5 py-0.5 rounded-full">
                                {item.dosagem}
                              </span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => remover(item.produtoId, item.dosagem)}
                            aria-label={`Remover ${item.nome}`}
                            className="shrink-0 w-9 h-9 -mr-2 -mt-1.5 rounded-full text-grafite-claro hover:text-navy hover:bg-gelo flex items-center justify-center transition-colors"
                          >
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                              <path
                                d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m3 0-.8 12a2 2 0 0 1-2 1.9H8.8a2 2 0 0 1-2-1.9L6 7"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                              />
                            </svg>
                          </button>
                        </div>

                        <div className="flex items-end mt-auto pt-2.5">
                          <div className="flex items-center border border-fio rounded-full p-0.5">
                            <button
                              type="button"
                              onClick={() => mudarQuantidade(item.produtoId, item.dosagem, -1)}
                              aria-label="Diminuir"
                              className="w-8 h-8 rounded-full text-tinta hover:bg-gelo text-base flex items-center justify-center active:scale-90 transition"
                            >
                              −
                            </button>
                            <span className="text-sm font-semibold text-navy w-7 text-center tabular-nums">
                              {item.quantidade}
                            </span>
                            <button
                              type="button"
                              onClick={() => mudarQuantidade(item.produtoId, item.dosagem, 1)}
                              aria-label="Aumentar"
                              className="w-8 h-8 rounded-full text-tinta hover:bg-gelo text-base flex items-center justify-center active:scale-90 transition"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Nada escolhido ainda */}
                  {!temAlgo && (
                    <p className="text-sm text-cinza text-center leading-relaxed px-4 pt-4">
                      Marque a receita acima para começar, ou{" "}
                      <Link href="/produtos" onClick={fechar} className="text-tinta font-medium hover:underline">
                        veja os produtos
                      </Link>
                      .
                    </p>
                  )}
                </div>

                <div className="border-t border-fio px-5 pt-4 pb-5">
                  {temProdutos && (
                    <p className="text-sm text-navy font-medium mb-1">
                      Produtos ({totalItens} {totalItens === 1 ? "item" : "itens"})
                    </p>
                  )}
                  <p className="text-xs text-cinza mb-4">
                    Na próxima etapa você escolhe se retira na loja ou recebe em casa. O
                    farmacêutico passa o valor pelo WhatsApp.
                  </p>
                  <button
                    type="button"
                    onClick={irParaDados}
                    disabled={!temAlgo}
                    className="botao botao-principal w-full text-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                  >
                    Continuar
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  {temProdutos && (
                    <button
                      type="button"
                      onClick={() => itens.forEach((i) => remover(i.produtoId, i.dosagem))}
                      className="w-full mt-1.5 min-h-11 text-grafite-claro hover:text-navy font-medium text-sm transition-colors"
                    >
                      Tirar todos os produtos
                    </button>
                  )}
                </div>
              </>
            ) : (
              /* ---------- Etapa 2: dados ---------- */
              <>
                <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-5">
                  <label className="flex flex-col gap-2">
                    <span className={classeRotuloCampo}>Seu nome *</span>
                    <input
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      autoFocus
                      autoComplete="name"
                      placeholder="Como podemos te chamar?"
                      className={classeCampo}
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className={classeRotuloCampo}>Seu WhatsApp *</span>
                    <input
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="(24) 99999-9999"
                      className={classeCampo}
                    />
                  </label>

                  {/* Como receber o pedido */}
                  <div className="flex flex-col gap-2">
                    <span className={classeRotuloCampo}>Como você quer receber *</span>
                    <div className="grid grid-cols-2 gap-2.5">
                      {[
                        {
                          modo: ENTREGA_RETIRADA,
                          titulo: "Retirar na loja",
                          apoio: "sem taxa",
                          icone: (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                              <path
                                d="M4 9.5 5.4 5A1.5 1.5 0 0 1 6.8 4h10.4a1.5 1.5 0 0 1 1.4 1L20 9.5M4 9.5h16M4 9.5v9A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5v-9M9.5 13h5"
                                stroke="currentColor"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          ),
                        },
                        {
                          modo: ENTREGA_DELIVERY,
                          titulo: "Receber em casa",
                          apoio: "de moto",
                          icone: <IconeMoto tamanho={24} />,
                        },
                      ].map((opcao) => (
                        <button
                          key={opcao.modo}
                          type="button"
                          onClick={() => escolherEntrega(opcao.modo)}
                          aria-pressed={entrega === opcao.modo}
                          className={`rounded-2xl px-3 py-4 border transition active:scale-95 flex flex-col items-center gap-1.5 text-center ${
                            entrega === opcao.modo
                              ? "bg-navy text-white border-navy"
                              : "bg-white text-navy border-fio hover:border-tinta/40"
                          }`}
                        >
                          {opcao.icone}
                          <span className="text-sm font-medium leading-tight mt-0.5">{opcao.titulo}</span>
                          <span
                            className={`text-[0.7rem] leading-none ${
                              entrega === opcao.modo ? "text-white/65" : "text-cinza"
                            }`}
                          >
                            {opcao.apoio}
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Retirada: escolher em qual das 3 lojas */}
                    {ehRetirada && (
                      <div className="flex flex-col gap-2 mt-1.5">
                        <span className="text-sm text-cinza">Em qual unidade você prefere retirar?</span>
                        {UNIDADES.map((u) => {
                          const marcada = unidade.startsWith(u.bairro);
                          return (
                            <button
                              key={u.bairro}
                              type="button"
                              onClick={() => setUnidade(`${u.bairro}, ${u.endereco}`)}
                              aria-pressed={marcada}
                              className={`text-left rounded-2xl px-4 py-3 border transition active:scale-[0.98] flex items-start gap-3 ${
                                marcada ? "bg-gelo/60 border-tinta" : "bg-white border-fio hover:border-tinta/40"
                              }`}
                            >
                              <span
                                className={`shrink-0 w-4 h-4 rounded-full border-2 mt-0.5 flex items-center justify-center transition-colors ${
                                  marcada ? "border-tinta" : "border-grafite-claro"
                                }`}
                                aria-hidden="true"
                              >
                                {marcada && <span className="w-2 h-2 rounded-full bg-tinta" />}
                              </span>
                              <span className="min-w-0">
                                <span className="block font-semibold text-navy text-sm">{u.bairro}</span>
                                <span className="block text-cinza text-xs leading-snug mt-0.5">
                                  {u.endereco}
                                </span>
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Entrega: endereço, senão a equipe não tem para onde levar */}
                    {entrega === ENTREGA_DELIVERY && (
                      <label className="flex flex-col gap-2 mt-1.5">
                        <span className="text-sm text-cinza">Endereço da entrega</span>
                        <textarea
                          value={endereco}
                          onChange={(e) => setEndereco(e.target.value)}
                          rows={2}
                          autoComplete="street-address"
                          placeholder="Rua, número, complemento e bairro"
                          className={`${classeCampo} resize-y`}
                        />
                        <span className="text-xs text-grafite-claro leading-relaxed">
                          A equipe confirma a taxa e o prazo da entrega pelo WhatsApp.
                        </span>
                      </label>
                    )}
                  </div>

                  <label className="flex flex-col gap-2">
                    <span className={classeRotuloCampo}>
                      Observação <span className="text-cinza font-normal">(opcional)</span>
                    </span>
                    <textarea
                      value={observacao}
                      onChange={(e) => setObservacao(e.target.value)}
                      rows={3}
                      placeholder="Alguma preferência ou informação para a equipe?"
                      className={`${classeCampo} resize-y`}
                    />
                  </label>

                  {/* Resumo */}
                  <div className="flex flex-col gap-2">
                    <span className={classeRotuloCampo}>Resumo</span>
                    {receita && (
                      <div className="bg-gelo/50 border border-fio rounded-2xl p-2.5 flex items-center gap-3">
                        <span className="shrink-0 w-11 h-11 rounded-xl bg-tinta text-white flex items-center justify-center">
                          <IconeReceita tamanho={20} />
                        </span>
                        <span className="flex-1 min-w-0 text-sm text-navy leading-snug">
                          Receita, com a foto no WhatsApp
                          {produtoVisto && (
                            <span className="block text-xs text-cinza truncate">Você viu: {produtoVisto}</span>
                          )}
                        </span>
                        <span className="text-xs text-cinza shrink-0">valor a combinar</span>
                      </div>
                    )}
                    {itens.map((item) => (
                      <div
                        key={`r-${item.produtoId}-${item.dosagem ?? ""}`}
                        className="bg-gelo/50 border border-fio rounded-2xl p-2.5 flex items-center gap-3"
                      >
                        <div className="shrink-0 w-11 h-11 rounded-xl bg-white overflow-hidden flex items-center justify-center p-1">
                          <FotoProduto
                            fotoUrl={item.fotoUrl ?? null}
                            nome={item.nome}
                            className="max-w-full max-h-full !object-contain"
                          />
                        </div>
                        <span className="flex-1 min-w-0 text-sm text-navy truncate">
                          {item.quantidade}× {item.nome}
                          {item.dosagem ? ` (${item.dosagem})` : ""}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-fio px-5 py-5">
                  <button
                    type="button"
                    onClick={enviarPedido}
                    disabled={!podeEnviar}
                    className="botao botao-principal w-full text-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm5.5 14.2c-.2.7-1.3 1.3-1.9 1.4-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.1-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.2-.3.5-.4.7-.4h.5c.2 0 .4 0 .6.4l.9 2.1c.1.2.1.4 0 .6l-.4.6-.5.5c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1.1 2.1 1.4 2.5 1.6.3.1.5.1.6-.1l.8-1c.2-.3.4-.2.7-.1l2.1 1c.3.1.5.2.6.4 0-.1 0 .6-.2 1.3Z" />
                    </svg>
                    Enviar pedido no WhatsApp
                  </button>
                  <p className="text-xs text-cinza text-center mt-3 leading-relaxed">
                    {receita && "Anexe a foto da receita logo depois da mensagem. "}
                    Seus dados (nome e WhatsApp) ficam com a Viver Bem apenas para
                    atendimento e ofertas, conforme a LGPD.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
