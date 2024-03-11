import { Request, Response, Router } from "express";
import { sequelize } from "../../loaders/dbLoader";
import ShiftCapacity from "server/src/models/ShiftCapacity";
import ShiftCapacityRequest from "@shared/src/interfaces/ShiftCapacityRequest";
import {postShiftCapacity} from "../services/ShiftCapacityService";
const shiftCapacityRouter = Router();

shiftCapacityRouter.post("/", async (req, res) => {
    try {
        let shiftCapacityRequest: ShiftCapacityRequest = req.body;
        await postShiftCapacity(shiftCapacityRequest);
        res.status(200).json({msg: "Request received successfully and result sent back!"});
    }
    catch(ex) {
        res.status(500).json({error: "Error occurred on server!"});
    }
});

export default shiftCapacityRouter;