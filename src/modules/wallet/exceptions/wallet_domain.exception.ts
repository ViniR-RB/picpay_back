import AppException from '@/core/exceptions/app_exception';

export default class WalletDomainException extends AppException {
  constructor(message: string, statusCode: number = 400) {
    super(message, statusCode);
    this.name = 'WalletDomainException';
  }
}
