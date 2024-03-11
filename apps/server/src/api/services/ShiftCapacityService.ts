import ShiftCapacity from "server/src/models/ShiftCapacity";
import ShiftCapacityRequest from "@shared/src/interfaces/ShiftCapacityRequest";

export const postShiftCapacity = async (shiftCapacityRequest: ShiftCapacityRequest): Promise<void> => {
    const {shiftDate, shiftTime, capacities} = shiftCapacityRequest;
    console.dir(capacities);
    let myDate: Date = new Date(shiftDate + "T00:00:00Z");
    for(let unitId in capacities) {
        let nUnitId = Number(unitId);
        const model = await ShiftCapacity.findOne( { where: {shift: shiftTime, shiftDate: myDate, unitId: nUnitId  } } ) ?? await ShiftCapacity.create( { shift: shiftTime, shiftDate: myDate, unitId: nUnitId, capacity: capacities[unitId] } );
        if(model.capacity != capacities[unitId]) {
            model.capacity = capacities[unitId];
            model.save();
        }
    }
}