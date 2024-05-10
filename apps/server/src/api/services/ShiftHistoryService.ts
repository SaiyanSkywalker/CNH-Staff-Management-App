import ShiftHistoryQuery from "@shared/src/interfaces/ShiftHistoryQuery";
import ShiftHistory from "server/src/models/ShiftHistory";
import Unit from "server/src/models/Unit";
import UserInformation from "server/src/models/UserInformation";
import ShiftHistoryClient from "@shared/src/interfaces/ShiftHistoryClient";

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
        createdAt: shiftHistory.createdAt
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

    if(shiftHistoryQuery.createdAt != undefined) {
      let createdAtDate: Date = new Date(Number(shiftHistoryQuery?.createdAt?.substring(6, 10)), Number(shiftHistoryQuery?.createdAt?.substring(0, 2))-1, Number(shiftHistoryQuery?.createdAt?.substring(3, 5))); 
      let matchingDates: ShiftHistoryClient[] = [];
      for(let shiftHistoryObject of shiftHistoryObjects) {
        if(shiftHistoryObject.createdAt.getDay() === createdAtDate.getDay() && shiftHistoryObject.createdAt.getMonth() === createdAtDate.getMonth() && shiftHistoryObject.createdAt.getFullYear() === createdAtDate.getFullYear()) {
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
