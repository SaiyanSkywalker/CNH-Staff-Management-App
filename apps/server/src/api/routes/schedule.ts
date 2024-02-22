import { Request, Response, Router } from "express";
import { UploadedFile } from "express-fileupload";

import ScheduleEntryAttributes from "@shared/src/interfaces/ScheduleEntryAttributes";
import { handleTestScheduleData } from "../services/ScheduleEntryService";
import {
  csvToArray,
  csvToScheduleData,
  validateSchedule,
} from "server/src/util/CsvUtils";
import ScheduleEntry from "server/src/models/ScheduleEntry";

const scheduleRouter = Router();

scheduleRouter.get("/", async (req: Request, res: Response): Promise<void> => {
  const entriesByCostCenter: { [key: string]: ScheduleEntryAttributes[] } =
    handleTestScheduleData(req.query.unit as string);
  res.json(entriesByCostCenter);
});

scheduleRouter.post("/", async (req: Request, res: Response) => {
  try {
    if (!req.files?.schedule) {
      res.status(400).send({ err: "file not found" });
    } else {
      const file: UploadedFile = req.files.schedule as UploadedFile;

      // Check if CSV is valid
      const validationStatus: any = validateSchedule(file);
      if (!validationStatus.isValid) {
        res.status(400).send({ err: validationStatus.error });
      }

      // Store schedule in database (overwrite exisitng values)
      const schedule: ScheduleEntryAttributes[] = csvToScheduleData(
        csvToArray(file.data.toString())
      );

      await Promise.all(
        schedule.map(async (data) => {
          try {
            await ScheduleEntry.upsert(data);
          } catch (error) {
            console.error("Error upserting data:", error);
          }
        })
      );

      res.send({ data: "File successfully uploaded" });
    }
  } catch (error) {
    console.error("Error upserting data list:", error);
  }
});

export default scheduleRouter;
