/*
import ShiftCapacity from "server/src/models/ShiftCapacity";



export const postShiftCapacity = async (unitId: number, chosenUnit: string, shiftDate: Date) => {
    let myDate: Date = new Date(shiftDate + "T00:00:00Z");
        const model = await ShiftCapacity.findOne( { where: {shift: req.body.shift, shiftDate: myDate, unitId  } } ) ?? await ShiftCapacity.create( { shift: req.body.shift, shiftDate: myDate, unitId, capacity: req.body[chosenUnit] } );
        if(model.capacity != req.body[chosenUnit]) {
            model.capacity = req.body[chosenUnit];
            model.save();
        }
}
*/

//shiftCapacity data modular

//shiftDate
//capacities [key:string]: number
//