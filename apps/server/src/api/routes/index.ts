/**
 * File: index.ts
 * Purpose: Import route definitions from other files and assigned 
 * them to the router object used in the server
 */

import { Router } from "express";
import scheduleRoutes from "./schedule";
import shiftHistoryRoutes from "./shift-history";
import loginRoutes from "./login";
import unitRoutes from "./unit";
import shiftCapacityRoutes from "./shift-capacity";
import refreshRoutes from "./refresh";
import channelRoutes from "./channel";

const router = Router();
router.use("/schedule", scheduleRoutes);
router.use("/login", loginRoutes);
router.use("/shift-history", shiftHistoryRoutes);
router.use("/unit", unitRoutes);
router.use("/shift-capacity", shiftCapacityRoutes);
router.use("/refresh-token", refreshRoutes);
router.use("/channel", channelRoutes);
export default router;
