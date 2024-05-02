import { Request, Response, Router } from "express";
import { sequelize } from "server/src/loaders/dbLoader";
import Role from "server/src/models/Role";
import config from "../../config";

const jwtSecretKey = config

const userRouter = Router();

userRouter.get("/", async (req: Request, res: Response): Promise<Response> => {
  try {
    const roleName: string = req.query.isMobile === "1" ? "USER" : "ADMIN";

    const user = await sequelize.models.UserInformation.findOne({
      where: {
        username: sequelize.where(
          sequelize.fn("UPPER", sequelize.col("username")),
          sequelize.fn("UPPER", req.query.username)
        ),
        password: req.query.password,
      },
      include: {
        model: Role,
        where: {
          name: roleName,
        },
      },
    });

    if(!user) {
      res.status(400).send({message: "User not found"});
    }

    return res.json(user);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error retrieving data from user table" + error });
  }
});

export default userRouter;
