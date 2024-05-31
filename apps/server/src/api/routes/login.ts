import { Request, Response, Router } from "express";
import { sequelize } from "server/src/loaders/dbLoader";
import Role from "server/src/models/Role";
import config from "../../config";
import Unit from "server/src/models/Unit";
import UserInformation from "server/src/models/UserInformation";
import { createToken } from "server/src/middleware/jwt";
const loginRouter = Router();

loginRouter.post(
  "/",
  async (req: Request, res: Response): Promise<Response> => {
    try {
      //Send error if request body is missing info
      if (!req.body.username || !req.body.password || !req.body.isMobile) {
        return res.status(400).send({
          message:
            "Request body does not contain all required params (username, password, isMobile)",
        });
      }
      const roleName: string =
        req.body.isMobile === "1"
          ? "USER"
          : req.body.isMobile === "2"
          ? "ADMIN"
          : "NURSEMANAGER";

      // search for user in db
      const username = req.body.username as string;
      const password = req.body.password as string;
      const user: UserInformation | null = await UserInformation.findOne({
        where: sequelize.and(
          sequelize.where(
            sequelize.fn("UPPER", sequelize.col("username")),
            sequelize.fn("UPPER", username)
          ),
          { password: password }
        ),
        include: [
          {
            model: Role,
            where: {
              name: roleName,
            },
          },
          { model: Unit },
        ],
      });

      if (!user) {
        return res.status(400).send({ message: "User not found" });
      }

      // if user is found, create JWT tokens
      const accessToken = createToken(
        user?.get({ plain: true }),
        config.jwtSecretKey,
        config.accessTokenLifetime
      );
      const refreshToken = createToken(
        user?.get({ plain: true }),
        config.jwtSecretKey,
        config.refreshTokenLifetime
      );

      return res.json({ access: accessToken, refresh: refreshToken });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ error: "Error retrieving data from user table" + error });
    }
  }
);

export default loginRouter;
