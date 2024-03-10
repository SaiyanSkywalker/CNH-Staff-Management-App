import ShiftHistory from "server/src/models/ShiftHistory";
import Unit from "server/src/models/Unit";
import UserInformation from "server/src/models/UserInformation";

export const getShiftHistory = async (id: string) => {
  try {
    const shiftHistory: ShiftHistory[] = await ShiftHistory.findAll({
      where: id ? { userId: id } : {},
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
        employeeId: shiftHistory.userId,
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
