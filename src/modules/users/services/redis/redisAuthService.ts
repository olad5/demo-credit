import { RedisClientType } from "redis";
import * as jwt from "jsonwebtoken";
import { authConfig } from "../../../../config";
import { AbstractRedisClient } from "./abstractRedisClient";
import { IAuthService } from "../authService";
import { RefreshToken, JWTToken, JWTClaims } from "../../domain/jwt";
import { User } from "../../domain/user";
import { nanoid } from "nanoid";

export class RedisAuthService
  extends AbstractRedisClient
  implements IAuthService
{
  public jwtHashName = authConfig.jwtHashName;

  constructor(redisClient: RedisClientType) {
    super(redisClient);
  }

  public async saveAuthenticatedUser(user: User): Promise<void> {
    if (user.isLoggedIn()) {
      await this.addToken(
        user.userId.id.toString(),
        user.refreshToken,
        user.accessToken
      );
    }
  }

  public createRefreshToken(): RefreshToken {
    return nanoid(256) as RefreshToken;
  }

  public signJWT(props: JWTClaims): JWTToken {
    const claims: JWTClaims = {
      email: props.email,
      userId: props.userId
    };

    return jwt.sign(claims, authConfig.secret, {
      expiresIn: authConfig.tokenExpiryTime
    });
  }

  public decodeJWT(token: string): Promise<JWTClaims> {
    return new Promise((resolve, _) => {
      jwt.verify(token, authConfig.secret, (err, decoded) => {
        if (err) {
          return resolve(null);
        }
        return resolve(decoded as JWTClaims);
      });
    });
  }

  private constructKey(userId: string, refreshToken: RefreshToken): string {
    return `refresh-${refreshToken}.${this.jwtHashName}.${userId}`;
  }

  public async addToken(
    userId: string,
    refreshToken: RefreshToken,
    token: JWTToken
  ): Promise<void> {
    await this.set(this.constructKey(userId, refreshToken), token);
  }

  public async getTokens(userId: string): Promise<string[]> {
    const keyValues = await this.getAllKeyValue(
      `*${this.jwtHashName}.${userId}`
    );
    return Object.values(keyValues);
  }
}
