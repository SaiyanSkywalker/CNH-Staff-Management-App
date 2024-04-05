import UserInformationAttributes from "@shared/src/interfaces/UserInformationAttributes";
import { Server, Socket } from "socket.io";

const socketMap = new Map<Socket, string>();

const socketHandler = (io: Server, socket: Socket) => {
  socket.on("user", (arg: UserInformationAttributes) => {
    socketMap.set(socket, arg.username);
  })
  socket.on("disconnect", () => {
    if(socketMap.has(socket)) {
      socketMap.delete(socket);
    }
  })
};

export default socketHandler;
