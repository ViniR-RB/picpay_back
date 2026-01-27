export default interface JwtSignPayload {
  sub: number;
  type: 'access' | 'refresh';
  jit: string;
}
