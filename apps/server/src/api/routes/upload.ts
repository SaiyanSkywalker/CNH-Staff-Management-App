import { Request, Response, Router } from "express";
import { UploadedFile } from "express-fileupload";
import { csvToScheduleData } from "../../util/CsvUtils";
import { sequelize } from "../../loaders/dbLoader";

const uploadRouter = Router();

uploadRouter.get("/", async (req: Request, res: Response): Promise<void> => {
  const record = await sequelize.models.ScheduleEntry.findAll();
  console.log(record);
  res.send("Hello World!");
});

uploadRouter.post("/", (req: Request, res: Response): void => {
  if (!req.files?.csvFile) {
    res.status(400).send({ err: "file not found" });
  } else {
    const file: UploadedFile = req.files.csvFile as UploadedFile;
    console.log(csvToScheduleData(file.data.toString()));
    res.send({ data: "File successfully uploaded" });
  }
});

export default uploadRouter;
