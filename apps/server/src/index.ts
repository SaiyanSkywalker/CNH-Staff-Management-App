import { Express, Request, Response } from "express";

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const app: Express = express();

const upload = require("./controllers/upload");

dotenv.config();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use("/upload", upload);

const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response): void => {
  res.send("Hello World!");
});

app.listen(port, (): void => {
  console.log(`Example app listening on port ${port}`);
});
