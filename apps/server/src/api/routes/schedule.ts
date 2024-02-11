import { Request, Response, Router } from "express";
import { UploadedFile } from "express-fileupload";
import { csvToScheduleData } from "../../util/CsvUtils";
import { sequelize } from "../../loaders/dbLoader";

import ScheduleData from "../../constants/ScheduleData";
import { ScheduleEntry } from "../../interfaces/ScheduleEntry";
const scheduleRouter = Router();

scheduleRouter.get("/", async (req: Request, res: Response): Promise<void> => {
  // const record = await sequelize.models.ScheduleEntry.findAll();
  const data = ScheduleData;
  const scheduleEntries: ScheduleEntry[] = csvToScheduleData(data);
  const entriesByCostCenter: {
    [key in ScheduleEntry["costCenter"]]: ScheduleEntry[];
  } = scheduleEntries.reduce((result, obj) => {
    const key = obj.costCenter;
    if (!result[obj.costCenter]) {
      result[key] = [];
    }
    result[key].push(obj);
    return result;
  }, {} as { [key: string]: ScheduleEntry[] });

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
