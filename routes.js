import express from "express";
import { login, register, exchangeBook, getBooksByUserName, changeUser, getUserData, getBooks} from "./controllers.js";

const router = express.Router();

router.get("/login", login);
router.get('/getBooks', getBooks);
router.get("/getUserData", getUserData);
router.get("/getBooksByUserName", getBooksByUserName);
router.post("/registration", register);
router.post("/exchangeBook", exchangeBook);
router.put("/changeUser", changeUser);
export default router;
