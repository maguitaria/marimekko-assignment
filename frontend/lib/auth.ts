"use client";

const TOKEN_KEY = "wh_jwt";
const CLIENT_NAME_KEY = "wh_client_name";
const CLIENT_ID_KEY = "wh_client_id"; // optional if you store clientId from backend

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function safeGetItem(key: string): string | null {
  try {
    return isBrowser() ? localStorage.getItem(key) : null;
  } catch {
    return null;
  }
}

function safeSetItem(key: string, value: string) {
  try {
    if (isBrowser()) localStorage.setItem(key, value);
  } catch {
    console.warn("Failed to write to localStorage:", key);
  }
}

function safeRemoveItem(key: string) {
  try {
    if (isBrowser()) localStorage.removeItem(key);
  } catch {
    console.warn("Failed to clear localStorage:", key);
  }
}

function parseJwt(token: string): any | null {
  try {
    const base64 = token.split(".")[1];
    const json = atob(base64);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export const auth = {
  set(token: string, clientName: string, clientId?: string) {
    safeSetItem(TOKEN_KEY, token);
    safeSetItem(CLIENT_NAME_KEY, clientName);
    if (clientId) safeSetItem(CLIENT_ID_KEY, clientId);
  },

  get(): { token: string | null; clientName: string | null; clientId: string | null } {
    return {
      token: safeGetItem(TOKEN_KEY),
      clientName: safeGetItem(CLIENT_NAME_KEY),
      clientId: safeGetItem(CLIENT_ID_KEY),
    };
  },

  clear() {
    safeRemoveItem(TOKEN_KEY);
    safeRemoveItem(CLIENT_NAME_KEY);
    safeRemoveItem(CLIENT_ID_KEY);
  },

  isAuthenticated(): boolean {
    const token = safeGetItem(TOKEN_KEY);
    if (!token) return false;

    const payload = parseJwt(token);
    if (!payload || !payload.exp) return false;

    const now = Date.now() / 1000;
    return payload.exp > now;
  },

  getDecoded(): any | null {
    const token = safeGetItem(TOKEN_KEY);
    return token ? parseJwt(token) : null;
  },
};
