export default interface IEventProcessor {
  processPendingEvents(): Promise<void>;
}
