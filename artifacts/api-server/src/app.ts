import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

const trustProxy = process.env.TRUST_PROXY?.trim();
if (trustProxy && trustProxy !== "false" && trustProxy !== "0") {
  if (trustProxy === "true") {
    app.set("trust proxy", 1);
  } else {
    const hops = Number(trustProxy);
    app.set("trust proxy", Number.isInteger(hops) && hops >= 1 ? hops : trustProxy);
  }
}

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json({ limit: "32kb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

export default app;
