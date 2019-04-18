// Utility that calls the given function with event details (data)
const callWithDetail = handler => event => handler(event.detail);

// Manage a single websocket connection on the client
class ClientSocket {
  constructor(url) {
    this.socket = new WebSocket(url);
    this._events = new EventTarget();

    this._handleOpen = this._handleOpen.bind(this);
    this._handleMessage = this._handleMessage.bind(this);
    this._handleSetID = this._handleSetID.bind(this);

    this.socket.addEventListener('open', this._handleOpen);
    this.socket.addEventListener('message', this._handleMessage);
    this.on('SetID', this._handleSetID);
  }

  _handleOpen() {
    console.log('client opening connection to server');
    this.send('NewConnection');
  }

  // Forward a message to the event emitter by type
  _handleMessage(msgEvent) {
    const { type, data } = JSON.parse(msgEvent.data);
    console.log(`[${type}] => (${JSON.stringify(data, null, 2)})`);

    const parsedEvent = new CustomEvent(type, { detail: data });
    this._events.dispatchEvent(parsedEvent);
  }

  _handleSetID({ id }) {
    this.id = id;
  }

  on(type, handler) {
    this._events.addEventListener(type, callWithDetail(handler));
  }

  send(type, data = {}) {
    const message = { type, data };
    this.socket.send(JSON.stringify(message));
  }
}