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
//
// 10/10/2026 ("deixe o carrinho mais moderno", com prints; "português
// simples, voltado para alta conversão"): as duas barras de progresso
// viraram etapas com nome (1 Pedido, 2 Dados, o visto de ouro na feita);
// o cartão da receita em repouso ficou em gelo, sem fio, e ligado mostra
// os três passos numa linha com setas, sem caixas; o estado vazio perdeu
// o tracejado e o "Ver produtos" virou a ação em navy; as opções de
// entrega ganham um selo de marcado; o botão final é o verde do WhatsApp
// (o mesmo do "Fale com a gente"); e a dica embaixo diz o que falta
// preencher, em vez de repetir a lista inteira. Lógica, campos e a
// mensagem do WhatsApp não mudaram.

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCarrinho } from "@/lib/carrinho";
import { linkWhatsAppPedido, gerarCodigoPedido } from "@/lib/whatsapp";
import { UNIDADES, ENTREGA_RETIRADA, ENTREGA_DELIVERY } from "@/lib/tipos";
import { IconeMoto } from "./IconeMoto";
import { FotoProduto } from "./FotoProduto";
import { IconeReceita } from "./BotaoEnviarReceita";
import { Chevron, IconeCarrinho, IconeFeito, IconeWhatsApp } from "./icones";

type Etapa = "pedido" | "dados";

// As duas etapas, com nome, no cabeçalho da gaveta
const ETAPAS: { id: Etapa; rotulo: string }[] = [
  { id: "pedido", rotulo: "Pedido" },
  { id: "dados", rotulo: "Dados" },
];

// O que acontece depois de marcar a receita, em três passos curtos
const PASSOS_RECEITA = ["Seus dados", "Mensagem pronta", "Foto na conversa"];

