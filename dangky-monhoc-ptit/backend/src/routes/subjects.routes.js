import { Router } from "express";

import * as subjectsController from "../controllers/subjects.controller.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = Router();

router.get("/", subjectsController.list);
router.get("/:id", subjectsController.getById);

router.post("/", authenticate, authorize("ADMIN"), subjectsController.create);
router.put("/:id", authenticate, authorize("ADMIN"), subjectsController.update);
router.delete("/:id", authenticate, authorize("ADMIN"), subjectsController.remove);

export default router;
