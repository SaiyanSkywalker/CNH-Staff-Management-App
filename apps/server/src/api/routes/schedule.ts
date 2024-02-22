import { Request, Response, Router } from "express";
import { UploadedFile } from "express-fileupload";

import ScheduleEntryAttributes from "@shared/src/interfaces/ScheduleEntryAttributes";
import {
  csvToArray,
  csvToScheduleData,
  validateSchedule,
} from "server/src/util/CsvUtils";
import ScheduleEntry from "server/src/models/ScheduleEntry";
import { getScheduleData } from "../services/ScheduleEntryService";

const scheduleRouter = Router();

scheduleRouter.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const scheduleData = await getScheduleData(
      req.query.costCenterId as string
    );
    res.json(scheduleData);
  } catch (err) {
    console.error("Error in retrieving schedule data:", err);
    res.status(500).send({ error: "Error in retrieving schedule data" });
  }
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

      // Inserts shift if it doesn't exist
      // Otherwise, update shift
      //TODO: Come up with a more performant way to do this
      const batchSize = 500;
      for (let i = 0; i < schedule.length; i += batchSize) {
        const batch: ScheduleEntryAttributes[] = schedule.slice(
          i,
          i + batchSize
        );
        await Promise.all(
          batch.map(async (data: ScheduleEntryAttributes) => {
            try {
              await ScheduleEntry.upsert(data);
            } catch (error) {
              console.error("Error upserting data:", error);
            }
          })
        );
      }

      res.send({ data: "File successfully uploaded" });
    }
  } catch (error) {
    console.error("Error upserting data list:", error);
  }
});

export default scheduleRouter;
