import UserSocketAttributes from "@shared/src/interfaces/UserSocketAttributes";
import ShiftRequestAttributes from "@shared/src/interfaces/ShiftRequestAttributes";
import { Server, Socket } from "socket.io";
import ShiftHistory from "../models/ShiftHistory";
import Unit from "server/src/models/Unit";
import UserInformation from "server/src/models/UserInformation";
import ScheduleEntry from "../models/ScheduleEntry";
import { calculateDuration } from "../util/dateUtils";

export const mobileSocketMap = new Map<string, Map<string, Socket>>();
export const adminSocketMap = new Map<string, Map<string, Socket>>();

const socketHandler = (io: Server, socket: Socket) => {
  socket.on("add_user", (arg: UserSocketAttributes) => {
    const socketMap = arg.isAdmin ? adminSocketMap : mobileSocketMap;
    if (!socketMap.has(arg.username)) {
      socketMap.set(arg.username, new Map<string, Socket>());
    }
    socketMap.get(arg.username)?.set(arg.uuid, socket);
    console.log("socketMap is:");
    console.dir(socketMap);
  });

  socket.on("remove_user", (arg: UserSocketAttributes) => {
    const socketMap = arg.isAdmin ? adminSocketMap : mobileSocketMap;
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
  socket.on("shift_submission", async (arg: ShiftRequestAttributes) => {
    try {
      console.log(arg);
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
          status: "pending",
          userId: user.employeeId as number,
          unitId: user.unit?.id as number,
          dateRequested: arg.shiftDate,
        });
        console.log(newShiftRequest.toJSON());
        console.log("new shift request has been created");
      }
    } catch (error) {
      console.log(error);
    }
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
      //TODO: Add code that adds new shift request to ScheduleEntry table on shift acceptance
      if (mobileSocketMap.has(arg.username)) {
        const userMap = mobileSocketMap.get(arg.username);
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
};

export default socketHandler;
