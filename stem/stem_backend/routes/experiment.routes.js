import express from "express";
import {
  getChemistryExperiments,
  getPhysicsExperiments,
  getExperimentById
} from "../controllers/experiment.controller.js";

const router = express.Router();

router.get("/chemistry/experiments", getChemistryExperiments);
router.get("/physics/experiments", getPhysicsExperiments);
router.get("/:subject/experiments/:id", getExperimentById);

export default router;