// "a, b e c", para a dica do que falta preencher
function listar(partes: string[]) {
  if (partes.length <= 1) return partes.join("");
  return `${partes.slice(0, -1).join(", ")} e ${partes[partes.length - 1]}`;
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

  // O que ainda falta na etapa 2, para a dica embaixo do botão
  const faltando = [
    nome.trim().length === 0 ? "o nome" : null,
    digitosWhats.length < 10 ? "o WhatsApp" : null,
    entrega.length === 0
      ? "como receber"
      : ehRetirada && unidade.length === 0
        ? "a loja"
        : !ehRetirada && endereco.trim().length === 0
          ? "o endereço"
          : null,
  ].filter((p): p is string => p !== null);

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
      {/* Botão flutuante. Com produto no carrinho: no celular um círculo navy
          com a sacola e o selo de ouro da contagem no canto (que pulsa quando
          o número muda); no computador a pílula "Ver pedido" com o selo
          (07/10/2026, "melhore o carrinho"). Some enquanto a gaveta está
          aberta. Sem produto, vira o "Enviar receita" do celular (no
          computador ele fica na home, na página do produto e na gaveta). */}
      {temProdutos ? (
        <button
          type="button"
          onClick={() => abrirPedido()}
          aria-label={`Ver carrinho, ${totalItens} ${totalItens === 1 ? "item" : "itens"}`}
          className={`fixed bottom-5 right-5 md:bottom-6 md:right-6 z-40 flex items-center justify-center bg-navy text-white rounded-full w-14 h-14 md:w-auto md:h-12 md:pl-5 md:pr-2 md:gap-3 shadow-[0_16px_34px_-16px_rgba(54,52,107,0.65)] hover:bg-tinta active:scale-95 transition duration-300 ${
            aberto ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <IconeCarrinho tamanho={22} />
          <span className="hidden md:inline text-[0.95rem] font-semibold">Ver pedido</span>
          {/* A key troca a cada mudança: o selo remonta e pulsa */}
          <span
            key={totalItens}
            className="animar-pulso absolute -top-1 -right-1 md:static min-w-6 h-6 px-1.5 md:min-w-8 md:h-8 md:px-2 rounded-full bg-ouro-claro text-navy text-[0.78rem] md:text-[0.8rem] font-semibold tabular-nums flex items-center justify-center ring-2 ring-white md:ring-0"
          >
            {totalItens}
          </span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => abrirPedido({ receita: true })}
          tabIndex={mostrarReceitaFlutuante ? 0 : -1}
          aria-hidden={!mostrarReceitaFlutuante}
          className={`md:hidden bg-navy fixed bottom-5 right-5 z-40 text-white rounded-full h-12 pl-4 pr-5 flex items-center gap-2.5 shadow-[0_14px_30px_-16px_rgba(54,52,107,0.6)] active:scale-95 transition duration-300 ${
            mostrarReceitaFlutuante ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
          }`}
        >
          <IconeReceita tamanho={20} />
          <span className="text-[0.95rem] font-semibold">Enviar receita</span>
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
            className="outline-none bg-white w-full h-[92dvh] md:h-full md:max-w-md flex flex-col animar-subir md:animar-surgir shadow-[0_-30px_80px_-20px_rgba(54,52,107,0.5)] md:shadow-[0_30px_80px_-20px_rgba(54,52,107,0.5)] rounded-t-[1.75rem] md:rounded-[1.75rem] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <span aria-hidden="true" className="md:hidden mx-auto mt-2.5 h-1.5 w-10 rounded-full bg-fio" />

            {/* ---------- Cabeçalho: título e as duas etapas com nome ---------- */}
            <div className="shrink-0 px-5 pt-3 md:pt-5 pb-4 border-b border-fio">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  {enviado && <p className="rotulo !text-cinza">pedido enviado</p>}
                  <h2 id="titulo-pedido" className="mt-1 text-[1.45rem] font-semibold tracking-[-0.03em] text-navy leading-tight">
                    {!enviado && <span className="sr-only">Passo {etapa === "pedido" ? "1" : "2"} de 2: </span>}
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

              {/* As etapas: a atual em navy, a feita com o visto em ouro, a
                  próxima em contorno; o fio entre elas acende em ouro */}
              {!enviado && (
                <ol className="mt-4 flex items-center gap-2.5" aria-label="Etapas do pedido">
                  {ETAPAS.map((e, i) => {
                    const atual = etapa === e.id;
                    const feita = i === 0 && etapa === "dados";
                    return (
                      <Fragment key={e.id}>
                        {i > 0 && (
                          <li
                            aria-hidden="true"
                            className={`h-px flex-1 rounded-full transition-colors ${feita ? "bg-[image:var(--ouro-degrade)]" : "bg-fio"}`}
                          />
                        )}
                        <li
                          aria-current={atual ? "step" : undefined}
                          className={`flex items-center gap-2 text-[0.78rem] font-semibold transition-colors ${
                            atual || feita ? "text-navy" : "text-cinza"
                          }`}
                        >
                          <span
                            className={`flex size-6 items-center justify-center rounded-full text-[0.68rem] tabular-nums transition-colors ${
                              atual
                                ? "bg-navy text-white"
                                : feita
                                  ? "bg-[image:var(--ouro-degrade)] text-navy"
                                  : "border border-fio text-cinza"
                            }`}
                          >
                            {feita ? <IconeFeito tamanho={12} /> : i + 1}
                          </span>
                          {e.rotulo}
                        </li>
                      </Fragment>
                    );
                  })}
                </ol>
              )}
            </div>

            {/* ---------- Confirmação de envio ---------- */}
            {enviado ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-8 gap-4">
                <div className="w-20 h-20 rounded-full bg-[image:var(--ouro-degrade)] text-navy flex items-center justify-center shadow-[0_18px_40px_-20px_rgba(201,165,107,0.8)]">
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
                    className={`relative overflow-hidden text-left rounded-[1.5rem] p-4 flex flex-col gap-4 transition ${
                      receita
                        ? "banner-noite em-noite text-white shadow-[0_20px_40px_-24px_rgba(54,52,107,0.6)]"
                        : "bg-gelo/60 hover:bg-gelo"
                    }`}
                  >
                    {receita && <span aria-hidden="true" className="malha-banner" />}
                    <span className="relative flex items-center gap-3.5 w-full">
                      <span
                        className={`shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center transition-colors ${
                          receita ? "bg-[image:var(--ouro-degrade)] text-navy" : "bg-white text-tinta shadow-sm"
                        }`}
                      >
                        <IconeReceita tamanho={22} />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className={`block font-semibold ${receita ? "text-white" : "text-navy"}`}>
                          Tenho uma receita
                        </span>
                        <span className={`block text-sm leading-snug mt-0.5 ${receita ? "text-white/70" : "text-cinza"}`}>
                          {receita ? "A foto vai na conversa do WhatsApp" : "Mande a foto pelo WhatsApp, direto na conversa"}
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
                    {/* Os três passos seguintes numa linha, ligados por setas */}
                    {receita && (
                      <span className="relative flex items-center gap-1.5 w-full border-t border-white/10 pt-3.5">
                        {PASSOS_RECEITA.map((passo, i) => (
                          <Fragment key={passo}>
                            {i > 0 && <Chevron tamanho={12} className="shrink-0 text-white/35" />}
                            <span className="flex-1 min-w-0 flex flex-col gap-0.5">
                              <span className="numero-tinta text-[0.9rem]">{`0${i + 1}`}</span>
                              <span className="text-[0.72rem] leading-tight text-white/85">{passo}</span>
                            </span>
                          </Fragment>
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
                    <div className="mt-2 rounded-[1.5rem] bg-gelo/60 px-5 py-7 text-center">
                      <span className="mx-auto w-12 h-12 rounded-2xl bg-white text-tinta shadow-sm flex items-center justify-center">
                        <IconeCarrinho tamanho={22} />
                      </span>
                      <p className="mt-3 font-semibold text-navy">Seu pedido está vazio</p>
                      <p className="mt-1 text-sm text-cinza leading-relaxed">
                        Marque a receita acima ou escolha um produto.
                      </p>
                      <Link
                        href="/produtos"
                        onClick={fechar}
                        className="mt-4 inline-flex items-center gap-2 h-10 px-4 rounded-full bg-navy text-white text-sm font-semibold hover:bg-tinta transition-colors"
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
                      Marque a receita ou adicione um produto.
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
                          apoio: "grátis",
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
                          className={`relative rounded-2xl px-3 py-4 border transition active:scale-95 flex flex-col items-center gap-1.5 text-center ${
                            entrega === opcao.modo
                              ? "bg-navy text-white border-navy"
                              : "bg-white text-navy border-fio hover:border-tinta/40"
                          }`}
                        >
                          {/* O selo de marcado, em ouro, no canto */}
                          {entrega === opcao.modo && (
                            <span
                              aria-hidden="true"
                              className="animar-surgir absolute top-2.5 right-2.5 flex size-5 items-center justify-center rounded-full bg-[image:var(--ouro-degrade)] text-navy"
                            >
                              <IconeFeito tamanho={11} />
                            </span>
                          )}
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
                          A taxa e o prazo da entrega a gente combina pelo WhatsApp.
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
                  {/* O verde do WhatsApp (o mesmo do "Fale com a gente"): a
                      pessoa já sabe para onde o pedido vai */}
                  <button
                    type="button"
                    onClick={enviarPedido}
                    disabled={!podeEnviar}
                    className="botao w-full bg-[#1DA851] text-white shadow-[0_18px_40px_-16px_rgba(29,168,81,0.65)] hover:bg-[#178a43] disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                  >
                    <IconeWhatsApp />
                    Enviar pedido no WhatsApp
                  </button>
                  <p className="text-xs text-cinza text-center mt-3 leading-relaxed" aria-live="polite">
                    {!podeEnviar ? (
                      `Falta preencher ${listar(faltando)}.`
                    ) : (
                      <>
                        {`${receita ? "Depois da mensagem, anexe a foto da receita. " : ""}Pedido `}
                        <span className="whitespace-nowrap">{codigo}</span>
                        {" · seus dados ficam só com a Viver Bem (LGPD)."}
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
