import express from "express";
import * as userController from "../controller/userController.js";
import { verifyToken } from "./verifyToken.js";
const router = express.Router();

// api/user/register
router.post("/register", userController.register);

// api/user/login
router.post("/login", userController.login);

// api/user/getAllUser
router.get("/getAllUser", verifyToken, userController.getAllUser);

// api/user/getInfo
router.get("/getInfo", verifyToken, userController.getInfo);
// api/user/update
router.patch("/update", verifyToken, userController.updateUser);

// api/user/delete
router.post("/delete", verifyToken, userController.deleteUser);

export { router };
