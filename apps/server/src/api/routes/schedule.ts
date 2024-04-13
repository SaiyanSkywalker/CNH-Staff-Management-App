import config from "server/src/config";
import { Request, Response, Router } from "express";
import { UploadedFile } from "express-fileupload";
import { validateSchedule } from "server/src/util/CsvUtils";
import {
  getScheduleData,
  handleTestScheduleData,
  saveScheduleData,
} from "../services/ScheduleEntryService";
import { adminSocketMap } from "server/src/sockets/socketHandler";
import { Socket } from "socket.io";

const scheduleRouter = Router();

scheduleRouter.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    // Change this if you want to use data from db instead
    const isTest = config.environment.toLowerCase() === "dev";
    const scheduleData = isTest
      ? handleTestScheduleData(req.query.costCenterId as string)
      : await getScheduleData(req.query.costCenterId as string);
    res.json(scheduleData);
  } catch (err) {
    console.error("Error in retrieving schedule data:", err);
    res.status(500).send({ error: "Error in retrieving schedule data" });
  }
});

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

      // Emit event to web client once schedule is finished saving
      const socketMap: Map<string, Socket> | undefined =
        adminSocketMap.get(username);

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
