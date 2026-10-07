# Manipulação Viver Bem — Site + Painel Admin

Site híbrido (institucional + catálogo) da farmácia de manipulação **Viver Bem** (Petrópolis-RJ):

- **Site** (`/`): home com hero em vídeo, vitrines de produtos, banner, sobre, delivery, destaques e avaliações; catálogo por categorias com busca; **página exclusiva por produto** (`/produto/nome-do-produto`, o link para o Instagram, com miniatura de compartilhamento); carrinho que **finaliza o pedido pelo WhatsApp**.
- **Base de clientes**: cada pedido finalizado registra nome, WhatsApp e itens — consulte e exporte em Painel → Clientes captados.
- **Painel admin** (`/admin`): a equipe cadastra produtos, sobe fotos, altera preços e gerencia categorias sem depender de suporte técnico (papéis administrador e operador).

> Vídeo do hero: salve o arquivo como `public/hero.mp4` que ele entra sozinho na home.

## Stack

| Peça | Tecnologia |
|---|---|
| Front + Back | Next.js 16 (App Router, React 19) |
| Banco | SQLite via Prisma ORM (migração fácil para Postgres) |
| Autenticação | iron-session (cookie criptografado) + bcryptjs |
| Estilo | Tailwind CSS 4 (cores da marca em `src/app/globals.css`) |
| Upload de fotos | Disco local em `public/uploads/` |

## Como rodar localmente

Pré-requisito: Node.js 20.9 ou superior.

```bash
npm install                      # instala as dependências
copy .env.example .env           # (Windows) cria o .env — ajuste se quiser
npm run db:migrate               # cria o banco SQLite e as tabelas
npm run db:seed                  # popula com dados de exemplo + usuário admin
npm run dev                      # sobe em http://localhost:3000
```

- Totem: http://localhost:3000
- Painel: http://localhost:3000/admin
  - **Admin:** `admin@viverbem.com.br` / senha `viverbem123` (acesso total)
  - **Operador:** `operador@viverbem.com.br` / senha `operador123` (só cadastra/edita produtos e preços)
  - **Troque as senhas em produção** (veja abaixo).

### Logo oficial

Salve o arquivo do logo como **`public/logo.png`** — o app usa esse arquivo
automaticamente na tela inicial, no catálogo e no login. Se o arquivo não
existir, uma versão recriada em CSS é exibida no lugar.

## Variáveis de ambiente (`.env`)

| Variável | O que é |
|---|---|
| `DATABASE_URL` | Conexão do banco. Padrão: `file:./dev.db` (SQLite local). |
| `SESSION_SECRET` | Segredo que criptografa o cookie de sessão do admin. **Mínimo 32 caracteres.** Gere um valor aleatório para produção. |

## Estrutura do projeto

```
prisma/
  schema.prisma        # modelos: Categoria, Produto (inclui combos), Usuario
  seed.js              # dados de exemplo (APAGA produtos/categorias e recria)
public/uploads/        # fotos dos produtos (placeholders SVG + uploads do painel)
src/
  app/
    page.tsx           # totem: tela de boas-vindas
    catalogo/          # totem: catálogo completo
    admin/             # painel: login + páginas protegidas
    api/
      auth/            # login/logout
      admin/           # CRUD de produtos/categorias + upload (protegidos)
      totem/catalogo/  # JSON público do catálogo (base p/ modo offline da Fase 3)
  components/
    totem/             # componentes da tela do cliente
    admin/             # componentes do painel
  lib/
    db.ts              # instância do Prisma
    sessao.ts          # sessão do admin (iron-session)
    catalogo.ts        # consulta do catálogo (compartilhada página + API)
    preco.ts           # preços em centavos <-> "R$ 0,00"
    validarProduto.ts  # validação do formulário de produto
    slug.ts            # gera slugs de categoria
```

Detalhes de modelagem:

