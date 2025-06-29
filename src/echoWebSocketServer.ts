import { WebSocketServer } from 'ws';

export function startEchoWebSocketServer(port: number): WebSocketServer {
  const wss = new WebSocketServer({ port });
  wss.on('connection', (ws) => {
    ws.on('message', (message) => {
      ws.send(message); // Echo back
    });
  });
  return wss;
}