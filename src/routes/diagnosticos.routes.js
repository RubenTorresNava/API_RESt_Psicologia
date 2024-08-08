import { Router } from "express";
import * as diagnosticosCtrl from "../controller/diagnosticos.controller.js";
import tokenMiddleware from "../middleware/token.middleware.js";

const router = Router();

router.get("/api/diagnosticos", tokenMiddleware, diagnosticosCtrl.getDiagnosticos);
router.get("/api/diagnosticos/:id", tokenMiddleware, diagnosticosCtrl.getDiagnostico);
router.post("/api/diagnosticos", tokenMiddleware, diagnosticosCtrl.createDiagnostico);
router.put("/api/diagnosticos/:id", tokenMiddleware, diagnosticosCtrl.updateDiagnostico);
router.delete("/api/diagnosticos/:id", tokenMiddleware, diagnosticosCtrl.deleteDiagnostico);    

export default router;