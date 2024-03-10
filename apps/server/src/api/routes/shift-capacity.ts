import { Request, Response, Router } from "express";
import { sequelize } from "../../loaders/dbLoader";
import ShiftCapacity from "server/src/models/ShiftCapacity";

const shiftCapacityRouter = Router();

shiftCapacityRouter.post("/", async (req, res) => {
    const setShiftCapacity = async (unitId: number, chosenUnit: string, shiftDate: Date) => {
        let myDate: Date = new Date(shiftDate + "T00:00:00Z");
        const model = await ShiftCapacity.findOne( { where: {shift: req.body.shift, shiftDate: myDate, unitId  } } ) ?? await ShiftCapacity.create( { shift: req.body.shift, shiftDate: myDate, unitId, capacity: req.body[chosenUnit] } );
        if(model.capacity != req.body[chosenUnit]) {
            model.capacity = req.body[chosenUnit];
            model.save();
        }
    }

    console.log("req:");
    console.dir(req);
    //setShiftCapacity(3, "picu", req.body.date);
    //setShiftCapacity(4, "nicu", req.body.date);
    //setShiftCapacity(5, "sevenEast", req.body.date);
    res.send("Request received successfully and result sent back!");
});

export default shiftCapacityRouter;