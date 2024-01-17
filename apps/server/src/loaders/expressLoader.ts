import cors from "cors";
import express, { Application, Express } from "express";
import fileUpload from "express-fileupload";
const configureServer = (): Application => {
  const app: Application = express();

  // Middleware
  app.use(cors());
  app.use(fileUpload({ limits: { fileSize: 1000 * 1024 * 1024 } }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  return app;
};
export default configureServer;
