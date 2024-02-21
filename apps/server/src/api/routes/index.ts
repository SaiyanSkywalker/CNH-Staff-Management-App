import { Router } from "express";
import scheduleRoutes from "./schedule";
import unitRoutes from "./unit";

const router = Router();
router.use("/schedule", scheduleRoutes);
router.use("/unit", unitRoutes);
export default router;
