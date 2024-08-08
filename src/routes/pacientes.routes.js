import { Router } from "express";
import * as pacientesCtrl from "../controller/pacientes.controller.js";
import tokenMiddleware from "../middleware/token.middleware.js";
const router = Router();

router.get("/api/pacientes", tokenMiddleware, pacientesCtrl.getPacientes);
router .get("/api/pacientes/:id", pacientesCtrl.getPacienteById);
router.post("/api/pacientes", tokenMiddleware, pacientesCtrl.createPaciente);
router.put("/api/pacientes/:id", tokenMiddleware, pacientesCtrl.updatePaciente);
router.delete("/api/pacientes/:id", tokenMiddleware, pacientesCtrl.deletePaciente);

export default router;