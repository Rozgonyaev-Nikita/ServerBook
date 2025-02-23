import express from 'express';
import { login, register } from './controllers.js';

const router = express.Router();

router.get('/login', login);
router.post('/registration', register);

export default router;
