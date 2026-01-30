import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';

export default class TransactionRepositoryException extends AppException {
  constructor(message: string, statusCode: number = 400, error?: Error) {
    super(message, statusCode, error);
    this.name = 'TransactionsRepositoryException';
  }

  static unexpectedError(error?: Error): TransactionRepositoryException {
    return new TransactionRepositoryException(
      ErrorMessages.UNEXPECTED_ERROR,
      500,
      error,
    );
  }
}
