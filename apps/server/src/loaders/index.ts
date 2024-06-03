/**
 * File: index.ts
 * Run server and start database connection
 */
import dbLoader from "./dbLoader";
import expressLoader from "./expressLoader";
import { Application } from "express";

export default async (app: Application, config: any) => {
  // Sets up the db and the server
  await expressLoader(app);
  await dbLoader(config);
};
