import express from 'express';
import authController from '../controllers/authController.js';

const app = express();

app.post('/register', authController.register);
app.post('/login', authController.login);
app.put('/change-password', authController.authenticateToken, authController.changePassword);
app.put('/reset-password', authController.resetPassword);
app.get('/me', authController.authenticateToken, authController.getLoggedInUser);
app.get('/check-email-exists', authController.checkEmailExists);

export default app;