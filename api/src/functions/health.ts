import { app } from "@azure/functions";
import { cors, json } from "../util/http";

app.http("health", {
  route: "health",
  methods: ["GET"],
  authLevel: "anonymous",
  handler: async () => {
    return json(
      {
        status: "ok",
        version: "v1.0.0",
        timestamp: new Date().toISOString(),
        uptime: process.uptime().toFixed(2),
      },
      200,
      cors()
    );
  },
});
