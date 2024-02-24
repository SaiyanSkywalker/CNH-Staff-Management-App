import { Router } from "express";


const shiftHistoryRouter = Router();

shiftHistoryRouter.get("/", (req, res) => {
    console.log("Request received!");
    res.send();
})

export default shiftHistoryRouter;


/*
 * Need to update UserInformation model to contain a name 
 */