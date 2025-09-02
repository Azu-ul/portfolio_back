import express from 'express';
import * as adminController from '../controllers/adminController.js';
import authController from '../controllers/authController.js';

const router = express.Router();

// Middleware de autenticación
router.use(authController.authenticateToken);
router.use(authController.checkAdminRole);

// Rutas simples sin params en la URL
router.get('/projects', adminController.getAllProjects);
router.post('/projects', adminController.createProject);

// Rutas con params numéricos (la validación se hará en el controlador)
router.put('/projects/:id', adminController.updateProject);
router.delete('/projects/:id', adminController.deleteProject);

// Rutas para skills
router.get('/skills', adminController.getAllSkills);
router.post('/skills', adminController.createSkill);
router.put('/skills/:id', adminController.updateSkill);
router.delete('/skills/:id', adminController.deleteSkill);

export default router;