import express from 'express';
import { register } from './controllers.js';

const router = express.Router();

router.get('/login', register);
router.post('/registration', register);

export default router;
