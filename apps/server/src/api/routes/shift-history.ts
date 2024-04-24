import { Router } from "express";
import { getShiftHistory } from "../services/ShiftHistoryService";
import ShiftHistoryQuery from "../../../../shared/src/interfaces/ShiftHistoryQuery"
import Unit from "server/src/models/Unit";
import ShiftHistoryClient from "@shared/src/interfaces/ShiftHistoryClient";

const shiftHistoryRouter = Router();

shiftHistoryRouter.get("/", async (req, res) => {
  
  const { employeeId, employeeName, unit, date, shift, status } = req.query;
  let attributes: ShiftHistoryQuery = {};
  if(employeeId) {
    attributes.employeeId = Number(employeeId as string);
  }
  if(employeeName) {
    attributes.employeeName = employeeName as string;
  }
  if(unit) {
    let unitString = unit as string;
    let unitRecord = await Unit.findOne({
      where: {
        name: unitString
      }
    })
    attributes.unitId = unitRecord?.id;
  }
  if(date) {
    attributes.dateRequested = date as string;
  }
  if(shift) {
    attributes.shift = shift as string;
  }
  if(status) {
    attributes.status = status as string;
  }


  const shiftHistories: ShiftHistoryClient[] = await getShiftHistory(attributes);

  res.send(shiftHistories);
});

export default shiftHistoryRouter;
