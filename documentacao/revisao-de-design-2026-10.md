# Revisão de design: Manipulação Viver Bem
**Data**: 05/10/2026
**URL**: http://localhost:3000 (branch `reformulacao-formularis`), vista com "reduzir movimento", como na máquina do Anderson

## Impressão geral
Site limpo e coerente (paleta disciplinada, itálico serifado como assinatura), mas com três padrões de "modelo pronto": ilustrações chapadas de banco de ícones, grades de cartão com ícone em quadradinho azul e a trilha de passos com bolinha numerada. Os três foram trocados por soluções tipográficas que usam a assinatura do próprio site.

## Achados

### Alto
- **Ilustrações chapadas** nas categorias e nos 22 produtos sem foto (potes e frascos azuis com detalhe vermelho, um deles com a onda do logo no rótulo): cara de banco de ícones. → **Corrigido**: os 8 desenhos em uso (`public/uploads/*.svg`, mesmos nomes) viraram traço fino azul com um único detalhe vermelho, sem onda.
- **Categorias** em 6 cartões grandes com ilustração ocupando quase metade da home. → **Corrigido**: cartões tipográficos (índice em itálico, nome com a segunda parte em itálico, quantidade de produtos, miniatura em traço fino, chip de seta). No celular viram linhas compactas.
- **"Como funciona"** no padrão ícone + bolinha numerada + linha ligando os passos. → **Corrigido**: números 01 a 04 grandes em Instrument Serif itálico, título alinhado à esquerda como as outras seções.
- **Abertura parada na foto menos nítida**: com "reduzir movimento" o carrossel não gira, e o primeiro slide era o quadro das mãos no pó vermelho. → **Corrigido**: primeiro slide com a foto do laboratório e a luz azul e vermelha da marca no fundo (`halo-marca`).

### Médio
- **"Cada pessoa tem sua fórmula"** em grade de 4 cartões com ícone. → **Corrigido**: ficha de 4 linhas com a palavra-chave em itálico (receita, farmacêutico, sob pedido, rótulo).
- **Botão "Adicionar ao carrinho"** quebrando em duas linhas nos cartões estreitos do celular. → **Corrigido**: "Adicionar" no celular, texto inteiro do `sm` para cima.
- **"Enviar receita" repetido** com o mesmo botão em degradê na abertura, no "Como funciona", na ficha e na entrega, além do cabeçalho e do botão flutuante. → **Pendente**: deixar o degradê só na abertura e no cabeçalho, e usar contorno nos demais.
- **Fotos da abertura e da loja** são quadros de reels, sem nitidez. → **Pendente** (depende da cliente).

### Baixo
- Nos cartões do catálogo, o nome da categoria se repete em todos os produtos dentro da própria categoria. → Pendente.
- `transition-all` nas setas do carrossel de avaliações (no Tailwind v4 o certo é `transition`). → Pendente.

## O que está bom
- Paleta azul e vermelho disciplinada, com o itálico serifado azul como assinatura dos títulos.
- Faixa de números aprovada pela cliente (número grande com unidade em itálico, fundo branco).
- Reels e avaliações reais com foto: o conteúdo mais autêntico do site.
- "Fale com a gente" em cartões e rodapé centralizado na estrutura da Cabana.

## Próximos 3 ajustes
1. Reduzir a repetição do "Enviar receita" em degradê.
2. Pedir à cliente fotos dos 22 produtos e da loja e do laboratório.
3. Tirar a categoria repetida dos cartões dentro da página da categoria.
