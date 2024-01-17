import { Request, Response, Router } from "express";
import { UploadedFile } from "express-fileupload";
import { csvToScheduleData } from "../../util/CsvUtils";

// const multer = require("multer");
const uploadRouter = Router();
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage }); // store the file in memory once it's uploaded, might move this to db later, idk

uploadRouter.post("/", (req: Request, res: Response): void => {
  if (!req.files?.csvFile) {
    res.status(400).send({ err: "file not found" });
  } else {
    const file: UploadedFile = req.files.csvFile as UploadedFile;

    // TODO: remove console.log, take list of ScheduleData objects
    // and convert them into a something that the mobile app or admin portal can
    // use for the user or db
    console.log(csvToScheduleData(file.data.toString()));
    res.send({ data: "File successfully uploaded" });
  }
});

export default uploadRouter;
