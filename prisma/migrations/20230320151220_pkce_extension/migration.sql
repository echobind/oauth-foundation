-- AlterTable
ALTER TABLE "OAuthAuthorizationCode" ADD COLUMN     "code_challenge" TEXT,
ADD COLUMN     "code_challenge_method" TEXT DEFAULT 'S256';
