import { Router } from "express";

import * as registrationsController from "../controllers/registrations.controller.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = Router();

router.use(authenticate, authorize("STUDENT"));

router.get("/me", registrationsController.myRegistrations);
router.get("/me/schedule", registrationsController.mySchedule);
router.post("/", registrationsController.registerClass);
router.post("/:id/cancel", registrationsController.cancelRegistration);

export default router;
