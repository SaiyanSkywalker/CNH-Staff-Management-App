import { Application } from "express";
import configureServer from "./loaders/expressLoader";
import config from "./config";
import routes from "./api/routes";

const app: Application = configureServer();

app.use("/", routes);

app.listen(config.port, () => {
  console.log(`Listening to server on port ${config.port}`);
});
