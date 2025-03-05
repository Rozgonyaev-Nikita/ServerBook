import express from 'express';
import { login, register, changeUser } from './controllers.js';

const router = express.Router();

router.get('/login', login);
router.post('/registration', register);
// router.post('/exchangeBook', exchangeBook);
router.put('/changeUser', changeUser);
export default router;
