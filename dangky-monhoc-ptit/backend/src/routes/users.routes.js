import { Router } from "express";

import * as usersController from "../controllers/users.controller.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = Router();

router.use(authenticate, authorize("ADMIN"));

router.get("/", usersController.list);
router.put("/:id/role", usersController.updateRole);

export default router;
