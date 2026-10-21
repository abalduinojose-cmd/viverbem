# Colocar o site no ar (produção)

Lista do que falta para o site sair da prévia do GitHub Pages e ir para o
endereço definitivo, com o painel funcionando de verdade. A prévia é
estática: nada é gravado nela. Em produção o site precisa de servidor,
banco e um lugar para as fotos.

## 1. Hospedagem (Vercel, já preparada)

O projeto tem o script `vercel-build` no `package.json`: troca o banco para
Postgres, cria as tabelas, semeia os dados iniciais se o banco estiver vazio
e faz o build.

Serviços a criar, todos com plano gratuito para começar:

- **Vercel**: importar o repositório `viverbem`, branch `main`.
- **Banco Postgres** (Neon ou Vercel Postgres): copiar a URL de conexão.
- **Vercel Blob**: para as fotos e vídeos enviados pelo painel
  (`src/lib/armazenamento.ts` usa o Blob quando a variável existe).

## 2. Variáveis de ambiente (Vercel > Settings > Environment Variables)

| Variável | O que é |
|---|---|
| `DATABASE_URL` | URL do Postgres |
| `SESSION_SECRET` | 32+ caracteres aleatórios (cookie do painel) |
| `NEXT_PUBLIC_SITE_URL` | O endereço do site, sem barra no fim, ex.: `https://www.viverbem.com.br`. Sem ele os links de compartilhamento, o sitemap e os dados para o Google saem errados |
| `BLOB_READ_WRITE_TOKEN` | Token do Vercel Blob (fotos) |
| `SEED_ADMIN_SENHA` | Senha inicial do gestor (`admin@viverbem.com.br`). Sem ela o build gera uma senha aleatória e mostra no log do build, uma vez |
| `SEED_OPERADOR_SENHA` | Senha inicial do colaborador (`operador@viverbem.com.br`), mesma regra |
| `NEXT_PUBLIC_GA_ID` | ID do Google Analytics 4 (`G-XXXXXXXXXX`). Opcional; sem ele o site não carrega o Analytics |

Gerar um segredo: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.

## 3. Domínio

Em Vercel > Settings > Domains, adicionar o domínio e apontar o DNS como a
Vercel indicar (um registro A ou CNAME). O HTTPS é automático.

## 4. Depois do primeiro deploy

1. Entrar no painel (`/admin`) com o gestor e **trocar a senha** em
   Acessos ao painel, mesmo tendo definido `SEED_ADMIN_SENHA`.
2. Criar o acesso de cada pessoa da equipe e desativar o
   `operador@viverbem.com.br` de exemplo.
3. Conferir que o endereço do site aparece certo em `/sitemap.xml` e no
   compartilhamento de um link no WhatsApp (a imagem e o título).
4. Cadastrar o site no **Google Search Console** (enviar o sitemap) e no
   **Google Business Profile** das três lojas, com o mesmo endereço.
5. Criar a propriedade no **Google Analytics 4** e colocar o ID em
   `NEXT_PUBLIC_GA_ID`. O site só mede depois que a pessoa aceita os
   cookies (Modo de Consentimento), como a LGPD pede.

## 5. Conformidade sanitária (RDC 44/2009)

O site de uma farmácia precisa mostrar o nome do farmacêutico responsável
com o número do CRF, o número da Autorização de Funcionamento (AFE/Anvisa)
e o da licença sanitária. Esses dados ainda não estão no site: pedir à
farmácia e colocar no rodapé (`src/components/site/Footer.tsx`), junto do
CNPJ. As páginas de privacidade, termos e reembolso também devem ser
lidas pelo farmacêutico responsável antes de ir ao ar.

## 6. O que o build faz sozinho

- Cabeçalhos de segurança (`next.config.ts`): o painel não pode ser aberto
  dentro de outro site, o navegador não "adivinha" tipos de arquivo, e
  câmera, microfone e localização ficam desligados.
- Fotos enviadas pelo painel viram WebP no servidor.
- Pedido novo chega no painel com aviso; o site nunca guarda a foto da receita.
