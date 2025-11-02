import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { readFileSync } from "fs";
import path from "path";
import {cors,json} from "../util/http";
import { verifyToken } from "../util/auth";
import fs from "fs";

function getClientProducts(clientId: string) {
  const file = clientId === "B" ? "clientB.json" : "clientA.json";
  const fullPath = path.join(__dirname, "../../config", file);
  return JSON.parse(readFileSync(fullPath, "utf8"));
}

export async function products(req: HttpRequest, ctx: InvocationContext): Promise<HttpResponseInit> {
 if (req.method === "OPTIONS") return { status: 204, headers: cors() };

    try {
      const auth = verifyToken(req);
      if (!auth) return { status: 401, body: "Unauthorized", headers: cors() };

      const clientId = auth.clientId;
      const filePath = path.join(__dirname, `../../config/${clientId}.json`);

      if (!fs.existsSync(filePath)) {
        return { status: 404, body: "Client data not found", headers: cors() };
      }

      const data = fs.readFileSync(filePath, "utf8");
      const products = JSON.parse(data);

      return json({ products }, 200, cors());
    } catch (err) {
      ctx.error(err);
      return { status: 500, body: "Server error", headers: cors() };
    }
  }

app.http("products", {
  methods: ["GET", "OPTIONS"],
  authLevel: "anonymous",
  handler: products
});
