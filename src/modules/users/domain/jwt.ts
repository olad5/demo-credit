export interface JWTClaims {
  userId: string;
  email: string;
}

export type JWTToken = string;

export type RefreshToken = string;
