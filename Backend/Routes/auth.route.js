import express from 'express'
import { login, logout, Signup } from '../Collector/auth.controller.js';

const router = express.Router();

router.post('/login',login)
router.post('/logout',logout)
router.post('/signup',Signup)

export default router;