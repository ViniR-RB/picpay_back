import AppException from '@/core/exceptions/app_exception';
import BaseRepository from '@/core/interface/base.repository';
import AsyncResult from '@/core/types/async_result';
import EventEntity from '@/modules/events/domain/entities/event.entity';
import EventModel from '@/modules/events/infra/models/event.model';

export default interface IEventRepository
  extends BaseRepository<EventEntity, EventModel> {
  getPending(): AsyncResult<AppException, EventEntity[]>;
}
