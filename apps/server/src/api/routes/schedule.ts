import config from "server/src/config";
import { Request, Response, Router } from "express";
import { UploadedFile } from "express-fileupload";
import { validateSchedule } from "server/src/util/CsvUtils";
import {
  getScheduleData,
  getScheduleDataForUser,
  handleTestScheduleData,
  saveScheduleData,
} from "../services/ScheduleEntryService";
import ScheduleEntryAttributes from "@shared/src/interfaces/ScheduleEntryAttributes";

const scheduleRouter = Router();
scheduleRouter.get(
  "/:user",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const user: string = req.params.user;
      const shifts: ScheduleEntryAttributes[] | undefined =
        await getScheduleDataForUser(user);
      res.json(shifts);
    } catch (error) {
      console.error("Error");
    }
  }
);
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

      // Check if CSV is valid, then attempt to save shifts
      const validationStatus: any = validateSchedule(file);
      if (!validationStatus.isValid) {
        res.status(400).send({ error: validationStatus.error });
      }

      await saveScheduleData(file);
      res.send({ isError: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: `Error saving schedule data from file` });
  }
});

export default scheduleRouter;
