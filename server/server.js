const app = require('./src/app');
const { PORT } = require('./src/config/environment');

const WebSocket = require('ws');


let scatterplotStates = {};

const wss = new WebSocket.Server({ noServer: true });
wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('message', (message) => {
    const parsed = JSON.parse(message);
    console.log('Received message:', parsed);
    if (parsed.type === 'BRUSH_EVENT') {
      scatterplotStates[parsed.deviceId] = parsed.brushState;
      console.log('Broadcasting Scatterplot states:', scatterplotStates);
      // Broadcast to other clients
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(
            JSON.stringify({
              type: 'BRUSH_UPDATE',
              selectedPoints: parsed.brushState.selectedPoints,
            })
          );
        }
      });
    }
  });
});

// Start the server
server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

server.on('upgrade', (request, socket, head) => {
  console.log('Upgrade request received');
  wss.handleUpgrade(request, socket, head, (ws) => {
    console.log('Upgrade request accepted');
    wss.emit('connection', ws, request);
  });
});
