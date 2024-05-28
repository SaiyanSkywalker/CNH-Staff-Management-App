import { Request, Response, Router } from "express";
import Unit from "server/src/models/Unit";

const unitRouter = Router();

unitRouter.get("/", async (req: Request, res: Response) => {
  try {
    const units = await Unit.findAll();
    res.json(units);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error retrieving data from Unit table" + error });
  }
});

unitRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const units = await Unit.findAll({
      where: { id }
    });
    res.json(units);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error retrieving data from Unit table" + error });
  }
});

export default unitRouter;
