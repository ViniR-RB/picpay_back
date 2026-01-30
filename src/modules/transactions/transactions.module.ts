import CoreModule from '@/core/core_module';
import IUnitOfWork from '@/core/interface/i_unit_of_work';
import { UNIT_OF_WORK } from '@/core/symbols';
import CreateTransactionService from '@/modules/transactions/application/create_transaction.service';
import { CREATE_TRANSACTION_SERVICE } from '@/modules/transactions/symbols';
import { Module } from '@nestjs/common';

@Module({
  imports: [CoreModule],
  providers: [
    {
      inject: [UNIT_OF_WORK],
      provide: CREATE_TRANSACTION_SERVICE,
      useFactory: (unitOfWork: IUnitOfWork) =>
        new CreateTransactionService(unitOfWork),
    },
  ],
})
export default class TransactionsModule {
  constructor() {}
}
