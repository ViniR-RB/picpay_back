export default interface JwtVerifyPayload {
  sub: string;
  iat: string;
  exp: string;
  type: string;
  jti: string;
}
