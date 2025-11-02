import fs from "fs";
import path from "path";

export function readClientCatalog(clientId: string) {
  const p = path.join(__dirname, `../../config/${clientId}.json`);
  if (!fs.existsSync(p)) return [];
  return JSON.parse(fs.readFileSync(p, "utf8"));
}
