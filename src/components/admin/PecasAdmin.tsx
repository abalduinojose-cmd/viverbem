// Peças repetidas do painel, para as telas não divergirem.
//
// Sistema do painel (07/10/2026, mesma identidade do site, "Branco, azul
// e ouro"): fundo em névoa (gelo bem claro), cartões brancos com fio,
// navy nos títulos e nas ações principais, azul da marca nos links e nas
// chaves ligadas, ouro só como acento (rótulos com o fio, a inicial de
// quem está logado, a marca da página ativa). Vermelho só em ação
// destrutiva. Três camadas: os tokens de cor vêm do globals.css, as
// classes abaixo são os tokens de componente, e as telas só compõem.

/** Cabeçalho padrão de página: rótulo pequeno com o fio de ouro, título,
 *  explicação e a ação principal à direita. */
export function CabecalhoAdmin({
  rotulo,
  titulo,
  descricao,
  acao,
}: {
  rotulo?: string;
  titulo: string;
  descricao?: string;
  acao?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
      <div className="min-w-0">
        {rotulo && <p className="rotulo-pilula mb-2">{rotulo}</p>}
        <h1 className="text-[1.65rem] md:text-[2rem] font-semibold text-navy tracking-[-0.03em] leading-[1.1]">
          {titulo}
        </h1>
        {descricao && <p className="text-cinza text-sm md:text-[0.95rem] mt-1.5">{descricao}</p>}
      </div>
      {acao && <div className="shrink-0 flex flex-wrap gap-2">{acao}</div>}
    </div>
  );
}

/** Cartão branco padrão (borda fina, sem sombra pesada). */
export function CartaoAdmin({
  children,
  className = "",
  titulo,
  apoio,
  acao,
}: {
  children: React.ReactNode;
  className?: string;
  /** Título pequeno em navy no alto do cartão */
  titulo?: string;
  apoio?: string;
  acao?: React.ReactNode;
}) {
  return (
    <div className={`bg-white rounded-2xl border border-fio ${className}`}>
      {(titulo || acao) && (
        <div className="flex items-start justify-between gap-3 px-5 pt-5">
          <div className="min-w-0">
            {titulo && <h2 className="font-semibold text-navy leading-snug">{titulo}</h2>}
            {apoio && <p className="text-cinza text-xs mt-0.5">{apoio}</p>}
          </div>
          {acao}
        </div>
      )}
      {children}
    </div>
  );
}

/** Número de destaque dos resumos. O ouro entra só como um fio curto sob
 *  o rótulo, para a leitura ficar nos números. */
export function CartaoNumero({
  rotulo,
  valor,
  apoio,
  tom = "navy",
  extra,
}: {
  rotulo: string;
  valor: string | number;
  apoio?: string;
  tom?: "navy" | "tinta" | "verde" | "ambar" | "vermelho";
  /** Algo no canto direito (ex.: a variação do mês) */
  extra?: React.ReactNode;
}) {
  const cor = {
    navy: "text-navy",
    tinta: "text-tinta",
    verde: "text-green-700",
    ambar: "text-amber-600",
    vermelho: "text-carimbo",
  }[tom];
  return (
    <div className="bg-white rounded-2xl border border-fio px-4 py-4 md:px-5">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[0.66rem] font-semibold tracking-[0.14em] uppercase text-cinza leading-tight">
          {rotulo}
        </p>
        {extra}
      </div>
      <p className={`text-[1.7rem] md:text-[2rem] font-semibold tracking-[-0.03em] leading-none mt-3 tabular-nums ${cor}`}>
        {valor}
      </p>
      {apoio && <p className="text-grafite-claro text-xs mt-2">{apoio}</p>}
    </div>
  );
}

/** Pílula de situação (texto pequeno em caixa alta). */
export function Selo({
  tom = "cinza",
  children,
  className = "",
}: {
  tom?: "cinza" | "azul" | "verde" | "ambar" | "vermelho" | "ouro";
  children: React.ReactNode;
  className?: string;
}) {
  const classe = {
    cinza: "bg-nevoa text-cinza border border-fio",
    azul: "bg-gelo text-tinta",
    verde: "bg-green-50 text-green-700",
    ambar: "bg-amber-50 text-amber-700",
    vermelho: "bg-carimbo/10 text-carimbo",
    ouro: "bg-ouro/10 text-ouro-escuro",
  }[tom];
  return (
    <span
      className={`inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-[0.64rem] font-semibold tracking-[0.08em] uppercase whitespace-nowrap ${classe} ${className}`}
    >
      {children}
    </span>
  );
}

/** Botão do painel. Um principal por tela (navy); o resto em contorno. */
export function BotaoAdmin({
  variante = "secundario",
  tamanho = "normal",
  className = "",
  type = "button",
  ...resto
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variante?: "primario" | "secundario" | "fantasma" | "perigo";
  tamanho?: "normal" | "pequeno";
}) {
  return (
    <button type={type} className={`${classeBotaoAdmin(variante, tamanho)} ${className}`} {...resto} />
  );
}

/** As mesmas classes do BotaoAdmin, para links (<Link>, <a>). */
export function classeBotaoAdmin(
  variante: "primario" | "secundario" | "fantasma" | "perigo" = "secundario",
  tamanho: "normal" | "pequeno" = "normal"
) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold whitespace-nowrap transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";
  const dimensao = tamanho === "pequeno" ? "h-9 px-3.5 text-[0.8rem]" : "h-11 px-4 text-sm";
  const tom = {
    primario: "bg-navy text-white hover:bg-tinta",
    secundario: "bg-white border border-fio text-navy hover:border-tinta/50 hover:text-tinta",
    fantasma: "text-cinza hover:text-navy hover:bg-nevoa",
    perigo: "bg-white border border-fio text-grafite-claro hover:border-carimbo/60 hover:text-carimbo",
  }[variante];
  return `${base} ${dimensao} ${tom}`;
}

