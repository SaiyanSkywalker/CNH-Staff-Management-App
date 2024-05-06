import UserSocketAttributes from "@shared/src/interfaces/UserSocketAttributes";
import { Server, Socket } from "socket.io";
import ShiftHistory from "../models/ShiftHistory";
import Unit from "server/src/models/Unit";
import UserInformation from "server/src/models/UserInformation";
import AnnouncementAttributes from "@shared/src/interfaces/AnnouncementAttributes";
import Announcement from "../models/Announcement";
import Channel from "../models/Channel";

const socketMap = new Map<string, Map<string, Socket>>();

const socketHandler = (io: Server, socket: Socket) => {
  socket.on("add_user", (arg: UserSocketAttributes) => {
    if (!socketMap.has(arg.username)) {
      socketMap.set(arg.username, new Map<string, Socket>());
    }
    socketMap.get(arg.username)?.set(arg.uuid, socket);
    console.log("socketMap is:");
    console.dir(socketMap);
  });

  socket.on("remove_user", (arg: UserSocketAttributes) => {
    if (
      socketMap.has(arg.username) &&
      socketMap.get(arg.username)?.has(arg.uuid)
    ) {
      const userMap = socketMap.get(arg.username);
      userMap?.delete(arg.uuid);
    }
    socket.disconnect();
  });

  //REQUEST_INIT event
  socket.on("shift_submission", () => {
    console.log("shift submitted!");
  });

  //REQUEST_UPDATE event
  socket.on(
    "shift_accept",
    async (arg: { shiftHistoryId: number; isAccepted: boolean }) => {
      console.log("arg.shiftHistoryId is:", arg.shiftHistoryId);
      console.log("arg.isAccepted is:", arg.isAccepted);
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
        shiftHistory?.set("status", "Accepted");
        socket.emit("shift_received", {isAccepted: 1, id: shiftHistory.id});
        message = `Shift accepted for ${shiftHistory?.shiftTime} on ${parsedDate}`;
      } else {
        shiftHistory?.set("status", "Rejected");
        socket.emit("shift_received", {isAccepted: 0, id: shiftHistory.id});
        message = `Shift rejected for ${shiftHistory?.shiftTime} on ${parsedDate}`;
      }
      await shiftHistory?.save();
      socket.emit("update_user", {
        username: shiftHistory?.user.username,
        message,
        isAccepted: arg.isAccepted,
      });
    }
  );

  //REQUEST_NOTIF event.
  socket.on(
    "update_user",
    (arg: { username: string; message: string; isAccepted: boolean }) => {
      if (socketMap.has(arg.username)) {
        const userMap = socketMap.get(arg.username);
        for (let uuid in userMap?.keys()) {
          console.log("uuid is:", uuid);
          let userSocket = userMap.get(uuid);
          userSocket?.emit("shift_update", {
            message: arg.message,
            isAccepted: arg.isAccepted,
          });
        }
      }
    }
  );

  //MESSAGE_SENT event
  socket.on("message_sent", async (arg: AnnouncementAttributes) => {
    let message: string = arg.body;
    let userId: number = arg.senderId;
    let channelId: number = arg.channelId;
    try {
      await Announcement.create({
        body: message,
        senderId: userId,
        channelId
      });
      let channel = await Channel.findOne({
        where: {
          id: channelId
        }
      });
      if(channel) {
        socket.to(channel.name).emit("message_subscriber", arg);
        socket.emit("message_provider", arg);
      }
    }
    catch {
      socket.emit("message_failed");
    }
  })

  socket.on("join_room", (arg: {prevSelectedChannel: string, selectedChannel: string}) => {
    console.log(`prevSelectedChannel is ${arg.prevSelectedChannel}`);
    console.log(`selectedChannel is ${arg.selectedChannel}`);
    if(arg.prevSelectedChannel && socket.rooms.has(arg.prevSelectedChannel)) {
      socket.leave(arg.prevSelectedChannel);
    }
    socket.join(arg.selectedChannel);
  })

  socket.on("leave_room", (arg: {channelName: string}) => {
    socket.leave(arg.channelName);
  });

};

export default socketHandler;
