import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import config from "server/src/config";
const refreshRouter = Router();

refreshRouter.post("/", (req: Request, res: Response) => {
  const refreshtoken = req.body.refreshtoken;
  if (!refreshtoken) {
    return res.sendStatus(401);
  }

  jwt.verify(refreshtoken, config.jwtSecretKey, (err: any, user: any) => {
    if (err) {
      return res.sendStatus(403);
    }
    const accessToken = jwt.sign({ user: {} }, config.jwtSecretKey, {
      expiresIn: "1hr",
    });
    res.json(accessToken);
  });
});

export default refreshRouter;
