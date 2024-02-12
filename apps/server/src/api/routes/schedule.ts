import { Request, Response, Router } from "express";
import { UploadedFile } from "express-fileupload";
import { csvToScheduleData } from "../../util/CsvUtils";

import ScheduleData from "../../constants/ScheduleData";
import ScheduleEntryAttributes from "@shared/src/interfaces/ScheduleEntryAttributes";
const scheduleRouter = Router();

scheduleRouter.get("/", async (req: Request, res: Response): Promise<void> => {
  // const record = await sequelize.models.ScheduleEntry.findAll();

  const data = ScheduleData;
  const scheduleEntries: ScheduleEntryAttributes[] = csvToScheduleData(data);

  // Group entries by cost center
  const entriesByCostCenter: {
    [key in ScheduleEntryAttributes["costCenterId"]]: ScheduleEntryAttributes[];
  } = scheduleEntries.reduce((result, obj) => {
    const key = obj.costCenterId;
    if (!result[obj.costCenterId]) {
      result[key] = [];
    }
    result[key].push(obj);
    return result;
  }, {} as { [key: string]: ScheduleEntryAttributes[] });

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
