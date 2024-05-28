/**
 * File: shift-capacity.ts
 * Purpose: Defines routes associated with getting staff capacity data for shifts
 */
import { Router } from "express";
import ShiftCapacityRequest from "@shared/src/interfaces/ShiftCapacityRequest";
import {
  getShiftCapacity,
  postShiftCapacity,
} from "../services/ShiftCapacityService";
const shiftCapacityRouter = Router();

// Save shift capacity data to db
shiftCapacityRouter.post("/", async (req, res) => {
  try {
    let shiftCapacityRequest: ShiftCapacityRequest = req.body;
    await postShiftCapacity(shiftCapacityRequest);
    res
      .status(200)
      .json({ msg: "Request received successfully and result sent back!" });
  } catch (ex) {
    res.status(500).json({ error: "Error occurred on server!" });
  }
});

// Gets the shift capacity data for admin portal
shiftCapacityRouter.get("/admin/", async (req, res) => {
  try {
    const data = await getShiftCapacity();
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error occurred on server!" });
  }
});

// Gets the shift capacity data for mobile app
shiftCapacityRouter.get("/mobile/", async (req, res) => {
  try {
    const costCenterId = Number(req.query.costCenterId);
    const date = req.query.date?.toString();
    if (!costCenterId || !date) {
      throw new Error("costCenterId and date are required");
    }
    const data = await getShiftCapacity(date, costCenterId);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
});
export default shiftCapacityRouter;
