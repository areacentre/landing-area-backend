import { Router, type Request, type Response } from "express";
import apiRoutes from "./api/index";

const router = Router();

router.use("/api", apiRoutes);

router.use((_req: Request, res: Response) => {
	res.status(404).json({ error: "Invalid route" });
});

export default router;
