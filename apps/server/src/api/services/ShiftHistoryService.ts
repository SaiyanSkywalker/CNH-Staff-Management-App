/**
 * File: ShiftHistoryService.ts
 * Purpose: Contains functionality for database operations involving shift history
 */
import ShiftHistoryQuery from "@shared/src/interfaces/ShiftHistoryQuery";
import ShiftHistory from "server/src/models/ShiftHistory";
import Unit from "server/src/models/Unit";
import UserInformation from "server/src/models/UserInformation";
import ShiftHistoryClient from "@shared/src/interfaces/ShiftHistoryClient";

/**
 * Gets shift history based on search queries
 * @param shiftHistoryQuery search data to filter shift history
 * @returns records from ShiftHistory table that match query
 */
export const getShiftHistory = async (shiftHistoryQuery: ShiftHistoryQuery): Promise<ShiftHistoryClient[]> => {
  let shiftHistoryObjects: ShiftHistoryClient[] = [];
  try {
    let queryParams = {
      ...(shiftHistoryQuery.employeeId != undefined ? { userId: shiftHistoryQuery.employeeId } : {}),
      ...(shiftHistoryQuery.unitId != undefined ? { unitId: shiftHistoryQuery.unitId } : {}),
      ...(shiftHistoryQuery.dateRequested != undefined ? { dateRequested: shiftHistoryQuery.dateRequested } : {}),
      ...(shiftHistoryQuery.status != undefined ? { status: shiftHistoryQuery.status } : {}),
      ...(shiftHistoryQuery.shift != undefined ? { shiftTime: shiftHistoryQuery.shift } : {}),
    }
    const shiftHistory: ShiftHistory[] = await ShiftHistory.findAll({
      where: queryParams,
      include: [
        {
          model: Unit,
          required: true,
        },
        {
          model: UserInformation,
          required: true,
        },
      ],
    });

    shiftHistoryObjects = shiftHistory.map((shiftHistory: ShiftHistory) => {
      return {
        id: shiftHistory.id,
        employeeId: shiftHistory.user.employeeId,
        employeeName:
          shiftHistory.user.firstName + " " + shiftHistory.user.lastName,
        unit: shiftHistory.unit.name,
        dateRequested: shiftHistory.dateRequested,
        status: shiftHistory.status,
        shift: shiftHistory.shiftTime,
        createdAt: (shiftHistory.createdAt.getMonth() < 9 ? "0" + String(shiftHistory.createdAt.getMonth() + 1) : String(shiftHistory.createdAt.getMonth() + 1)) + "/" + (shiftHistory.createdAt.getDate() < 10 ? "0" + String(shiftHistory.createdAt.getDate()) : String(shiftHistory.createdAt.getDate())) + "/" + (String(shiftHistory.createdAt.getFullYear()))
      };
    });

    if(shiftHistoryQuery.employeeName != undefined) {
      let matchingNames: ShiftHistoryClient[] = [];
      for(let shiftHistoryObject of shiftHistoryObjects) {
        if (shiftHistoryObject.employeeName == shiftHistoryQuery.employeeName) {
          matchingNames.push(shiftHistoryObject);
        }
      }
      shiftHistoryObjects = matchingNames;
    }
    //console.log(`shiftHistoryObjects before is:`);
    //console.dir(shiftHistoryObjects);
    if(shiftHistoryQuery.createdAt != undefined) {
      let createdAtDate: Date = new Date(Number(shiftHistoryQuery?.createdAt?.substring(6, 10)), Number(shiftHistoryQuery?.createdAt?.substring(0, 2))-1, Number(shiftHistoryQuery?.createdAt?.substring(3, 5))); 
      let createdAtDateString: string = (createdAtDate.getMonth() < 9 ? "0" + String(createdAtDate.getMonth() + 1) : String(createdAtDate.getMonth() + 1)) + "/" + (createdAtDate.getDate() < 10 ? "0" + String(createdAtDate.getDate()) : String(createdAtDate.getDate())) + "/" + (String(createdAtDate.getFullYear()))
      let matchingDates: ShiftHistoryClient[] = [];
      for(let shiftHistoryObject of shiftHistoryObjects) {
        if(shiftHistoryObject.createdAt === createdAtDateString) {
          matchingDates.push(shiftHistoryObject);
        }
      }
      shiftHistoryObjects = matchingDates;
    }
  } catch (error) {
    console.log(error);
  } finally {
    return shiftHistoryObjects;
  }
};
