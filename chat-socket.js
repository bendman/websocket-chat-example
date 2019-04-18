const WebSocket = require('ws');
const EventEmitter = require('events');
const User = require('./user');

const WSServer = WebSocket.Server;
let wsServer;

module.exports = (httpServer) => {
  // Route WebSocket requests to the WebSocket server
  wsServer = new WSServer({ server: httpServer });

  wsServer.on('connection', ws => {
    const user = new User(ws);
  });
};
