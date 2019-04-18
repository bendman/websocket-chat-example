const EventEmitter = require('events');
const WebSocket = require('ws');

// ID iteration utility
const newId = (() => {
  // Track most recent ID in a closure
  let currentId = 0;

  return () => {
    currentId += 1;
    return currentId.toString(36);
  }
})();

// Create a function that checks an object for the given property value
const byProp = (prop, val) => item => item[prop] === val;

class ServerSocket {
  // Get client by ID
  static byId(id) {
    const i = ServerSocket._all.findIndex(byProp('id', id));
    return i === -1 ? null : User._all[i];
  }

  // Get client by socket
  static bySocket(socket) {
    const i = ServerSocket._all.findIndex(byProp('socket', socket));
    return i === -1 ? null : User._all[i];
  }

  // Return a list of all clients
  static getAll() {
    return this._all.slice();
  }

  // Broadcast a message to all open clients
  static broadcast(type, data) {
    ServerSocket._all.forEach(client => {
      if (client.socket.readyState === WebSocket.OPEN) {
        client.send(type, data)
      }
    });
  }

  constructor(socket) {
    // Set initial props
    this.id = newId();
    this.socket = socket;
    this._events = new EventEmitter();

    // Bindings
    this._handleMessage = this._handleMessage.bind(this);

    // Event handling infrastructure
    this.socket.on('message', this._handleMessage);

    // Add user to registry
    ServerSocket._all.push(this);

    // Send server ID to client for tracking
    this.send('SetID', { id: this.id });
  }

  // Forward a message to the event emitter by type
  _handleMessage(wireMessage) {
    const { data, type } = JSON.parse(wireMessage);
    console.log(`[${type}] => (${JSON.stringify(data, null, 2)})`);
    this._events.emit(type, data);
  }

  // Register a message handler
  on(type, handler) {
    this._events.on(type, handler);
  }

  // Send a message object to the socket
  send(type, data = {}) {
    const message = { type, data };
    this.socket.send(JSON.stringify(message));
  }
}

ServerSocket._all = [];

module.exports = ServerSocket;
