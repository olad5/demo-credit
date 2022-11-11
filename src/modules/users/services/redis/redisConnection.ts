import * as redis from "redis";
import { authConfig, isProduction } from "../../../../config";
import debug from "debug";

const log = debug("redisConnection");

const port = authConfig.redisServerPort as number;
const host = authConfig.redisServerURL;
const redisConnection: redis.RedisClientType = isProduction
  ? redis.createClient({ url: authConfig.redisConnectionString })
  : redis.createClient({ socket: { port: port, host: host } }); // creates a new client

(async () => {
  redisConnection.on("connect", () => {
    log(`[Redis]: Connected to redis server at ${host} on port:${port}`);
  });
  await redisConnection.connect();
})();

export { redisConnection };
