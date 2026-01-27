import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';
import ConfigurationService from '@/core/services/configuration.service';
import IEncryptionService from '@/modules/auth/adapters/encryption_service.interface';
import { compare, hash } from 'bcryptjs';

export default class EncryptionService implements IEncryptionService {
  constructor(private readonly configurationService: ConfigurationService) {}

  async hashString(anyString: string): Promise<string> {
    try {
      return await hash(anyString, this.configurationService.get('SALT'));
    } catch (error) {
      throw new AppException(ErrorMessages.UNEXPECTED_ERROR, 500, error);
    }
  }

  async isMatch(hashedString: string, normalString: string): Promise<boolean> {
    try {
      return await compare(normalString, hashedString);
    } catch (error) {
      throw new AppException(ErrorMessages.UNEXPECTED_ERROR, 500, error);
    }
  }
}
