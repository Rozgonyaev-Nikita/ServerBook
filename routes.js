import express from "express";
<<<<<<< HEAD
import { login, register, exchangeBook, changeUser, getUserData, getOfferBooks, getWishBooks} from "./controllers.js";
=======
import { login, register, exchangeBook, changeUser, getUserData, getOfferBooks, getBooksSdelka} from "./controllers.js";
>>>>>>> d59d6711971dd5197f92d0786ab185eaf1befaf4

const router = express.Router();

router.get("/login", login);
router.get('/getOfferBooks', getOfferBooks);
router.get('/getWishBooks', getWishBooks);
router.get("/getUserData", getUserData);
router.get("/getBooksSdelka", getBooksSdelka);
router.post("/registration", register);
router.post("/exchangeBook", exchangeBook);
router.put("/changeUser", changeUser);
export default router;
