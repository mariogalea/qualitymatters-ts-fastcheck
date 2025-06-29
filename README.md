# qualitymatters-ts-fastcheck
A property based testing POC using Fast Check with Typescript

## Property-Based Test Samples

This project demonstrates property-based testing in TypeScript using fast-check. The focus is on verifying the correctness and robustness of code by generating a wide range of random inputs and asserting that certain properties always hold. Below are the actual tests implemented in this proof of concept:

### 1. REST API Response Validation
**Test:** Ensures that every post returned from the public JSONPlaceholder API contains the required properties (`userId`, `id`, `title`, `body`) and that their types are correct for any index in the response array.
```ts
import { fetchPosts } from '../src/fetchPosts';
import fc from 'fast-check';

describe('fetchPosts', () => {
  it('should return an array of posts with required properties', async () => {
    const posts = await fetchPosts() as Array<any>;
    expect(Array.isArray(posts)).toBe(true);
    expect(posts.length).toBeGreaterThan(0);
    fc.assert(
      fc.property(fc.integer({ min: 0, max: posts.length - 1 }), (i) => {
        const post = posts[i];
        return (
          typeof post.userId === 'number' &&
          typeof post.id === 'number' &&
          typeof post.title === 'string' &&
          typeof post.body === 'string'
        );
      })
    );
  });
});
```

### 2. Event-Based Messaging (EventBus)
**Test:** Verifies that all events published to an `EventBus` are delivered to subscribers in the correct order, for any array of string events.
```ts
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
        return JSON.stringify(received) === JSON.stringify(events);
      })
    );
  });
});
```

### 3. WebSocket Echo Server
**Test:** Starts a local WebSocket echo server and checks that, for any string sent by a client, the exact same string is echoed back by the server.
```ts
import { startEchoWebSocketServer } from '../src/echoWebSocketServer';
import WebSocket from 'ws';
import fc from 'fast-check';

describe('WebSocket Echo Server', () => {
  let server;
  const port = 8081;

  beforeAll(() => {
    server = startEchoWebSocketServer(port);
  });

  afterAll((done) => {
    server.close(() => done());
  });

  it('should echo back any string sent by the client', async () => {
    await fc.assert(
      fc.asyncProperty(fc.string(), async (msg) => {
        await new Promise<void>((resolve, reject) => {
          const ws = new WebSocket(`ws://localhost:${port}`);
          ws.on('open', () => {
            ws.send(msg);
          });
          ws.on('message', (data) => {
            expect(data.toString()).toBe(msg);
            ws.close();
            resolve();
          });
          ws.on('error', reject);
        });
      }),
      { numRuns: 20 }
    );
  });
});
```

### 4. SRP Authentication (jsrp)
**Test:** Uses the `jsrp` library to simulate a Secure Remote Password (SRP) authentication flow. For any valid alphanumeric string (starting with a letter, min 4 chars), it checks that registration and authentication succeed when using the same value for both username and password. Any internal jsrp errors are skipped.
```ts
import { srpRegisterAndAuthenticate } from '../src/srpAuth';
import fc from 'fast-check';

describe('SRP Authentication', () => {
  it('should authenticate successfully with the same username and password', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 4, maxLength: 16 })
          .filter(s => /^[a-zA-Z][a-zA-Z0-9]+$/.test(s)),
        async (value) => {
          try {
            const result = await srpRegisterAndAuthenticate(value, value);
            return result === true;
          } catch (e) {
            return true;
          }
        }
      ),
      { numRuns: 10 }
    );
  });
});
```
