import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';

export default class WalletRepositoryException extends AppException {
  constructor(message: string, statusCode: number = 400, error?: Error) {
    super(message, statusCode, error);
    this.name = 'WalletRepositoryException';
  }

  static unexpectedError(error?: Error) {
    return new WalletRepositoryException(
      ErrorMessages.UNEXPECTED_ERROR,
      500,
      error,
    );
  }
  static notFound(id?: string) {
    return new WalletRepositoryException(
      id ? `Wallet with id ${id} not found.` : 'Wallet not found.',
      404,
    );
  }
}
