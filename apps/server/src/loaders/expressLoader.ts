import cors from "cors";
import express, { Application } from "express";
import fileUpload from "express-fileupload";
import routes from "../api/routes";
export default (app: Application): Application => {
  
  // Middleware
  app.use(cors());
  app.use(fileUpload({ limits: { fileSize: 1000 * 1024 * 1024 } }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Routes
  app.use("/", routes);
  return app;
};
