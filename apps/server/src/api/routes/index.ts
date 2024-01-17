import { Router } from "express";
import uploadRoutes from "./upload";

const router = Router();
router.use("/upload", uploadRoutes);
export default router;
