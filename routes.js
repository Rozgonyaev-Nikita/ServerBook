import express from 'express';
import { login, register, exchangeBook } from './controllers.js';

const router = express.Router();

router.get('/login', login);
router.post('/registration', register);
router.post('/exchangeBook', exchangeBook);

export default router;
