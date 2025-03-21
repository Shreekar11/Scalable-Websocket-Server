import { WebSocket, WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

const subscriptions: {
  [key: string]: {
    ws: WebSocket;
    rooms: string[];
  };
} = {};

wss.on("connection", function connection(ws) {
  const id = Math.random().toString(36).substring(7);
  subscriptions[id] = {
    ws: ws,
    rooms: [],
  };

  ws.on("message", function message(data) {
    const parseMessage = JSON.parse(data.toString());
    if (parseMessage.type === "subscribe") {
      subscriptions[id].rooms.push(parseMessage.room);
    }

    if (parseMessage.type === "sendMessage") {
      const message = parseMessage.message;
      const roomId = parseMessage.roomId;

      Object.keys(subscriptions).forEach((key) => {
        const { ws, rooms } = subscriptions[key];
        if (rooms.includes(roomId)) {
          ws.send(message);
        }
      });
    }
  });
});
