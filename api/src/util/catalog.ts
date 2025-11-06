import fs from "fs";
import path from "path";

export default function loadClientCatalog(clientId: string) {
  const file = clientId === "clientB" ? "clientB.json" : "clientA.json";
  const fullPath = path.join(__dirname, "../../config", file);

  if (!fs.existsSync(fullPath)) {
    throw new Error(`Catalog file missing: ${fullPath}`);
  }
  return JSON.parse(fs.readFileSync(fullPath, "utf8"));
}

