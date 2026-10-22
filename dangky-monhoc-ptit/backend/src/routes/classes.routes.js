import { Router } from "express";

import * as classesController from "../controllers/classes.controller.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = Router();

router.get("/", classesController.list);
router.get("/teaching/me", authenticate, authorize("TEACHER"), classesController.myTeachingClasses);
router.get("/:id", classesController.getById);
router.get("/:id/roster", authenticate, authorize("TEACHER", "ADMIN"), classesController.roster);

router.post("/", authenticate, authorize("ADMIN"), classesController.create);
router.put("/:id", authenticate, authorize("ADMIN"), classesController.update);
router.delete("/:id", authenticate, authorize("ADMIN"), classesController.remove);

export default router;
