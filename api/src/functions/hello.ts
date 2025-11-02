import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

export async function helloHandler(req: HttpRequest, ctx: InvocationContext): Promise<HttpResponseInit> {
  return { body: "Hello from Azure Functions!" };
}

app.http("hello", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: helloHandler,
});
