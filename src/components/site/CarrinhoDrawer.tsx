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
//
// Desenho (06/10/2026, "mais clean e fácil para o cliente"): cabeçalho
// enxuto com "passo 1 de 2" e dois traços de progresso em ouro; uma só
// linha de resumo, no rodapé; "Limpar" discreto ao lado do título da lista;
// na etapa 2 os dados em dois blocos, e Observação e Resumo em sanfonas
// fechadas, para a tela caber no celular sem rolar muito.

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCarrinho } from "@/lib/carrinho";
import { linkWhatsAppPedido, gerarCodigoPedido } from "@/lib/whatsapp";
import { UNIDADES, ENTREGA_RETIRADA, ENTREGA_DELIVERY } from "@/lib/tipos";
import { IconeMoto } from "./IconeMoto";
import { FotoProduto } from "./FotoProduto";
import { IconeReceita } from "./BotaoEnviarReceita";

type Etapa = "pedido" | "dados";

// O que acontece depois de marcar a receita, em três passos curtos
const PASSOS_RECEITA = ["Seus dados", "Mensagem pronta", "Foto na conversa"];

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

function IconeSeta({ direcao = "direita", tamanho = 20 }: { direcao?: "direita" | "esquerda"; tamanho?: number }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={direcao === "direita" ? "M5 12h14m0 0-6-6m6 6-6 6" : "M19 12H5m0 0 6-6m-6 6 6 6"}
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconeFechar() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

function IconeChevron() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="shrink-0 text-ouro transition-transform group-open:rotate-180"
    >
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconeWhatsApp() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm5.5 14.2c-.2.7-1.3 1.3-1.9 1.4-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.1-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.2-.3.5-.4.7-.4h.5c.2 0 .4 0 .6.4l.9 2.1c.1.2.1.4 0 .6l-.4.6-.5.5c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1.1 2.1 1.4 2.5 1.6.3.1.5.1.6-.1l.8-1c.2-.3.4-.2.7-.1l2.1 1c.3.1.5.2.6.4 0-.1 0 .6-.2 1.3Z" />
    </svg>
  );
}

