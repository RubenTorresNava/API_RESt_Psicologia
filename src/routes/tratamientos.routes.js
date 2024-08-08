import { Router } from "express";
import * as tratamientoCtrl from "../controller/tratamientos.controller.js";
import tokenMiddleware from "../middleware/token.middleware.js";

const router = Router();

router.get("/api/tratamientos", tokenMiddleware, tratamientoCtrl.getTratamientos);

export default router;