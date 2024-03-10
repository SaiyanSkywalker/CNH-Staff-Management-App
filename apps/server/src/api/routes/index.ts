import { Router } from "express";
import scheduleRoutes from "./schedule";
import shiftHistoryRoutes from "./shift-history";
import userRoutes from "./user";
import unitRoutes from "./unit";
import shiftCapacityRoutes from "./shift-capacity";

const router = Router();
router.use("/schedule", scheduleRoutes);
router.use("/user", userRoutes);
router.use("/shift-history", shiftHistoryRoutes);
router.use("/unit", unitRoutes);
router.use("/shift-capacity", shiftCapacityRoutes)
export default router;