// Botão redondo do cabeçalho da gaveta (voltar, fechar)
const classeBotaoCabecalho =
  "shrink-0 w-10 h-10 rounded-full bg-gelo text-navy hover:bg-fio flex items-center justify-center transition active:scale-90";

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

  // Esc fecha; Tab fica dentro da gaveta enquanto ela está aberta
  const dialogoRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!aberto) return;
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        fechar();
        return;
      }
      if (e.key !== "Tab" || !dialogoRef.current) return;
      const focaveis = dialogoRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), summary, [tabindex]:not([tabindex="-1"])'
      );
      if (focaveis.length === 0) return;
      const primeiro = focaveis[0];
      const ultimo = focaveis[focaveis.length - 1];
      if (e.shiftKey && (document.activeElement === primeiro || document.activeElement === dialogoRef.current)) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primeiro.focus();
      }
    };
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [aberto, fechar]);

  // Ao abrir: trava a rolagem da página e leva o foco para a gaveta; ao
  // fechar, devolve o foco para quem abriu
  useEffect(() => {
    if (!aberto) return;
    const focoAnterior = document.activeElement as HTMLElement | null;
    const rolagemAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const foco = window.setTimeout(() => dialogoRef.current?.focus(), 50);
    return () => {
      window.clearTimeout(foco);
      document.body.style.overflow = rolagemAnterior;
      focoAnterior?.focus?.();
    };
  }, [aberto]);

  // O "Enviar receita" flutuante só aparece depois de rolar: na primeira
  // tela a página já tem o mesmo botão, e os dois juntos se repetem
  const [rolou, setRolou] = useState(false);
  useEffect(() => {
    const aoRolar = () => setRolou(window.scrollY > 400);
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  // ... e some enquanto um botão de receita da própria página está na tela
  // (data-receita-cta), para não cobri-lo. Reconsulta a cada navegação.
  const pathname = usePathname();
  const [ctaVisivel, setCtaVisivel] = useState(false);
  useEffect(() => {
    const alvos = document.querySelectorAll("[data-receita-cta]");
    if (alvos.length === 0 || typeof IntersectionObserver === "undefined") return;
    const naTela = new Set<Element>();
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (e.isIntersecting) naTela.add(e.target);
          else naTela.delete(e.target);
        }
        setCtaVisivel(naTela.size > 0);
      },
      { rootMargin: "0px 0px -72px 0px" }
    );
    alvos.forEach((a) => observador.observe(a));
    return () => observador.disconnect();
  }, [pathname]);
  const mostrarReceitaFlutuante = rolou && !ctaVisivel;

  const temProdutos = itens.length > 0;
  const temAlgo = receita || temProdutos;

  // Retirada: precisa da loja. Entrega: precisa do endereço.
  const ehRetirada = entrega === ENTREGA_RETIRADA;
  const local = ehRetirada ? unidade : endereco.trim();
  const entregaResolvida = entrega.length > 0 && local.length > 0;

  const digitosWhats = whatsapp.replace(/\D/g, "");
  const podeEnviar =
    temAlgo && nome.trim().length > 0 && digitosWhats.length >= 10 && entregaResolvida;

  // Uma linha só para dizer o que vai no pedido
  const resumoCurto = [
    receita ? "Receita" : null,
    temProdutos ? `${totalItens} ${totalItens === 1 ? "produto" : "produtos"}` : null,
  ]
    .filter(Boolean)
    .join(" + ");

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

  const classeCampo = "campo";
  const classeRotuloCampo = "font-semibold text-navy text-sm";

  const titulo = enviado ? "Tudo certo" : etapa === "pedido" ? "Seu pedido" : "Seus dados";

  return (
    <>
      {/* Botão flutuante. Com produto no carrinho, mostra quantos itens
          em qualquer tela (no celular só o círculo com o contador: o texto
          cobria os botões das seções). Sem produto, vira o "Enviar receita"
          do celular (no computador ele fica na home, na página do produto e
          na gaveta). */}
      {temProdutos ? (
        <button
          type="button"
          onClick={() => abrirPedido()}
          aria-label={`Ver carrinho, ${totalItens} ${totalItens === 1 ? "item" : "itens"}`}
          className="bg-navy hover:bg-tinta fixed bottom-5 right-5 md:bottom-6 md:right-6 z-40 text-white rounded-full h-14 w-14 md:w-auto md:pl-5 md:pr-6 flex items-center justify-center gap-3 shadow-[0_18px_40px_-16px_rgba(13,35,64,0.65)] active:scale-95 transition"
        >
          <span className="relative text-ouro-claro">
            <IconeCarrinho />
            <span className="absolute -top-2.5 -right-2.5 bg-[image:var(--ouro-degrade)] text-navy text-[0.7rem] font-bold rounded-full min-w-5 h-5 px-1 flex items-center justify-center shadow-sm">
              {totalItens}
            </span>
          </span>
          <span className="hidden md:inline font-semibold">Ver carrinho</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => abrirPedido({ receita: true })}
          tabIndex={mostrarReceitaFlutuante ? 0 : -1}
          aria-hidden={!mostrarReceitaFlutuante}
          className={`md:hidden bg-tinta fixed bottom-5 right-5 z-40 text-white rounded-full h-14 pl-5 pr-6 flex items-center gap-2.5 shadow-[0_18px_40px_-16px_rgba(28,105,181,0.65)] active:scale-95 transition duration-300 ${
            mostrarReceitaFlutuante ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
          }`}
        >
          <IconeReceita tamanho={22} />
          <span className="font-semibold">Enviar receita</span>
        </button>
      )}

      {/* Gaveta lateral */}
      {aberto && (
        <div
          className="fixed inset-0 z-50 bg-navy/50 backdrop-blur-[2px] flex items-end md:items-stretch md:justify-end md:p-3"
          onClick={fechar}
        >
          {/* No celular é uma folha que sobe de baixo, com a alça no topo;
              no computador, o painel lateral arredondado */}
          <div
            ref={dialogoRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-pedido"
            className="outline-none bg-white w-full h-[92dvh] md:h-full md:max-w-md flex flex-col animar-subir md:animar-surgir shadow-[0_-30px_80px_-20px_rgba(13,35,64,0.5)] md:shadow-[0_30px_80px_-20px_rgba(13,35,64,0.5)] rounded-t-[1.75rem] md:rounded-[1.75rem] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <span aria-hidden="true" className="md:hidden mx-auto mt-2.5 h-1.5 w-10 rounded-full bg-fio" />

            {/* ---------- Cabeçalho: passo, título e os dois traços de progresso ---------- */}
            <div className="shrink-0 px-5 pt-3 md:pt-5 pb-4 border-b border-fio">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="rotulo !text-cinza">
                    {enviado ? "pedido enviado" : `passo ${etapa === "pedido" ? "1" : "2"} de 2`}
                  </p>
                  <h2 id="titulo-pedido" className="mt-1 text-[1.45rem] font-semibold tracking-[-0.03em] text-navy leading-tight">
                    {titulo}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  {etapa === "dados" && !enviado && (
                    <button type="button" onClick={() => setEtapa("pedido")} aria-label="Voltar" className={classeBotaoCabecalho}>
                      <IconeSeta direcao="esquerda" />
                    </button>
                  )}
                  <button type="button" onClick={fechar} aria-label="Fechar" className={classeBotaoCabecalho}>
                    <IconeFechar />
                  </button>
                </div>
              </div>

              {!enviado && (
                <div className="mt-4 flex gap-1.5" aria-hidden="true">
                  <span className="h-1 flex-1 rounded-full bg-[image:var(--ouro-degrade)]" />
                  <span
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      etapa === "dados" ? "bg-[image:var(--ouro-degrade)]" : "bg-fio"
                    }`}
                  />
                </div>
              )}
            </div>

            {/* ---------- Confirmação de envio ---------- */}
            {enviado ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-8 gap-4">
                <div className="w-20 h-20 rounded-full bg-[image:var(--ouro-degrade)] text-navy flex items-center justify-center shadow-[0_18px_40px_-20px_rgba(179,144,79,0.8)]">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold tracking-[-0.03em] text-navy">Pedido enviado</h3>
                <p className="text-cinza leading-relaxed">
                  Abrimos o WhatsApp com o seu pedido <b className="text-navy whitespace-nowrap">{codigo}</b>.{" "}
                  {enviouReceita
                    ? "Agora é só anexar a foto da receita na conversa. O farmacêutico confere e passa o valor."
                    : "Envie a mensagem: o farmacêutico confere o pedido e passa o valor, o prazo e a forma de pagamento."}
                </p>
                <button type="button" onClick={fechar} className="botao botao-secundario mt-2">
                  Concluir
                </button>
              </div>
            ) : etapa === "pedido" ? (
              /* ---------- Etapa 1: o pedido ---------- */
              <>
                <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
                  {/* A receita: o pedido do manipulado. Ligada, o cartão vira
                      azul-noite com o ouro e mostra os três passos seguintes */}
                  <button
                    type="button"
                    role="switch"
                    aria-checked={receita}
                    onClick={() => setReceita(!receita)}
                    className={`relative overflow-hidden text-left rounded-2xl p-4 flex flex-col gap-4 transition ${
                      receita
                        ? "banner-noite em-noite text-white shadow-[0_20px_40px_-24px_rgba(13,35,64,0.6)]"
                        : "bg-white border border-fio hover:border-tinta/40"
                    }`}
                  >
                    {receita && <span aria-hidden="true" className="malha-banner" />}
                    <span className="relative flex items-center gap-3.5 w-full">
                      <span
                        className={`shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-colors ${
                          receita ? "bg-[image:var(--ouro-degrade)] text-navy" : "bg-gelo text-tinta"
                        }`}
                      >
                        <IconeReceita tamanho={22} />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className={`block font-semibold ${receita ? "text-white" : "text-navy"}`}>
                          Vou enviar uma receita
                        </span>
                        <span className={`block text-sm leading-snug mt-0.5 ${receita ? "text-white/70" : "text-cinza"}`}>
                          {receita ? "A foto vai pela conversa do WhatsApp" : "Tire uma foto da prescrição e envie pelo WhatsApp"}
                        </span>
                      </span>
                      {/* Chave visual do switch: ouro quando ligada */}
                      <span
                        aria-hidden="true"
                        className={`shrink-0 w-11 h-6 rounded-full p-0.5 transition-colors ${
                          receita ? "bg-[image:var(--ouro-degrade)]" : "bg-fio"
                        }`}
                      >
                        <span
                          className={`block w-5 h-5 rounded-full shadow-sm transition-transform ${
                            receita ? "bg-navy translate-x-5" : "bg-white"
                          }`}
                        />
                      </span>
                    </span>
                    {receita && (
                      <span className="relative grid grid-cols-3 gap-2 w-full">
                        {PASSOS_RECEITA.map((passo, i) => (
                          <span
                            key={passo}
                            className="rounded-xl bg-white/10 ring-1 ring-inset ring-white/15 px-2.5 py-2 flex flex-col gap-1"
                          >
                            <span className="numero-tinta text-[0.95rem]">{`0${i + 1}`}</span>
                            <span className="text-[0.72rem] leading-tight text-white/85">{passo}</span>
                          </span>
                        ))}
                      </span>
                    )}
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
                        className="shrink-0 w-9 h-9 rounded-full text-cinza hover:text-navy hover:bg-white flex items-center justify-center transition-colors"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                        </svg>
                      </button>
                    </div>
                  )}

                  {/* Só a receita marcada: um convite discreto para juntar produtos */}
                  {receita && !temProdutos && (
                    <p className="px-1 text-sm text-cinza leading-relaxed">
                      Quer juntar algum produto de pronta entrega?{" "}
                      <Link href="/produtos" onClick={fechar} className="font-semibold text-tinta whitespace-nowrap underline-offset-4 hover:underline">
                        Ver produtos
                      </Link>
                    </p>
                  )}

                  {/* Produtos do carrinho */}
                  {temProdutos && (
                    <div className="mt-2 flex items-center justify-between px-1">
                      <p className="rotulo !text-cinza">Produtos</p>
                      <button
                        type="button"
                        onClick={() => itens.forEach((i) => remover(i.produtoId, i.dosagem))}
                        className="min-h-8 px-2 -mr-2 text-xs font-medium text-cinza hover:text-navy transition-colors"
                      >
                        Limpar
                      </button>
                    </div>
                  )}
                  {itens.map((item, i) => (
                    <div
                      key={`${item.produtoId}-${item.dosagem ?? ""}`}
                      className="animar-surgir bg-white border border-fio rounded-2xl p-3 flex gap-3"
                      style={{ animationDelay: `${Math.min(i, 6) * 60}ms` }}
                    >
                      <div className="shrink-0 w-16 h-16 rounded-xl bg-gelo/70 flex items-center justify-center p-1.5">
                        <FotoProduto
                          fotoUrl={item.fotoUrl ?? null}
                          nome={item.nome}
                          className="max-w-full max-h-full !object-contain"
                        />
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-medium text-navy leading-snug line-clamp-2 text-[0.95rem]">{item.nome}</p>
                          <button
                            type="button"
                            onClick={() => remover(item.produtoId, item.dosagem)}
                            aria-label={`Remover ${item.nome}`}
                            className="shrink-0 w-8 h-8 -mr-1 -mt-1 rounded-full text-cinza hover:text-navy hover:bg-gelo flex items-center justify-center transition-colors"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                              <path
                                d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m3 0-.8 12a2 2 0 0 1-2 1.9H8.8a2 2 0 0 1-2-1.9L6 7"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                              />
                            </svg>
                          </button>
                        </div>

                        <div className="mt-auto pt-2 flex items-center justify-between gap-2">
                          {item.dosagem ? (
                            <span className="inline-block bg-gelo text-tinta text-[0.7rem] font-semibold px-2.5 py-1 rounded-full">
                              {item.dosagem}
                            </span>
                          ) : (
                            <span />
                          )}
                          <div className="flex items-center bg-gelo/70 rounded-full p-0.5 gap-0.5">
                            <button
                              type="button"
                              onClick={() => mudarQuantidade(item.produtoId, item.dosagem, -1)}
                              aria-label="Diminuir"
                              className="w-8 h-8 rounded-full bg-white text-navy shadow-sm text-base flex items-center justify-center active:scale-90 transition"
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
                              className="w-8 h-8 rounded-full bg-navy text-white text-base flex items-center justify-center active:scale-90 transition"
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
                    <div className="mt-2 rounded-2xl border border-dashed border-fio px-5 py-7 text-center">
                      <span className="mx-auto w-12 h-12 rounded-full bg-gelo text-tinta flex items-center justify-center">
                        <IconeCarrinho tamanho={22} />
                      </span>
                      <p className="mt-3 font-semibold text-navy">Seu pedido está vazio</p>
                      <p className="mt-1 text-sm text-cinza leading-relaxed">
                        Marque a receita acima ou escolha produtos no catálogo.
                      </p>
                      <Link
                        href="/produtos"
                        onClick={fechar}
                        className="mt-4 inline-flex items-center gap-2 h-10 px-4 rounded-full border border-fio text-navy text-sm font-medium hover:border-navy/40 transition-colors"
                      >
                        Ver produtos
                        <IconeSeta tamanho={15} />
                      </Link>
                    </div>
                  )}
                </div>

                <div className="shrink-0 border-t border-fio bg-white px-5 pt-4 pb-5 md:pb-6">
                  {temAlgo && (
                    <div className="flex items-center justify-between gap-3 text-sm mb-3">
                      <span className="font-medium text-navy">{resumoCurto}</span>
                      <span className="text-cinza">valor pelo WhatsApp</span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={irParaDados}
                    disabled={!temAlgo}
                    className="botao botao-principal w-full disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                  >
                    Continuar
                    <IconeSeta />
                  </button>
                  {!temAlgo && (
                    <p className="text-xs text-cinza text-center mt-3">
                      Marque a receita ou adicione um produto para continuar.
                    </p>
                  )}
                </div>
              </>
            ) : (
              /* ---------- Etapa 2: dados ---------- */
              <>
                <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-6">
                  {/* Quem recebe */}
                  <div className="flex flex-col gap-4">
                    <label className="flex flex-col gap-2">
                      <span className={classeRotuloCampo}>Seu nome *</span>
                      <input
                        type="text"
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
                        type="tel"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        inputMode="tel"
                        autoComplete="tel"
                        placeholder="(24) 99999-9999"
                        className={classeCampo}
                      />
                    </label>
                  </div>

                  {/* Como receber o pedido */}
                  <div className="flex flex-col gap-3">
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
                          <span className={`text-[0.7rem] leading-none ${entrega === opcao.modo ? "text-white/65" : "text-cinza"}`}>
                            {opcao.apoio}
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Retirada: escolher em qual das 3 lojas */}
                    {ehRetirada && (
                      <div className="flex flex-col gap-2 mt-1">
                        <span className="text-sm text-cinza">Em qual loja você prefere retirar?</span>
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
                                  marcada ? "border-tinta" : "border-cinza"
                                }`}
                                aria-hidden="true"
                              >
                                {marcada && <span className="w-2 h-2 rounded-full bg-tinta" />}
                              </span>
                              <span className="min-w-0">
                                <span className="block font-semibold text-navy text-sm">{u.bairro}</span>
                                <span className="block text-cinza text-xs leading-snug mt-0.5">{u.endereco}</span>
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Entrega: endereço, senão a equipe não tem para onde levar */}
                    {entrega === ENTREGA_DELIVERY && (
                      <label className="flex flex-col gap-2 mt-1">
                        <span className="text-sm text-cinza">Endereço da entrega *</span>
                        <textarea
                          value={endereco}
                          onChange={(e) => setEndereco(e.target.value)}
                          rows={2}
                          autoComplete="street-address"
                          placeholder="Rua, número, complemento e bairro"
                          className={`${classeCampo} resize-y`}
                        />
                        <span className="text-xs text-cinza leading-relaxed">
                          A equipe confirma a taxa e o prazo da entrega pelo WhatsApp.
                        </span>
                      </label>
                    )}
                  </div>

                  {/* Observação: fechada por padrão, para não alongar a tela */}
                  <details className="group rounded-2xl border border-fio bg-white">
                    <summary className="flex items-center justify-between gap-3 min-h-12 px-4 cursor-pointer list-none marker:content-[''] text-sm font-semibold text-navy">
                      <span>
                        Observação <span className="text-cinza font-normal">(opcional)</span>
                      </span>
                      <IconeChevron />
                    </summary>
                    <div className="px-4 pb-4">
                      <textarea
                        value={observacao}
                        onChange={(e) => setObservacao(e.target.value)}
                        rows={3}
                        aria-label="Observação"
                        placeholder="Alguma preferência ou informação para a equipe?"
                        className={`${classeCampo} resize-y`}
                      />
                    </div>
                  </details>

                  {/* Resumo do pedido, fechado por padrão */}
                  <details className="group rounded-2xl border border-fio bg-white">
                    <summary className="flex items-center justify-between gap-3 min-h-12 px-4 cursor-pointer list-none marker:content-[''] text-sm font-semibold text-navy">
                      <span>
                        Resumo do pedido <span className="text-cinza font-normal">· {resumoCurto}</span>
                      </span>
                      <IconeChevron />
                    </summary>
                    <ul className="px-4 pb-4 flex flex-col gap-2">
                      {receita && (
                        <li className="flex items-center gap-3 text-sm">
                          <span className="shrink-0 w-9 h-9 rounded-lg bg-tinta text-white flex items-center justify-center">
                            <IconeReceita tamanho={18} />
                          </span>
                          <span className="flex-1 min-w-0 text-navy leading-snug">
                            Receita, com a foto no WhatsApp
                            {produtoVisto && <span className="block text-xs text-cinza truncate">Você viu: {produtoVisto}</span>}
                          </span>
                        </li>
                      )}
                      {itens.map((item) => (
                        <li key={`r-${item.produtoId}-${item.dosagem ?? ""}`} className="flex items-center gap-3 text-sm">
                          <span className="shrink-0 w-9 h-9 rounded-lg bg-gelo flex items-center justify-center p-1">
                            <FotoProduto fotoUrl={item.fotoUrl ?? null} nome={item.nome} className="max-w-full max-h-full !object-contain" />
                          </span>
                          <span className="flex-1 min-w-0 text-navy truncate">
                            {item.quantidade}× {item.nome}
                            {item.dosagem ? ` (${item.dosagem})` : ""}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </details>
                </div>

                <div className="shrink-0 border-t border-fio bg-white px-5 pt-4 pb-5 md:pb-6">
                  <button
                    type="button"
                    onClick={enviarPedido}
                    disabled={!podeEnviar}
                    className="botao botao-principal w-full disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                  >
                    <IconeWhatsApp />
                    Enviar pedido no WhatsApp
                  </button>
                  <p className="text-xs text-cinza text-center mt-3 leading-relaxed" aria-live="polite">
                    {!podeEnviar ? (
                      "Preencha o nome, o WhatsApp e como quer receber para enviar."
                    ) : (
                      <>
                        {`${receita ? "Anexe a foto da receita logo depois da mensagem. " : ""}Pedido `}
                        <span className="whitespace-nowrap">{codigo}</span>
                        {" · seus dados ficam só com a Viver Bem, conforme a LGPD."}
                      </>
                    )}
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
