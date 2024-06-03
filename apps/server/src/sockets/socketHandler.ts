/**
 * File: socketHandler.ts
 * Trees: Contains logic for creating sockets, and handling socket events
 */
import UserSocketAttributes from "@shared/src/interfaces/UserSocketAttributes";
import ShiftRequestAttributes from "@shared/src/interfaces/ShiftRequestAttributes";
import { Server, Socket } from "socket.io";
import ShiftHistory from "../models/ShiftHistory";
import Unit from "server/src/models/Unit";
import UserInformation from "server/src/models/UserInformation";
import CNHSocket from "@shared/src/interfaces/CNHSocket";
import AnnouncementAttributes from "@shared/src/interfaces/AnnouncementAttributes";
import Announcement from "../models/Announcement";
import Channel from "../models/Channel";

// Socket maps used to hold sockets in memory
export const mobileSocketMap = new Map<string, Map<string, CNHSocket>>();
export const adminSocketMap = new Map<string, Map<string, CNHSocket>>();

/**
 * Wrapper function where socket operations are defined
 * @param io
 * @param socket
 */
const socketHandler = (io: Server, socket: CNHSocket) => {
  socket.on("disconnect", () => {
    if (socket.userInfo) {
      removeUser(socket.userInfo);
    }
  });
  // Event where user is added to socket map (happens when user logs in)
  socket.on("add_user", (arg: UserSocketAttributes) => {
    const socketMap = arg.isAdmin ? adminSocketMap : mobileSocketMap;
    if (!socketMap.has(arg.username)) {
      socketMap.set(arg.username, new Map<string, CNHSocket>());
    }
    socketMap.get(arg.username)?.set(arg.uuid, socket);
    socket.userInfo = arg;
  });

  socket.on("remove_user", (arg: UserSocketAttributes) => {
    socket.disconnect();
  });

  //REQUEST_INIT event
  // Event where mobile user sends shift request to be processed by admin
  socket.on("shift_submission", async (arg: ShiftRequestAttributes) => {
    try {
      const user: UserInformation | null = await UserInformation.findOne({
        where: { username: arg.user },
        include: [
          {
            model: Unit,
            required: true,
          },
        ],
      });
      if (user) {
        const newShiftRequest = await ShiftHistory.create({
          shiftTime: arg.shift,
          status: "Pending",
          userId: user.employeeId as number,
          unitId: user.unit?.id as number,
          dateRequested: arg.shiftDate,
        });
      }
    } catch (error) {
      console.log(error);
    }
  });

  //REQUEST_UPDATE event
  // Event where admin user accepts or rejects shift request
  socket.on(
    "shift_accept",
    async (arg: { shiftHistoryId: number; isAccepted: boolean }) => {
      try {
        const shiftHistory: ShiftHistory | null = await ShiftHistory.findOne({
          where: {
            id: arg.shiftHistoryId,
          },
          include: [
            {
              model: Unit,
              required: true,
            },
            {
              model: UserInformation,
              required: true,
            },
          ],
        });

        if (!shiftHistory) {
          return;
        }

        let message: string = "";
        let parsedDate: string = shiftHistory?.dateRequested;

        if (arg.isAccepted) {
          // Set shift status
          shiftHistory?.set("status", "Accepted");
          message = `Shift accepted for ${shiftHistory?.shiftTime} on ${parsedDate}`;
        } else {
          shiftHistory?.set("status", "Rejected");
          message = `Shift rejected for ${shiftHistory?.shiftTime} on ${parsedDate}`;
        }
        await shiftHistory?.save();

        // Send response to admin user
        socket.emit("shift_accept_response", {
          isAccepted: arg.isAccepted,
          shiftHistory: shiftHistory,
        });

        // Send response to mobile user
        if (mobileSocketMap.has(shiftHistory?.user.username)) {
          const userMap = mobileSocketMap.get(shiftHistory?.user.username);
          userMap?.forEach((socket: Socket, uuid: string) => {
            socket?.emit("shift_update", {
              isAccepted: arg.isAccepted,
              message: message,
            });
          });
        } else {
          console.log(
            `Mobile user: ${shiftHistory?.user.username} does not have an entry in socket map`
          );
        }
      } catch (error) {
        console.log(error);
        socket.emit("shift_accept_error", {
          isAccepted: arg.isAccepted,
        });
      }
    }
  );

  //MESSAGE_SENT event
  // Event where chat message is sent
  socket.on("message_sent", async (arg: AnnouncementAttributes) => {
    let message: string = arg.body;
    let userId: number = arg.senderId;
    let channelId: number = arg.channelId;
    try {
      await Announcement.create({
        body: message,
        senderId: userId,
        channelId,
      });
      let channel = await Channel.findOne({
        where: {
          id: channelId,
        },
      });
      if (channel) {
        socket.broadcast.to(channel.name).emit("message_subscriber", arg);
        socket.emit("message_provider", arg);
      }
    } catch {
      socket.emit("message_failed");
    }
  });

  // Event where user joins room in chat page/screen
  socket.on(
    "join_room",
    (arg: { prevSelectedChannel: string; selectedChannel: string }) => {
      if (
        arg.prevSelectedChannel &&
        socket.rooms.has(arg.prevSelectedChannel)
      ) {
        socket.leave(arg.prevSelectedChannel);
      }
      socket.join(arg.selectedChannel);
    }
  );

  // Event where user leaves room (emitted when user switches chat channels)
  socket.on("leave_room", (arg: { channelName: string }) => {
    socket.leave(arg.channelName);
  });
};

// Event where user is removed from socket map
// typically emitted when user signs out
const removeUser = (user: UserSocketAttributes) => {
  const socketMap = user.isAdmin ? adminSocketMap : mobileSocketMap;
  if (
    socketMap.has(user.username) &&
    socketMap.get(user.username)?.has(user.uuid)
  ) {
    const userMap = socketMap.get(user.username);
    userMap?.delete(user.uuid);
  }
};
export default socketHandler;
