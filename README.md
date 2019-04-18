# WebSocket Chat Example

This is an example of a chat app using WebSockets. Note that this is a fairly minimum example with no transpilation, no splitting of services, etc. It does provide a simple example of how to track individual clients and identify them distinctly on the server.

## Getting Started

> Note: You can also just run and fork this project at https://repl.it/@bendman/WebSockets-1.

1. Clone the repo
2. Install dependencies (`npm install`)
3. Run the server (`npm start`)
4. Visit the chat client at http://localhost:3000 (or whichever port you used)

## TODOs

- remove users when they disconnect
- auto-reconnect users if they come back, using the same userID