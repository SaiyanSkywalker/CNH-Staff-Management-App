import { Request, Response } from "express";

const express = require("express");
const multer = require("multer");
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post(
  "/",
  upload.single("schedule"),
  (req: Request, res: Response): void => {
    if (!req.file) {
      res.status(400).send({ err: "file not found" });
    } else {
      const fileContent: string = req.file.buffer.toString().trim();
      console.log(fileContent);
      //   console.log(csvToScheduleData(fileContent));
      res.send({ data: "File successfully uploaded" });
    }
  }
);

module.exports = router;
