import config from "server/src/config";
import { Request, Response, Router } from "express";
import { UploadedFile } from "express-fileupload";
import { validateSchedule } from "server/src/util/CsvUtils";
import {
  getScheduleData,
  getUnitScheduleData,
  getScheduleDataForUser,
  saveScheduleData,
} from "../services/ScheduleEntryService";
import { adminSocketMap } from "server/src/sockets/socketHandler";
import { Socket } from "socket.io";

const scheduleRouter = Router();

// Gets all shift data for admin portal
scheduleRouter.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    // Uncomment code below if you want to use data from db instead
    // const scheduleData = handleTestScheduleData(req.query.costCenterId as string)
    const scheduleData = await getScheduleData(
      req.query.costCenterId as string
    );
    res.json(scheduleData);
  } catch (err) {
    console.error("Error in retrieving schedule data:", err);
    res.status(500).send({ error: "Error in retrieving schedule data" });
  }
});

// Gets all shifts in a day for unit
scheduleRouter.get(
  "/unit",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const shiftDate = req.query.shiftDate as string;
      const costCenterId = Number(req.query.costCenterId);
      const shifts = await getUnitScheduleData(shiftDate, costCenterId);
      res.json(shifts);
    } catch (error) {
      res
        .status(500)
        .send({ error: "Error in retrieving avaialble shifts for nurse" });
    }
  }
);

scheduleRouter.get(
  "/:user",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const user: string = req.params.user;
      const shifts = await getScheduleDataForUser(user);
      res.json(shifts);
    } catch (error) {
      console.error("Error");
    }
  }
);

scheduleRouter.post("/", async (req: Request, res: Response) => {
  try {
    if (!req.files?.schedule) {
      res.status(400).send({ error: "Schedule file not found" });
    } else {
      const file: UploadedFile = req.files.schedule as UploadedFile;
      const username: string = req.body.username;

      // Check if CSV is valid, then attempt to save shifts
      const validationStatus: any = validateSchedule(file);
      if (!validationStatus.isValid) {
        res.status(400).send({ error: validationStatus.error });
      }
      await saveScheduleData(file);
      res.send({ isError: false });

      const socketMap: Map<string, Socket> | undefined =
        adminSocketMap.get(username);
      // Emit event to web client once schedule is finished saving
      if (socketMap) {
        socketMap.forEach((value: Socket, _) => {
          value.emit("schedule_upload_complete");
        });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: `Error saving schedule data from file` });
  }
});
export default scheduleRouter;
