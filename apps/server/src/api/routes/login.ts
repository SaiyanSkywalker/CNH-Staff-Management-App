import { Request, Response, Router } from "express";
import { sequelize } from "server/src/loaders/dbLoader";
import Role from "server/src/models/Role";
import config from "../../config";
import Unit from "server/src/models/Unit";
import {
  createAccessToken,
  createRefreshToken,
} from "server/src/middleware/jwt";
const loginRouter = Router();

loginRouter.post(
  "/",
  async (req: Request, res: Response): Promise<Response> => {
    try {
      const roleName: string = req.body.isMobile ? "USER" : "ADMIN";
      console.log(roleName);
      // search for user in db
      const user = await sequelize.models.UserInformation.findOne({
        where: {
          username: sequelize.where(
            sequelize.fn("UPPER", sequelize.col("username")),
            sequelize.fn("UPPER", req.body.username)
          ),
          password: req.body.password,
        },
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
      const accessToken = createAccessToken(
        user?.get({ plain: true }),
        config.jwtSecretKey
      );
      const refreshToken = createRefreshToken(
        user?.get({ plain: true }),
        config.jwtSecretKey
      );

      return res.json({ access: accessToken, refresh: refreshToken });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Error retrieving data from user table" + error });
    }
  }
);

export default loginRouter;
