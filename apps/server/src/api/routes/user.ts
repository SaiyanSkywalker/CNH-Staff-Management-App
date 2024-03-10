import { Request, Response, Router } from "express";
import { sequelize } from "server/src/loaders/dbLoader";
import Role from "server/src/models/Role";

const userRouter = Router();

userRouter.get("/", async (req: Request, res: Response): Promise<Response> => {
  try {
    const roleName: string = req.query.isMobile === "1" ? "USER" : "ADMIN";

    const user = await sequelize.models.UserInformation.findOne({
      where: { username: req.query.username, password: req.query.password },
      include: {
        model: Role,
        where: {
          name: roleName,
        },
      },
    });
    return res.json(user);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error retrieving data from user table" + error });
  }
});

export default userRouter;