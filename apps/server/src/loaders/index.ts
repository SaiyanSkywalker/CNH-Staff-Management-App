import dbLoader from "./dbLoader";
import expressLoader from "./expressLoader";
import models from "../models"
import { Application } from "express";

export default async (app: Application, config: any) => {
  // Configures the db and the server
  await expressLoader(app);
  //await dbLoader(config);
};
