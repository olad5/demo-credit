import { RedisClientType } from "redis";

export abstract class AbstractRedisClient {
  private tokenExpiryTime = 604800;
  protected client: RedisClientType;

  constructor(client: RedisClientType) {
    this.client = client;
  }

  public getAllKeys(wildcard: string): Promise<string[]> {
    return this.client.keys(wildcard);
  }

  public async getAllKeyValue(wildcard: string) {
    const results = await this.client.keys(wildcard);
    return results;
  }

  public async set(key: string, value: string): Promise<void> {
    const result = await this.client.set(key, value);
    if (result === "OK") {
      this.client.expire(key, this.tokenExpiryTime);
    }
  }

  public deleteOne(key: string): Promise<number> {
    return this.client.del(key);
  }
}
