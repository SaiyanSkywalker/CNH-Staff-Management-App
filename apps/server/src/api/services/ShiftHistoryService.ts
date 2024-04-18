import ShiftHistoryQuery from "@shared/src/interfaces/ShiftHistoryQuery";
import ShiftHistory from "server/src/models/ShiftHistory";
import Unit from "server/src/models/Unit";
import UserInformation from "server/src/models/UserInformation";

export const getShiftHistory = async (shiftHistoryQuery: ShiftHistoryQuery) => {
  try {

    let queryParams = {
      ...(shiftHistoryQuery.employeeId != undefined && { userId: shiftHistoryQuery.employeeId }),
      ...(shiftHistoryQuery.employeeName != undefined && {}),
      ...(shiftHistoryQuery.employeeName != undefined && {}),
      ...(shiftHistoryQuery.employeeName != undefined && {}),
      ...(shiftHistoryQuery.employeeName != undefined && {}),
    }

    //let employeeName: string = shiftHistoryQuery.employeeName;
    //let employeeId = shiftHistoryQuery.employeeId;
    //let unitId = shiftHistoryQuery.unitId;

    const shiftHistory: ShiftHistory[] = await ShiftHistory.findAll({
      where: {},
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
    return shiftHistory.map((shiftHistory: ShiftHistory) => {
      return {
        id: shiftHistory.id,
        employeeId: shiftHistory.user.employeeId,
        employeeName:
          shiftHistory.user.firstName + " " + shiftHistory.user.lastName,
        unit: shiftHistory.unit.name,
        dateRequested: shiftHistory.dateRequested,
        status: shiftHistory.status,
        shift: shiftHistory.shiftTime,
      };
    });
  } catch (error) {
    console.log(error);
  }
};
