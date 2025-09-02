import express from 'express';
import * as adminController from '../controllers/adminController.js';

const router = express.Router();

// Ruta para obtener todos los proyectos
router.get('/', adminController.getAllProjects);

export default router;