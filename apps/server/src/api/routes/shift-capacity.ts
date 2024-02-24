import { Request, Response, Router } from "express";
import { sequelize } from "../../loaders/dbLoader";
import ShiftCapacity from "server/src/models/ShiftCapacity";

const shiftCapacityRouter = Router();

shiftCapacityRouter.post("/", async (req, res) => {
    let myDate: Date = new Date(req.body.date + "T00:00:00Z");
    const setShiftCapacity = async (unitId: number, chosenUnit: string) => {
        const model = await ShiftCapacity.findOne( { where: {shift: req.body.shift, shiftDate: myDate, unitId  } } ) ?? await ShiftCapacity.create( { shift: req.body.shift, shiftDate: myDate, unitId, capacity: req.body[chosenUnit] } );
        if(model.capacity != req.body[chosenUnit]) {
            model.capacity = req.body[chosenUnit];
            model.save();
        }
    }
    setShiftCapacity(3, "picu");
    setShiftCapacity(4, "nicu");
    setShiftCapacity(5, "sevenEast");
    res.send("Request received successfully and result sent back!");
});

export default shiftCapacityRouter;