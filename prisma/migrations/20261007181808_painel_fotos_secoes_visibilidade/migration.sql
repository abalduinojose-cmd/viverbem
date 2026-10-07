-- CreateTable
CREATE TABLE "FotoProduto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "produtoId" INTEGER NOT NULL,
    CONSTRAINT "FotoProduto_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Configuracao" (
    "chave" TEXT NOT NULL PRIMARY KEY,
    "valor" TEXT NOT NULL,
    "atualizadoEm" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Categoria" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "visivel" BOOLEAN NOT NULL DEFAULT true,
    "vitrineHome" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_Categoria" ("id", "nome", "ordem", "slug") SELECT "id", "nome", "ordem", "slug" FROM "Categoria";
DROP TABLE "Categoria";
ALTER TABLE "new_Categoria" RENAME TO "Categoria";
CREATE UNIQUE INDEX "Categoria_slug_key" ON "Categoria"("slug");
CREATE TABLE "new_Produto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "precoCentavos" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'PRODUTO',
    "venda" TEXT NOT NULL DEFAULT 'MANIPULADO',
    "aprovado" BOOLEAN NOT NULL DEFAULT true,
    "fotoUrl" TEXT,
    "mostrarPreco" BOOLEAN NOT NULL DEFAULT false,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "novidade" BOOLEAN NOT NULL DEFAULT false,
    "destaque" BOOLEAN NOT NULL DEFAULT false,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "dosagens" TEXT,
    "composicao" TEXT,
    "modoUso" TEXT,
    "indicacoes" TEXT,
    "apresentacao" TEXT,
    "categoriaId" INTEGER,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" DATETIME NOT NULL,
    CONSTRAINT "Produto_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Produto" ("apresentacao", "aprovado", "ativo", "atualizadoEm", "categoriaId", "composicao", "criadoEm", "descricao", "destaque", "dosagens", "fotoUrl", "id", "indicacoes", "modoUso", "nome", "novidade", "ordem", "precoCentavos", "slug", "tipo", "venda") SELECT "apresentacao", "aprovado", "ativo", "atualizadoEm", "categoriaId", "composicao", "criadoEm", "descricao", "destaque", "dosagens", "fotoUrl", "id", "indicacoes", "modoUso", "nome", "novidade", "ordem", "precoCentavos", "slug", "tipo", "venda" FROM "Produto";
DROP TABLE "Produto";
ALTER TABLE "new_Produto" RENAME TO "Produto";
CREATE UNIQUE INDEX "Produto_slug_key" ON "Produto"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
