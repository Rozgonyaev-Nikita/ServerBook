import express from 'express';
<<<<<<< HEAD
import { login, register, exchangeBook, changeUser } from './controllers.js';
=======
import { login, register, exchangeBook } from './controllers.js';
>>>>>>> 928619264b8b7aa8b4914d860f594e6e6c087360

const router = express.Router();

router.get('/login', login);
router.post('/registration', register);
router.post('/exchangeBook', exchangeBook);
<<<<<<< HEAD
router.put('/changeUser', changeUser);
=======

>>>>>>> 928619264b8b7aa8b4914d860f594e6e6c087360
export default router;
