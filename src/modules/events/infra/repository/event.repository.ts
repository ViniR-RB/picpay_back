import AppException from '@/core/exceptions/app_exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import IEventRepository from '@/modules/events/adapters/i_event.repository';
import EventEntity from '@/modules/events/domain/entities/event.entity';
import EventRepositoryException from '@/modules/events/exceptions/event_repository.exception';
import EventMapper from '@/modules/events/infra/mapper/event.mapper';
import EventModel from '@/modules/events/infra/models/event.model';
import { EntityManager, Repository } from 'typeorm';

export default class EventRepository implements IEventRepository {
  private readonly repository: Repository<EventModel>;
  constructor(repoOrManager: Repository<EventModel> | EntityManager) {
    if (repoOrManager instanceof EntityManager) {
      this.repository = repoOrManager.getRepository(EventModel);
    } else {
      this.repository = repoOrManager;
    }
  }
  async getPending(): AsyncResult<AppException, EventEntity[]> {
    try {
      const queryBuilder = this.repository.createQueryBuilder('event');
      queryBuilder.where('event.status = :status', { status: 'pending' });
      const models = await queryBuilder.getMany();
      return right(models.map(EventMapper.toEntity));
    } catch (e) {
      return left(EventRepositoryException.unexpectedError(e));
    }
  }
  create(entity: EventEntity): EventModel {
    const model = EventMapper.toModel(entity);
    return this.repository.create(model);
  }
  async save(entity: EventEntity): AsyncResult<AppException, EventEntity> {
    try {
      const model = this.create(entity);
      const savedModel = await this.repository.save(model);
      return right(EventMapper.toEntity(savedModel));
    } catch (e) {
      return left(EventRepositoryException.unexpectedError(e));
    }
  }
}
