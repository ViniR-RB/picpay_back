import AppException from '@/core/exceptions/app_exception';

export default class AmountValueObjectException extends AppException {
  constructor(message: string, statusCode: number = 400) {
    super(message, statusCode);
    this.name = 'AmountValueObjectException';
  }
}