- **Combo é um produto** com `tipo: "COMBO"` — mesma tela de cadastro e mesma vitrine.
- **Preços são inteiros em centavos** (`precoCentavos`) para evitar erro de arredondamento. Use os helpers de `src/lib/preco.ts`.
- **Desativar ≠ apagar**: o toggle "Ativo" esconde o produto do totem na hora, mantendo o cadastro (para itens em falta).
- **Dosagens** (`dosagens`): texto livre separado por vírgula (ex.: `250mg, 500mg`). Se preenchido, o cliente escolhe a dosagem no totem antes de adicionar ao carrinho.
- **Carrinho + finalização**: vive no navegador do tablet (localStorage) — nada é gravado no servidor. Ao "Finalizar pedido" o cliente informa o nome (e observação); é gerado um código (ex.: `VB-8F3A`) e o pedido completo vira uma mensagem no WhatsApp da loja com todas as especificações (item, dosagem, quantidade, preço unitário, subtotal, total) para a recepção receber e mandar preparar (`src/lib/whatsapp.ts`).
- **Papéis**: `ADMIN` é o **gestor** (tudo: números, clientes, log, acessos, publicar e apagar) e `OPERADOR` é o **colaborador** (cuida do catálogo: produtos com até 5 fotos, preço no site, categorias com as chaves "No site" e "Vitrine na home", seções da home e a arte da dobra; não apaga, não publica, não reordena e não vê números).
- **Galeria** (`FotoProduto`): até 10 fotos por produto, reordenáveis no formulário; a primeira é a capa e fica copiada em `fotoUrl` para as listas.
- **Preço no site** (`mostrarPreco`): desligado por padrão; só liga em industrializado com registro (a rota recusa em manipulado, RDC 67/2007). O site não mostra preço de nada enquanto a chave estiver desligada.
- **Categoria no site** (`visivel`) e **vitrine na home** (`vitrineHome`): tirar uma área do site esconde também os produtos dela, sem apagar nada.
- **Ajustes do site** (`Configuracao`, chave/valor em JSON): as seções da home ligadas e a arte da dobra enviada pelo painel (`src/lib/configuracao.ts`, `src/lib/secoes.ts`).
- **Log de alterações** (`LogAlteracao`): registrado automaticamente pelas rotas de API a cada mutação — consulte em Painel → Log de alterações.

## Tarefas comuns

**Criar/alterar usuário admin:** rode `npm run db:studio` (interface visual do banco) e edite a tabela `Usuario`. Para gerar o hash de uma nova senha:

```bash
node -e "console.log(require('bcryptjs').hashSync('SENHA_NOVA', 10))"
```

**Resetar os dados de exemplo:** `npm run db:seed` (recria produtos/categorias; não mexe em usuários).

**Ligar e desligar seções da home, trocar a arte da dobra:** Painel → Home e arte da dobra (gestor e colaborador). **Tirar uma área do site ou da home:** Painel → Categorias, chaves "No site" e "Vitrine na home".

**Modo quiosque no tablet:** abra a URL do totem no navegador do tablet e use o modo tela cheia/quiosque do próprio navegador (Chrome: "Adicionar à tela inicial" ou um app de kiosk como Fully Kiosk). O totem volta sozinho à tela inicial após 90s sem toques (ajuste em `SEGUNDOS_INATIVIDADE`, `src/components/totem/CatalogoClient.tsx`).

## Deploy (auto-hospedado)

Num servidor com Node 20.9+:

```bash
npm install
npx prisma migrate deploy        # aplica as migrações (não apaga dados)
npm run build
npm start                        # sobe em produção na porta 3000
```

Recomendações:

- Use um gerenciador de processo (ex.: `pm2 start npm --name viverbem -- start`) para reiniciar sozinho.
- Coloque um proxy reverso com HTTPS na frente (Caddy ou Nginx) — o cookie de sessão exige HTTPS em produção.
- **Troque `SESSION_SECRET`** e a senha do admin.
- **Login protegido**: senhas em hash (bcrypt), sessão em cookie criptografado com validade de 12h e bloqueio de 30 minutos depois de 5 senhas erradas (por e-mail e por IP, tabela `TentativaLogin`). O gestor desbloqueia em Acessos ao painel. Atrás de proxy, mantenha o cabeçalho `X-Forwarded-For` para o bloqueio por IP funcionar.
- Faça backup do arquivo `prisma/dev.db` (banco) e da pasta `public/uploads/` (fotos) — são os dois únicos lugares com dados.

### Migrar para Postgres (quando precisar)

