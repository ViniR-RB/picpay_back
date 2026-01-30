import UseCase from '@/core/interface/use_case';
import EventEntity from '@/modules/events/domain/entities/event.entity';
import { EVENT_MAPPER } from '@/modules/events/domain/entities/event_mapper';

export interface CreateEventParam {
  serviceName: keyof typeof EVENT_MAPPER;
  payload: any;
  maxRetries: number;
}

export class CreateEventResponse {
  constructor(private readonly event: EventEntity) {}

  fromResponse() {
    return this.event.toObject();
  }
}

export default interface ICreateEventUseCase
  extends UseCase<CreateEventParam, CreateEventResponse> {}
