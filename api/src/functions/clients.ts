import { app } from "@azure/functions";
import { cors, json } from "../util/http";
import fs from "fs";
import path from "path";
import { ClientsResponse } from "../types/api";

app.http("clients", {
  route: "clients",
  methods: ["GET", "OPTIONS"],
  authLevel: "anonymous",
  handler: async (req, ctx) => {
    if (req.method === "OPTIONS") return { status: 204, headers: cors() };

    try {
      const dir = path.join(__dirname, "../../config");

      // Read all client JSON config files
      const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));

      // Map each file → full client info
      const clients = files.map((file) => {
        const id = file.replace(".json", "");
        const data = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
        if (!data) throw new Error(`Invalid client config: ${file}`);
        // Derive display name safely
    let displayName: string;
    if (id === "clientA") displayName = "Client A";
    else if (id === "clientB") displayName = "Client B";
    else displayName = data.name || "Unknown Client";
        return {
          id,
          name: displayName,
          priceMultiplier: data.priceMultiplier ?? 1,
          stockFactor: data.stockFactor ?? 1,
          description:
            data.description ||
            "Wholesale client configuration for product pricing and stock adjustments.",
        };
      });

      // Sort alphabetically for stable output
      clients.sort((a, b) => a.id.localeCompare(b.id));
  const response: ClientsResponse = { clients };
      return json(response, 200, cors());
    } catch (err: any) {
      ctx.error("Failed to list clients:", err);
      return json({ error: "Server error" }, 500, cors());
    }
  },
});
