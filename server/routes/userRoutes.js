import express from 'express';
import { authUser, registerUser } from '../controllers/userController.js';

const router = express.Router();

router.route('/').post(registerUser); // POST /api/users
router.post('/login', authUser);     // POST /api/users/login

export default router;