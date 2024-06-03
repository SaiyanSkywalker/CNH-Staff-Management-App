/**
 * File: index.ts
 * Purpose: Start up server project (initialize loaders and socket connection)
 * This is the first point of entry for the server project, this is what's ran
 * when running the command `npm run dev` from the `apps/server` directory
 */

import express from "express";
import config from "./config";
import loaders from "./loaders";
import { Server } from "socket.io";
import http from "http";
import socketHandler from "./sockets/socketHandler";
import CNHSocket from "@shared/src/interfaces/CNHSocket";
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

  const onConnection = (socket: CNHSocket) => {
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

export default app;