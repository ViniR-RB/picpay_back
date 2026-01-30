import BaseMapper from '@/core/mappers/base.mapper';
import EventEntity from '@/modules/events/domain/entities/event.entity';
import EventModel from '@/modules/events/infra/models/event.model';

export default abstract class EventMapper extends BaseMapper<
  EventEntity,
  EventModel
> {
  static toEntity(model: EventModel): EventEntity {
    return EventEntity.fromData({
      id: model.id,
      serviceName: model.serviceName,
      payload: model.payload,
      status: model.status,
      processedAt: model.processedAt,
      retryCount: model.retryCount,
      nextRetryAt: model.nextRetryAt,
      maxRetries: model.maxRetries,
      createdAt: model.createdAt,
    });
  }
  static toModel(entity: EventEntity) {
    return {
      id: entity.id,
      serviceName: entity.serviceName,
      payload: entity.payload,
      status: entity.status,
      createdAt: entity.createdAt,
      processedAt: entity.processedAt,
      retryCount: entity.retryCount,
      nextRetryAt: entity.nextRetryAt,
      maxRetries: entity.maxRetries,
    };
  }
}
