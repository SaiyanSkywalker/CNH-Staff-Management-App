/**
 * File: unit.ts
 * Purpose: Defines routes assosciated with
 * processing data related to units (cost centers)
 */
import { Request, Response, Router } from "express";
import Unit from "server/src/models/Unit";

const unitRouter = Router();

/**
 * Retrieves all units
 */
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

/**
 * Retrives unit based on id
 */
unitRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const units = await Unit.findAll({
      where: { id },
    });
    res.json(units);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error retrieving data from Unit table" + error });
  }
});

export default unitRouter;
