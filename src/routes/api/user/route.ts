import { type Request, type Response, Router } from "express";
import userController from "../../../controllers/user.controller";

const router = Router();

router.post("/", userController.create.bind(userController));
router.get("/", userController.getUserList.bind(userController));
router.get("/id/:id", userController.getUser.bind(userController));
router.get("/sinchronize", userController.sinchronize.bind(userController));

router.use((_: Request, res: Response) => {
	res.status(404).json({
		error: "Invalid route",
	});
});

export default router;
