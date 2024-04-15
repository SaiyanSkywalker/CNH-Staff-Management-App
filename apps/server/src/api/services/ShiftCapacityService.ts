import ShiftCapacity from "server/src/models/ShiftCapacity";
import ShiftCapacityRequest from "@shared/src/interfaces/ShiftCapacityRequest";
import DefaultCapacity from "server/src/models/DefaultCapacity";

const parseShift = (shiftTime: string): string[] => {
  let shiftStrings: string[] = [];
  let beginTimeHour = Number(shiftTime.substring(0, 2));
  let endTimeHour = Number(shiftTime.substring(8, 10));
  let minutes = shiftTime.substring(3, 5);
  let differenceInHours = endTimeHour - beginTimeHour;
  if(differenceInHours <= 0) {
    differenceInHours += 24;
  }
  for(let i = 0; i < differenceInHours; i += 4) {
    let newBeginTime: number = (beginTimeHour + i) % 24;
    let newEndTime: number = (beginTimeHour + i + 4) % 24;
    let shiftString: string = "";
    let beginString: string = "";
    let endString: string = "";

    if(newBeginTime < 10) {
      beginString = `0${newBeginTime}:${minutes}`;
    }
    else {
      beginString = `${newBeginTime}:${minutes}`;
    }
    if(newEndTime < 10) {
      endString = `0${newEndTime}:${minutes}`;
    }
    else {
      endString = `${newEndTime}:${minutes}`;
    }
    shiftString = beginString + " - " + endString;
    shiftStrings.push(shiftString);
  }
  return shiftStrings;
}

const nextDay = (currentDate: Date) => {
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
  return newDate;
}

export const postShiftCapacity = async (
  shiftCapacityRequest: ShiftCapacityRequest
): Promise<void> => {
  const { shiftDate, shiftTime, capacities } = shiftCapacityRequest;
  let shiftTimeStrings: string[] = parseShift(shiftTime);
  let myDate: Date = new Date(shiftDate + "T00:00:00Z");
  let todayDate: Date = new Date();
  console.log("todayDate.toUTCString() is: " + todayDate.toUTCString());
  console.log("todayDate is: ");
  console.dir(todayDate);
  let nextDate: Date = nextDay(myDate);
  let currDate: Date = myDate;
  let dayCounter = 0;

  for (let unitId in capacities) {
    for(let shiftTimeString of shiftTimeStrings) {
      if(dayCounter > 0) {
        currDate = nextDate;
      }
      let nUnitId = Number(unitId);
      let model: ShiftCapacity | DefaultCapacity;
      if(shiftCapacityRequest.isDefault) {
        model =
        (await DefaultCapacity.findOne({
          where: { shift: shiftTimeString, unitId: nUnitId },
        })) ??
        (await DefaultCapacity.create({
          shift: shiftTimeString,
          unitId: nUnitId,
          capacity: capacities[unitId],
        }));
      }
      else {
        console.log("currDate is: ");
        console.dir(currDate);
        model = 
        (await ShiftCapacity.findOne({
          where: { shift: shiftTimeString, shiftDate: currDate, unitId: nUnitId },
        })) ??
        (await ShiftCapacity.create({
          shift: shiftTimeString,
          shiftDate: currDate,
          unitId: nUnitId,
          capacity: capacities[unitId],
        }));
        console.log("model is: ");
        console.dir(model);
      }

      if (model.capacity != capacities[unitId]) {
        model.capacity = capacities[unitId];
        await model.save();
      }

      if(shiftTimeString.substring(0,2) == "23") {
        dayCounter += 1;
      }

    }
  }
};
