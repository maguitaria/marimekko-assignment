import { app } from "@azure/functions";
import { cors, json } from "../util/http";
import { verifyToken } from "../util/auth";
import { getClientProfile } from "../util/clients";
import { ProfileResponse } from "../types/api";

app.http("profile", {
  route: "profile",
  methods: ["GET", "OPTIONS"],
  authLevel: "anonymous",
  handler: async (req, ctx) => {
    if (req.method === "OPTIONS") return { status: 204, headers: cors() };

    try {
      const auth = verifyToken(req);
      if (!auth) return json({ error: "Unauthorized" }, 401, cors());

      const profile = getClientProfile(auth.clientId);
      if (!profile) return json({ error: "Profile not found" }, 404, cors());

      // Map to human-readable client name
      let displayName: string;
      if (auth.clientId === "clientA") displayName = "Client A";
      else if (auth.clientId === "clientB") displayName = "Client B";
      else displayName = profile.name || "Unknown Client";

      const response: ProfileResponse = {
        clientId: auth.clientId,
        clientName:
          auth.clientId === "clientA"
            ? "Client A"
            : auth.clientId === "clientB"
            ? "Client B"
            : profile.name || "Unknown Client",
        priceMultiplier: profile.priceMultiplier ?? 1,
        stockFactor: profile.stockFactor ?? 1,
        description:
          profile.description ||
          "Client profile loaded successfully with applicable modifiers.",
        summary:
          auth.clientId === "clientA"
            ? "Premium wholesale partner with priority pricing."
            : auth.clientId === "clientB"
            ? "Standard wholesale partner."
            : "Registered wholesale client.",
      };

      return json(response, 200, cors());
    } catch (err: any) {
      ctx.error("Error in /api/profile:", err);
      return json({ error: "Server error" }, 500, cors());
    }
  },
});
