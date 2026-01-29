import AmountValueObjectException from '@/core/exceptions/amount_value_object.exception';

export default class AmountValueObject {
  private constructor(private readonly cents: number) {
    if (cents < 0) {
      throw new AmountValueObjectException('Amount cannot be negative');
    }
    this.cents = cents;
  }

  static fromCents(cents: number): AmountValueObject {
    return new AmountValueObject(cents);
  }

  static fromReais(reais: number): AmountValueObject {
    const cents = Math.round(reais * 100);
    return new AmountValueObject(cents);
  }

  add(amount: AmountValueObject): AmountValueObject {
    const newCents = this.cents + amount.getCents();
    return new AmountValueObject(newCents);
  }

  subtract(amount: AmountValueObject): AmountValueObject {
    const newCents = this.cents - amount.getCents();
    if (newCents < 0) {
      throw new AmountValueObjectException(
        'Resulting amount cannot be negative',
      );
    }
    return new AmountValueObject(newCents);
  }

  getCents(): number {
    return this.cents;
  }

  getReais(): number {
    return this.cents / 100;
  }

  toObject() {
    return this.getCents();
  }
}
