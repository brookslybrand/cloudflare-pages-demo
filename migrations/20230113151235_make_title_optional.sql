-- RedefineTables
-- PRAGMA foreign_keys=OFF; /* D1 currently doesn't allow the use of most PRAGMA statements: https://developers.cloudflare.com/d1/platform/client-api/#pragma-statements */
CREATE TABLE "new_Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "authorId" INTEGER NOT NULL,
    CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Post" ("authorId", "id", "published", "title") SELECT "authorId", "id", "published", "title" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
-- PRAGMA foreign_key_check; /* D1 currently doesn't allow the use of most PRAGMA statements: https://developers.cloudflare.com/d1/platform/client-api/#pragma-statements */
-- PRAGMA foreign_keys=ON; /* D1 currently doesn't allow the use of most PRAGMA statements: https://developers.cloudflare.com/d1/platform/client-api/#pragma-statements */
