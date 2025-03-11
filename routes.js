import express from "express";
import { login, register, exchangeBook, changeUser, getUserData } from "./controllers.js";

const router = express.Router();

router.get("/login", login);
router.get("/getUserData", getUserData);
router.post("/registration", register);
router.post("/exchangeBook", exchangeBook);
router.put("/changeUser", changeUser);
export default router;
