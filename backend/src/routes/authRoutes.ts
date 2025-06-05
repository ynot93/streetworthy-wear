// backend/src/routes/authRoutes.ts
import express from 'express';
import { register, login, logout, getMe } from '../controllers/authController';
import { authenticated, authorize } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', authenticated, logout); // Logout only for logged-in users
router.get('/me', authenticated, getMe); // Get user profile for logged-in users

export default router;