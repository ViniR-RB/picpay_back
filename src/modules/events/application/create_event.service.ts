import AppException from '@/core/exceptions/app_exception';
import AsyncResult from '@/core/types/async_result';
import { left, right } from '@/core/types/either';
import IEventRepository from '@/modules/events/adapters/i_event.repository';
import EventEntity from '@/modules/events/domain/entities/event.entity';
import ICreateEventUseCase, {
  CreateEventParam,
  CreateEventResponse,
} from '@/modules/events/domain/usecase/i_create_event_use_case';

export default class CreateEventService implements ICreateEventUseCase {
  constructor(private readonly eventRepository: IEventRepository) {}
  async execute(
    param: CreateEventParam,
  ): AsyncResult<AppException, CreateEventResponse> {
    const event = EventEntity.create({
      maxRetries: param.maxRetries,
      payload: param.payload,
      serviceName: param.serviceName,
    });

    const savedEventResult = await this.eventRepository.save(event);

    if (savedEventResult.isLeft()) {
      return left(savedEventResult.value);
    }
    return right(new CreateEventResponse(savedEventResult.value));
  }
}
