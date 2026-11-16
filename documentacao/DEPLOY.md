# Publicar na internet

Há duas publicações possíveis, com finalidades diferentes:

| | **Vitrine (GitHub Pages)** | **App completo (Vercel)** |
|---|---|---|
| Para que serve | Mostrar o visual a um cliente | Uso real na loja |
| Totem do cliente | ✅ funciona | ✅ funciona |
| Carrinho + WhatsApp | ✅ funciona | ✅ funciona |
| Painel administrativo | ❌ não vai junto | ✅ funciona |
| Produtos | congelados na publicação | editáveis pelo painel |

---

# A) Vitrine de demonstração (GitHub Pages)

Já está publicada na branch `gh-pages`. Para o link funcionar, ajuste a
fonte do Pages **uma única vez**:

1. Abra
   [Settings → Pages](https://github.com/abalduinojose-cmd/app_viverbem/settings/pages)
2. Em **Build and deployment → Source**, escolha **Deploy from a branch**
3. Em **Branch**, selecione **`gh-pages`** e a pasta **`/ (root)`**
4. **Save** e aguarde ~1 minuto

Link: **https://abalduinojose-cmd.github.io/app_viverbem/**

### Atualizar a vitrine depois de mudar produtos

```bash
npm run demo:build                       # regenera a partir do banco atual
cd out && git add -A && git commit -m "atualiza vitrine" && git push --force origin gh-pages && cd ..
```

---

# B) App completo (Vercel) — passo a passo

Coloca o app **inteiro** no ar (totem + painel administrativo), com link
público fixo, sem depender do seu computador ligado.

Tempo estimado: ~10 minutos, **só cliques** — nenhum comando de terminal.
As tabelas e os produtos são criados sozinhos no primeiro deploy.
Você usa apenas a conta do **GitHub que já tem** — o Vercel entra com ela.

> **Por que não GitHub Pages?** O Pages só serve arquivos estáticos. Este
> projeto precisa de servidor (login, cadastro de produtos, upload de fotos,
> banco de dados), então o painel administrativo não funcionaria lá.

O código já está no GitHub: https://github.com/abalduinojose-cmd/app_viverbem

---

## Passo 1 — Importar o projeto no Vercel

1. Acesse [vercel.com](https://vercel.com) e clique em **Continue with GitHub**.
2. **Add New → Project**.
3. Encontre `app_viverbem` na lista e clique em **Import**.

Ainda **não clique em Deploy** — falta cadastrar uma variável (Passo 2).

---

## Passo 2 — Cadastrar o segredo de sessão

Ainda na tela de importação, abra **Environment Variables** e cadastre:

| Name (Nome) | Value (Valor) |
|---|---|
| `SESSION_SECRET` | cole o valor pronto abaixo |

Valor pronto para copiar (já é um segredo aleatório válido):

```
6118848de47126b7f98eb5d59fd75d53e6e565a5cae1c58195355629d534d094
```

Clique em **Deploy**. Essa primeira publicação vai **falhar** — é esperado,
porque o banco ainda não existe. Resolvemos no Passo 3.

---

## Passo 3 — Criar o banco de dados (Postgres)

O SQLite guarda tudo num arquivo, e a nuvem apaga esse arquivo a cada
publicação. Por isso a versão online usa **PostgreSQL**, provisionado pelo
próprio Vercel (não precisa de outra conta).

1. No projeto, abra a aba **Storage → Create Database → Postgres**.
2. Dê um nome (ex.: `viverbem-db`), escolha a região **Washington, D.C.**
   ou **São Paulo** e clique em **Create**.
3. Clique em **Connect** para ligar o banco ao projeto.

Pronto — o Vercel cria a variável `DATABASE_URL` automaticamente.
**Você não roda nenhum comando:** no próximo deploy, o build cria as
tabelas e cadastra os 38 produtos sozinho.

---

## Passo 4 — Ativar o envio de fotos

Em servidores serverless o disco é temporário, então as fotos enviadas pelo
painel precisam ir para um armazenamento externo.

1. **Storage → Create Database → Blob** e clique em **Create**.
2. Clique em **Connect** para ligar ao projeto.
3. Vá em **Deployments**, abra o menu **⋯** do topo da lista e clique em
   **Redeploy** para aplicar.

Esse **Redeploy** é também o que cria as tabelas e cadastra os produtos
(o Passo 3 tinha ligado o banco; agora o build roda com ele conectado).

O Vercel cria a variável `BLOB_READ_WRITE_TOKEN`, e o código
(`src/lib/armazenamento.ts`) detecta isso sozinho: com ela, as fotos vão
para a nuvem; sem ela, continuam sendo gravadas em `public/uploads/` como
no seu computador.

---

## Passo 5 — Usar

O Vercel dará um endereço como `https://app-viverbem.vercel.app`.

| Tela | Endereço |
|---|---|
| **Totem (clientes)** | `https://SEU-APP.vercel.app` |
| **Painel administrativo** | `https://SEU-APP.vercel.app/admin` |

No tablet do balcão, abra o endereço do totem e use **"Adicionar à tela
inicial"** para rodar em tela cheia, sem barra do navegador.

### ⚠️ Troque as senhas

As senhas iniciais (`viverbem123` e `operador123`) estão no código do
repositório e **precisam ser trocadas** antes do uso real:

```bash
node -e "console.log(require('bcryptjs').hashSync('SUA_SENHA_NOVA', 10))"
```

Cole o resultado no campo `senhaHash` do usuário. Para editar o banco de
produção, aponte a `DATABASE_URL` para ele e rode `npm run db:studio`.

---

## Publicações seguintes

Depois de configurado é automático: todo `git push` na branch `main`
publica a nova versão sozinho.

```bash
git add -A
git commit -m "descrição da mudança"
git push
```

---

## Se algo der errado

| Sintoma | Causa provável | Solução |
|---|---|---|
| 1º deploy falhou | Banco ainda não existe | Normal — faça os Passos 3 e 4 e o **Redeploy** |
| Páginas com erro 500 | Banco não conectado | Confira se o Postgres aparece ligado em **Storage** e refaça o **Redeploy** |
| Catálogo vazio | Deploy rodou antes de o banco existir | Faça um **Redeploy** com o Postgres já conectado |
| Não entra no painel | `SESSION_SECRET` ausente | Confira a variável em **Settings → Environment Variables** e refaça o **Redeploy** |
| Foto some após publicar | Blob não conectado | Faça o Passo 4 |

> Todas as soluções são pelo painel do Vercel — nenhum comando de terminal.
