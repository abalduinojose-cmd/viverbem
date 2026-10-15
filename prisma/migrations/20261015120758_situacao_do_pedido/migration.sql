-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Cliente" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "itens" TEXT NOT NULL,
    "totalCentavos" INTEGER NOT NULL,
    "pagamento" TEXT NOT NULL,
    "entrega" TEXT NOT NULL DEFAULT '',
    "local" TEXT NOT NULL DEFAULT '',
    "receita" BOOLEAN NOT NULL DEFAULT false,
    "codigo" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NOVO',
    "statusEm" DATETIME,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Cliente" ("codigo", "criadoEm", "entrega", "id", "itens", "local", "nome", "pagamento", "receita", "totalCentavos", "whatsapp") SELECT "codigo", "criadoEm", "entrega", "id", "itens", "local", "nome", "pagamento", "receita", "totalCentavos", "whatsapp" FROM "Cliente";
DROP TABLE "Cliente";
ALTER TABLE "new_Cliente" RENAME TO "Cliente";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
