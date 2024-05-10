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
      try {
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
          // Set shift status
          shiftHistory?.set("status", "Accepted");
          message = `Shift accepted for ${shiftHistory?.shiftTime} on ${parsedDate}`;

          // Add shift to scheduleEntry table
          const shiftTimeTokens: string[] = shiftHistory.shiftTime.split("-");
          const duration = calculateDuration(shiftTimeTokens);

          await ScheduleEntry.create({
            employeeId: shiftHistory.user.employeeId,
            lastName: shiftHistory.user.lastName,
            firstName: shiftHistory.user.firstName,
            middleInitial: shiftHistory.user.middleInitial,
            shiftDate: new Date(shiftHistory.dateRequested),
            shiftType: "REG",
            costCenterId: shiftHistory.unit.laborLevelEntryId,
            startTime: shiftTimeTokens[0].trim(),
            endTime: shiftTimeTokens[1].trim(),
            duration: duration,
          });
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
            console.log("uuid is:", uuid);
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
          isAccepted: arg.isAccepted
        });
      }
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
