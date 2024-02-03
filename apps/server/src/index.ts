import express from "express";
import config from "./config";
import loaders from "./loaders";
const app = express();

const startServer = async () => {
  await loaders(app, config);

  app.listen(config.port, () => {
    console.log(`Listening to server on port ${config.port}`);
  });
};

startServer();
