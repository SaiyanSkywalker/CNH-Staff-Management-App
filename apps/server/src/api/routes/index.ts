import { Router } from "express";
import scheduleRoutes from "./schedule";
import unitRoutes from "./unit";
import shiftCapacityRoutes from "./shift-capacity";

const router = Router();
router.use("/schedule", scheduleRoutes);
router.use("/unit", unitRoutes);
router.use("/shift-capacity", shiftCapacityRoutes)
export default router;
