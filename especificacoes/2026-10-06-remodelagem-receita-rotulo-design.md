# Remodelagem visual "Receita e rótulo" — Manipulação Viver Bem

> **ADENDO 49 (10/10/2026): "Adicionar" com texto e ícone em branco, textos em português simples, linha de confiança no lugar do aviso, rodapé levemente modernizado e carrinho mais moderno. Não publicado.**
> Pedidos: "coloque os ícones e escritos em branco, vamos ver se vai ficar
> bom, quero deixar o site mais clean"; "melhore a frase no receita em mãos
> 'Envie a foto agora e o farmacêutico confere', deixe mais curta, português
> simples e mais fácil de entender, voltado para sites de alta conversão";
> "modernize [o aviso legal com o telefone] embaixo do envie a receita";
> "mantenha a estrutura do rodapé, só modernize ele levemente"; "deixe o
> carrinho mais moderno" (4 prints). Feito: `.botao-carrinho` (Adicionar,
> Escolher dosagem, Adicionar ao carrinho) com texto e ícone em BRANCO sobre
> o ouro claro (contraste 2,4:1; se ficar, escurecer o fundo para o ouro ou o
> ouro escuro); o compacto "suave" também vai a branco no hover. Como
> funciona: os quatro passos e o apoio reescritos curtos ("Mande a foto pelo
> WhatsApp ou traga na loja", "Grátis em uma das 3 lojas..."); o convite
> virou "Mande a foto. *A gente cuida do resto.*" com apoio "A foto vai pelo
> WhatsApp. O farmacêutico confere e responde com o valor e o prazo." e o
> botão "Tirar uma dúvida"; o parágrafo legal virou a LINHA DE CONFIANÇA em
> três pontos com ícone (escudo "Manipulamos só com receita válida, de
> profissional habilitado", cadeado "Sua receita e seus dados ficam só com a
> nossa equipe", WhatsApp com o número em link). Rodapé: mesma estrutura;
> ícones em círculo com fio branco a 15% (o fio de ouro saiu), navegação com
> tracking 0.12em e hover branco, aviso em duas frases simples, linha final
> com pontos de ouro como separador. Carrinho (`CarrinhoDrawer`): as duas
> barras viraram etapas com nome (1 Pedido, 2 Dados; a feita com visto em
> ouro, o fio entre elas acende); "passo X de 2" só em sr-only; cartão da
> receita em repouso em gelo sem fio, ícone em quadrado branco, "Tenho uma
> receita" / "Mande a foto pelo WhatsApp, direto na conversa"; ligado, os
> três passos numa linha com setas, sem caixas; estado vazio em gelo sem
> tracejado e "Ver produtos" em navy; "Retirar na loja · grátis"; selo de
> marcado em ouro no canto da opção escolhida; botão final no verde do
> WhatsApp (#1DA851, o mesmo do Fale com a gente); a dica embaixo diz o que
> falta ("Falta preencher o nome, o WhatsApp e como receber."). Lógica,
> campos e mensagem do WhatsApp intactos.

> **ADENDO 48 (08/10/2026): seção Saúde da Mulher no lugar do "Explore o catálogo", banner das faixas no fim, Como funciona e Fale com a gente mais limpos.**
> Pedidos: "mude isso para o final da seção, assim como no Mais procurados";
> "modernize o Como funciona"; "o catálogo / Explore o catálogo... isso não
> tá bom, pode ser uma seção saúde da mulher e modernize a seção também";
> "modernize a seção fale com a gente". Faixas das áreas
> (`VitrineCategoria`): o banner volta a fechar a faixa, no tamanho normal
> (saíram `bannerPrimeiro` e `compacto`). Home: a grade "Explore o catálogo"
> e o `CatalogoHome` saíram; no lugar, entre o Como funciona e os vídeos,
> entra a seção Saúde da Mulher (`SecaoSaudeMulher`, no arquivo
> `BannerSaudeMulher.tsx`): rótulo em pílula, "Cuidado em cada fase", o apoio
> só com tipos de produto, "ver a linha", a animação "mulher" no cartão
> azul-noite e a faixa com os produtos da linha (os potes da animação que
> estão no catálogo e a categoria, os com foto na frente). O banner solto
> depois das avaliações deixou de existir; a chave `bannerMulher` liga e
> desliga a seção nova e a chave `catalogo` saiu de `secoes.ts`. Como
> funciona: sem o círculo de ouro cheio; o ícone fica num quadrado suave
> (ouro a 10%) e o número vira marca d'água no canto do cartão; o convite
> azul-noite ganhou o rótulo em pílula. Fale com a gente: os ícones em
> círculo viraram rótulos em pílula ("whatsapp", "3 lojas em Petrópolis",
> "horário"), o WhatsApp tem o botão verde dele, o "Como chegar" é um círculo
> só de contorno e os dias da semana perderam o contorno (hoje em ouro).
> Capturas em `scratchpad/r49`; fumaça das 6 páginas sem erro.

> **ADENDO 47 (08/10/2026): página de produtos com "Mais procurados" primeiro, cartão dos 20 anos com painel flutuante. PUBLICADO no 10º push (c755664).**
> Pedido: "modernize mais o link component (20 anos); agora na página de
> produtos, vamos modernizar mais ela, e coloque a linha de mais procurados
> primeiro; atualize o github". Página de produtos (`CatalogoClient`): a
> primeira faixa é "Mais procurados" (os produtos com foto, destaques na
> frente), depois "Pronta entrega" e as áreas; cada faixa abre com
> `CabecalhoFaixa` (título, o total numa pílula azul a 7%, o apoio e o "ver
> tudo", agora também no celular); os chips de área mostram a contagem (as
> páginas passam `contagens`, de `src/lib/contagens.ts`, contadas no
> servidor sobre o catálogo inteiro); a abertura ganhou a linha dos números
> com pontos de ouro; o bilhete da receita perdeu o círculo de ouro; e a
> página fecha com o convite "Não achou a sua fórmula? Manipulamos conforme a
> receita." em azul-noite. Cartão dos 20 anos (celular), quarta versão: a
> foto dos sócios ocupa o cartão (5:4) e um painel branco flutua sobre a base
> com o "20" em ouro, "anos construindo cuidado" e o botão redondo
> azul-noite. A pílula do rótulo ganhou `width: fit-content` (dentro de
> cartões em coluna ela esticava na largura toda). O demo:build deu EPERM
> logo depois de parar o servidor; a segunda tentativa, 8 s depois, passou.

> **ADENDO 46 (08/10/2026): fotos nos círculos de categoria, cartão dos 20 anos refeito, rótulo das seções em pílula leve. PUBLICADO no 10º push (c755664).**
> Círculos: Cabelos & Unhas e Homeopatia & Florais (sem produto com foto)
> ganharam, PROVISÓRIOS a pedido ("vai mudar depois"), o frasco do ZincBlock
> e o conta-gotas do Firm Defense (FOTO_REPRESENTATIVA na home). Banner da
> história (celular), terceira versão ("muito ruim, melhore a foto"): a
> fachada escurecida pelo véu saiu; o cartão tem em cima a foto dos sócios
> dentro da loja, limpa (`public/fotos/sobre/equipe-loja.webp`, recorte 16:10
> de futuro.webp ampliado para 1200 px com lanczos3, nitidez, brilho e
> contraste leves) com a etiqueta branca "desde 1999", e embaixo a faixa
> azul-noite com o "20" em ouro itálico, "anos construindo cuidado" e o botão
> redondo com a seta. Rótulo das seções (`.rotulo-pilula`, o site inteiro:
> "fale com a gente", "quem já é cliente", "acompanhe a gente", "o catálogo",
> "como funciona" e os capítulos da página A Viver Bem): o fio de ouro na
> frente virou uma pílula bem leve (azul a 6%, contorno a 10%) com um ponto
> de ouro e espaçamento de letras menor; na folha escura, vidro a 8% com o
> texto em ouro. Capturas em `scratchpad/etapa60`.

> **ADENDO 45 (08/10/2026): banner da Saúde da Mulher publicado, potes mais lentos, site mais leve e compacto, aviso de erro do Next. PUBLICADO no 9º push (efee319).**
> Pedidos, em duas mensagens: "encurte o segundo vídeo da saúde da mulher, e
> não tá aparecendo no github", "site 100% fluindo", "limpe tudo que não for
> usar", "espaços entre as seções mais compactos", "exclua o botão vermelho";
> depois "a cena animada não aparece na prévia", "os medicamentos e nomes
> estão aparecendo muito rápido, deixe mais lento como um especialista em
> motion", "modernize a seção selecionada" (banner da história) e "o botão
> enviar receita". **Ritmo da animação da mulher**: o roteiro ganhou
> `ritmo` (pares [segundo real, segundo da coreografia]) e o HeroAnimado
> passa o tempo real por uma curva cúbica monotônica (Fritsch e Carlson,
> pontas com a mesma inclinação para o laço emendar). A primeira versão
> encurtou o ciclo para 5,2 s e ficou rápida demais; a final dá a cada pote
> 0,75 s chegando e 0,85 s quase parado na frente, com o nome legível no
> letreiro (antes eram 0,2 s), e o ciclo tem 11 s. A coreografia (fases.ts)
> não mudou. **Prévia**: o banner foi publicado ligado (o pote do Composto
> Emagrecedor segue nele, decisão do usuário). **Botão vermelho**: era o
> aviso de "Issues" do Next em desenvolvimento; com `devIndicators: false` o
> Next ainda mostra erros de compilação e de execução. Causas: a importação
> quebrada no meio da refatoração da outra sessão (já resolvida) e
> `createLinearGradient` com medida infinita no degradê de ouro (cena.ts:
> `ouro` agora saneia as medidas e `desenharForma` pula o quadro sem pontos
> válidos). **Fluidez**: a outra sessão dividiu a preparação da cena em
> pedaços (sem a tarefa longa de ~300 ms); aqui, durante a rolagem a
> animação desenha um quadro sim, outro não, e só anima com 15% do banner à
> vista. Medido (Chrome sem tela, roda real): computador CPU 2x, home 1,6% de
> quadros lentos e A Viver Bem 0,2%, nenhuma tarefa longa; celular CPU 4x,
> home de 10% para cerca de 5% (o resto é o desenho do canvas). **Espaços**:
> `--espaco-secao` de 56-88px para 44-68px, `--vao-titulo` e os capítulos da
> página A Viver Bem cerca de 20% menores, e os respiros fixos do rodapé, do
> "Fale com a gente" e das páginas internas; a home ficou 301 px mais curta
> no computador e 226 px no celular. **Banner da história** (celular): a foto
> inteira, o "20" grande em ouro itálico com "anos construindo cuidado", a
> etiqueta "desde 1999 · Petrópolis" e um botão redondo branco com a seta,
> sem desfoque. **Cartão "Enviar receita"** (Fale com a gente): saiu o
> círculo de ouro com o ícone; o rótulo com o fio abre o cartão e o convite
> é uma pílula branca com o ícone em ouro escuro e a seta que anda.
> **Limpeza**: saíram do repositório img/ (11 imagens do Gemini da primeira
> versão, ~1,3 MB) e o logo antigo da raiz; public/ e os componentes já
> estavam sem sobras. A prévia confirmou as duas animações prontas no
> celular e no computador, sem erro e sem 404.

> **ADENDO 44 (08/10/2026): página A Viver Bem em capítulos com motor de rolagem em JavaScript, rolagem suave no site, travamentos medidos, limpeza. PUBLICADO no 8º push (2f46ad6), junto com os adendos 37 a 43 das duas sessões.**
> Pedidos: "modernizar a página sobre, clean e moderna, com efeitos de scroll,
> design profissional feito em JavaScript, refinar com a skill
> ui-ux-pro-max"; depois "melhore os movimentos de scroll, tire todos os
> travamentos, limpe tudo que não precisa e atualize o github". A skill
> recomendou o padrão de narrativa por capítulos (indicador de progresso,
> no máximo uma ou duas seções presas, paralaxe só em fotos); a paleta e as
> fontes que ela sugeriu foram ignoradas (a identidade é fixa).
> **Motor** (`src/components/site/historia/motor.ts`): um laço só de
> requestAnimationFrame; cada cena mede o progresso pela caixa na tela e
> escreve transform/opacity direto no DOM; leituras antes das escritas;
> suavização independente da taxa de quadros; cenas fora da tela paradas
> (IntersectionObserver); roda no Safari do iPhone e no Firefox, onde o CSS
> de rolagem ainda não roda; com "reduzir movimento" a suavização encurta.
> **Página** (`sobre/page.tsx`): barra de leitura em ouro no alto
> (ProgressoLeitura, até o fim do capítulo 04); abertura com o título que
> sobe palavra por palavra de dentro de máscaras, os números 1999/20/3
> rolando como contador mecânico (NumeroRolante, fitas 0 a 9 desenhadas no
> CSS, largura real de cada algarismo) e a foto da equipe que se abre na
> carga com paralaxe (FotoParalaxe); 01 o parágrafo da fundação grande, que
> acende palavra por palavra enquanto se lê (TextoRevelado, "próxima,
> humana e personalizada" em ouro itálico); 02 a linha do tempo
> (LinhaDoTempo): no computador, se couber abaixo do cabeçalho, a seção
> prende (sticky, rolagem nativa) e os marcos andam para o lado, o marco na
> linha de leitura acende, a régua dos anos enche e marca o ano ativo (a
> linha de leitura anda de 28% até o centro do último marco, para cada ano
> ter um ponto próprio na régua; parada, 2012 e 2017 se amontoavam); no
> celular, o trilho de ouro desce e acende cada ano; o 2006 leva a foto do
> laboratório; 03 a folha escura (CapituloVinteAnos) com o "20" que cresce
> e o miolo que recua quando a folha branca do 04 sobe; 04 a citação que
> acende como o manifesto, com a foto. Textos da farmácia sem mudança.
> **Rolagem suave** (`RolagemSuave.tsx`, no layout do site): com as
> animações do Windows desligadas o Chrome também desliga a rolagem
> animada da roda, e cada clique saltava ~100px (efeitos aos saltos, o
> "travamento"). Cada clique soma ao alvo e a página desliza com o
> scrollTo suave do navegador (compositor); se o navegador não animar, o
> primeiro clique percebe e passa a deslizar por conta própria (modo
> lembrado na sessão). Toque, trackpad, teclado, âncoras, caixas que rolam
> por dentro e a gaveta aberta ficam nativos. O motor ouve o passo
> ("rolagemsuave") e atualiza no mesmo quadro. **Travamentos medidos**
> (scratchpad `medir-rolagem.cjs` e `rastrear.cjs`, Chrome sem tela, CPU 2x,
> roda real): home de 11,4% para 3,5% de quadros lentos e A Viver Bem com
> 0,5% e zero tarefas longas; o vidro do cabeçalho passou de blur-xl para
> blur-md (bg-white/90). A primeira versão da rolagem suave rodava sempre
> no JavaScript e o trace mostrou um quadro de 1,8 s: por isso o caminho do
> navegador vem primeiro. Sobra uma tarefa longa de ~265 ms na home, a
> preparação do canvas da animação (CenaAnimada, preparar.comecar), avisada
> à sessão da animação. **Limpeza**: sem uso, saíram .citacao,
> .titulo-display, .ladrilho-luz, .sombra-card, .paralaxe e .paralaxe-vista
> (com o keyframe), .trilha-topo e os tokens --tam-display e --shadow-card
> (2,6 KB a menos); nenhum componente órfão. **Publicação**: as duas
> sessões estavam na mesma pasta; a outra confirmou arquivos estáveis e
> avisou que o banner Saúde da Mulher mostra o pote do Composto
> Emagrecedor (tirado do site em setembro). A prévia foi gerada com a chave
> bannerMulher desligada só durante o build (o banco local voltou ao valor
> original); o banner continua ligado no site local. Antes do push: tsc e
> lint limpos e 12 cargas de página sem erro (6 páginas, 1440 e 390).

> **ADENDO 43 (08/10/2026): banner animado da Saúde da Mulher, com coreografia própria ("fases"). Não publicado.**
> Pedido: "uma animação no mesmo estilo, com os medicamentos em anexo
> (Pó finalizador FPB 20, ZincBlock FPS, Composto Emagrecedor, Bastão
> clareador), voltada para a saúde da mulher"; depois "as transições estão
> iguais à primeira, mude o formato mas mantenha a identidade" e "não
> gostei do efeito nos produtos, melhore os movimentos". Novo
> `BannerSaudeMulher` (cartão escuro como o da história, celular e desktop,
> link para /produtos/saude-da-mulher, chave `bannerMulher` no painel),
> depois das avaliações e antes do banner da história. O motor virou
> genérico: `heroAnimado/roteiros.ts` (texto, potes, cor da luz, formato
> "dobra" ou "cartao", coreografia "orbita" ou "fases"), `CenaAnimada`
> (o `HeroAnimado` virou atalho dela) e `fases.ts` (a coreografia nova,
> sobre o mesmo palco exposto por cena.ts). Fases: "Saúde em cada fase da
> mulher", rótulo "BELEZA *e* AUTOESTIMA" em cápsula que se abre do ponto,
> "Saúde" vira letra a letra, "em cada fase da" entra palavra por palavra
> ganhando foco, "mulher" acende do centro; uma lua de ouro cresce de nova
> a cheia; os potes flutuam ao longe em volta dela, fora de foco, e vêm um
> por vez para a frente (girando de leve, luz rosada atrás, brilho no
> rótulo) com o letreiro de lado acompanhando; no fecho pousam juntos no
> horizonte e na saída sobem e somem enquanto a lua mingua. Luz rosada no
> lugar da azul (cor dos potes), mesmo azul-noite e ouro. As fotos só
> descem quando o banner chega perto da tela. Aquecimento passou a copiar
> cada quadro para uma tela de GPU (força a compilação dos desenhos antes
> do primeiro laço). Risco avisado: o Composto Emagrecedor foi tirado do
> site em setembro ("o nome era a promessa") e aparece em destaque aqui.

> **ADENDO 42 (08/10/2026): "Como funciona" arrasta para o lado no celular. Não publicado.**
> Pedido: "quero mais moderno e coloque eles arrastando para o lado na
> versão mobile". No celular a lista dos passos virou uma faixa horizontal
> com rolagem nativa e snap (`snap-x snap-mandatory`, `scroll-pl-5`, sangra
> até as bordas com `-mx-5 px-5`), cartões de `min(18.5rem, 82vw)` para o
> seguinte aparecer na borda, e o ícone e o número dividindo a primeira
> linha do cartão (do tablet em diante seguem empilhados, como no print).
> Embaixo da faixa, uma barra de ouro de 112px anda com a rolagem da
> própria faixa: `scroll-timeline-name: --passos` na faixa,
> `timeline-scope` no pai (`.passos-escopo`) para a barra, que fica fora da
> faixa, ler a linha do tempo, e `animation-timeline: --passos` na barra
> (`.passos-barra`, de 25% a 100%); roda com "reduzir movimento" porque é
> a pessoa que arrasta; sem suporte fica parada no primeiro quarto. Do
> tablet em diante nada mudou (2x2 e 4 colunas com o traço). Os cartões
> têm a mesma altura (alturas próprias deixavam um vazio entre o cartão e a
> barra); os chips das lojas ficam menores no celular, para caberem numa
> linha e o 04 não esticar tanto. Capturas em
> `scratchpad/etapa57`. A segunda imagem do pedido (o banner da história)
> veio sem instrução; nada foi mexido nela.

> **ADENDO 42 (08/10/2026): tipografia da animação remodelada, rótulo do topo novo e animação sem trancos. Não publicado.**
> Pedidos: "a tipografia pode melhorar, como um especialista em motion,
> mantendo a essência"; depois "o MANIPULAÇÃO E HOMEOPATIA pode melhorar,
> fontes mais modernas e movimentos suaves" e "o vídeo está travando de
> leve". Tipografia: três vozes (Bricolage Grotesque 800 só na linha
> grande, com o peso florescendo de 300 a 800 na entrada; "em saúde" em
> Instrument Sans 400 menor; "personalizada" em Instrument Serif itálico
> ouro, a maior, escrita com borda macia e luz na ponta), bloco empilhado
> pela tinta medida, rastro de movimento, mola no pouso e saída em
> espelho. As fontes do site saíram do layout para `src/lib/fontes-site.ts`
> (mesma instância no canvas). Rótulo: cápsula de vidro que se desenha a
> partir de um ponto de ouro que respira, "MANIPULAÇÃO *e* HOMEOPATIA" em
> Bricolage 600 subindo de dentro dela, um fio de ouro dá uma volta na
> borda (como o botão "Enviar receita"). Trancos: peso da fonte em degraus
> de 50 e aquecido antes de tocar, sem shadowBlur, sem tela de apoio por
> quadro (a luz nos potes é uma máscara recortada em faixas), luzes e
> sombras como imagens prontas, linhas paradas do título como imagens,
> início num respiro do navegador (requestIdleCallback), canvas só refeito
> quando o tamanho muda, densidade 1,5 no desktop. Medido nesta máquina
> (Vega 8): 2 a 4 ms de GPU por quadro, nenhum acima de 13 ms mesmo com
> sincronização forçada a cada quadro.

> **ADENDO 41 (08/10/2026): "Como funciona" v5, igual ao print de referência, na nossa identidade. Não publicado.**
> Pedido com um print (cartões sobre creme, ícones em círculos de ouro,
> números itálicos, traços ligando os cartões, folhagem no canto) e a
> instrução "igual o print, mas com a identidade visual que já estamos
> usando". Cabeçalho: rótulo com o fio, título em duas vozes e o apoio
> EMBAIXO do título (antes ficava ao lado). Passos: o cartão único dividido
> por fios (v4) voltou a ser QUATRO cartões brancos separados
> (`rounded-[1.5rem]`, fio, sombra leve, sobem 0,5px no hover), cada um
> com o ícone num círculo de ouro de 56px (ícone em navy, como os outros
> círculos de ouro do site), o número grande em `numero-tinta`, o título,
> o texto e o detalhe; o passo 04 segue com os chips das 3 lojas. No
> computador um traço de ouro de 16px liga os cartões na altura do ícone
> (`.traco-liga`, cresce com a rolagem via `trilha-cresce-x`; 2x2 no
> tablet e empilhado no celular, sem traço). Ficou de fora, de propósito:
> o fundo creme e a folhagem do print (a seção segue na folha gelo, sem
> ornamento botânico) e a serifa nos títulos dos cartões (Instrument Sans
> 600, como nos outros cartões). O convite em azul-noite e o aviso legal
> não mudaram. Lint da seção limpo; o tsc acusa erros só em
> `heroAnimado/cena.ts`, que o outro chat estava editando na hora
> (`FontesDaCena` sem `titulo/pesoTitulo/trackingTitulo`), e o console
> mostra "createLinearGradient non-finite" vindo da mesma animação.
> Capturas em `scratchpad/etapa56` (1440, 1024 e 390).

> **ADENDO 40 (08/10/2026): botões da dobra "modernos e atuais, condizentes com a animação da hero". Não publicado.**
> Pedido com um print do celular. Os três níveis ficaram, mas com movimento
> e material: "Enviar receita" (`.botao-vivo`) é branco com o ícone em ouro
> escuro, um brilho de ouro embaixo e um fio de ouro que percorre a borda
> devagar (pseudo-elemento com `conic-gradient` girando por `@property
> --angulo-fio`, máscara que deixa só os 2px da borda; um giro a cada 7 s,
> o mesmo compasso da animação da dobra, DURACAO de heroAnimado/cena.ts;
> roda também com "reduzir movimento", porque é um detalhe contido e a
> máquina do usuário está em reduce); "Ver produtos" (`.botao-vidro`) é vidro (branco
> a 10%, borda a 22%, blur de 10px, fio de luz em cima); "Como funciona" é
> texto com a seta que acena para baixo (`.acenar-baixo`, 3px, 2,4s; 3,6s
> em reduce), chamando para rolar. O hover do principal sobe 1px e abre o
> brilho. Lint limpo. Capturas em `scratchpad/etapa55`.

> **ADENDO 41 (08/10/2026): a animação também no desktop, frase "Especialistas em saúde personalizada" e fontes próprias da animação. Não publicado.**
> A bancada estática saiu: o banner (todas as larguras) é o canvas, com
> altura fixa (celular `min((100vw-1.5rem)*2, 46rem)`, md 30rem, lg 34rem,
> xl 36rem), h1 "Especialistas em saúde personalizada" e texto de apoio em
> `sr-only`, botões por cima na base (à esquerda no desktop, md:px-12). A
> cena tem dois enquadramentos escolhidos pelo mesmo corte do CSS (md):
> retrato 360x720 e paisagem 560 de altura com título à esquerda e potes à
> direita (escala dos potes pela altura livre e pela largura). Fontes em
> `heroAnimado/fontes.ts` (só na animação, sem preload): A Fraunces 600 +
> Fraunces itálico (padrão), B Plus Jakarta Sans 800 + Playfair itálico, C
> Manrope 800 + DM Serif Display itálico; em dev `?heroFonte=jakarta`
> compara. O tamanho do título se ajusta à coluna medindo as letras.

> **ADENDO 39 (08/10/2026): dobra do celular vira animação de 7 s em canvas ("como se fosse After Effects"). Não publicado.**
> Pedido: tipografia cinética, transições suaves entre formas, potes em 3D,
> movimento de câmera, 7 s, no tamanho do banner azul do celular e com o
> mesmo fundo. `src/components/site/heroAnimado/cena.ts` é a composição
> (função pura do tempo, laço sem emenda: o último quadro é o primeiro) e
> `HeroAnimado.tsx` toca, pausa fora da tela/aba escondida/tablet+ e roda
> também com "reduzir movimento" (pedido). Roteiro: ponto de ouro vira fio,
> "Sua fórmula" sobe de trás dele com a câmera recuando; o título voa para o
> topo, "começa" fecha o espaçamento, o fio vira cápsula (metade em ouro)
> que gira e tomba virando o anel no chão; os 4 potes chegam do fundo com
> desfoque de movimento e giram em carrossel 3D (profundidade de campo,
> reflexo, sombra, luz correndo no rótulo); "pela receita" se escreve em
> ouro; um letreiro rola os 4 passos do pedido e termina em "Petrópolis,
> desde 2006"; no fecho Caramelo + Gummy vêm para a frente e os outros
> somem no fundo; tudo se recolhe ao ponto. Banner do celular com altura
> `min((100vw-1.5rem)*2, 46rem)`, h1 e texto em `sr-only`, botões por cima
> na base. Do `md` para cima nada mudou. Em dev, `?heroT=3.2` congela um
> quadro. Custo medido: ~1 ms por quadro.

> **ADENDO 38 (08/10/2026): home com a grade do catálogo, banner da história no celular, vantagens em cartão único, categorias 10% menores, banner das faixas refeito e na frente nas áreas. Não publicado.**
> Pedido com dois prints do celular. **Explore o catálogo** (novo,
> `CatalogoHome`): entre o "Como funciona" e os reels, uma grade (2 colunas
> no celular, 3 no tablet, 4 no computador) com 8 produtos escolhidos um de
> cada área por vez (os com foto primeiro, depois os destaques), o apoio
> com os totais reais ("N fórmulas e produtos em M áreas") e o botão
> "Ver o catálogo completo" em contorno; chave `catalogo` no painel.
> **Banner da história** (novo, `BannerHistoria`, só no celular, `md:hidden`):
> depois das avaliações e antes do "Fale com a gente" (que vem no rodapé),
> um retângulo 16:10 com a foto da fachada (a mesma da página A Viver Bem),
> véu azul-noite, "desde 1999 em Petrópolis", "20 anos construindo cuidado."
> e "Conheça a nossa história", levando para /sobre; chave `bannerHistoria`.
> As duas chaves novas entram ligadas (`normalizarSecoes`). **Vantagens**
> (`Beneficios`): no celular os quatro cartões com o ícone no círculo viraram
> UM cartão com a grade 2x2 dividida por fios, ícone em ouro escuro ao lado
> do texto alinhado à esquerda (título 0,8rem para "Retirada sem taxa"
> caber); no computador seguem as pílulas. **Nossas categorias**: título a
> 90% do tamanho de seção e a grade dos círculos a 90% da largura.
> **Banner das faixas** (`BannerCartao`): a inicial em marca d'água
> (`InicialMarca`), o fio e a seta no círculo de ouro saíram; agora é a peça
> em azul-noite com a malha, as luzes, um fio curto de ouro, título e texto
> centralizados e o botão "Ver produtos" em contorno (vira branco no hover,
> `whitespace-nowrap` para não quebrar no cartão estreito). O campo
> `inicial` saiu do tipo `BannerVitrine`. Nas faixas das áreas (Dermatologia,
> Vitaminas) o banner ABRE a faixa, compacto (10/11rem, `bannerPrimeiro`);
> no "Mais procurados" segue fechando (11/12rem). Lint e tsc limpos.
> Capturas em `scratchpad/etapa54` (home 1440 inteira e 390 em três
> viewports altos).

> **ADENDO 37 (07/10/2026): página A Viver Bem com as fotos, "Como pedir" em cartão, botões da dobra sem círculos, coluna lateral do produto. Não publicado.**
> Pedido com seis anexos (prints 77 a 79 e três posts do Instagram da
> farmácia). **A Viver Bem**: as fotos dos posts foram recortadas (só o
> miolo, sem a moldura e a legenda do post; `public/fotos/sobre/`,
> `geracoes.webp` 638x611, `vinte-anos.webp` 692x490, `futuro.webp`
> 599x598) e entraram com a frase de cada post. A abertura trocou o
> laboratório em ladrilho pela foto da equipe na loja, sem moldura, com a
> legenda em itálico serifado e fio de ouro (`.legenda-foto`); a linha do
> tempo virou UM cartão dividido por fios (4 colunas no computador, 2x2 no
> tablet, empilhado no celular), com o ano em `numero-tinta` e a linha de
> ouro crescendo na borda de cima (`.trilha-topo`), no lugar dos quatro
> cartões com pílulas e linha horizontal; o fecho "20 anos" ganhou a foto
> da fachada à esquerda (4:3) e o número passou a 5,5/7rem; e um bloco
> novo fecha a história com a citação "E seguimos olhando para o futuro com
> o mesmo propósito do primeiro dia." (`.citacao`), a terceira foto e o
> link para as lojas. Textos da farmácia mantidos. **Página do produto**:
> "Como pedir" deixou de ser a trilha com círculos de ouro e linha
> (`.trilha-clara`) e virou um cartão claro com os três passos numerados
> em ouro itálico e fios entre eles, igual no celular e no computador, com
> "Tenho receita: enviar a foto" dentro do cartão. **Coluna lateral**
> ("Mais procurados" e "Você viu recentemente"): a coluna presa passou de
> 16 para 18rem; cada item é uma linha inteira clicável (foto num ladrilho
> de gelo com a luz dourada, nome em até 2 linhas, área) com o "adicionar"
> em contorno que vira ouro no hover (`BotaoAdicionar suave`), no lugar do
> botão de ouro cheio repetido; "Ver todos os produtos" fecha o bloco.
> **Botões da dobra**: três níveis sem círculos internos: "Enviar receita"
> branco com o ícone em ouro escuro, "Ver produtos" só em contorno
> (borda branca a 35%) e "Como funciona" só texto com a seta; o mesmo
> "Enviar receita" sem círculo foi aplicado no convite do "Como funciona"
> e no fecho da página A Viver Bem. **CSS**: saíram as regras mortas da
> trilha vertical (`.trilha-linha/.trilha-progresso/.trilha-ponto`,
> `.trilha-clara`), do `.passo-numero`, do `.marco-ano` e da
> `.trilha-h-*`. Lint e tsc limpos. Capturas em `scratchpad/etapa53`
> (no celular a página inteira passa de 16384px físicos e a captura
> enrola; capturar em dois viewports altos).

> **ADENDO 36 (07/10/2026): capas dos reels, seção dos reels, "quem já é cliente", carrinho flutuante, lojas e "Como funciona". Não publicado.**
> Pedido com oito prints. Capas: escolhidas quadro a quadro com o ffmpeg
> (folhas de contato a cada 4s e a cada 0,5s nos trechos candidatos):
> reel 1 em 14s (o farmacêutico na loja, sem legenda queimada), reel 2 em
> 1,5s (os irmãos), reel 3 em 2,4s (o olho com o tubo) e reel 4 em 1s (o
> pote dos pads, no lugar do quadro final com o logo); `gerar-posteres.js`
> atualizado. Reels: cabeçalho em duas colunas no computador com o botão
> do Instagram ao lado do título (abaixo do lg ele volta para baixo); os
> cartões perderam o ícone do Instagram repetido e a caixa de vidro da
> legenda: véu escuro embaixo, rótulo "REEL" em ouro e o título em branco;
> barra de progresso mais fina; autoplay só a partir do lg. Avaliações: o
> selo do Google deu lugar aos rostos empilhados com o "+676" em ouro, as
> estrelas, "5,0 no Google" e "680 avaliações · ver todas", sem caixa (o
> cartão navy da nota segue abrindo a faixa). Carrinho flutuante: no celular
> um círculo navy de 56px com a sacola e o selo de ouro da contagem no canto
> (pulsa quando o número muda, `.animar-pulso`, desligado com "reduzir
> movimento"); no computador a pílula "Ver pedido" com o selo; some com a
> gaveta aberta. Lojas do "Fale com a gente": os três cartões viraram UM
> cartão com as unidades em linhas numeradas em ouro itálico, endereço e
> "Como chegar" (sem telefone, como pedido antes); o horário passou a ocupar
> a linha inteira no tablet. "Como funciona" v4: os quatro cartões
> pendurados viraram um cartão só, dividido por fios (4 colunas no
> computador, 2x2 no tablet, empilhado no celular), número grande em ouro
> itálico, ícone pequeno e a linha de ouro crescendo na borda de cima
> (`.trilha-topo`, scroll-driven). Capturas em `scratchpad/etapa52`.

> **ADENDO 35 (07/10/2026): a paleta voltou ao "Branco, azul e ouro". Não publicado.**
> Pedido: "volte as cores como estava antes", logo depois de ver a paleta do
> Instagram aplicada. O adendo 34 foi desfeito por script
> (`scratchpad/despaletar-r35.cjs`: os casos com dois valores de origem
> tratados por contexto, o resto pelo mapa inverso), sem tocar no que mais
> entrou no dia (bloqueio do login, painel em linhas, 10 fotos, duas artes).
> O token `--color-areia` saiu junto. Fica registrado: a paleta do Instagram
> foi testada e reprovada no site; não propor de novo.

> **ADENDO 34 (07/10/2026): a paleta do Instagram no site e no painel. DESFEITO no adendo 35.**
> Pedido: "atualize o site nessa paleta de cores, quero o site clean":
> primária #322F69 (azul-marinho arroxeado, o "Viver Bem" do logo),
> dourado #C9A56B, creme #F9F4EA (fundo principal) e areia #E6DDD3 (fundo
> dos posts de produto). O sistema passou a se chamar "Creme, roxo-marinho e
> ouro": `--color-papel` virou creme (fundo do site), `--color-gelo` um
> creme-areia (#EFE8DC) para preenchimentos leves, `--color-areia` novo
> (fundo das fotos de produto: cartão, galeria, miniaturas, círculos das
> áreas), `--color-fio` quente (#E3D9CC), navy e tinta (a ação) viraram a
> primária #322F69 (escura #262457), ouro #C9A56B / claro #D6B885 / escuro
> #85673A (4,5:1 sobre creme), grafite e cinza quentes (#2A2740, #6A6480),
> degradê de ouro e luzes dos banners refeitos (lavanda no lugar do azul).
> Trocado por script (`scratchpad/repaletar-r34.cjs`): 26 arquivos, 58
> literais hex e todas as sombras rgba. Cabeçalho, menu do celular, barra do
> catálogo e "Fale com a gente" em creme; cartões brancos sobre o creme. O
> painel acompanha (névoa #F7F3EB). Vermelho segue só no logo.

> **ADENDO 33 (07/10/2026): bloqueio do login, painel em linhas, 10 fotos, duas artes na dobra. Não publicado.**
> Pedidos: "criptografia no site para acessar o painel; tentou 5 vezes,
> bloqueia e não deixa mais tentar / painel mais moderno e clean / mais
> fotos no produto / duas fotos na home, para PC e para mobile".
> Login: as senhas já eram hash (bcrypt, agora custo 12) e a sessão já ia em
> cookie criptografado (iron-session; agora com validade de 12h). Entrou a
> camada que faltava, `src/lib/protecaoLogin.ts` + tabela `TentativaLogin`
> (migração `20261007210419_tentativas_de_login`): cada senha errada conta
> no e-mail e no IP; na 5ª, bloqueio de 30 min (429 com `bloqueadoAte`), a
> tela mostra o tempo e desliga o botão, o log registra; atraso aleatório
> de 250 a 600 ms em toda tentativa; acerto zera; o gestor desbloqueia em
> Acessos ao painel (`PATCH { desbloquear: true }`). Testado: 4 x 401 com a
> contagem, depois 429. Painel: produtos em LINHAS (capa, nome com selos,
> preço editável, chaves "No site" e "Preço no site", ações; novidade e
> destaque ficam no formulário). Galeria: até 10 fotos (`MAX_FOTOS_PRODUTO`).
> Dobra: até DUAS artes (`heroDesktop2`/`heroCelular2`), cada uma com a
> versão do computador e a do celular; com duas, `CarrosselArte` alterna em
> fade a cada 7s (para no hover e com a aba escondida) com bolinhas no alto;
> `obterArtesHero()` devolve a lista; a página "Home e arte da dobra" tem
> Arte 1 e Arte 2. A vitrine estática leva as duas. Capturas em
> `scratchpad/etapa50` (artes de teste subidas e removidas; nenhuma arte
> ficou no banco).

> **ADENDO 32 (07/10/2026): botões mais clean (cápsula do celular, flutuantes, Adicionar). Não publicado.**
> Pedido com quatro prints: "deixe esses botões mais clean". A cápsula do
> celular deixou de ser navy com o carrinho num círculo de ouro: virou uma
> cápsula branca com fio, os três ícones em navy (40px), o que estiver
> aberto em círculo navy e a contagem do carrinho num selo pequeno de ouro
> chapado (`BotaoCarrinho` ganhou a prop `selo`). Os dois flutuantes do
> celular viraram pílulas navy simples de 48px, sem círculo e com sombra
> menor: "Enviar receita" (ícone + texto) e o carrinho (ícone + contagem num
> selo de ouro de 28px; no computador, "Ver pedido" + selo, numa linha só).
> O `.botao-carrinho` ("Adicionar", "Adicionar ao carrinho", compacto)
> ficou em ouro chapado (`--color-ouro-claro`, hover `--color-ouro`),
> sem o brilho metálico e sem sombra; o degradê de ouro segue só nos
> acentos pequenos (círculos de ícone, fios, bolinha ativa). Capturas em
> `scratchpad/etapa49`.

> **ADENDO 31 (07/10/2026): revisão de design medida, ajustes pontuais. Não publicado.**
> Pedido: "deixar mais clean, moderno, sofisticado e profissional, mantendo
> a estrutura, os conteúdos, as funcionalidades e a identidade; evolução,
> não reconstrução". Em vez de redesenhar, uma auditoria medida (skill
> design-review + `scratchpad/auditar-r31.cjs`: 7 páginas em 1440, 1024,
> 768 e 390) e só o que a medição apontou, registrado em
> `especificacoes/2026-10-07-design-review.md`. Corrigido: estouro de 97px
> da home no tablet (a faixa dos reels deixava de rolar no md; agora rola até
> o lg, com cartões de 14rem no lg e 16rem no xl); potes da dobra cortados
> no md (tamanho intermediário até o lg); avatares das avaliações de 256px e
> 1,9 MB para 120px e 76 KB (o download pede 128px); logo de 1.133px/210 KB
> para 560px/76 KB (original em `midia/logo-original.png`); um só título de
> segundo nível, `.titulo-bloco` (`--tam-bloco` 28 a 38px), nas vitrines,
> áreas do catálogo, "Mais em", lojas e contato (eram 34, 36 e 40px);
> alvos de toque em 44px (bolinhas dos reels com área de toque e bolinha
> pequena, Instagram dos reels, pílulas "ver mais" e as do cabeçalho, pílula
> da área do produto, adicionar compacto da coluna lateral, "Página das
> lojas"; a cápsula do celular foi para 40px, 48 no total, para não brigar
> com a logo); rótulos da régua do horário de 3,1:1 para 6,6:1. Ficou de
> fora, de propósito: os links da faixa do topo (36px, só mouse) e as fotos
> de produto de 500px nos círculos pequenos (certas no celular com 2 a 3x).

> **ADENDO 30 (07/10/2026): quatro retoques no site e os dois painéis (gestor e colaborador). Não publicado.**
> Site: os links institucionais da faixa do topo viraram texto fino com um
> ponto de ouro entre eles e um fio de ouro que nasce no hover e fica na
> página atual; o cabeçalho das avaliações trocou o botão "Ver no Google"
> por um selo (G, nota com estrelas, total e seta em ouro); o cabeçalho do
> catálogo trocou o cartão da receita por um bilhete em azul-noite inteiro
> clicável (ícone em ouro, "Tem a receita? *Envie a foto*", seta em círculo
> branco); o cartão do horário ganhou o estado ao vivo no alto, a régua do
> dia (7h a 21h, o horário de hoje em ouro e a hora de agora em navy, via
> `minutos` no `useEstadoLoja`) e a semana em círculos com hoje em ouro.
> Painéis, em cima do painel que já existia (pedido: "não precisa começar do
> zero"): paleta do site (névoa `#f5f8fc`, navy, tinta, ouro nos acentos,
> vermelho só em ação destrutiva; `.degrade-marca` apagado), peças em
> `PecasAdmin` (CabecalhoAdmin com rótulo, CartaoAdmin, CartaoNumero,
> Selo, BotaoAdmin, CampoAdmin, Interruptor com cor ouro, AvisoAdmin,
> Inicial, Alca); ícones do menu em `iconesAdmin.tsx`, módulo sem "use
> client" (importados num Server Component a partir da casca, viravam
> referência de cliente e não renderizavam). Banco (migração
> `20261007181808_painel_fotos_secoes_visibilidade`): `FotoProduto` (até 5
> por produto, `fotoUrl` segue como capa), `Produto.mostrarPreco` (só
> industrializado; a rota recusa em manipulado), `Categoria.visivel` e
> `vitrineHome`, `Configuracao` chave/valor (`secoesHome`, `heroDesktop`,
> `heroCelular`; `valor` entra nos `@db.Text` do `trocar-banco`).
> Colaborador (OPERADOR): produtos com galeria e preço no site, categorias
> (criar, renomear, "No site", "Vitrine na home"), Home e arte da dobra
> (seções da home e upload da arte, `/api/admin/site` e `/api/admin/hero`);
> não apaga, não publica, não reordena. Gestor: tudo isso e a visão geral
> refeita com a gestão primeiro (KPIs com variação, gráficos tinta/ouro,
> retrato do catálogo, como recebem, atenção, equipe e últimas ações,
> últimos pedidos, atalhos por último). O site lê tudo isso: `obterCatalogo`
> filtra categorias visíveis (e os produtos delas), `paraVitrine` só deixa
> o preço passar com `mostrarPreco`, a home liga as seções e `obterArteHero`
> lê a Configuracao antes dos arquivos; página do produto com
> `GaleriaProduto` (miniaturas, contador) e o preço quando liberado; cartão
> e cartão de compra idem. Vitrine estática: o retrato ganhou `fotos`,
> `mostrarPreco`, `visivel`, `vitrineHome` e `configuracao`. ESLint passou
> a ignorar `prisma/**` e `scripts/**` (CommonJS). Produto de teste
> "Protetor solar FPS 50 Viver Bem" (id 77) ficou no banco local como "em
> falta", para o gestor testar galeria e preço; pode ser apagado. Capturas
> em `scratchpad/etapa45` (gestor), `etapa46` (site) e `etapa47`
> (colaborador).

> **ADENDO 29 (07/10/2026): reels centralizados no celular; os dois produtos novos na dobra. Não publicado.**
> Reels no celular ("centralizado, com opção de arrastar para os dois
> lados"): a faixa ganhou recuo lateral de `calc(50% - min(7,5rem, 35vw))`
> dos dois lados e o cartão passou a medir `min(15rem, 70vw)` (a largura em
> porcentagem encolhia com o recuo da faixa), então o cartão ativo fica
> sempre no centro com os vizinhos aparecendo; ao abrir, a faixa já posiciona o SEGUNDO reel no
> centro (um efeito que só mexe na rolagem) para haver vídeo dos dois
> lados desde o início; o observador que marca o ativo segue igual. Dobra
> ("coloque os produtos em anexo com a frase que estava antes,
> provisoriamente"): a bancada passou a mostrar o Caramelo de Creatina e a
> Creatina Gummy (as fotos anexadas são idênticas às do catálogo, então
> reaproveitam `/uploads/caramelo-creatina.png` e `creatina-gummy.png`),
> maiores, com a Gummy à frente como LCP; textos iguais. Fica assim até a
> arte da farmácia entrar pelo modo arte (adendo 28). Os dois são
> industrializados com registro, então a dobra não exibe manipulado.

> **ADENDO 28 (07/10/2026): menu sem ícones, banner no fim da faixa, traço de ouro nos títulos, cabeçalho do catálogo, dobra com modo arte. Não publicado.**
> Menu do celular: saíram os ícones das linhas e o "Aberto agora" (pedido
> "exclua isso"); ficou texto + seta. Vitrines: o banner da área virou o
> ÚLTIMO cartão da faixa (`FaixaProdutos` ganhou `depois`; `antes` continua
> disponível) para os produtos virem primeiro. Títulos de seção ("quero
> mais moderno"): depois do rótulo, o título ganha um traço curto de ouro
> embaixo (`.rotulo-pilula + .titulo-secao::after`, 3rem x 3px; centrado nas
> seções centradas; também no `.titulo-display` da dobra); na noite o
> rótulo sai em ouro-claro. Catálogo (/produtos): o cabeçalho virou uma
> grade com o título à esquerda e, à direita, o convite da receita num
> cartão em azul-noite (ícone em ouro, frase e botão branco), no lugar do
> texto solto com botão. Dobra: dois modos em `Abertura`: com a ARTE da
> farmácia (`src/lib/hero.ts` lê `public/uploads/hero/desktop.*` e
> `celular.*`), a dobra mostra a arte inteira e só os três botões por cima,
> centralizados (h1 só para leitor de tela); sem arte, a composição padrão,
> agora com anel interno, rótulo com fio de ouro, traço de ouro no título e
> uma luz azul atrás dos potes. Os botões viraram `BotoesDaDobra`,
> compartilhado pelos dois modos. LEIA-ME em public/uploads/hero/ e nota no
> README; o envio pelo painel fica para depois. Testado com uma arte de
> gradiente temporária, depois apagada.

> **ADENDO 27 (07/10/2026): passada "clean", limpeza do que não era usado, ícones compartilhados e preparo para MySQL. Não publicado.**
> Menu do celular ("não gostei, quero mais clean"): sem cartões, selo
> "Aberto agora" como texto, três linhas de "A Viver Bem" com ícone
> pequeno em ouro e seta, Lojas e Contato na mesma linguagem, botão da
> receita. Passada clean no site mantendo a estrutura: o rótulo de seção
> voltou a ser texto (caixa alta pequena com um fio de ouro na frente, sem
> caixa); o banner da vitrine perdeu a malha, o anel e o brilho de hover;
> a malha de laboratório ficou mais sutil (6%). Limpeza: saíram as classes
> CSS sem uso (abertura-presa e o keyframe abertura-recua, citacao,
> degrade-suave, fio-ouro, ladrilho-vidro, selo-secao, sombra-card-hover,
> texto-degrade, tinta-azul), três fotos órfãs em public/fotos e a faixa
> antiga "Você viu recentemente" (o histórico virou o hook
> `src/lib/useVistosRecentemente.ts`); os quatro reels foram recodificados
> em 540p (public/videos de 24,4 para 14,7 MB). Engenharia: os ícones
> repetidos em vários arquivos (WhatsApp, Instagram, seta, chevron, sacola,
> visto, relógio) viraram um módulo só, `src/components/site/icones.tsx`;
> os botões "Adicionar" passaram a usar a mesma sacola do carrinho; os
> erros de lint antigos do painel admin foram corrigidos (Link em vez de
> `<a>`, estado derivado durante a renderização em vez de setState em
> efeito, chip de filtro fora do componente): `eslint src` inteiro e
> `tsc` zerados. MySQL: `scripts/trocar-banco.js` aceita `mysql`
> (`npm run db:mysql`) e, fora do SQLite, marca os textos longos
> (descricao, composicao, modoUso, indicacoes, texto, itens, detalhe) com
> `@db.Text`, porque no MySQL String vira VARCHAR(191); schema validado
> nos dois providers; .env.example, schema e README atualizados.

> **ADENDO 26 (07/10/2026): menu do celular sem cara de genérico. Não publicado.**
> O menu que abre no botão do cabeçalho ("modernize essa parte, tire a
> cara de site genérico") deixou de ser uma lista de links: fundo em
> degradê branco-gelo; no alto o selo ao vivo "Aberto agora · Fecha às
> 19h" (`SeloAbertoMenu`, porque a faixa do topo não existe no celular);
> os três atalhos de "A Viver Bem" num cartão branco, cada um com ícone em
> círculo de ouro (relógio, receita, estrela), uma linha de apoio ("Desde
> 1999 em Petrópolis", "Da receita até a sua mão", "5,0 no Google") e a
> seta em ouro; "Lojas" e "Contato" em dois cartões lado a lado com ícone
> (a página atual fica em azul); e o "Enviar receita" embaixo. Os mesmos
> destinos de antes.

> **ADENDO 25 (07/10/2026): sem contagens, sem linha de progresso, faixa do topo de volta, rodapé novo, coluna na página do produto. Não publicado.**
> As contagens de produtos saíram do site ("não mostre a quantidade"): do
> banner da vitrine (`pilula` apagada de `BannerVitrine`) e dos círculos
> das áreas (`contagens` apagada de `CategoriasRedondas` e da home). A
> linha de progresso em ouro sob o cabeçalho saiu (`.progresso-rolagem`
> apagada). Faixa do topo ("antes estava melhor, volte e melhore
> suavemente"): voltou ao formato de texto com fio entre as vantagens, sem
> pílulas, agora com o selo ao vivo "Aberto agora · Fecha às 19h" como
> primeiro item e `whitespace-nowrap`; para nunca quebrar linha, a nota do
> Google entra de lg e a retirada só de xl; altura 36px e
> `--altura-cabecalho` md de volta a 10,25rem. Rodapé: a versão em grade
> (marca à esquerda, navegação em duas colunas, ícones à direita) foi
> testada e REPROVADA na hora ("não gostei do rodapé, aperfeiçoe o que já
> estava"); voltou o rodapé centralizado em três tempos, com retoques: fio
> de ouro no alto, a malha fina e a luz de ouro ao fundo, links um pouco
> mais legíveis e hover em ouro-claro. A mesma informação de sempre. "Como funciona"
> da fileira de categorias virou pílula branca com a seta em círculo de
> ouro. Página do produto ("coluna de os mais procurados e os que a pessoa
> já visitou"): nova `ColunaLateralProduto` com dois blocos compactos
> (foto 56px, nome, área, adicionar compacto): "Mais procurados" (4 do
> catálogo com foto, sem o atual) e "Você viu recentemente" (histórico do
> navegador via o novo hook `useVistosRecentemente`, extraído de
> `VistosRecentemente`); no xl é a 3ª coluna presa (`xl:grid-cols-[1fr_1fr_16rem]`,
> página em `xl:max-w-7xl`), abaixo disso dois blocos lado a lado embaixo
> do produto, no lugar da faixa antiga de vistos.

> **ADENDO 24 (07/10/2026): acabamentos, "mais elegante e moderno". Não publicado.**
> Rótulo das seções (`.rotulo-pilula`): branco com fio de ouro a 35%, texto
> navy em caixa alta mais espaçada, ponto de ouro com halo e sombra curta
> (era gelo com fio cinza e texto azul). Banner da vitrine: a pílula
> "10 PRODUTOS" virou o número grande em ouro (`numero-tinta`) com a
> palavra pequena ao lado; o pé ficou em duas linhas, "VER PRODUTOS" e,
> embaixo, um fio de ouro que corre até a seta em círculo de ouro com anel
> translúcido. Dobra: "Como funciona" virou pílula de vidro (branco 6%,
> fio branco, desfoque) com a seta para baixo num círculo no fim, que
> desce um pouco no hover (mesma família do "Ver produtos").

> **ADENDO 23 (07/10/2026): faixa do topo, sacola, rodapé, horário, 4 avaliações novas, banner e potes. Não publicado.**
> Faixa do topo (computador): o selo ao vivo "Aberto agora · Fecha às 19h"
> (`SeloAbertoFaixa`, via `useEstadoLoja`), as vantagens em pílulas de
> vidro com ícone em ouro, o WhatsApp com o número e os links em pílulas;
> altura de 36 para 40px (`--altura-cabecalho` md 10,5rem). Ícone do
> carrinho virou uma SACOLA com alça (`IconeCarrinho`), em todos os usos.
> Rodapé: a assinatura gigante "Viver Bem" em marca d'água saiu e o site
> termina na linha do © (padding 10/12). Horário ("modernize a parte de
> horários"): hoje em destaque (horas grandes + "Hoje · fecha às 19h"), a
> semana em sete quadradinhos (hoje em navy, dias fechados apagados) e as
> três linhas compactas. Avaliações: +4 do Google com foto real (João
> Luis, Shirlei Mayworm, Andresa Neumann, Marcela A Kuster; lidas no Google
> Maps pelo navegador do painel, fotos em public/uploads/avaliacoes/,
> gravadas no banco e nos arquivos de seed/script), total do perfil
> atualizado de 634 para 680, e os cartões 1rem/1,5rem menores. Banner da
> vitrine ("modernize mais"): título em cima, "VER PRODUTOS" pequeno e a
> seta grande em círculo de ouro no pé, marca d'água maior e um brilho que
> acende no hover. Dobra: só 3 potes (o Glow Cream saiu), 10% maiores.

> **ADENDO 22 (07/10/2026): carrinho, banner da vitrine com setas, reels interativos, história da farmácia. Não publicado.**
> Carrinho: no celular a barra branca virou uma CÁPSULA NAVY com o carrinho
> em pílula de ouro (ícone e contagem em navy), lupa e menu em branco; o
> flutuante virou pílula navy com o ícone num círculo de ouro e a contagem
> (no computador também "Ver pedido · N itens"). O rótulo "compre por área"
> saiu: só "Nossas categorias". Vitrines: o banner da faixa encolheu para
> 11/12rem, só pílula, título e botão (produtos em destaque), e a
> `FaixaProdutos` ganhou SETAS redondas nas bordas no computador (somem na
> ponta; prop `setas`), também no catálogo. Instagram: dois reels novos
> (`reel-3.mp4` área dos olhos, 25s; `reel-4.mp4` pads faciais, 46s;
> 720p, faststart, pôsteres em 0,6s e 44,5s) e a seção virou interativa em
> JavaScript: fileira de quatro com o ativo maior e anel de ouro, barra de
> progresso como nos stories, o próximo entra sozinho ao terminar, botão de
> som, bolinhas de navegação, faixa com snap no celular; no computador sem
> "reduzir movimento" o ativo começa mudo ao entrar na tela; botão do
> Instagram com anel de ouro que gira e "ímã" que segue o mouse (só mouse).
> **Pendência regulatória**: os reels 3 e 4 anunciam manipulados com
> promessa de efeito e menção a preço, o mesmo motivo que tirou o 3º reel
> antes (RDC 67/2007 item 5.14); o farmacêutico precisa aprovar antes de
> publicar. Página "A Viver Bem": texto da farmácia em versão conceitual,
> abertura "Tudo começou com um propósito" com três números em ouro
> (1999, 20 anos, 3 lojas), linha do tempo em quatro cartões (1999, 2006,
> 2012, 2017) ligados pela linha de ouro (`.marco-ano`, `.trilha-h-*`),
> fecho em azul-noite com o "20" gigante e os botões. `ANOS_TRADICAO` 19
> -> 20 e "desde 2007" -> "desde 2006" (outubro de 2006, conforme o texto).

> **ADENDO 21 (07/10/2026): seis ajustes do celular. Não publicado (pedido: "não atualize o github").**
> 1) Carrinho do cabeçalho no celular ("algo mais elegante e moderno"):
> pílula navy com o ícone em ouro-claro e a contagem ao lado, dentro da
> barra branca (`BotaoCarrinho` ganhou `contagemInline`); vazia, é só o
> círculo com o ícone. 2) Sombra sob as vantagens: os cartões 2x2 ficaram
> sem sombra no celular e a primeira folha perdeu a sombra do topo
> (`.folha:first-child { box-shadow: none }`). 3) Rótulo "compre por
> área" virou PÍLULA com ponto de ouro (`.rotulo-pilula`: gelo, fio,
> caixa alta), e o mesmo rótulo-pílula entrou nas outras seções da home
> (como funciona, acompanhe a gente, quem já é cliente, fale com a gente)
> para o sistema ficar coerente. 4) "Como funciona" no celular: os quatro
> passos viram uma FAIXA que arrasta para o lado (cartões de 82% da
> largura, mesma altura, snap, sangria até a borda; o cartão das lojas
> mostra só os bairros numa linha para não ficar mais alto), e do md em
> diante seguem na grade.
> 5) Sombra dos produtos mais perto e um pouco mais escura: cartões
> `0 6px 8px / 0.30` (era `0 16px 14px / 0.22`), potes da dobra `0 10px
> 12px / 0.5` (era `0 24px 22px / 0.55`), círculos das áreas e "vistos
> recentemente" no mesmo espírito. 6) Logo 14% maior no celular (2,5rem ->
> 2,85rem); o cabeçalho manteve a altura (`--altura-cabecalho`).

> **ADENDO 20 (06/10/2026, noite): produtos um pouco menores; catálogo em faixas por categoria. Não publicado.**
> "Os produtos ficaram muito grandes": os cartões das faixas voltaram de
> 16/20rem para 15/18rem (no computador cabem o banner e 3 produtos
> inteiros, com o 4º aparecendo) e a foto ganhou um pouco mais de ar no
> ladrilho (`p-3`). Catálogo `/produtos` ("com os produtos arrastando
> para o lado também e separados por categoria"): cada categoria, e a
> "Pronta entrega", passou da grade para a `FaixaProdutos` que arrasta,
> com o mesmo título, descrição e "Ver categoria"; a busca e a página de
> uma categoria seguem em grade. Respiro entre as categorias de 16 para
> 12/14. Lint e tsc limpos; capturas em `scratchpad/etapa29/`. GitHub
> não atualizado (sem pedido nesta rodada).

> **ADENDO 19 (06/10/2026, noite): banner dentro da faixa, produtos grandes, site mais compacto. Publicado a pedido.**
> Vitrines ("diminua mais o quadrado azul", "coloque as categorias com os
> produtos maiores e arrastando para o lado"): o banner deixou de ser uma
> coluna da grade e virou o PRIMEIRO CARTÃO da faixa que arrasta (14/16rem
> de largura, mesma altura dos produtos), e os cartões de produto foram
> para 16/20rem (`FaixaProdutos` ganhou a prop `antes`; `ladoBanner`
> saiu). No celular o banner também entra na faixa, em vez de ocupar a
> tela inteira. Espaçamentos ("tire um pouco dos espaçamentos"):
> `--espaco-secao` de 4,5-7rem para 3,5-5,5rem, `--vao-titulo` de 2-3rem
> para 1,5-2,25rem, e as vitrines em sequência usam `.secao-vitrine` (70%
> do respiro); a home caiu de 7551 para 7263px no computador e de 10003
> para 8890px no celular. Lint e tsc limpos; capturas em
> `scratchpad/etapa28/`. Publicado no GitHub Pages a pedido explícito
> ("e atualize o github").

> **ADENDO 18 (06/10/2026, noite): vitrines com o produto em destaque; "Fale com a gente" refeito com a skill ui-ux-pro-max. Não publicado.**
> Vitrines ("diminua o espaço do quadrado azul e aumente o produto"): o
> banner passou de 4 para 3 das 12 colunas e a faixa de 8 para 9; os
> cartões das vitrines da home foram de 16 para 18rem no computador (15rem
> no celular) e a foto ganhou recuo menor no ladrilho (`p-2.5`); no
> computador cabem 3 cartões inteiros ao lado do banner. O banner ficou
> mais baixo no celular (16rem), com título de 1,7rem e a marca d'água
> menor no computador. "Fale com a gente" (3ª versão, com a skill:
> estilo "Trust & Authority" para saúde, contato nunca escondido, uma só
> ação principal, estado do sistema visível): cabeçalho com o título em
> duas vozes e o selo ao vivo "Aberto agora · Fecha às 19h" (ponto verde
> pulsando só sem "reduzir movimento", `role="status"`); grade com a
> RECEITA em azul-noite (malha, luz de ouro e a folha de receita em vidro
> como ilustração, título em duas vozes, pílula "Começar"), o WhatsApp
> com o número grande e a mensagem que já vai pronta num balão (o link
> leva `?text=`), as 3 LOJAS com endereço completo e "Como chegar" (mapa;
> antes eram só chips; no celular viram linhas) e o cartão do HORÁRIO com
> o dia de hoje marcado e o link "Página das lojas". Sem telefone fixo.
> Lint e tsc limpos; capturas em `scratchpad/etapa26/` e `etapa27/`.
> **GitHub NÃO atualizado: pedido explícito "só atualize o GitHub quando
> eu mandar"** (a prévia pública segue no commit `bfeee9c`).

> **ADENDO 17 (06/10/2026, noite): prévia publicada no repositório novo.**
> A pedido ("crie um repositório no GitHub e um link de visualização"), a
> remodelagem foi commitada (`04ca686`, adendos 4 a 16) e publicada no
> repositório público **abalduinojose-cmd/viverbem** (remoto `novo`; a
> branch `remodelagem-receita-rotulo` virou a `main` de lá). O GitHub
> Pages serve a pasta `docs/` da `main`:
> **https://abalduinojose-cmd.github.io/viverbem/**. A vitrine estática
> agora tem o `basePath` `/viverbem` por padrão (`next.config.ts`); o
> repositório antigo `app_viverbem-` continua intocado, com a primeira
> versão. Para atualizar a prévia: parar o `next dev`, `npm run
> demo:build`, commit e `git push novo remodelagem-receita-rotulo:main`.

> **ADENDO 16 (06/10/2026, noite): sai o rótulo em vidro; banners e "Como funciona" novos; a receita em destaque na gaveta; flutuantes discretos.**
> O rótulo "Preparado para [nome]" em vidro saiu do site inteiro a pedido
> ("exclua isso de todo o site"): da bancada da abertura e do banner "Mais
> procurados"; `RotuloVidro` e os nomes fictícios foram apagados de
> `Abertura.tsx`, e `BannerVitrine` trocou `rotulo`/`legenda`/`contador`
> por `pilula`. Banners das vitrines ("melhore todos os LinkComponent,
> deixe mais moderno"): malha fina de laboratório (`.malha-banner`, linhas
> brancas a 8% mascaradas no alto à direita), luz dourada e azul, um anel,
> a inicial da área como marca d'água preenchida (branco 7% + fio de ouro)
> que desce mais devagar que a página (`.paralaxe-vista`, view timeline),
> pílula de vidro com ponto de ouro e o total ("10 produtos"), título em
> duas vozes (a parte entre *asteriscos* dos textos em `page.tsx` sai em
> itálico ouro, via `TituloDuasVozes` e `.titulo-banner`) e o botão "Ver
> produtos" em vidro com a seta no círculo de ouro (irmão noturno do
> `BotaoVerMais`). "Como funciona" (3ª versão, "modernize a seção"):
> título em duas vozes com o apoio ao lado; quatro cartões brancos lado a
> lado (1/2/4 colunas), cada um com o número num círculo de ouro saindo
> pela borda de cima (`.passo-numero`) e o ícone do passo (receita,
> prancheta com visto, frasco, moto) em círculo ouro/10; no computador a
> `.trilha-h-linha` liga os quatro números e a `.trilha-h-progresso`
> cresce com a rolagem (view timeline, `cover 0% 55%`); fecha com o
> convite em azul-noite ("Receita em mãos? Envie a foto agora *e o
> farmacêutico confere.*", malha, ícone em ouro, botão branco "Enviar
> receita" com o ícone em círculo de ouro e "Tirar uma dúvida antes" em
> contorno; o parágrafo some no celular); aviso legal embaixo. "Melhore a
> parte de enviar a receita": na gaveta, o cartão da receita ligado vira
> azul-noite com a malha, o ícone e a chave em ouro (botão navy) e três
> mini-passos ("Seus dados", "Mensagem pronta", "Foto na conversa") com
> numerais em ouro; desligado, "Tire uma foto da prescrição e envie pelo
> WhatsApp". O "Ver carrinho" flutuante no celular virou só o círculo navy
> com o contador (o texto cobria os botões das seções, visto no print do
> usuário); o "Enviar receita" flutuante some enquanto um botão de receita
> da página está na tela (`data-receita-cta` no `BotaoEnviarReceita`,
> IntersectionObserver reconsultado a cada `usePathname`). Capturas em
> `scratchpad/etapa24/` e `etapa25/`.

> **ADENDO 15 (06/10/2026, noite): gaveta do pedido refeita, "mais clean e fácil para o cliente".**
> `CarrinhoDrawer.tsx` reescrito por inteiro mantendo a lógica (estado,
> `enviarPedido`, Esc/Tab, foco e trava de rolagem, botões flutuantes,
> `role="switch"`, `aria-pressed`). Cabeçalho enxuto: "passo 1 de 2" em
> rótulo cinza, título ("Seu pedido" / "Seus dados" / "Tudo certo"), botões
> redondos em gelo (voltar só na etapa 2, fechar) e DOIS TRAÇOS de progresso
> em ouro no lugar das pílulas de etapa; a linha de resumo duplicada saiu
> do topo. Etapa 1: cartão da receita com ícone em quadrado e uma chave
> (switch) visual à direita, azul quando ligada; "você viu" numa pílula
> fina; lista "Produtos" com um "Limpar" discreto no lugar do "Tirar todos
> os produtos"; cartões menores (foto 64px em gelo, nome, lixeira, chip da
> dosagem e stepper em pílula de gelo com o "+" em navy); vazio com borda
> tracejada, ícone do carrinho e "Ver produtos"; só a receita marcada
> mostra um convite em uma linha para juntar produtos. Rodapé com UMA linha
> ("2 produtos · valor pelo WhatsApp") e "Continuar" com seta. Etapa 2:
> campos agrupados (nome e WhatsApp; "Como você quer receber" em dois
> cartões com ícone, navy quando escolhido; lojas em rádios; endereço com
> aviso da taxa), e Observação e Resumo em SANFONAS (`<details>`) fechadas,
> para a tela caber no celular. Rodapé: "Enviar pedido no WhatsApp" com o
> ícone, a dica em `aria-live` enquanto falta algo e, quando dá, "Pedido
> VB-XXXX · seus dados ficam só com a Viver Bem, conforme a LGPD" (código
> sem quebrar no hífen). Confirmação: círculo de ouro com o check, "Pedido
> enviado" e "Concluir". `summary::-webkit-details-marker` escondido para
> o Safari. Verificado por script: Continuar desabilitado no vazio, switch
> com `aria-checked`, retirada exige loja, link do WhatsApp com os dados,
> foco preso em 12 Tabs, Esc devolve o foco ao botão do carrinho, zero erros
> de console. Capturas em `scratchpad/etapa23/`.

> **ADENDO 14 (06/10/2026, noite): vídeo na dobra testado e reprovado; barra do cabeçalho no celular.**
> O usuário mandou um vídeo de 10s dos produtos ("Hero Viver Bem.mp4",
> 1920x1080, fundo preto com legendas próprias) para o lugar dos potes no
> computador. Foi colocado numa tela arredondada à direita (H.264 720p,
> sem som, `<source media="(min-width: 768px)">` para o celular não
> baixar), ele viu e reprovou na hora ("não ficou bom, volte o que era
> antes"): a dobra voltou aos potes em todas as telas e os arquivos
> `public/videos/hero*.{mp4,jpg}` foram apagados. O que ficou da rodada:
> os botões do cabeçalho do celular viraram uma barra branca com fio e
> sombra, o carrinho num círculo de ouro (como os "Adicionar") com o
> contador em navy, e a lupa e o menu redondos dentro da barra (navy quando
> abertos).

> **ADENDO 13 (06/10/2026, noite): dobra mais curta e larga, folga nas avaliações, transições de rolagem.**
> Dobra "mais curta e rente às bordas": a seção passou a `max-w-[90rem]`
> com recuo de 12/20px (era 20/32 dentro de 1280px), o miolo com menos
> respiro (pt-7, md:py-9, md:min-h-[26rem]), a bancada de 13,5/22rem com
> os potes 18% menores e o display de 44-80px (era 48-90): no computador
> o banner caiu de ~630 para ~470px, no celular de ~800 para ~710px. A
> bancada ganhou paralaxe (`.paralaxe`, desce 3rem mais devagar que a
> página, scroll-driven). Avaliações no celular: o encaixe (`snap`) levava
> o primeiro cartão até o limite da tela, ignorando o recuo; entrou
> `scroll-pl-5 md:scroll-pl-8`, e o cartão fica a 20px da borda.
> Transições de rolagem mais presentes: `.revelar` sobe 56px com escala
> 0,98 ao longo de 45% da entrada (era 28px em 30%), a folha que sai recua
> para 0,92 e 25% de opacidade (era 0,95 e 35%), e uma linha de progresso
> em ouro (2px) cresce sob o cabeçalho conforme a página rola
> (`.progresso-rolagem`, scroll-driven). Tudo roda com "reduzir movimento"
> ligado; vídeo da rolagem em `scratchpad/video-r10/rolagem-390.mp4`.

> **ADENDO 12 (06/10/2026, noite): banners editoriais, vantagens centralizadas no celular.**
> Os banners das vitrines ("quero esse layout muito mais moderno") viraram
> peças editoriais em azul-noite: borda interna de vidro (`ring-inset`),
> luz dourada no canto, a inicial da área GIGANTE em contorno de ouro
> (SVG `<text>` com stroke, cortada pela borda), anéis finos como cápsulas
> vistas de cima, legenda em ouro (no celular e ao lado do rótulo em vidro
> só o total, "10 produtos"; no computador "Área · 10 produtos"), título,
> texto e a chamada "veja os produtos" com a seta num círculo de ouro, sem
> pílula branca. No "Mais procurados" o rótulo em vidro aparece em todas
> as telas. Vantagens no celular com ícone e textos centralizados. Botões
> secundários da dobra com ícone também no celular (grade em círculo e
> seta), com `shrink-0` nos ícones: o flex estava esmagando a seta para
> 3px; a dobra ganhou 8px de largura no celular (px-5) para os dois
> caberem lado a lado.

> **ADENDO 11 (06/10/2026, noite): três botões na dobra, fotos nas áreas, produtos maiores, contato sem telefone fixo.**
> Dobra com três botões em hierarquia (regra da skill ui-ux-pro-max: uma
> ação principal por tela): "Enviar receita" em branco com o ícone num
> círculo de ouro, "Ver produtos" em vidro com o ícone de grade e "Como
> funciona" só com o contorno; no celular a receita ocupa a linha e os
> outros dois dividem a seguinte. Círculos das áreas: as áreas sem foto
> própria usam frascos que já temos onde combinam (Vitaminas = Ômega 3,
> Saúde da Mulher = CitoRepair, Saúde do Homem = VitaFlex, mapa
> `FOTO_REPRESENTATIVA` na home); Cabelos & Unhas e Homeopatia & Florais
> ficam com a inicial em ouro sobre azul-noite até chegar foto. Fotos de
> produto 10% maiores (só a foto: o recuo do cartão caiu de 24 para 14px
> e o da página do produto de 32/48 para 24/36px). "Fale com a gente" com
> três cartões: a receita em azul-noite na linha inteira com a pílula
> "Começar", WhatsApp e Nossas lojas (bairros em chips) com a seta em ouro
> e uma linha de ação no pé; o telefone fixo saiu daqui e do rodapé
> (segue na página das lojas).

> **ADENDO 10 (06/10/2026, noite): auditoria de front-end, acessibilidade e UX (skill ui-ux-pro-max).**
> Auditoria automática (axe-core WCAG 2.1 AA + boas práticas, rolagem
> horizontal, alvos de toque, imagens sem dimensão, ordem de títulos,
> console) em 7 páginas x 4 larguras (320/390/768/1440), mais revisão de
> código. Corrigido: contraste do rodapé (textos de 40-50% de branco
> passaram a 60%) e dos textos pequenos em cinza-claro (3,1:1 -> cinza,
> 6,3:1); foco visível igual no site inteiro (`:focus-visible`, anel azul,
> ouro sobre o azul-noite); link "Pular para o conteúdo" e alvo
> `#conteudo` no layout; `cursor: pointer` nos botões (o Tailwind v4 deixa
> padrão) e `touch-action: manipulation`; rolagem suave nas âncoras com
> `data-scroll-behavior` no html (o Next 16 só suspende na troca de
> página com o atributo); `theme-color` e `color-scheme`. Catálogo: a
> página inteira virou `<main>` (conteúdo fora de landmark), o `nav` das
> áreas ganhou nome próprio (duplicava o do cabeçalho), h2 só para leitor
> de tela na página de categoria (h1 -> h3 pulava nível), só o "&" em
> itálico como na home. Toque: pílulas do cabeçalho com 40px, trilha de
> navegação com 44px, pílula da área do produto com 40px e 11,5px de
> texto; o cartão de produto inteiro virou o link (pseudo-elemento do
> nome; o botão fica por cima), a foto deixou de ser um segundo link.
> Imagens: `width`/`height` nas fotos de produto (500) e nos avatares
> (CLS). Gaveta do pedido: foco vai para a gaveta ao abrir e volta para
> quem abriu ao fechar, Tab preso dentro, rolagem da página travada,
> `type="text"`/`"tel"` nos campos e aviso do que falta para enviar; os
> botões "Adicionar" anunciam "Produto adicionado" (`aria-live`).
> `lib/carrinho.tsx` virou store externo com `useSyncExternalStore`
> (sem setState em efeito, sem divergência de hidratação, sincroniza entre
> abas). `video.play()` com catch. Apagados os componentes mortos
> `SecaoCategorias`, `SecaoQueridinhos`, `Numeros`, `SecaoTitulo`,
> `Revelar`. Resultado: 0 violações do axe nas 28 combinações (medidas com
> as animações de entrada desligadas; com elas ligadas o axe mede a cor
> na opacidade do momento e acusa falso positivo), 0 rolagem horizontal
> (inclusive em 320px), 0 erros de console, 0 imagens sem dimensão.
> Teste funcional do carrinho novo: adiciona, persiste ao recarregar,
> +/-, remover, foco e Esc conferidos por script.

> **ADENDO 9 (06/10/2026, noite, sétima rodada): dobra, categorias, arraste, cabeçalho do celular, cartão da nota e "Fale com a gente".**
> Botões da dobra: "Enviar receita" em branco com o ícone num círculo de
> ouro e "Como funciona" em pílula de vidro (antes era link sublinhado).
> Categorias: contagem de produtos embaixo de cada nome (vem da home,
> `contagens`). Saiu a numeração "01, 02" dos títulos das vitrines
> (reprovada). Arraste com o mouse nas faixas de produtos e de avaliações
> pelo hook `useArrasteHorizontal` (lib): o arrasto nativo de links e
> imagens era o que cancelava o ponteiro; testado por script (scrollLeft
> 4 -> 280 sem abrir produto). Logo do cabeçalho: na home, só volta ao
> topo com rolagem suave. Cabeçalho do celular: a cápsula em gelo virou
> três botões redondos, o carrinho em navy com o contador em ouro.
> Cartão da nota nas avaliações preenchido: "5,0 de 5, nota máxima",
> estrelas maiores, fotos de quem avaliou empilhadas, total e "Ver todas
> no Google". "Fale com a gente" reformulado e tirado do rodapé escuro:
> bloco claro com o título em duas vozes, pílula "Aberto agora" e a
> semana num cartão, e quatro cartões de contato (WhatsApp em verde,
> receita, telefone fixo, lojas) com a seta num círculo de ouro; o
> `Footer` devolve `<div class="mt-auto">` com o Fale com a gente e o
> rodapé navy. Botões de categoria (pílulas do cabeçalho, círculos da
> home e chips do catálogo) testados: todos navegam.

> **ADENDO 8 (06/10/2026, noite, sexta rodada): "Como funciona" claro, títulos das vitrines e botão do Instagram.**
> O painel em azul-noite do "Como funciona" saiu ("tire o azul forte do
> fundo"): a seção voltou para a folha clara, com a coluna do título
> presa ao rolar no computador e os quatro passos em cartões brancos
> pendurados na trilha clara (`.trilha-clara`): números em ouro, linha de
> ouro que cresce ao rolar, chips das lojas com o pino em ouro; o botão
> "Enviar receita" voltou a ser o principal azul. Títulos das vitrines
> maiores (1,75/2,5rem), com o índice da vitrine em ouro antes ("01 Mais
> procurados", "02 Dermatologia & Estética"...) e, nos nomes das áreas, só
> o "&" em itálico ouro (dividir o nome ao meio ficava estranho). O botão
> do Instagram virou pílula branca com o ícone num círculo de ouro, o
> @ em navy e a setinha de link externo em ouro.

> **ADENDO 7 (06/10/2026, noite, quinta rodada): banners sem foto de produto e botões "Adicionar" em ouro.**
> Os potes saíram dos banners das vitrines (pedido). Sem foto, o banner é
> o azul-noite com a inicial da área como marca d'água em itálico
> serifado (branco a 8%), uma pílula de vidro com o contador ("N
> produtos", total da área), um traço de ouro acima do título e o botão
> "veja os produtos" em branco com a seta num círculo de ouro; o banner
> virou coluna flex com altura mínima (18/20/26rem), contador em cima e
> texto embaixo, para nada se sobrepor no celular. No "Mais procurados" o
> rótulo em vidro continua (computador) e o contador vai para a direita.
> `.botao-carrinho` passou a **ouro** (degradê `--ouro-degrade`, texto em
> navy, sombra dourada, brilho no hover; verde com texto branco quando o
> produto entrou), nos cartões, nos relacionados e no cartão de compra da
> página do produto. O flutuante "Ver carrinho" segue navy com o contador
> em ouro, para se distinguir do "Adicionar".

> **ADENDO 6 (06/10/2026, noite, quarta rodada): página do produto, 2x2 e mais ouro.**
> Página do produto modernizada: a foto num ladrilho com a luz dourada e
> três selos de logística embaixo (Delivery, Retirada sem taxa, Receita
> conferida); a pílula da área em branco com fio e ponto em ouro (era o
> chip azul); o nome em 2,4/3,25rem; a segunda voz em itálico serifado
> ouro ("Preparado a partir da sua receita" ou "Pronta entrega nas
> lojas"); cartão de compra (`AcoesProduto`) com dosagens em pílulas,
> stepper em gelo com o "+" em navy e o `.botao-carrinho` grande; sanfonas
> dos industrializados em cartões; "Como pedir" como trilha clara
> (`.trilha-clara`, três passos, linha de ouro que cresce ao rolar).
> Vantagens no celular em 2x2 (cartões com o ícone em cima; do md em
> diante seguem pílulas). Botão flutuante "Ver carrinho" em navy com o
> ícone e o contador em ouro. Mais 10% de ouro no site: ícone dos botões
> do carrinho em ouro-claro, seta do "ver mais" num círculo de ouro (navy
> no hover), fio das vitrines começando em ouro, anel ouro/30 nos
> círculos de categoria e ícones das vantagens em círculos ouro/10.

> **ADENDO 5 (06/10/2026, noite, terceira rodada): sete pedidos por print.**
> "Delivery" no lugar de "Entrega de moto" nas vantagens e na faixa do
> topo, com o ícone do scooter (a partir do "moped" do Tabler Icons, MIT),
> que lê melhor pequeno. A seção de categorias colou nas vantagens: saiu
> o respiro de seção dela e `.folha` passou a 1,5rem de padding no topo
> (o vão caiu de ~139px para ~40px no computador). Vitrines: a pílula
> "ver mais" com a seta num círculo em azul-noite (`BotaoVerMais`); o
> banner sem foto ganha um pote .png da própria área flutuando sobre a luz
> dourada e, no "Mais procurados", o rótulo em vidro (`RotuloVidro`,
> exportado da Abertura) no computador; o cartão de produto ganhou a luz
> dourada no pé do pote e o botão virou `.botao-carrinho` (pílula cheia em
> azul-noite, azul no hover, verde por um instante quando o produto entrou,
> branca dentro de `.em-noite`). Reels centralizados: título no centro, os
> dois vídeos lado a lado no celular e no computador (o segundo desce um
> pouco no computador), legenda em vidro com o título do vídeo e o botão
> do Instagram embaixo. "Como funciona" virou um painel em azul-noite com
> a trilha do pedido: os quatro passos numa linha vertical, números em
> ouro e a linha de progresso que cresce com a rolagem (`.trilha-*`,
> scroll-driven, roda com "reduzir movimento"). O botão vermelho "1 Issue"
> dos prints é o indicador de erros do Next em desenvolvimento (não existe
> no site publicado).
> Passada de revisão depois dos prints: a mesma pílula (`BotaoVerMais`, em
> arquivo próprio) nos "Ver categoria" do catálogo e da página do produto;
> o banner "Mais procurados" escolhe um pote que nenhuma vitrine de área
> já usa, para não repetir o frasco em dois banners seguidos.

> **ADENDO 4 (06/10/2026, noite, segunda rodada): "modernize mais ainda" e a faixa do topo.**
> Cabeçalho translúcido (branco a 85% com desfoque); no celular os três
> botões (carrinho, busca, menu) ficam numa cápsula em gelo e o contador do
> carrinho é em ouro. A faixa de vantagens do computador passou a azul-noite
> (degradê navy → azul), cada vantagem com ícone em ouro e um fio entre elas
> (a do meio some abaixo de lg, para caber no tablet); os links
> institucionais viraram pílulas, com a página atual acesa
> (`--altura-cabecalho` = 7,25rem / 10,25rem). Categorias em pílulas em
> gelo com a ativa em navy e "Todos" com o ícone de grade. Vantagens em
> pílulas roláveis, com o ícone num círculo (ouro só na nota do Google).
> Avaliações abrem com o cartão da nota em azul-noite (5,0, estrelas em
> ouro, total) e seguem em cartões com aspas em ouro, texto na sans e rodapé
> com foto, nome e estrelas; "Ver no Google" ao lado do título. Gaveta do
> pedido como folha de baixo no celular (92dvh, com alça) e painel flutuante
> arredondado no computador; campos `.campo` em gelo, stepper com "+" em
> navy e pílulas de resumo no rodapé. Lógica do carrinho intacta. Ícones
> da loja e da estrela foram para `IconesVantagens.tsx`, usados no
> cabeçalho e nas vantagens.

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
