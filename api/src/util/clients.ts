import fs from "fs";
import path from "path";

/**
 * Returns the full profile for the client, including:
 * - Display name
 * - Product pricing overrides and stock overrides
 * Loaded from config/clientA.json or config/clientB.json
 */
export function getClientProfile(clientId: string) {
  const filePath = path.join(__dirname, `../../config/${clientId}.json`);

  if (!fs.existsSync(filePath)) {
    console.error("Client config not found:", filePath);
    return null;
  }

  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

/**
 * Maps login codes → client IDs (stored securely in env vars)
 */
export function resolveClientIdFromCode(code: string): string | null {
  const map: Record<string, string> = {
    [process.env.CLIENT_A_CODE || ""]: "clientA",
    [process.env.CLIENT_B_CODE || ""]: "clientB",
  };

  return map[code] || null;
}
