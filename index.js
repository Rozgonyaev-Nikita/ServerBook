import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import bcrypt from 'bcrypt'
import multer from 'multer';
import routes from './routes.js'; // Импорт маршрутов
import { PORT, MONGODB_URI } from './config.js'; // Импорт конфигураций
import {Author, BookLibrary, BookResponse, Category, ExchangeList, OfferList, Status, User, UserAddress, UserExchangeList, UserList, UserMsg, UserValueCategory, WishList} from './models.js'

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

mongoose.connect(MONGODB_URI)
  .then(() => console.log("Connected to yourDB-name database"))
  .catch((err) => console.log(err));

app.use('/api', routes);

app.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}`);
  });