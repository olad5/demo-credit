import express from "express";
import { DecodedExpressRequest } from "../../../../modules/users/infra/http/models/decodedRequest";
import { IAuthService } from "../../../../modules/users/services/authService";

export class Middleware {
  private authService: IAuthService;

  constructor(authService: IAuthService) {
    this.authService = authService;
  }

  private endRequest(status: 400 | 401 | 403, message: string, res: any): any {
    return res.status(status).send({ message });
  }

  public ensureAuthenticated() {
    return async (
      req: DecodedExpressRequest,
      res: express.Response,
      next: express.NextFunction
    ) => {
      try {
        if (!req.headers["authorization"]) {
          return this.endRequest(403, "No authorization headers", res);
        }
        const token = req.headers["authorization"].split(" ")[1];
        // Confirm that the token was signed with our signature.
        if (token) {
          const decoded = await this.authService.decodeJWT(token);
          const signatureFailed = !!decoded === false;

          if (signatureFailed) {
            return this.endRequest(403, "Token signature expired.", res);
          }

          // See if the token was found
          const { userId } = decoded;
          const tokens = await this.authService.getTokens(userId);

          // if the token was found, just continue the request.
          if (tokens.length !== 0) {
            req.decoded = decoded;
            return next();
          } else {
            return this.endRequest(
              403,
              "Auth token not found. User is probably not logged in. Please login again.",
              res
            );
          }
        } else {
          return this.endRequest(403, "No access token provided", res);
        }
      } catch (err) {
        return this.endRequest(400, "bad request", res);
      }
    };
  }
}
