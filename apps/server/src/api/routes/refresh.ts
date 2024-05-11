import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import config from "server/src/config";
const refreshRouter = Router();

refreshRouter.post("/", (req: Request, res: Response) => {
  const refreshToken = req.body.refreshToken;
  const user = req.body.user;

  if (!refreshToken) {
    return res.sendStatus(401);
  }
  jwt.verify(refreshToken, config.jwtSecretKey, (err: any) => {
    if (err) {
      return res.sendStatus(403);
    }
    const accessToken = jwt.sign({ user: user }, config.jwtSecretKey, {
      expiresIn: "15s",
    });
    res.json(accessToken);
  });
});

export default refreshRouter;
