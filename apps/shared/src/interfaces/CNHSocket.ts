/**
 * File: CNHSocket.ts
 * Purpose: define shape of data for sockets used in this project
 * Attaches user info to socket
 */

import { Socket } from "socket.io";
import UserSocketAttributes from "./UserSocketAttributes";

export default interface CNHSocket extends Socket {
  userInfo?: UserSocketAttributes;
}
