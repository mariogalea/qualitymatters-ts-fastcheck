// Simple event emitter implementation
export type EventHandler<T> = (event: T) => void;

export class EventBus<T> {
  private handlers: EventHandler<T>[] = [];

  subscribe(handler: EventHandler<T>) {
    this.handlers.push(handler);
  }

  unsubscribe(handler: EventHandler<T>) {
    this.handlers = this.handlers.filter(h => h !== handler);
  }

  publish(event: T) {
    for (const handler of this.handlers) {
      handler(event);
    }
  }
}
