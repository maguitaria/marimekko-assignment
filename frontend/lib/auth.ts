"use client";

const TOKEN_KEY = "wh_jwt";
const CLIENT_NAME_KEY = "wh_client_name";

export const auth = {
  set(token: string, clientName: string) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(CLIENT_NAME_KEY, clientName);
  },
  get() {
    return {
      token: localStorage.getItem(TOKEN_KEY),
      clientName: localStorage.getItem(CLIENT_NAME_KEY)
    };
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(CLIENT_NAME_KEY);
  }
};
