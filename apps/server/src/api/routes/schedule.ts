/**
 * File: schedule.ts
 * Purpose: defines the routes assoicated with getting schedule data
 */
import config from "server/src/config";
import { Request, Response, Router } from "express";
import { UploadedFile } from "express-fileupload";
import { validateSchedule } from "server/src/util/CsvUtils";
import {
  getScheduleData,
  getUnitScheduleData,
  getScheduleDataForUser,
  saveScheduleData,
  handleTestScheduleData,
} from "../services/ScheduleEntryService";
import { adminSocketMap } from "server/src/sockets/socketHandler";
import { Socket } from "socket.io";

const scheduleRouter = Router();

// Gets all shift data for admin portal
scheduleRouter.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    // const scheduleData = handleTestScheduleData(
    //   req.query.costCenterId as string
    // );
    // Uncomment code below if you want to use data from db instead
    // const scheduleData = handleTestScheduleData(req.query.costCenterId as string)
    const costCenterId: string = req.query.costCenterId as string;
    const numericCostCenterId: number = Number(costCenterId);
    if (
      costCenterId !== null &&
      costCenterId !== undefined &&
      isNaN(numericCostCenterId)
    ) {
      res
        .status(400)
        .json({ err: "costCenterId needs to be numeric if included" });
      return;
    }
    const scheduleData = await getScheduleData(costCenterId);
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
      if (shifts === null) {
        res.status(400).json({ err: "Unit does not exist!" });
        return;
      }
      res.json(shifts);
    } catch (error) {
      res
        .status(500)
        .send({ error: "Error in retrieving avaialble shifts for nurse" });
    }
  }
);

// Get all the shifts for a particular user
scheduleRouter.get(
  "/:user",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const user: string = req.params.user;
      const shifts = await getScheduleDataForUser(user);
      if (shifts === null) {
        res.status(400).json({ err: "User does not exist!" });
        return;
      }
      res.json(shifts);
    } catch (error) {
      console.error("Error");
    }
  }
);

// Add schedules to database from uploaded CSV file
scheduleRouter.post("/", async (req: Request, res: Response) => {
  try {
    if (!req.files?.schedule) {
      return res.status(400).send({ error: "Schedule file not found" });
    } else {
      const file: UploadedFile = req.files.schedule as UploadedFile;
      const username: string = req.body.username;

      // Check if CSV is valid, then attempt to save shifts
      const validationStatus: any = validateSchedule(file);
      if (!validationStatus.isValid) {
        return res.status(400).send({ error: validationStatus.error });
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
    return res
      .status(500)
      .send({ message: `Error saving schedule data from file` });
  }
});
export default scheduleRouter;
