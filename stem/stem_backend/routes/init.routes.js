import express from "express";
import { initData } from "../controllers/init.controller.js";

const router = express.Router();
router.post("/init-data", initData);

export default router;
