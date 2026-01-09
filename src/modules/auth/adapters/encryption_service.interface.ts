export default interface IEncryptionService {
  hashString(anyString: string): Promise<string>;
  isMatch(hashedString: string, normalString: string): Promise<boolean>;
}
