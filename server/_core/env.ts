export const ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",

  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
  /** TEST_MODE=true deaktiviert die Tagessperre im 14-Tage-Zyklus */
  testMode: process.env.TEST_MODE === "true",
  /** Passwort für das Admin-Panel */
  adminPanelPassword: process.env.ADMIN_PANEL_PASSWORD ?? "",
};
