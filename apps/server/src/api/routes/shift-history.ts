import { Router } from "express";
import { getShiftHistory } from "../services/ShiftHistoryService";

const shiftHistoryRouter = Router();

shiftHistoryRouter.get("/:id?", async (req, res) => {
  const { id } = req.params;
  const shiftHistories = await getShiftHistory(id || "");
  res.send(shiftHistories);
});

export default shiftHistoryRouter;
