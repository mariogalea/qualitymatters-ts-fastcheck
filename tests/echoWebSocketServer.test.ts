import { startEchoWebSocketServer } from '../src/echoWebSocketServer';
import WebSocket from 'ws';
import fc from 'fast-check';

describe('WebSocket Echo Server', () => {
  let server: ReturnType<typeof startEchoWebSocketServer>;
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
