import { Socket } from "socket.io";
import UserSocketAttributes from "./UserSocketAttributes";

export default interface CNHSocket extends Socket {
  userInfo?: UserSocketAttributes;
}
