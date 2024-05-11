import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import fileUpload from "express-fileupload";
import routes from "../api/routes";
import { verifyToken } from "../middleware/jwt";
export default (app: Application): Application => {
  const MAX_FILE_SIZE = 1000 * 1024 * 1024; // max file upload size (in MB)
  const nonAuthPaths = ["/login", "/refresh-token"];
  // Middleware
  app.use(cors());
  app.use(fileUpload({ limits: { fileSize: MAX_FILE_SIZE } }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use((req: Request, res: Response, next: NextFunction) => {
    // Prevents JWT middleware from being ran on login routes
    if (!nonAuthPaths.includes(req.path)) {
      verifyToken(req, res, next);
    } else {
      next();
    }
  });
  // Routes
  app.use("/", routes);
  return app;
};
