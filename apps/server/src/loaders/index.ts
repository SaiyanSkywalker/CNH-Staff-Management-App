import dbLoader from "./dbLoader";
import expressLoader from "./expressLoader";
import { Application } from "express";

export default async (app: Application, config: any) => {
  // Configures the db and the server
  await expressLoader(app);
  await dbLoader(config);
};
