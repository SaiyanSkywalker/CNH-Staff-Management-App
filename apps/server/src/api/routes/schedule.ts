import { Request, Response, Router } from "express";
import { UploadedFile } from "express-fileupload";

import ScheduleEntryAttributes from "@shared/src/interfaces/ScheduleEntryAttributes";
import { handleTestScheduleData } from "../services/ScheduleEntryService";

const scheduleRouter = Router();

scheduleRouter.get("/", async (req: Request, res: Response): Promise<void> => {
  const entriesByCostCenter: { [key: string]: ScheduleEntryAttributes[] } =
    handleTestScheduleData(req.query.unit as string);

  res.json(entriesByCostCenter);
});

scheduleRouter.post("/", (req: Request, res: Response): void => {
  if (!req.files?.csvFile) {
    res.status(400).send({ err: "file not found" });
  } else {
    const file: UploadedFile = req.files.csvFile as UploadedFile;
    // TODO: Include some validation for CSV file (handle empty file case, without correct # of columns, etc.)
    // TODO: add logic to store uploaded schedule into database
    res.send({ data: "File successfully uploaded" });
  }
});

export default scheduleRouter;
