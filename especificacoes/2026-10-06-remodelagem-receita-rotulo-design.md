# Remodelagem visual "Receita e rótulo" — Manipulação Viver Bem

> **ADENDO 3 (06/10/2026, noite): cinco ajustes pedidos por print.**
> Cabeçalho do celular com três botões redondos (carrinho, busca, menu) em
> gelo; a barra de categorias deixou o azul-noite e virou uma fileira de
> pílulas em branco com fio, rolável no celular (`--altura-cabecalho` =
> 7,25rem / 10rem); vantagens em quatro `.ladrilho` (2x2 no celular);
> avaliações em cartões limpos, com o texto na Instrument Sans (o itálico
> serifado saiu dali, "a fonte tá muito ruim") e o selo do Google embaixo;
> gaveta do pedido no sistema: etapas em pílulas, cartões com fio, stepper
> em contorno, campos com foco azul, botão final azul com o ícone do
> WhatsApp (o verde ficou só no ícone).

> **ADENDO 2 (06/10/2026, fim da tarde): a home virou MODELO DE LOJA, na
> referência do biovittare.com.br (pedido do Anderson: "muita cara de
> genérico, pegue a referência da parte de produto desse site").**
> O que foi aplicado por cima do adendo 1 (mantendo as cores, a tipografia,
> os ladrilhos e as folhas):
>
> - **Cabeçalho em três faixas**, preso ao topo e no fluxo da página (as
>   páginas não têm mais margem no topo; `--altura-cabecalho` = 6,75rem no
>   celular e 9,5rem do md para cima): faixa de vantagens com os links
>   institucionais (A Viver Bem, Lojas, Contato), linha principal com logo,
>   **busca aberta** e carrinho, e a **barra de categorias em azul-noite** com
>   o "Enviar receita" em ouro na ponta.
> - **Abertura como banner** largo e arredondado em azul-noite (`.banner-noite`)
>   com a bancada de potes e o rótulo em vidro; botão branco com texto navy.
> - **Vantagens** (`Beneficios`): entrega de moto, retirada sem taxa, receita
>   conferida, 5,0 no Google. Substituiu a faixa de números.
> - **Categorias em círculos** (`CategoriasRedondas`): foto em
>   `public/fotos/categorias/<slug>.jpg`; sem foto, o pote de um produto da
>   área; sem pote, a inicial em ouro.
> - **Vitrines** (`VitrineCategoria`): título com fio e "ver mais" na linha,
>   banner em azul-noite ao lado (imagem opcional em
>   `public/fotos/banners/<slug>.jpg` ou `mais-procurados.jpg`, com véu para
>   o texto) e a faixa de produtos. Uma vitrine para "Mais procurados" e uma
>   para cada área com 3 ou mais fotos reais (hoje Dermatologia e Vitaminas).
> - **Cartão de produto** de loja: foto grande sobre o gelo, nome, botão.
> - Depois vêm Como funciona (bento), reels e avaliações, em folhas.
> - As fotos de pessoas (categorias e banners) ficam a cargo do Anderson:
>   quadradas de pelo menos 800px para os círculos, 4:5 de pelo menos
>   1000x1250 para os banners, JPG, nos nomes acima.

> **ADENDO 1 (06/10/2026, tarde): a direção mudou para "Branco, azul e ouro".**
> Depois de implementada a direção A (clara, fina, fios), o Anderson reprovou:
> "o site está até pior, pedi um layout totalmente moderno e sem parecer
> genérico". Para ele, clean NÃO é branco e fino: é profundidade, impacto e
> movimento. O que foi aplicado em seguida, e é o que vale:
>
> - **Paleta**: fundo branco; azul `#1C69B5` na estrutura e na ação principal
>   (o vermelho fica só no logo); azul-noite `#0D2340` nos títulos, numa única
>   folha escura (a vitrine "Mais procurados") e no rodapé; **dourado da paleta
>   da farmácia, `#B3904F` e `#C0A060`** (passado pelo Anderson), como acento
>   metálico em degradê: palavra-chave dos títulos, números, nome do rótulo, luz
>   quente sob os potes e fios finos. Nunca em texto pequeno (contraste).
> - **Tipografia**: títulos em Instrument Sans **600** (não 400), navy; itálico
>   serifado em ouro. Display da abertura até 90px, títulos de seção 60px.
> - **Superfícies**: `.ladrilho` (branco → gelo, 28px, luz dourada no canto) no
>   lugar das fichas com fio; `.ladrilho-vidro` sobre a folha escura. "Como
>   funciona" em bento 2x2; números em ladrilhos; produtos em ladrilhos.
> - **Folhas (transições de rolagem)**: cada seção da home é uma `.folha` com o
>   topo arredondado que desliza por cima da anterior; a anterior recua
>   (`scale .95`, opacidade) via `animation-timeline: view()` no `exit`. A
>   abertura fica presa ao topo no computador (`.abertura-presa`, sticky +
>   `scroll(root)`) e recua enquanto a 1ª folha a cobre; os potes têm paralaxe.
>   Revelação `.revelar` e `.escalonado` (filhos um depois do outro, por faixas
>   de `animation-range`). Tudo scroll-driven: roda com "reduzir movimento".
> - **Captura**: a revelação e as folhas andam com a rolagem, então captura de
>   página inteira precisa desligar `.revelar/.folha/.abertura-presa` (ver
>   `scratchpad/capturar-etapa.cjs`); o vídeo de rolagem (`rolar.cjs`) mostra
>   o efeito real.
> - As seções 4 a 10 abaixo continuam válidas em conteúdo e ordem; o
>   tratamento visual é o deste adendo.

**Data**: 06/10/2026
**Pasta**: `viverbem-app` (Next.js 16, branch `reformulacao-formularis`, dev em `localhost:3000`)
**Pedido**: "site visualmente clean e moderno, sem parecer genérico"
**Aprovação**: direção, sistema, abertura, home, páginas internas e plano aprovados pelo Anderson em 06/10/2026, por seção, com maquete da abertura sobre o site real.
**Cópia de segurança**: `..\viverbem-app-backup-2026-10-06-antes-da-remodelagem.zip` (sem `node_modules` e `.next`). Trabalho segue na própria branch, sem commit até o Anderson pedir.

## 1. Por que remodelar, e por que assim

O site de 06/10 é coerente, mas lê como modelo pronto. Medido na home, em 1440px, com "reduzir movimento":

- 10 blocos, 4 deles em azul-noite alternando com claro (zebra: números, mais procurados, entrega, rodapé).
- 18 estilos de botão, 7 raios de canto, títulos de seção em 4 tamanhos (62, 64, 52 e 46px).
- Degradê azul-vermelho em 5 botões; "Enviar receita" 5 vezes mais cabeçalho e flutuante; o processo do pedido explicado 4 vezes.
- 3 famílias de fonte (Bricolage 800 nos títulos, Instrument Sans, Instrument Serif itálico), duas vozes de título disputando.
- Abertura no layout mais comum da internet (texto à esquerda, foto arredondada à direita) com um quadro de reel desfocado; os potes, o material mais bonito, só no meio da página.
- Home com 7.816px no computador e 10.256px no celular.

Em 05/10 uma remodelagem total (fontes novas, composição "rótulo de fórmula", sem carrossel) foi rejeitada: "perdeu a essência". Lição aplicada aqui: manter o que a cliente reconhece, mudar a composição por evolução e aprovar cada parte vendo em cima do site real.

## 2. Essência preservada (não muda)

- Logo e paleta: azul `#1C69B5` + vermelho `#E02129` (paleta intocável; troca já foi revertida pela cliente em ago/2026).
- O itálico serifado azul nas palavras-chave dos títulos (Instrument Serif), escolhido em 05/10.
- A ordem de conteúdo aprovada pela cliente (modelo Formularis): abertura, números, como funciona, mais procurados, categorias, pronta entrega (condicional), entrega e retirada, reels, avaliações, fale com a gente, rodapé.
- Os números (19 anos, 3 lojas, 5,0 e 634 no Google), as 15 avaliações reais com foto, os 2 reels, as 11 fotos de produto (PNG 500x500 com fundo transparente).
- Todos os textos (já revisados pela RDC 67/2007 e RDC 96/2008), sem preço, sem indicação de manipulado.
- A onda do logo não vira decoração (reprovada duas vezes pela cliente).

## 3. Conceito: "Receita e rótulo"

A manipulação vive entre dois papéis: a receita escrita à mão pelo médico e o rótulo impresso com o nome do paciente. O site passa a ter exatamente essas duas vozes:

- **Tinta azul da receita**: Instrument Serif itálico, grande, para o que é humano: a palavra-chave dos títulos, os números, as frases das avaliações, o nome no rótulo.
- **Rótulo**: Instrument Sans em peso 400 no texto e nos títulos leves, caixa alta espaçada nos dados técnicos (categoria, horário, quantidade), números tabulares.

Assinatura visual: a bancada de potes reais na abertura e o rótulo "Preparado para [nome]" (nome fictício, pode variar a cada visita).

## 4. Sistema visual

### 4.1 Tipografia
- Duas famílias: Instrument Sans (variável 400 a 700; não tem 300) e Instrument Serif itálico. **A Bricolage Grotesque sai** de `layout.tsx` e do `globals.css`.
- Contraste por tamanho (saltos de 3x) e por voz (sans leve x serif itálico), não por peso extremo nem por terceira fonte.
- Escala (computador / celular):
  - Display da abertura: sans 400 em 80px / 46px, serif itálico em 92px / 54px (ajustar para a frase caber em 2 linhas no computador).
  - Título de seção: **um tamanho para todas**, 56px / 36px, sans 400 com a palavra-chave em serif itálico 1,1em.
  - Subtítulo e frase de apoio: 20px / 17px.
  - Texto: 17px / 16px; secundário 15px.
  - Rótulo (caixa alta): 12px, tracking 0,18em, peso 600; 11px no celular.
  - Números da faixa: serif itálico 54px / 40px, unidade em sans 17px.
- Letter-spacing: títulos sans -0,035em; serif -0,015em; texto -0,005em.

### 4.2 Cor
- `--papel #FCFCFD` fundo de tudo (body).
- `--tinta #1C69B5` (royal), `--tinta-escura #14508C` (hover/foco).
- `--carimbo #E02129`: **só no botão principal de cada tela e no logo**. Sai dos selos, das bolinhas, dos degradês de texto e de botão.
- `--grafite #1F2328` texto; `--cinza #5B6169` secundário; `--fio #E4E8EE` separadores; `--gelo #EEF3F9` ladrilho atrás das fotos de produto e luz atrás da bancada.
- `--noite #0D2340`: **só o rodapé** (Fale com a gente + rodapé). Nenhuma outra seção escura.
- WhatsApp: o verde `#25D366` fica só no ícone, nunca em botão inteiro.
- Degradês `.degrade-marca`, `.degrade-suave` e `.texto-degrade` saem do site público (checar `grep` antes de apagar: gaveta e páginas internas usam).

### 4.3 Botões (3 estilos, site inteiro)
1. **Principal**: pílula vermelha, texto branco 600, ícone à esquerda, sombra `0 14px 30px -14px rgba(224,33,41,.55)`. Um por tela: home = "Enviar receita"; produto = "Adicionar ao carrinho"; contato = "Falar no WhatsApp".
2. **Secundário**: pílula de contorno `1.5px rgba(28,105,181,.35)`, texto azul 500; hover preenche azul claro. Carrinho do cabeçalho, "Adicionar" nas fichas de produto, "Ver o catálogo", "@manipulacaoviverbem".
3. **Link**: texto azul 500 com seta, fio inferior de 1px em `rgba(28,105,181,.3)`. "Como funciona", "ver no mapa", "Tenho receita".
- Alturas: 52px (principal/secundário no computador), 48px no celular; link sem caixa. Toque mínimo 44px.

### 4.4 Superfícies e cantos
- Pílula (999px) para botões e chips; **20px** para as poucas caixas que sobram (ladrilho de foto, gaveta, pôster dos reels).
- Acaba o cartão dentro de cartão: seções viram **fichas** separadas por fio de 1px `--fio`. Sem sombra em cartão; sombra só nos potes (drop-shadow) e no botão principal.

### 4.5 Respiro (3 passos fixos)
- Entre seções: 112px no computador, 72px no celular.
- Do título ao conteúdo da seção: 48px (32 no celular).
- Do rótulo ao título: 16px.
- Largura de leitura máxima: 60ch.

### 4.6 Movimento
- Entrada orquestrada da abertura: texto e potes em cascata (opacidade + 12px de subida, 600ms, 80ms entre itens), uma vez por carga.
- Revelação ao rolar contida (opacidade + 16px), que **roda também com movimento reduzido** (a máquina do Anderson está com reduce ligado): `animation-timeline: view()` dentro de `@supports`, com fallback para o `Revelar` atual.
- Deriva leve dos potes ao rolar (translateY até 12px), só sem reduce.
- Nenhum loop (sai o `animar-respirar` e o `animate-ping`).
- Hover: fio vira azul, seta desliza 2px, pote sobe 4px. Transições `transition` puro (Tailwind v4), nunca `transition-all`.

## 5. Home (9 blocos, de 10)

1. **Abertura** (nova, fixa; sai o carrossel): grade 6,5fr/5,5fr. À esquerda: rótulo "Manipulação e homeopatia · Petrópolis, desde 2007", h1 em duas vozes ("Sua fórmula" / "começa pela receita"), frase de apoio (texto atual do 1º slide, ajustado: "Envie a foto da prescrição. O farmacêutico confere, passa o valor pelo WhatsApp e você retira numa das 3 lojas ou recebe em casa."), "Enviar receita" (principal) + "Como funciona" (link com seta para baixo), linha "★★★★★ 5,0 no Google · 634 avaliações" (estrelas azuis, link para o perfil). À direita, a **bancada**: CitoRepair, Ômega 3, Glow Cream (à frente, menor) e VitaFlex, pés na mesma linha, `drop-shadow`, plano elíptico suave, luz azul radial atrás; **rótulo** inclinado -5° ("MANIPULAÇÃO VIVER BEM / Preparado para *Ana Paula* / Uso conforme prescrição · Val. 90 dias"). Celular: texto, botão de largura cheia, link centralizado, bancada com 3 potes (sem o 4º) embaixo; total até 1,5 tela. Imagens com `fetchPriority="high"` no Ômega 3 (LCP).
2. **Números** no papel entre dois fios, 4 colunas (2x2 no celular): "+19 anos / de tradição em Petrópolis", "3 lojas / Centro, Corrêas e Posse", "5,0 no Google / 634 avaliações", "Entrega de moto / por toda Petrópolis". Número em serif itálico azul, unidade em sans, rótulo em caixa alta.
3. **Como funciona (trilha única)**: funde `ComoFunciona`, `EnviarReceita` ("Cada pessoa tem sua fórmula") e `SecaoDelivery`. Computador: coluna esquerda fixa (sticky) com rótulo "como funciona", título "Da receita *até a sua mão*", texto curto, botão principal "Enviar receita" e o aviso legal (texto atual da seção "Cada pessoa"). Direita: 4 fichas com fio, número em serif itálico 64px, título sans 500 22px, texto e detalhe:
   - 01 Envie a receita: "Mande a foto da prescrição pelo WhatsApp, ou traga na loja." / "Pelo site, o pedido já chega com o seu código."
   - 02 O farmacêutico confere: "Ele avalia a receita e passa o valor e o prazo de preparo." / "Você só confirma se estiver de acordo."
   - 03 Preparo: "A fórmula é preparada no laboratório, a partir da receita, depois do pedido. Nada fica pronto na prateleira." / "O rótulo sai com o seu nome, a composição e a validade."
   - 04 Retire ou receba: "Sem taxa, numa das 3 lojas, ou em casa, de moto, por toda Petrópolis." / chips Centro · Corrêas · Posse (link do mapa) e "A taxa e o prazo da entrega são combinados pelo WhatsApp antes de sair."
   Celular: coluna única, título e botão em cima, fichas embaixo. O botão verde "Falar no WhatsApp" sai daqui.
4. **Mais procurados**: título "Mais *procurados*" + pílula secundária "Ver o catálogo"; faixa horizontal (`FaixaProdutos`) com fichas: pote recortado sobre o papel com sombra, índice 01.. em serif itálico, nome sans 500, botão secundário "Adicionar". Sem fundo escuro, sem cartão branco, sem malha.
5. **Categorias**: lista tipográfica, uma linha por categoria (`<li>` com fio): número pequeno, nome 32px com a 2ª parte em serif itálico azul (`NomeComItalico` atual), descrição, "10 produtos" em caixa alta, seta. Hover (computador): o pote-exemplo da categoria (1ª foto .png da categoria, se houver) aparece à direita, flutuando. Os desenhos .svg saem da home (continuam como fallback de foto no catálogo).
6. **Pronta entrega**: condicional como hoje, no desenho da faixa 4.
7. **Por dentro da Viver Bem**: sem caixa; título "Por dentro da *Viver Bem*", texto, botão secundário "@manipulacaoviverbem"; 2 reels em cantos de 20px com **pôster real** (`public/videos/reel-N.jpg`, gerado por ffmpeg no segundo `capaEm`), play branco discreto, selo do Instagram.
8. **Avaliações**: título centralizado "O que dizem *sobre a gente*" + linha "G 5,0 ★★★★★ 634 avaliações no Google" (link). Fichas em faixa horizontal: frase em serif itálico 22px grafite (protagonista), embaixo foto 40px, nome 500 e estrelas pequenas; fio esquerdo em vez de caixa com sombra; setas discretas (contorno) no computador.
9. **Fale com a gente + rodapé** (único escuro): mantém a estrutura pedida (logo branco, frase em itálico, 4 ícones, navegação em caixa alta, aviso legal, linha final com CNPJ e a marca d'água). O bloco "Fale com a gente" troca os 4 cartões por **lista com fios**: WhatsApp (número tabular grande), Receita, Telefone fixo, Nossas lojas; pílula "Aberto agora" e os horários continuam.

## 6. Páginas internas

- **Catálogo** (`CatalogoClient`): abertura leve (rótulo, h1 "O que *manipulamos*" ou o nome da categoria com itálico, apoio); convite da receita vira linha com link; busca e chips grudados (chips secundários, ativo azul sólido); grade de fichas (`ProdutoCard`): pote sobre ladrilho gelo 20px, nome, "Adicionar" secundário; títulos de categoria 56/36px. Estado vazio e busca mantidos.
- **Produto**: foto sobre gelo sem borda; chip da categoria; h1 56/36; descrição; `AcoesProduto` com quantidade em pílula de contorno e **"Adicionar ao carrinho" principal (vermelho)**; "Como pedir" em 3 linhas com fio; "Tenho receita: enviar a foto" como link; `VistosRecentemente` e "Mais em..." no padrão das faixas, sem caixa azul.
- **A Viver Bem**: abertura com a foto do laboratório (cantos 20px) e h1 em duas vozes; linhas de história e "Como trabalhamos" ficam; "Onde estamos" em lista com fio; trilha "Como funciona" compartilhada (mesmo componente da home, sem o botão duplicado); avaliações.
- **Lojas**: lista mantida, no sistema (número em serif itálico, botões secundários "Como chegar" e ícone do WhatsApp em contorno, horário em ficha clara com "Aberto agora").
- **Contato**: reescrita no sistema: rótulo, h1 "Estamos *pertinho de você*", "Falar no WhatsApp" principal, horário com "Aberto agora", 3 lojas em lista com fio e "ver no mapa" (link). Usa `UNIDADES` de `lib/tipos.ts` em vez da lista local duplicada.

## 7. Transversais

- **Cabeçalho**: carrinho em pílula secundária (sai o vermelho); menus e busca iguais; sólido ao rolar como hoje.
- **Botão flutuante** do celular: "Enviar receita" continua principal (vermelho), sem degradê; some com o formulário aberto como hoje.
- **Gaveta do pedido** (`CarrinhoDrawer`): só cores e cantos (cabeçalho em `--tinta` ou papel com fio, botão final principal vermelho, 20px); nenhuma mudança de lógica, de campos ou da mensagem do WhatsApp.
- `Revelar` ganha a variante com `animation-timeline` e continua como fallback.

## 8. Fora de escopo

Painel administrativo, APIs, Prisma, mensagem do WhatsApp, textos legais, fotos novas da cliente (22 produtos, loja e laboratório), dados da RDC 44 no rodapé, troca do banco para MySQL, vitrine do GitHub Pages (não publicar sem pedido).

## 9. Plano de execução

Cada etapa termina com captura em 1440 e 390 (reduce ligado) enviada ao Anderson; ele pode parar antes da próxima.

1. **Sistema**: `globals.css` (tokens, 3 botões, ficha, rótulo, movimento), `layout.tsx` (fontes), `Header.tsx`, `Footer.tsx` + `FaleComAGente.tsx`, `CarrinhoDrawer.tsx` (cores), `HorarioAtendimento.tsx`.
2. **Abertura e números**: `HeroCarrossel.tsx` vira `Abertura.tsx` (server component + cascata em CSS); `MarqueeMarca.tsx` vira `Numeros.tsx`.
3. **Trilha única, Mais procurados, Categorias**: `ComoFunciona.tsx` absorve `EnviarReceita.tsx` e `SecaoDelivery.tsx` (os dois saem); `SecaoQueridinhos.tsx` e `SecaoCategorias.tsx` redesenhados; `SecaoTitulo.tsx` no sistema; `page.tsx` da home reordenado.
4. **Reels e Avaliações**: pôsteres (`scripts/gerar-posteres.js` com ffmpeg-static), `ReelsInstagram.tsx`, `CarrosselAvaliacoes.tsx`, `Estrelas.tsx`.
5. **Internas**: `CatalogoClient.tsx`, `ProdutoCard.tsx`, `FotoProduto.tsx`, `BotaoAdicionar.tsx`, `AcoesProduto.tsx`, `VistosRecentemente.tsx`, `produto/[slug]/page.tsx`, `sobre/page.tsx`, `lojas/page.tsx`, `contato/page.tsx`.
6. **Revisão**: `auditar.cjs` (metas: 3 estilos de botão, 1 tamanho de título de seção, 2 fontes, 1 bloco escuro, 0 degradês), design-review, Lighthouse (perf, a11y, SEO), larguras 320 a 1440, reduce ligado e desligado, Tab pelo cabeçalho e pela gaveta.

## 10. Riscos e decisões em aberto

- Fotos de produto têm 500px: na abertura o Ômega 3 é exibido com até 400px de altura; acima disso perde nitidez. Se a cliente mandar fotos maiores, trocar os arquivos sem mexer no código.
- Instrument Sans não tem peso 300; o "leve" é 400 contra 600.
- Nome do rótulo é fictício ("Ana Paula"); pode alternar entre alguns nomes a cada carga. Não usar nome de cliente real.
- O "Como funciona" fundido reduz a presença da entrega: a seção 04 precisa carregar bem os 3 bairros e a moto.
- A mudança do carrinho vermelho para contorno tira destaque do carrinho; o botão flutuante e o "Adicionar" compensam. Medir depois com a cliente.