1. Em `prisma/schema.prisma`, troque `provider = "sqlite"` por `provider = "postgresql"`.
2. Aponte `DATABASE_URL` para o Postgres (ex.: `postgresql://usuario:senha@host:5432/viverbem`).
3. Rode `npx prisma migrate dev` (novo histórico de migrações será criado).

### Arte da dobra (home)

A farmácia troca a abertura da home pelas próprias artes em **Painel → Home e arte da dobra**: até duas artes, cada uma com a versão do computador (~1920x760, obrigatória) e a do celular (~1080x1350, opcional). Com uma arte, a dobra mostra a imagem inteira com só os três botões por cima; com duas, alterna entre elas (ver `src/lib/hero.ts`, `Abertura.tsx` e `CarrosselArte.tsx`). Para a primeira arte também funciona copiar os arquivos direto em `public/uploads/hero/desktop.jpg` e `celular.jpg`; o que foi enviado pelo painel tem prioridade.

### Paleta

O site usa o sistema "Branco, azul e ouro": azul da marca #1C69B5 (ação), azul-noite #0D2340 (títulos, banners, rodapé), ouro #B3904F / #C0A060 (acentos) sobre fundo branco e gelo #EEF3F9. Tudo está em tokens no `src/app/globals.css` (`@theme`); para mudar uma cor, mude lá. A paleta do Instagram (#322F69 / #C9A56B / creme / areia) foi testada em 07/10/2026 e desfeita a pedido.

### Migrar para MySQL (hospedagem do cliente)

1. `npm run db:mysql` troca o provider do Prisma e marca os textos longos com `@db.Text`.
2. No `.env` do servidor: `DATABASE_URL="mysql://usuario:senha@servidor:3306/viverbem"`.
3. `npx prisma db push` cria as tabelas; `npm run db:seed` carrega categorias, produtos e avaliações.
4. Para voltar ao SQLite local: `npm run db:sqlite`.

As fotos enviadas pelo painel continuam em `public/uploads/` (ou no Vercel Blob, quando houver token). O MySQL guarda só os caminhos.

### Publicar na internet (Vercel)

Veja o guia completo em **[DEPLOY.md](DEPLOY.md)** — sobe o app inteiro
(totem + painel) com link público, usando Postgres e Vercel Blob.

O upload de fotos já se adapta sozinho ao ambiente (`src/lib/armazenamento.ts`):
grava em `public/uploads/` no servidor próprio e na nuvem quando existe
`BLOB_READ_WRITE_TOKEN`. Para trocar por S3/Cloudinary, reescreva só a
função `salvarImagem()`.

## Avaliações do Google

As avaliações do Google **não podem ser importadas automaticamente** (o Google
bloqueia a leitura por robôs). Para exibi-las no totem, cadastre-as em
**Painel → Avaliações**: para cada avaliação, informe o nome, o texto, a nota
(estrelas) e a fonte (Google). As ativas aparecem na página "Como funciona"
com o selo do Google. Os textos que vêm no seed são apenas exemplos.

## Fases

- **Fase 1 (entregue):** totem com catálogo/busca/vitrines + painel com CRUD completo, toggles e upload de fotos.
- **Fase 2 (entregue):** dosagens por produto, carrinho com envio do pedido por WhatsApp, botão de WhatsApp por produto, página "Como funciona a manipulação" com 19 anos + avaliações (gerenciáveis no painel), vitrine especial da linha dermatológica, drag-and-drop de produtos/categorias, papéis admin/operador e log de alterações.
- **Redesign clean (entregue):** tipografia Figtree + Inter, layout com mais respiro, sombras suaves, cantos generosos, avaliações estilo Google.
- **Fase 3 (pendente):** modo offline do totem (a rota `/api/totem/catalogo` já expõe o JSON para cache local), métricas (mais vistos/clicados), gestão multi-lojas, integração com fila/senha.
- **Painéis gestor e colaborador (07/10/2026):** painel na paleta do site, galeria de até 5 fotos por produto, preço no site por produto (só industrializado), categorias com "No site" e "Vitrine na home", seções da home e arte da dobra pelo painel, visão geral do gestor com os números, o catálogo, a equipe e o log.
