import { Request, Response, Router } from "express";
import { sequelize } from "../../loaders/dbLoader";

const unitRouter = Router();

unitRouter.get("/", async (req: Request, res: Response) => {
  try {
    const units = await sequelize.models.Unit.findAll();
    res.json(units);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error retrieving data from Unit table" + error });
  }
});

export default unitRouter;
