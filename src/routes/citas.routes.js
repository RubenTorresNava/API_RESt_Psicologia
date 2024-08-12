import { Router } from 'express';
import * as citasController from '../controller/citas.controller.js';
import tokenMiddleware from '../middleware/token.middleware.js';

const router = Router();

router.get('/api/citas', tokenMiddleware, citasController.getCitas);
router.get('/api/citas/:id', citasController.getCitaById);
router.post('/api/citas', tokenMiddleware, citasController.createCita);
router.put('/api/citas/:id', tokenMiddleware, citasController.updateCita);
router.delete('/api/citas/:id', tokenMiddleware, citasController.deleteCita);
router.put('/api/citas/confirmar/:id', tokenMiddleware, citasController.confirmCita);
router.get('/api/citas/pacientes', tokenMiddleware, citasController.getCitasPacientes);

export default router;