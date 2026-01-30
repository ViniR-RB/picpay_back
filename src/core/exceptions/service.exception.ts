import ErrorMessages from '@/core/constants/error_messages';
import AppException from '@/core/exceptions/app_exception';

export default class ServiceException extends AppException {
  constructor(message: string, statusCode: number = 400, error?: Error) {
    super(message, statusCode, error);
  }

  static unexpectedError(error?: Error) {
    return new ServiceException(ErrorMessages.UNEXPECTED_ERROR, 500, error);
  }
}
