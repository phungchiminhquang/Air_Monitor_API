import { registerValidation, loginValidation } from "../validation.js";
import bcrypt from "bcryptjs";
import UserModel from "../model/userModel.js";
import jwt from "jsonwebtoken";

const register = async (req, res) => {
  // Let validate the data before we make a user
  const { error } = registerValidation(req.body);
  if (error) {
    return res.status(400).json(error.details[0].message);
  }

  //Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // assgin user info
  const user = new UserModel({
    userName: req.body.userName,
    password: hashedPassword,
  });
  // try to save new user
  try {
    const newUser = await user.save();

    return res.status(200).json({
      message: "Successfully registered",
      user: newUser,
    });
  } catch (err) {
    return res.status(500).json(err);
  }
};

const login = async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) {
    return res.status(400).json(error.details[0].message);
  }

  // check in if the email existed
  let user = await UserModel.findOne({ username: req.body.username });
  if (!user) {
    return res.status(200).send("username is incorrect");
  }
  //Check if password is correct ???
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) {
    return res.status(400).send("password is incorrect");
  }

  // Create and assign a token, I dont set the expires time on purpose for simple cases
  const accessToken = jwt.sign(user.toJSON(), process.env.TOKEN_SECRET);
  // I skip the refreshToken part for simplest cases
  // const refreshToken = jwt.sign(user.toJSON(), process.env.TOKEN_SECRET);

  return res.send({
    message: "success",
    accessToken: accessToken,
    expiredTime: "infinity and beyond",
    user: user,
  });
};

// send user._id or accessToken to get this infomation in case infomation is updated
const getUserInfo = async (req, res) => {
  const userName = req.body.userName;
  if (!userName) {
    return res.status(500).json({ error: "missing UserName" });
  }

  const filter = { userName: userName };
  try {
    const user = await UserModel.findOne(filter);
    return res.json(user);
  } catch (error) {
    return res.status(500).json(error);
  }
  res.send("this will be the user info");
};

export { register, login, getUserInfo };
