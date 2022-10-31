import express from "express";
import * as userController from "../controller/userController.js";
import { verifyToken } from "./verifyToken.js";
const router = express.Router();

// api/user/register
router.post("/register", userController.register);

// api/user/login
router.post("/login", userController.login);

// api/user/getInfo
router.get("/getInfo", verifyToken, userController.getUserInfo);
// api/user/updateUserInfo
router.patch("/updateUserInfo", verifyToken, userController.updateUserInfo);
// api/user/getUserInfo

// api/user/deleteUser
router.post("/deleteUser", verifyToken, userController.deleteUser);

export { router };
