import { Router } from "express";
import ShiftCapacityRequest from "@shared/src/interfaces/ShiftCapacityRequest";
import {
  getShiftCapacity,
  postShiftCapacity,
} from "../services/ShiftCapacityService";
const shiftCapacityRouter = Router();

shiftCapacityRouter.post("/", async (req, res) => {
  try {
    if(!req.body || Object.keys(req.body).length === 0) {
      res.status(400).json({ msg: "Need a body" });
      return;
    }
    
    if(!req.body.shiftTime || !req.body.capacities || Object.keys(req.body.capacities).length === 0) {
      res.status(400).json({ msg: "Need a shift time and capacity configured for at least one unit!" });
      return;
    }
    let shiftTimeTypeof = typeof req.body.shiftTime;
    let capacitiesTypeOf = typeof req.body.capacities;

    if(shiftTimeTypeof !== "string" || capacitiesTypeOf !== "object") {
      res.status(400).json({ msg: "shiftTime property in request's body should be a string and capacities should be an object of keys of type strings and values of type number" });
      return;
    }

    let shiftCapacityRequest: ShiftCapacityRequest = req.body;
    let updatedShifts = await postShiftCapacity(shiftCapacityRequest);
    res
      .status(200)
      .json({ msg: "Request received successfully and result sent back!", updatedShifts });
  } catch (ex) {
    res.status(500).json({ error: "Error occurred on server!" });
  }
});

shiftCapacityRouter.get("/admin/", async (req, res) => {
  try {
    const data = await getShiftCapacity();
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error occurred on server!" });
  }
});

shiftCapacityRouter.get("/mobile/", async (req, res) => {
  try {
    const costCenterId = Number(req.query.costCenterId);
    const date = req.query.date?.toString();
    if (!costCenterId || !date) {
      res.status(400).json({ msg: "costCenterId should be a valid integer, and date should be a string in format: 'YYYY-MM-DD'" });
      return;
    }
    const data = await getShiftCapacity(date, costCenterId);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
});
export default shiftCapacityRouter;
