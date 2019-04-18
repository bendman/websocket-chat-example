const http = require('http');
const express = require('express');
const attachChatSockets = require('./chat-socket');

const PORT = process.env.PORT || 3000;

const server = http.createServer();
const app = express();

// Route WebSocket requests to the WebSocket server
attachChatSockets(server);

// Route HTTP Requests to the Express server
app.use(express.static('public'));
server.on('request', app);

// Start the HTTP server
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
