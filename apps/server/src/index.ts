import { Server } from 'colyseus';
import { WebSocketTransport } from '@colyseus/ws-transport';
import { createServer } from 'http';
import express from 'express';
import cors from 'cors';
import { WorldRoom } from './rooms/WorldRoom';

const port = Number(process.env.PORT) || 2567;
const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'game-of-mboa-server', time: new Date().toISOString() });
});

const gameServer = new Server({
  transport: new WebSocketTransport({
    server: createServer(app),
  }),
});

// Register the main world room
gameServer.define('world', WorldRoom);

gameServer.listen(port);

console.log(`🚀 Game of Mboa server running on port ${port}`);
console.log(`   Health:   http://localhost:${port}/health`);
console.log(`   Colyseus: ws://localhost:${port}`);
console.log(`   Room:     "world"`);
