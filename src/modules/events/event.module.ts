import { UNIT_OF_WORK } from '@/core/symbols';
import CreateEventService from '@/modules/events/application/create_event.service';
import EventModel from '@/modules/events/infra/models/event.model';
import EventProcessor from '@/modules/events/infra/processor/event.processor';
import EventRepository from '@/modules/events/infra/repository/event.repository';
import {
  CREATE_EVENT_SERVICE,
  EVENT_PROCESSOR,
  EVENT_REPOSITORY,
} from '@/modules/events/symbols';
import { Module } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { ScheduleModule, SchedulerRegistry } from '@nestjs/schedule';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [
    {
      inject: [getRepositoryToken(EventModel)],
      provide: EVENT_REPOSITORY,
      useFactory: (repository: Repository<EventModel>) =>
        new EventRepository(repository),
    },
    {
      inject: [UNIT_OF_WORK, SchedulerRegistry, ModuleRef],
      provide: EVENT_PROCESSOR,
      useFactory: (unitOfWork, schedulerRegistry, moduleRef) => {
        return new EventProcessor(schedulerRegistry, unitOfWork, moduleRef);
      },
    },
    {
      inject: [EVENT_REPOSITORY],
      provide: CREATE_EVENT_SERVICE,
      useFactory: eventRepository => new CreateEventService(eventRepository),
    },
  ],
  exports: [],
})
export default class EventModule {}
