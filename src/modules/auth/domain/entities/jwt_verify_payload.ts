export  default interface JwtVerifyPayload {
  sub: number;
  iat: string;
  exp: string;
  type: string;
  jti: string;
}
