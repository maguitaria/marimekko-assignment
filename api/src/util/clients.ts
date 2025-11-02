export function resolveClientIdFromCode(code: string): string | null {
  const map: Record<string, string> = {
    [process.env.CLIENT_A_CODE || ""]: "clientA",
    [process.env.CLIENT_B_CODE || ""]: "clientB",
  };
  return map[code] || null;
}

export function getClientProfile(clientId: string) {
  const profiles: Record<string, { id: string; name: string }> = {
    clientA: { id: "clientA", name: "Client A" },
    clientB: { id: "clientB", name: "Client B" }
  };
  return profiles[clientId] || null;
}
