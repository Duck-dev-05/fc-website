-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" DATETIME,
    "image" TEXT,
    "password" TEXT,
    "isMember" BOOLEAN NOT NULL DEFAULT false,
    "membershipType" TEXT,
    "memberSince" DATETIME,
    "username" TEXT,
    "phone" TEXT,
    "dob" TEXT,
    "address" TEXT,
    "gender" TEXT,
    "nationality" TEXT,
    "language" TEXT,
    "bio" TEXT,
    "website" TEXT,
    "occupation" TEXT,
    "favoriteTeam" TEXT,
    "profileInitialized" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_User" ("address", "bio", "dob", "email", "emailVerified", "favoriteTeam", "gender", "id", "image", "isMember", "language", "memberSince", "membershipType", "name", "nationality", "occupation", "password", "phone", "username", "website") SELECT "address", "bio", "dob", "email", "emailVerified", "favoriteTeam", "gender", "id", "image", "isMember", "language", "memberSince", "membershipType", "name", "nationality", "occupation", "password", "phone", "username", "website" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
