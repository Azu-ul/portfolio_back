import express from 'express';
import * as adminController from '../controllers/adminController.js';
import authController from '../controllers/authController.js';

const router = express.Router();

// Rutas GET
router.get('/header', adminController.getHeader);
router.get('/about', adminController.getAbout);
router.get('/contact', adminController.getContact);
router.get('/footer', adminController.getFooter);
router.get('/skills', adminController.getSkills);
router.get('/soft-skills', adminController.getSoftSkills);

// Middleware para rutas protegidas
const protectRoute = [authController.authenticateToken, authController.checkAdminRole];

// Rutas PUT
router.put('/header', protectRoute, adminController.updateHeader);
router.put('/about', protectRoute, adminController.updateAbout);
router.put('/contact', protectRoute, adminController.updateContact);
router.put('/footer', protectRoute, adminController.updateFooter);

export default router;