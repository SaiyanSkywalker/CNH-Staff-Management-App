import { Server, Socket } from "socket.io";

const socketHandler = (io: Server, socket: Socket) => {
  socket.emit("hello", "hello from the server");
  socket.on("hello", (arg) => {
    console.log(arg); // world
  });
};

export default socketHandler;