/** Campo de texto do painel (input e select). */
export const classeCampoAdmin =
  "w-full bg-white border border-fio rounded-xl px-4 h-11 text-[0.95rem] text-grafite placeholder:text-grafite-claro/80 focus:outline-none focus:border-tinta focus:ring-4 focus:ring-tinta/10 transition-shadow";
/** Área de texto do painel. */
export const classeAreaAdmin =
  "w-full bg-white border border-fio rounded-xl px-4 py-3 text-[0.95rem] text-grafite placeholder:text-grafite-claro/80 focus:outline-none focus:border-tinta focus:ring-4 focus:ring-tinta/10 transition-shadow resize-y";

/** Rótulo + campo, com a dica embaixo quando houver. */
export function CampoAdmin({
  rotulo,
  dica,
  obrigatorio = false,
  children,
  className = "",
}: {
  rotulo: React.ReactNode;
  dica?: React.ReactNode;
  obrigatorio?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <span className="text-sm font-medium text-navy">
        {rotulo}
        {obrigatorio && (
          <span className="text-ouro-escuro" aria-hidden="true">
            {" "}
            *
          </span>
        )}
      </span>
      {children}
      {dica && <span className="text-xs text-cinza leading-relaxed">{dica}</span>}
    </label>
  );
}

/** Chave liga/desliga. A cor só aparece quando está ligada, o que deixa
 *  a leitura das listas calma. */
export function Interruptor({
  ligado,
  rotulo,
  aoAlternar,
  desabilitado = false,
  cor = "tinta",
  descricao,
}: {
  ligado: boolean;
  rotulo: string;
  aoAlternar: () => void;
  desabilitado?: boolean;
  cor?: "tinta" | "verde" | "ouro";
  /** Texto menor embaixo do rótulo */
  descricao?: string;
}) {
  const fundo = {
    tinta: "bg-tinta",
    verde: "bg-green-600",
    ouro: "bg-[image:var(--ouro-degrade)]",
  }[cor];

  return (
    <button
      type="button"
      role="switch"
      aria-checked={ligado}
      onClick={aoAlternar}
      disabled={desabilitado}
      className="group flex items-center gap-2.5 min-h-10 py-1.5 text-left disabled:opacity-50 transition-opacity"
    >
      <span
        className={`relative w-10 h-6 rounded-full shrink-0 transition-colors ${
          ligado ? fundo : "bg-grafite-claro/35 group-hover:bg-grafite-claro/55"
        }`}
      >
        <span
          className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
            ligado ? "translate-x-4" : ""
          }`}
        />
      </span>
      <span className="min-w-0">
        <span className={`block text-sm font-medium leading-tight ${ligado ? "text-navy" : "text-cinza"}`}>
          {rotulo}
        </span>
        {descricao && <span className="block text-xs text-grafite-claro mt-0.5">{descricao}</span>}
      </span>
    </button>
  );
}

/** Mensagem de erro ou de sucesso de um formulário. */
export function AvisoAdmin({
  tom = "erro",
  children,
  className = "",
}: {
  tom?: "erro" | "ok" | "info";
  children: React.ReactNode;
  className?: string;
}) {
  const classe = {
    erro: "bg-carimbo/10 text-carimbo",
    ok: "bg-green-50 text-green-700",
    info: "bg-gelo text-navy",
  }[tom];
  return (
    <p role={tom === "erro" ? "alert" : "status"} className={`${classe} text-sm font-medium rounded-xl px-4 py-3 ${className}`}>
      {children}
    </p>
  );
}

/** Inicial de uma pessoa num círculo de ouro (quem está logado, o log). */
export function Inicial({ nome, tamanho = "md" }: { nome: string; tamanho?: "sm" | "md" | "lg" }) {
  const dimensao = { sm: "w-8 h-8 text-xs", md: "w-9 h-9 text-sm", lg: "w-11 h-11 text-base" }[tamanho];
  return (
    <span
      aria-hidden="true"
      className={`${dimensao} shrink-0 rounded-full bg-[image:var(--ouro-degrade)] text-navy flex items-center justify-center font-semibold`}
    >
      {nome.charAt(0).toUpperCase()}
    </span>
  );
}

/** Alça de arrastar (seis pontos). */
export function Alca({ titulo = "Arraste para reordenar" }: { titulo?: string }) {
  return (
    <span
      className="cursor-grab active:cursor-grabbing text-grafite-claro hover:text-tinta select-none transition-colors"
      title={titulo}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <circle cx="9" cy="6" r="1.6" />
        <circle cx="15" cy="6" r="1.6" />
        <circle cx="9" cy="12" r="1.6" />
        <circle cx="15" cy="12" r="1.6" />
        <circle cx="9" cy="18" r="1.6" />
        <circle cx="15" cy="18" r="1.6" />
      </svg>
    </span>
  );
}

/** Ícone de "mais" dos botões de criar. */
export function IconeMais({ tamanho = 18 }: { tamanho?: number }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

/** Estado vazio com explicação e, quando fizer sentido, uma saída. */
export function VazioAdmin({
  titulo,
  descricao,
  acao,
}: {
  titulo: string;
  descricao?: string;
  acao?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6 gap-3">
      <span className="w-14 h-14 rounded-2xl bg-gelo text-tinta flex items-center justify-center">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
          <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </span>
      <div>
        <p className="font-semibold text-navy">{titulo}</p>
        {descricao && <p className="text-cinza text-sm mt-1">{descricao}</p>}
      </div>
      {acao}
    </div>
  );
}
