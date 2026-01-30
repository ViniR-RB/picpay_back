import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';

export default class EventRepositoryException extends AppException {
  constructor(message: string, statusCode: number = 400, error?: Error) {
    super(message, statusCode, error);
    this.name = 'EventRepositoryException';
  }

  static unexpectedError(error: Error): EventRepositoryException {
    return new EventRepositoryException(
      ErrorMessages.UNEXPECTED_ERROR,
      500,
      error,
    );
  }
}
