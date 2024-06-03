/**
 * File: shift-history.ts
 * Purpose: Defines the routes for processing data for
 * shift request history
 */
import { Router } from "express";
import { getShiftHistory } from "../services/ShiftHistoryService";
import ShiftHistoryQuery from "../../../../shared/src/interfaces/ShiftHistoryQuery";
import Unit from "server/src/models/Unit";
import ShiftHistoryClient from "@shared/src/interfaces/ShiftHistoryClient";

const shiftHistoryRouter = Router();

// Get shift history data based on user search params
shiftHistoryRouter.get("/", async (req, res) => {
  const {
    employeeId,
    employeeName,
    unit,
    requestedDate,
    shiftDate,
    shift,
    status,
  } = req.query;
  console.log(
    `employeeId is ${employeeId}\nemployeeName is ${employeeName}\nunit is ${unit}\nrequestedDate is ${requestedDate}\nshiftDate is ${shiftDate}\nshift is ${shift}\nstatus is ${status}`
  );

  // Get query attributes from request url
  let attributes: ShiftHistoryQuery = {};
  if (employeeId) {
    attributes.employeeId = Number(employeeId as string);
  }
  if (employeeName) {
    attributes.employeeName = employeeName as string;
  }
  if (unit) {
    let unitString = unit as string;
    let unitRecord = await Unit.findOne({
      where: {
        name: unitString,
      },
    });
    attributes.unitId = unitRecord?.id;
  }
  if (requestedDate) {
    const parsedRequestedDate: string = requestedDate as string;
    attributes.createdAt =
      parsedRequestedDate.substring(5, 7) +
      "/" +
      parsedRequestedDate.substring(8, 10) +
      "/" +
      parsedRequestedDate.substring(0, 4);
    console.log(`attributes.createdAt is: ${attributes.createdAt}`);
  }
  if (shiftDate) {
    const parsedDate: string = shiftDate as string;
    attributes.dateRequested =
      parsedDate.substring(5, 7) +
      "/" +
      parsedDate.substring(8, 10) +
      "/" +
      parsedDate.substring(0, 4);
  }
  if (shift) {
    attributes.shift = shift as string;
  }
  if (status) {
    attributes.status = status as string;
  }

  // search for matching records in db
  const shiftHistories: ShiftHistoryClient[] = await getShiftHistory(
    attributes
  );

  res.send(shiftHistories);
});

export default shiftHistoryRouter;
