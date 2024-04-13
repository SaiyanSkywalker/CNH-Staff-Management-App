import express from "express";
import config from "./config";
import loaders from "./loaders";
import { Server, Socket } from "socket.io";
import http from "http";
import socketHandler from "./sockets/socketHandler";
const app = express();

const startServer = async () => {
  // Load db and route configs
  await loaders(app, config);

  // Set up sockets
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
    },
    connectionStateRecovery: {
      maxDisconnectionDuration: 120000, //2 minute recovery
      skipMiddlewares: true,
    },
  });

  const onConnection = (socket: Socket) => {
    socketHandler(io, socket);
  };

  // Allow socket to listen for new connections
  io.on("connection", onConnection);

  // Start app
  server.listen(config.port, () => {
    console.log(`Listening to server on port ${config.port}`);
  });
};

startServer();
