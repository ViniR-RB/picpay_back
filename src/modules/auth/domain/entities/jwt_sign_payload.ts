export default interface JwtSignPayload {
  sub: string;
  type: 'access' | 'refresh';
  jit: string;
}
