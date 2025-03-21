import express from "express";
import { login, register, exchangeBook, changeUser, getUserData, getOfferBooks, getWishBooks, getBooksSdelka} from "./controllers.js";

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
