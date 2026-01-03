import { Hono } from "hono";

import { chatRoute } from "./routes/chat";

const app = new Hono().basePath("/api");

app.route("/chat", chatRoute);

export { app };
