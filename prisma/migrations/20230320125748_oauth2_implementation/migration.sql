-- CreateTable
CREATE TABLE "OAuthAccessToken" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "access_token" TEXT NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "user_id" TEXT,
    "client_id" TEXT,

    CONSTRAINT "OAuthAccessToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OAuthAccessTokenScope" (
    "id" SERIAL NOT NULL,
    "scope" TEXT,
    "accessToken_ID" INTEGER,

    CONSTRAINT "OAuthAccessTokenScope_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OAuthApp" (
    "id" SERIAL NOT NULL,
    "client_id" TEXT NOT NULL,
    "client_secret" TEXT NOT NULL,
    "app_name" TEXT NOT NULL,
    "app_icon_url" TEXT,
    "app_homepage_url" TEXT,
    "app_description" TEXT,

    CONSTRAINT "OauthApp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OAuthAuthorizationCode" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "user_id" TEXT,
    "client_id" TEXT,

    CONSTRAINT "OAuthAuthorizationCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OAuthAuthorizationScope" (
    "id" SERIAL NOT NULL,
    "scope" TEXT,
    "authorizationScope_id" INTEGER,

    CONSTRAINT "OAuthAuthorizationScopes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OAuthCallbackURL" (
    "id" SERIAL NOT NULL,
    "callback_url" TEXT NOT NULL,
    "oauthAppId" INTEGER,

    CONSTRAINT "OauthCallbackURL_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OAuthDeviceRequest" (
    "id" SERIAL NOT NULL,
    "device_code" TEXT NOT NULL,
    "user_code" TEXT NOT NULL,
    "expires_at" TIMESTAMP(6) NOT NULL,
    "client_id" TEXT,
    "access_token" TEXT,

    CONSTRAINT "OAuthDeviceRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OAuthDeviceRequestScope" (
    "id" SERIAL NOT NULL,
    "scope" TEXT,
    "deviceRequest_id" INTEGER,

    CONSTRAINT "OAuthDeviceRequestScope_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OAuthScope" (
    "id" SERIAL NOT NULL,
    "scope" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "OAuthScopes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OAuthAccessToken_access_token_key" ON "OAuthAccessToken"("access_token");

-- CreateIndex
CREATE UNIQUE INDEX "OAuthAccessToken_refresh_token_key" ON "OAuthAccessToken"("refresh_token");

-- CreateIndex
CREATE UNIQUE INDEX "OauthApp_client_id_key" ON "OAuthApp"("client_id");

-- CreateIndex
CREATE UNIQUE INDEX "OAuthAuthorizationCode_code_key" ON "OAuthAuthorizationCode"("code");

-- CreateIndex
CREATE UNIQUE INDEX "OAuthScopes_scope_key" ON "OAuthScope"("scope");

-- AddForeignKey
ALTER TABLE "OAuthAccessToken" ADD CONSTRAINT "OAuthAccessToken_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "OAuthApp"("client_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OAuthAccessToken" ADD CONSTRAINT "OAuthAccessToken_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "OAuthAccessTokenScope" ADD CONSTRAINT "OAuthAccessTokenScope_accessToken_ID_fkey" FOREIGN KEY ("accessToken_ID") REFERENCES "OAuthAccessToken"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "OAuthAccessTokenScope" ADD CONSTRAINT "OAuthAccessTokenScope_scope_fkey" FOREIGN KEY ("scope") REFERENCES "OAuthScope"("scope") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OAuthAuthorizationCode" ADD CONSTRAINT "OAuthAuthorizationCode_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "OAuthApp"("client_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OAuthAuthorizationCode" ADD CONSTRAINT "OAuthAuthorizationCode_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "OAuthAuthorizationScope" ADD CONSTRAINT "OAuthAuthorizationScopes_authorizationScope_id_fkey" FOREIGN KEY ("authorizationScope_id") REFERENCES "OAuthAuthorizationCode"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "OAuthAuthorizationScope" ADD CONSTRAINT "OAuthAuthorizationScopes_scope_fkey" FOREIGN KEY ("scope") REFERENCES "OAuthScope"("scope") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OAuthCallbackURL" ADD CONSTRAINT "OauthCallbackURL_oauthAppId_fkey" FOREIGN KEY ("oauthAppId") REFERENCES "OAuthApp"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "OAuthDeviceRequest" ADD CONSTRAINT "OAuthDeviceRequest_access_token_fkey" FOREIGN KEY ("access_token") REFERENCES "OAuthAccessToken"("access_token") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "OAuthDeviceRequest" ADD CONSTRAINT "OAuthDeviceRequest_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "OAuthApp"("client_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OAuthDeviceRequestScope" ADD CONSTRAINT "OAuthDeviceRequestScope_deviceRequest_id_fkey" FOREIGN KEY ("deviceRequest_id") REFERENCES "OAuthDeviceRequest"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "OAuthDeviceRequestScope" ADD CONSTRAINT "OAuthDeviceRequestScope_scope_fkey" FOREIGN KEY ("scope") REFERENCES "OAuthScope"("scope") ON DELETE CASCADE ON UPDATE CASCADE;
