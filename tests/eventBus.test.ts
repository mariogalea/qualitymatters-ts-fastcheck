import { EventBus } from '../src/eventBus';
import fc from 'fast-check';

describe('EventBus', () => {
  it('should deliver published events to all subscribers', () => {
    fc.assert(
      fc.property(fc.array(fc.string()), (events) => {
        const bus = new EventBus<string>();
        const received: string[] = [];
        bus.subscribe((e) => received.push(e));
        for (const event of events) {
          bus.publish(event);
        }
        // All published events should be received in order
        return JSON.stringify(received) === JSON.stringify(events);
      })
    );
  });

  it('should not deliver events to unsubscribed handlers', () => {
    fc.assert(
      fc.property(fc.array(fc.string()), (events) => {
        const bus = new EventBus<string>();
        const received: string[] = [];
        const handler = (e: string) => received.push(e);
        bus.subscribe(handler);
        bus.unsubscribe(handler);
        for (const event of events) {
          bus.publish(event);
        }
        // No events should be received after unsubscribe
        return received.length === 0;
      })
    );
  });
});
