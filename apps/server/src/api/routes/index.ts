import { Router } from "express";
import scheduleRoutes from "./schedule";
import unitRoutes from "./unit";
import shiftHistoryRoutes from "./shift-history";

const router = Router();
router.use("/schedule", scheduleRoutes);
router.use("/unit", unitRoutes);
router.use("/shift-history", shiftHistoryRoutes)
export default router;
