import { Request, Response, Router } from "express";
import { sequelize } from "server/src/loaders/dbLoader";
import Role from "server/src/models/Role";
import config from "../../config";
import Unit from "server/src/models/Unit";
import { createToken } from "server/src/middleware/jwt";
const loginRouter = Router();

loginRouter.post(
  "/",
  async (req: Request, res: Response): Promise<Response> => {
    try {
      console.log("HIT /LOGIN");
      const roleName: string =
        req.body.isMobile === "1"
          ? "USER"
          : req.body.isMobile === "2"
          ? "ADMIN"
          : "NURSEMANAGER";
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
      return res
        .status(500)
        .json({ error: "Error retrieving data from user table" + error });
    }
  }
);

export default loginRouter;
