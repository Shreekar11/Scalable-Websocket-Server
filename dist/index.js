"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
const subscriptions = {};
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
