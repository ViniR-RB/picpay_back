import AmountValueObjectException from '@/core/exceptions/amount_value_object.exception';

export default class AmoutValueObject {
  private constructor(private readonly cents: number) {
    if (cents < 0) {
      throw new AmountValueObjectException('Amount cannot be negative');
    }
    this.cents = cents;
  }

  static fromCents(cents: number): AmoutValueObject {
    return new AmoutValueObject(cents);
  }

  static fromReais(reais: number): AmoutValueObject {
    const cents = Math.round(reais * 100);
    return new AmoutValueObject(cents);
  }

  add(amount: AmoutValueObject): AmoutValueObject {
    const newCents = this.cents + amount.getCents();
    return new AmoutValueObject(newCents);
  }

  subtract(amount: AmoutValueObject): AmoutValueObject {
    const newCents = this.cents - amount.getCents();
    if (newCents < 0) {
      throw new AmountValueObjectException(
        'Resulting amount cannot be negative',
      );
    }
    return new AmoutValueObject(newCents);
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
