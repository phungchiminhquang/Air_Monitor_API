import express from "express";
import UserModel from "../model/userModel.js";
import { registerValidation, loginValidation } from "../validation.js";
import { verifyToken } from "./verifyToken.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

//Validate

// api/user/register
router.post("/register", async (req, res) => {
  // Let validate the data before we make a user
  const { error } = registerValidation(req.body);
  if (error) {
    return res.status(400).json(error.details[0].message);
  }

  //Check if username is already registered
  // const usernameExisted = await UserModel.findOne({
  //   username: req.body.username,
  // });
  // if (usernameExisted) {
  //   return res.status(200).send("username already registered");
  // }

  //Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // assgin user info
  const user = new UserModel({
    username: req.body.username,
    password: hashedPassword,
  });

  // try to save new user
  try {
    const newUser = await user.save();
    // console.log(newUser);
    // just return for confirmation => no useful meaning
    return res
      .status(200)
      .json({ message: "Successfully registered", user: newUser });
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Login
// api/user/login
router.post("/login", async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) {
    return res.status(400).json(error.details[0].message);
  }

  // check in if the email existed
  const user = await UserModel.findOne({ username: req.body.username });
  if (!user) {
    return res.status(200).send("username is incorrect");
  }
  //Check in password is correct ???
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) {
    return res.status(400).send("password is incorrect");
  }

  // Create and assign a token, I dont set the expires time on purpose for simple cases
  const accessToken = jwt.sign(user.toJSON(), process.env.TOKEN_SECRET);
  // I skip the refreshToken part for simplest cases
  // const refreshToken = jwt.sign(user, process.env.TOKEN_SECRET);
  return res.send({
    message: "success",
    accessToken: accessToken,
    expiresTime: "infinity and beyond",
    user: user,
  });
});

// api/user/getInfo
// router.get("/getInfo", verifyToken, (req, res) => {
//   console.log(req.header);
//   res.send("this will be the user info");
// });

export { router };
