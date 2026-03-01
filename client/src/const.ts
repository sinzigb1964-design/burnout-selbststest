export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Eigene Login-Seite (Magic-Link) statt Manus-OAuth
export const getLoginUrl = (_returnPath?: string) => {
  return "/login";
};
