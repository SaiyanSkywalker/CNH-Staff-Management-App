import { Router } from "express";
import scheduleRoutes from "./schedule";
import unitRoutes from "./unit";
import userRoutes from "./user";

const router = Router();
router.use("/schedule", scheduleRoutes);
router.use("/unit", unitRoutes);
router.use("/user", userRoutes)
export default router;
