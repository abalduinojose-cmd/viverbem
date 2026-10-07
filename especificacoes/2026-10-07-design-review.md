# Design review: site da Manipulação Viver Bem

**Data**: 07/10/2026
**URL**: http://localhost:3000 (home, /produtos, /produtos/[categoria], /produto/[slug], /sobre, /lojas, /contato)
**Método**: auditoria medida com o navegador (scratchpad `auditar-r31.cjs`): 7 páginas em 1440, 1024, 768 e 390px. Para cada uma: tamanho e peso dos títulos, respiro das seções, alvos de toque abaixo de 44px, contraste do texto pequeno contra o fundo real, imagens maiores do que o espaço em que aparecem, peso por tipo de recurso e estouro horizontal. Mais as fotos de página inteira em 1440 e 390 (`auditoria-r31/*.jpg`).

## Impressão geral

Profissional e consistente: uma identidade só (branco, azul, ouro de acento), duas vozes tipográficas, cartões com o mesmo raio (1,75rem) e a mesma elevação, botões em três estilos usados do mesmo jeito em todas as páginas, foco visível e movimento que anda com a rolagem. O que sobrou eram detalhes de medida, não de desenho: um estouro no tablet, três tamanhos diferentes para o mesmo nível de título, alguns alvos de toque abaixo de 44px, um texto pequeno sem contraste e imagens muito maiores do que o espaço em que aparecem.

## Achados

### Alto
- **Estouro horizontal de 97px na home em 768px** (reels). A faixa dos vídeos deixava de rolar a partir de `md`, mas quatro cartões de 14,5rem mais os vãos somam 976px, mais do que cabe no tablet. → A faixa rola e encaixa até `lg`; os cartões ficam em 14rem no `lg` e 16rem no `xl`, que cabem centralizados. **Corrigido.**
- **1,9 MB de fotos de clientes na home**: 19 avatares de 256px e ~100 KB cada para círculos de 36 a 40px. → Redimensionados para 120px (3x) em JPEG 85: 1.863 KB viraram 76 KB. O script de download passa a pedir 128px ao Google. **Corrigido.**
- **Logo 10x maior do que o uso**: `logo.png` com 1.133px e 210 KB para 109px no cabeçalho (182px no rodapé). → 560px e 76 KB; o original ficou em `midia/logo-original.png`. **Corrigido.**

### Médio
- **Potes da dobra cortados no tablet** (768 a 1023px): a coluna da bancada fica com ~300px e os potes do computador (20 e 21,5rem) saíam pela borda. → Tamanho intermediário no `md` (14 e 15rem), o de sempre a partir do `lg`. **Corrigido.**
- **Três tamanhos para o mesmo nível de título**: as vitrines da home em 40px, as áreas do catálogo, "Mais em", lojas e contato em 36px, com rastreio e entrelinha diferentes; o item das lojas em 28px com entrelinha 1,33 (padrão do navegador). → Token único `.titulo-bloco` (`--tam-bloco`, 28 → 38px, peso 600, entrelinha 1,06, rastreio -0,035em), aplicado em todos; os nomes das lojas/contato em 1,35rem/2xl com entrelinha justa. **Corrigido.**
- **Alvos de toque abaixo de 44px**: bolinhas dos reels (10×10), ícone do Instagram em cada reel (40), pílulas "ver mais" (40), pílulas de categoria do cabeçalho (40), botões da cápsula do celular (36) e o botão compacto de adicionar da coluna lateral (40). → Bolinhas com área de toque de 44px (a bolinha segue pequena), Instagram 44, pílulas 44, cápsula 40 (a cápsula inteira 48, para não brigar com a logo), adicionar compacto 44. **Corrigido.** Ficaram em 36px, de propósito, os links institucionais da faixa do topo (só computador, uso com mouse) e a nota do Google na mesma faixa.
- **Contraste de 3,1:1** nos rótulos "7h, 14h, 21h" da régua do horário (11px, cinza-claro sobre branco). → 0,7rem em `text-cinza` (6,6:1). **Corrigido.**

### Baixo
- Fotos de produto de 500px aparecem em círculos de 76px (6,5x) e cartões de 123 a 242px: no celular, com densidade 2 a 3x, o tamanho está certo; no computador há excesso. Sem pipeline de imagens no servidor próprio, fica como está (os PNG têm fundo transparente e 100 a 160 KB cada).
- A legenda dos reels (branco sobre o vídeo) foi apontada pela medição automática contra o fundo da seção, não contra o vídeo; nas fotos, a pílula escura de vidro garante a leitura. Sem mudança.
- O HTML da home sai com 270 KB no modo de desenvolvimento (dados do React Server Components embutidos); em produção vai comprimido. Sem mudança.

## O que está bem e deve ser preservado
- Ritmo vertical consistente: seções com 80px (56 no celular), vitrines com 70% disso, fecho das folhas igual em todas.
- Hierarquia em três níveis claros: dobra (77px), seção (60px) e, agora, bloco (36px), com os cartões em 16px/500.
- Um raio de caixa (1,75rem) em 14 lugares e `rounded-full` nas pílulas; sombras curtas e iguais nos cartões.
- Botões: principal (azul), secundário (contorno), link com fio de ouro e o carrinho em ouro, sem variações soltas.
- Estados: foco visível global, hover em todo cartão clicável, página ativa marcada no cabeçalho e no menu.
- Movimento com a rolagem da própria pessoa (roda com "reduzir movimento"), paralaxe contida, cascata curta na carga.

## As 3 mudanças de maior impacto
1. A faixa dos reels sem estourar no tablet (a página inteira deixava de caber na tela).
2. Menos 1,9 MB na home com os avatares e a logo no tamanho certo.
3. Um só tamanho de título de bloco em todo o site.
