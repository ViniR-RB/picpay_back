import IUnitOfWork from '@/core/interface/i_unit_of_work';
import UseCase from '@/core/interface/use_case';
import IEventProcessor from '@/modules/events/adapters/i_event.processor';
import IEventRepository from '@/modules/events/adapters/i_event.repository';
import EventEntity from '@/modules/events/domain/entities/event.entity';
import { EVENT_MAPPER } from '@/modules/events/domain/entities/event_mapper';
import { Logger, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { SchedulerRegistry } from '@nestjs/schedule';

export default class EventProcessor implements IEventProcessor, OnModuleInit {
  private readonly logger = new Logger(EventProcessor.name);
  private intervalId: string;

  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private unitOfWork: IUnitOfWork,
    private moduleRef: ModuleRef,
  ) {}

  onModuleInit() {
    this.startPolling();
  }

  async processPendingEvents(): Promise<void> {
    await this.unitOfWork.start();

    const eventRepository = this.unitOfWork.getEventRepository();

    const pending = await eventRepository.getPending();
    for (const event of pending.getOrThrow()) {
      if (event.status === 'processing') continue;
      if (new Date() < (event.nextRetryAt ?? new Date(0))) continue;
      await this.processEvent(event, eventRepository);
    }
  }

  private startPolling() {
    const callback = () => {
      this.processPendingEvents();
    };

    const interval = setInterval(callback, 5000);
    this.intervalId = 'event-polling';
    this.schedulerRegistry.addInterval(this.intervalId, interval);
    this.logger.log('Polling iniciado');
  }

  stopPolling() {
    const interval = this.schedulerRegistry.getInterval(this.intervalId);
    clearInterval(interval);
    this.schedulerRegistry.deleteInterval(this.intervalId);
  }

  private async processEvent(
    event: EventEntity,
    eventRepository: IEventRepository,
  ): Promise<void> {
    try {
      event.makeProcessing();
      const eventSavedResult = await eventRepository.save(event);
      eventSavedResult.getOrThrow();
      const serviceResult = await this.getService(event.serviceName).execute(
        event.payload,
      );
      serviceResult.getOrThrow();
      await this.unitOfWork.commit();
    } catch (e) {
      this.logger.error(`Error processing event ${event.id}: ${e}`);
      event.makeRetry();
      await this.unitOfWork.commit();
    }
  }

  private getService(serviceName: string) {
    return this.moduleRef.get(EVENT_MAPPER[serviceName]) as UseCase<any, any>;
  }
}
