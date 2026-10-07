-- CreateTable
CREATE TABLE "TentativaLogin" (
    "chave" TEXT NOT NULL PRIMARY KEY,
    "falhas" INTEGER NOT NULL DEFAULT 0,
    "bloqueadoAte" DATETIME,
    "atualizadoEm" DATETIME NOT NULL
);
