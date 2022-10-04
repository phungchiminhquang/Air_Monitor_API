import express from "express";
import * as userController from "../controller/userController.js";

const router = express.Router();

// api/user/register
router.post("/register", userController.register);

// api/user/login
router.post("/login", userController.login);

// api/user/getInfo
// router.get("/getInfo",verifyToken, userController.getUserInfo);

// api/user/updateUserInfo

// api/user/getUserInfo

export { router };
