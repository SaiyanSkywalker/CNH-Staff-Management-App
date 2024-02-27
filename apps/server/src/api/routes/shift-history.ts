import { Router } from "express";
import ShiftHistory from "server/src/models/ShiftHistory";
import Unit from "server/src/models/Unit";
import UserInformation from "server/src/models/UserInformation";

const shiftHistoryRouter = Router();
shiftHistoryRouter.get("/", async (req, res) => {
    res.send((await ShiftHistory.findAll({ 
        include: [ 
            { 
                model: Unit,
                required: true
            }, 
            { 
                model: UserInformation,
                required: true
            } 
        ]
     })).map(shiftHistory => {
        return {
            employeeId: shiftHistory.userId,
            employeeName: shiftHistory.user.firstName + " " + shiftHistory.user.lastName,
            unit: shiftHistory.unit.name,
            dateRequested: shiftHistory.dateRequested,
            status: shiftHistory.status,
            shift: shiftHistory.shiftTime    
        }
    }));
})
shiftHistoryRouter.get("/:id", async (req, res) => {
    const { id } = req.params;
    const shiftHistories = (await ShiftHistory.findAll({ where: { userId: id }, 
        include: [ 
            { 
                model: Unit,
                required: true
            }, 
            { 
                model: UserInformation,
                required: true
            } 
        ]})).map(shiftHistory => {
        return {
            employeeId: shiftHistory.userId,
            employeeName: shiftHistory.user.firstName + " " + shiftHistory.user.lastName,
            unit: shiftHistory.unit.name,
            dateRequested: shiftHistory.dateRequested,
            status: shiftHistory.status,
            shift: shiftHistory.shiftTime    
        }
    });
    res.send(shiftHistories);
})

export default shiftHistoryRouter;
