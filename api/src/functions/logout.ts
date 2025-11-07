import { app } from "@azure/functions";
import { cors, json } from "../util/http";
import { verifyToken } from "../util/auth";

const revokedTokens = new Set<string>(); // temporary in-memory store

app.http("logout", {
  route: "logout",
  methods: ["POST", "OPTIONS"],
  authLevel: "anonymous",
  handler: async (req, ctx) => {
    if (req.method === "OPTIONS") return { status: 204, headers: cors() };

    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return json({ error: "Missing token" }, 400, cors());

    const auth = verifyToken(req);
    if (!auth) return json({ error: "Invalid token" }, 401, cors());

    revokedTokens.add(token);
    ctx.log(`Token revoked for ${auth.clientId}`);

    return json({ message: "Logout successful" }, 200, cors());
  },
});

// Helper to check if token is revoked
export function isTokenRevoked(token: string) {
  return revokedTokens.has(token);
}
