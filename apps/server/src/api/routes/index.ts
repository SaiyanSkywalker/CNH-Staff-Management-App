import { Router } from "express";
import scheduleRoutes from "./schedule";
import shiftHistoryRoutes from "./shift-history";
import userRoutes from "./user";

const router = Router();
router.use("/schedule", scheduleRoutes);
router.use("/user", userRoutes);
router.use("/shift-history", shiftHistoryRoutes);
export default router;
