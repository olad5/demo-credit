import dotenv from "dotenv";

const dotenvResult = dotenv.config();
if (process.env.NODE_ENV === "development" && dotenvResult.error) {
  throw dotenvResult.error;
}

import express from "express";
import bodyParser from "body-parser";
import rateLimiter from "express-rate-limit";
import helmet from "helmet";
import compression from "compression";
import * as http from "http";
import * as winston from "winston";
import * as expressWinston from "express-winston";
import cors from "cors";
import { serverPort } from "../../../config";
import { v1Router } from "./api/v1";

const origin = {
  origin: "*"
};

const app: express.Application = express();
const server: http.Server = http.createServer(app);

app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000
  })
);

app.use(bodyParser.json({ limit: "31mb" }));
app.use(bodyParser.urlencoded({ limit: "31mb", extended: true }));
app.use(cors(origin));
app.use(compression());
app.use(helmet());

const port = serverPort;
const loggerOptions: expressWinston.LoggerOptions = {
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.json(),
    winston.format.prettyPrint(),
    winston.format.colorize({ all: true })
  )
};

app.use(expressWinston.logger(loggerOptions));
app.use(v1Router);
app.use(
  expressWinston.errorLogger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json()
    )
  })
);

const runningMessage =
  process.env.NODE_ENV === "development"
    ? `\nServer running at http://localhost:${port}\n`
    : { statusCode: 200, message: "Server running..." };

app.get("/", (req: express.Request, res: express.Response) => {
  res.status(200).send(runningMessage);
});

export default server.listen(port, () => {
  /* eslint-disable */
  console.log(runningMessage);
  /* eslint-enable */
});
