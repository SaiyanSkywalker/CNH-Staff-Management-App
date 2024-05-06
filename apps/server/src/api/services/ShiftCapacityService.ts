import ShiftCapacity from "server/src/models/ShiftCapacity";
import ShiftCapacityRequest from "@shared/src/interfaces/ShiftCapacityRequest";
import DefaultCapacity from "server/src/models/DefaultCapacity";
import Unit from "server/src/models/Unit";
import ShiftCapacityAttributes from "@shared/src/interfaces/ShiftCapacityAttributes";
import ShiftCapacityResponse from "@shared/src/interfaces/ShiftCapacityResponse";

const parseShift = (shiftTime: string): string[] => {
  let shiftStrings: string[] = [];
  let beginTimeHour = Number(shiftTime.substring(0, 2));
  let endTimeHour = Number(shiftTime.substring(8, 10));
  let minutes = shiftTime.substring(3, 5);
  let differenceInHours = endTimeHour - beginTimeHour;
  if (differenceInHours <= 0) {
    differenceInHours += 24;
  }
  for (let i = 0; i < differenceInHours; i += 4) {
    let newBeginTime: number = (beginTimeHour + i) % 24;
    let newEndTime: number = (beginTimeHour + i + 4) % 24;
    let shiftString: string = "";
    let beginString: string = "";
    let endString: string = "";

    if (newBeginTime < 10) {
      beginString = `0${newBeginTime}:${minutes}`;
    } else {
      beginString = `${newBeginTime}:${minutes}`;
    }
    if (newEndTime < 10) {
      endString = `0${newEndTime}:${minutes}`;
    } else {
      endString = `${newEndTime}:${minutes}`;
    }
    shiftString = beginString + " - " + endString;
    shiftStrings.push(shiftString);
  }
  return shiftStrings;
};

const nextDay = (currentDate: string) => {
  const newDate = new Date(currentDate);
  const currentDay = newDate.getDate();
  newDate.setDate(currentDay + 1);
  if (newDate.getDate() === 1) {
    newDate.setMonth(newDate.getMonth() + 1);
    if (newDate.getMonth() === 0) {
      newDate.setFullYear(newDate.getFullYear() + 1);
    }
    newDate.setDate(1);
  }
  return newDate.toISOString().substring(0, 10);
};

export const postShiftCapacity = async (
  shiftCapacityRequest: ShiftCapacityRequest
): Promise<void> => {
  const { shiftDate, shiftTime, capacities } = shiftCapacityRequest;
  let shiftTimeStrings: string[] = parseShift(shiftTime);

  // Add original shift time to broken down intervals
  shiftTimeStrings.push(shiftTime);
  let nextDate: string = nextDay(shiftDate);
  for (let unitId in capacities) {
    let currDate: string = shiftDate;
    let dayCounter = 0;
    for (let shiftTimeString of shiftTimeStrings) {
      if (dayCounter > 0) {
        currDate = nextDate;
      }
      let nUnitId = Number(unitId);
      let model: ShiftCapacity | DefaultCapacity;
      if (shiftCapacityRequest.isDefault) {
        model =
          (await DefaultCapacity.findOne({
            where: { shift: shiftTimeString, unitId: nUnitId },
          })) ??
          (await DefaultCapacity.create({
            shift: shiftTimeString,
            unitId: nUnitId,
            capacity: capacities[unitId],
          }));
      } else {
        model =
          (await ShiftCapacity.findOne({
            where: {
              shift: shiftTimeString,
              shiftDate: currDate,
              unitId: nUnitId,
            },
          })) ??
          (await ShiftCapacity.create({
            shift: shiftTimeString,
            shiftDate: currDate,
            unitId: nUnitId,
            capacity: capacities[unitId],
          }));
      }

      if (model.capacity != capacities[unitId]) {
        model.capacity = capacities[unitId];
        await model.save();
      }

      if (shiftTimeString.substring(0, 2) == "23") {
        dayCounter += 1;
      }
    }
  }
};

export const getShiftCapacity = async (
  date: string | undefined = undefined,
  costCenterId: number | undefined = undefined
) => {
  const defaultCapacities: DefaultCapacity[] = await DefaultCapacity.findAll({
    include: [
      {
        model: Unit,
        required: true,
        where: costCenterId ? { id: costCenterId } : {},
      },
    ],
  });
  const capacities = await ShiftCapacity.findAll({
    where: date
      ? {
          shiftDate: date,
        }
      : {},
    include: [
      {
        model: Unit,
        required: true,
        where: costCenterId ? { id: costCenterId } : {},
      },
    ],
  });
  return {
    default: defaultCapacities.map((sc: DefaultCapacity) => {
      return {
        shift: sc.shift,
        capacity: sc.capacity,
        id: sc.id,
        unitId: sc.unit.id,
        laborLevelEntryId: sc.unit.laborLevelEntryId,
      };
    }),
    updated: capacities.map((sc: ShiftCapacity) => {
      return {
        shift: sc.shift,
        capacity: sc.capacity,
        id: sc.id,
        unitId: sc.unit.id,
        laborLevelEntryId: sc.unit.laborLevelEntryId,
        shiftDate: sc.shiftDate,
      };
    }),
  };
};
